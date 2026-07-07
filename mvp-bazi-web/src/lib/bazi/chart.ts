import { Solar, type EightChar } from "lunar-typescript";
import type { BaziChart, BirthInput, ElementBalance, Pillar, PillarName } from "./types";

const stemElement: Record<string, { element: string; yinYang: "yin" | "yang" }> = {
  "甲": { element: "wood", yinYang: "yang" },
  "乙": { element: "wood", yinYang: "yin" },
  "丙": { element: "fire", yinYang: "yang" },
  "丁": { element: "fire", yinYang: "yin" },
  "戊": { element: "earth", yinYang: "yang" },
  "己": { element: "earth", yinYang: "yin" },
  "庚": { element: "metal", yinYang: "yang" },
  "辛": { element: "metal", yinYang: "yin" },
  "壬": { element: "water", yinYang: "yang" },
  "癸": { element: "water", yinYang: "yin" }
};

const branchElement: Record<string, string> = {
  "子": "water",
  "丑": "earth",
  "寅": "wood",
  "卯": "wood",
  "辰": "earth",
  "巳": "fire",
  "午": "fire",
  "未": "earth",
  "申": "metal",
  "酉": "metal",
  "戌": "earth",
  "亥": "water"
};

const hiddenStemsByBranch: Record<string, string[]> = {
  "子": ["癸"],
  "丑": ["己", "癸", "辛"],
  "寅": ["甲", "丙", "戊"],
  "卯": ["乙"],
  "辰": ["戊", "乙", "癸"],
  "巳": ["丙", "戊", "庚"],
  "午": ["丁", "己"],
  "未": ["己", "丁", "乙"],
  "申": ["庚", "壬", "戊"],
  "酉": ["辛"],
  "戌": ["戊", "辛", "丁"],
  "亥": ["壬", "甲"]
};

const branchClashes: Array<[string, string]> = [
  ["子", "午"],
  ["丑", "未"],
  ["寅", "申"],
  ["卯", "酉"],
  ["辰", "戌"],
  ["巳", "亥"]
];

const branchCombinations: Array<[string, string]> = [
  ["子", "丑"],
  ["寅", "亥"],
  ["卯", "戌"],
  ["辰", "酉"],
  ["巳", "申"],
  ["午", "未"]
];

const knownBirthPlaces: Record<string, { longitude: number; timezone: string }> = {
  beijing: { longitude: 116.4074, timezone: "Asia/Shanghai" },
  "beijing, china": { longitude: 116.4074, timezone: "Asia/Shanghai" },
  shanghai: { longitude: 121.4737, timezone: "Asia/Shanghai" },
  "shanghai, china": { longitude: 121.4737, timezone: "Asia/Shanghai" },
  guangzhou: { longitude: 113.2644, timezone: "Asia/Shanghai" },
  shenzhen: { longitude: 114.0579, timezone: "Asia/Shanghai" },
  hongkong: { longitude: 114.1694, timezone: "Asia/Hong_Kong" },
  "hong kong": { longitude: 114.1694, timezone: "Asia/Hong_Kong" },
  taipei: { longitude: 121.5654, timezone: "Asia/Taipei" },
  tokyo: { longitude: 139.6917, timezone: "Asia/Tokyo" },
  "tokyo, japan": { longitude: 139.6917, timezone: "Asia/Tokyo" },
  osaka: { longitude: 135.5023, timezone: "Asia/Tokyo" },
  singapore: { longitude: 103.8198, timezone: "Asia/Singapore" },
  london: { longitude: -0.1276, timezone: "Europe/London" },
  paris: { longitude: 2.3522, timezone: "Europe/Paris" },
  "new york": { longitude: -74.006, timezone: "America/New_York" },
  "new york city": { longitude: -74.006, timezone: "America/New_York" },
  "los angeles": { longitude: -118.2437, timezone: "America/Los_Angeles" },
  sydney: { longitude: 151.2093, timezone: "Australia/Sydney" }
};

const standardTimezoneOffsets: Record<string, number> = {
  "Asia/Shanghai": 8,
  "Asia/Hong_Kong": 8,
  "Asia/Taipei": 8,
  "Asia/Tokyo": 9,
  "Asia/Singapore": 8,
  "Europe/London": 0,
  "Europe/Paris": 1,
  "America/New_York": -5,
  "America/Los_Angeles": -8,
  "Australia/Sydney": 10
};

const hourBranchByIndex = ["子", "丑", "丑", "寅", "寅", "卯", "卯", "辰", "辰", "巳", "巳", "午", "午", "未", "未", "申", "申", "酉", "酉", "戌", "戌", "亥", "亥", "子"];

const elementLabels = {
  en: {
    wood: "Wood",
    fire: "Fire",
    earth: "Earth",
    metal: "Metal",
    water: "Water"
  },
  zh: {
    wood: "木",
    fire: "火",
    earth: "土",
    metal: "金",
    water: "水"
  }
};

function parseDate(input: BirthInput) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(input.birthDate)) {
    throw new Error("Birth date must use YYYY-MM-DD.");
  }

  const [year, month, day] = input.birthDate.split("-").map(Number);
  const time = input.birthTimeUnknown ? "12:00" : input.birthTime || "12:00";

  if (!/^\d{2}:\d{2}$/.test(time)) {
    throw new Error("Birth time must use HH:mm.");
  }

  const [hour, minute] = time.split(":").map(Number);
  const date = new Date(Date.UTC(year, month - 1, day, hour, minute));

  if (Number.isNaN(date.getTime()) || date.getUTCFullYear() !== year || date.getUTCMonth() !== month - 1 || date.getUTCDate() !== day) {
    throw new Error("Birth date is invalid.");
  }

  if (hour < 0 || hour > 23 || minute < 0 || minute > 59) {
    throw new Error("Birth time is invalid.");
  }

  return { year, month, day, hour, minute };
}

function normalizePlace(value?: string) {
  return (value || "").trim().toLowerCase().replace(/\s+/g, " ");
}

function dayOfYear(year: number, month: number, day: number) {
  const start = Date.UTC(year, 0, 0);
  const current = Date.UTC(year, month - 1, day);
  return Math.floor((current - start) / 86400000);
}

function equationOfTimeMinutes(year: number, month: number, day: number) {
  const dayNumber = dayOfYear(year, month, day);
  const b = (2 * Math.PI * (dayNumber - 81)) / 364;
  return 9.87 * Math.sin(2 * b) - 7.53 * Math.cos(b) - 1.5 * Math.sin(b);
}

function toDateParts(date: Date) {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    hour: date.getUTCHours(),
    minute: date.getUTCMinutes()
  };
}

function formatDateParts(parts: ReturnType<typeof toDateParts>) {
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${parts.year}-${pad(parts.month)}-${pad(parts.day)} ${pad(parts.hour)}:${pad(parts.minute)}`;
}

function resolveTrueSolarTime(input: BirthInput, parsed: ReturnType<typeof parseDate>) {
  const notes: string[] = [];
  const requested = Boolean(input.trueSolarTime);
  if (!requested) {
    return { parsed, applied: false, notes };
  }
  if (input.birthTimeUnknown) {
    notes.push("True solar time was requested but not applied because exact birth time is unknown.");
    return { parsed, applied: false, notes };
  }

  const place = knownBirthPlaces[normalizePlace(input.birthPlace)];
  if (!place) {
    notes.push("True solar time was requested but not applied because the birth place is not in the built-in longitude table.");
    return { parsed, applied: false, notes };
  }

  const timezone = input.timezone && input.timezone !== "auto" ? input.timezone : place.timezone;
  const standardOffset = standardTimezoneOffsets[timezone];
  if (standardOffset === undefined) {
    notes.push("True solar time was requested but not applied because the timezone is not supported by the built-in standard-meridian table.");
    return { parsed, applied: false, notes };
  }

  const standardMeridian = standardOffset * 15;
  const longitudeCorrection = 4 * (place.longitude - standardMeridian);
  const eot = equationOfTimeMinutes(parsed.year, parsed.month, parsed.day);
  const correctionMinutes = Math.round(longitudeCorrection + eot);
  const adjusted = new Date(Date.UTC(parsed.year, parsed.month - 1, parsed.day, parsed.hour, parsed.minute + correctionMinutes));
  const adjustedParts = toDateParts(adjusted);

  notes.push(`True solar time applied using ${input.birthPlace || "birth place"} longitude ${place.longitude.toFixed(4)} and timezone ${timezone}.`);
  notes.push(`Correction: ${correctionMinutes} minutes; longitude component ${longitudeCorrection.toFixed(1)} minutes; equation of time ${eot.toFixed(1)} minutes.`);
  return {
    parsed: adjustedParts,
    applied: true,
    correctionMinutes,
    timezone,
    longitude: place.longitude,
    notes,
    method: "longitude correction plus approximate equation of time; standard meridian uses built-in timezone table"
  };
}

function splitPillar(label: string) {
  const chars = Array.from(label);
  if (chars.length < 2) {
    throw new Error(`Invalid pillar label: ${label}`);
  }
  return { stem: chars[0], branch: chars[1] };
}

function toPillar(name: PillarName, label: string): Pillar {
  const { stem, branch } = splitPillar(label);
  const stemInfo = stemElement[stem] || { element: branchElement[branch] || "earth", yinYang: "yang" as const };
  return {
    name,
    stem,
    branch,
    label,
    element: stemInfo.element,
    yinYang: stemInfo.yinYang
  };
}

function emptyElements(): ElementBalance {
  return { wood: 0, fire: 0, earth: 0, metal: 0, water: 0 };
}

function countElements(pillars: Pillar[]) {
  const elements = emptyElements();
  for (const pillar of pillars) {
    elements[pillar.element as keyof ElementBalance] += 1;
    const branch = branchElement[pillar.branch] as keyof ElementBalance | undefined;
    if (branch) {
      elements[branch] += 1;
    }
  }
  return elements;
}

function relationForStem(dayStem: string, otherStem: string, language: "en" | "zh") {
  if (dayStem === otherStem) {
    return language === "zh" ? "同气" : "Peer energy";
  }
  const day = stemElement[dayStem];
  const other = stemElement[otherStem];
  if (!day || !other) {
    return language === "zh" ? "关系待定" : "Mixed influence";
  }
  const generating: Record<string, string> = { wood: "fire", fire: "earth", earth: "metal", metal: "water", water: "wood" };
  const controlling: Record<string, string> = { wood: "earth", earth: "water", water: "fire", fire: "metal", metal: "wood" };
  if (generating[other.element] === day.element) return language === "zh" ? "生扶日主" : "Supportive influence";
  if (generating[day.element] === other.element) return language === "zh" ? "表达输出" : "Expression influence";
  if (controlling[day.element] === other.element) return language === "zh" ? "财富/资源管理" : "Resource management";
  if (controlling[other.element] === day.element) return language === "zh" ? "压力/规则" : "Pressure and structure";
  return language === "zh" ? "同类互动" : "Peer interaction";
}

function nativeStemRelations(eightChar: EightChar) {
  return [
    eightChar.getYearShiShenGan(),
    eightChar.getMonthShiShenGan(),
    eightChar.getDayShiShenGan(),
    eightChar.getTimeShiShenGan()
  ];
}

function nativeBranchRelations(eightChar: EightChar) {
  return [
    eightChar.getYearShiShenZhi(),
    eightChar.getMonthShiShenZhi(),
    eightChar.getDayShiShenZhi(),
    eightChar.getTimeShiShenZhi()
  ];
}

function nayin(eightChar: EightChar) {
  return [
    eightChar.getYearNaYin(),
    eightChar.getMonthNaYin(),
    eightChar.getDayNaYin(),
    eightChar.getTimeNaYin()
  ];
}

function buildHiddenStems(pillars: Pillar[]) {
  return Object.fromEntries(pillars.map((pillar) => [pillar.name, hiddenStemsByBranch[pillar.branch] || []])) as Record<PillarName, string[]>;
}

function buildBranchInteractions(pillars: Pillar[], language: "en" | "zh") {
  const branches = new Set(pillars.map((pillar) => pillar.branch));
  const interactions: BaziChart["branch_interactions"] = [];

  for (const [first, second] of branchClashes) {
    if (branches.has(first) && branches.has(second)) {
      interactions.push({
        type: language === "zh" ? "冲" : "clash",
        branches: [first, second],
        description: language === "zh" ? `${first}${second}相冲，提示变化、拉扯或需要重新安排节奏。` : `${first}-${second} clash suggests movement, tension, or a need to reorganize timing.`
      });
    }
  }

  for (const [first, second] of branchCombinations) {
    if (branches.has(first) && branches.has(second)) {
      interactions.push({
        type: language === "zh" ? "合" : "combination",
        branches: [first, second],
        description: language === "zh" ? `${first}${second}相合，提示协作、吸引或某种资源汇聚。` : `${first}-${second} combination suggests cooperation, attraction, or resource convergence.`
      });
    }
  }

  return interactions;
}

function buildLuckPillars(eightChar: EightChar, input: BirthInput) {
  if (input.gender === "unspecified") {
    return [];
  }
  const gender = input.gender === "male" ? 1 : 0;
  return eightChar
    .getYun(gender)
    .getDaYun(8)
    .map((pillar) => ({
      index: pillar.getIndex(),
      start_year: pillar.getStartYear(),
      end_year: pillar.getEndYear(),
      start_age: pillar.getStartAge(),
      end_age: pillar.getEndAge(),
      gan_zhi: pillar.getGanZhi()
    }));
}

function yearPillar(year: number) {
  const solar = Solar.fromYmdHms(year, 2, 4, 12, 0, 0);
  return solar.getLunar().getEightChar().getYear();
}

function accuracyNote(input: BirthInput, solarCorrection: ReturnType<typeof resolveTrueSolarTime>) {
  if (input.birthTimeUnknown) {
    return input.language === "zh"
      ? "你选择了不知道准确出生时间，因此时柱采用中午作为临时参考，完整解读会降低对时柱细节的判断权重。"
      : "You selected unknown birth time, so the hour pillar uses noon as a temporary reference and the reading reduces confidence around hour-specific details.";
  }
  if (input.trueSolarTime) {
    if (solarCorrection.applied) {
      return input.language === "zh"
        ? `已根据出生地经度和时区应用真太阳时修正，约修正 ${solarCorrection.correctionMinutes} 分钟。`
        : `True solar time was applied using birthplace longitude and timezone, with an approximate correction of ${solarCorrection.correctionMinutes} minutes.`;
    }
    return input.language === "zh"
      ? "你开启了真太阳时选项，但当前出生地或时区无法被内置表识别，因此本次未强行校正。"
      : "You enabled true solar time, but the current birthplace or timezone could not be resolved by the built-in table, so no correction was forced.";
  }
  return input.language === "zh"
    ? "本 MVP 不收集户籍地；出生地用于未来真太阳时校正，不会作为身份信息使用。"
    : "This MVP does not collect hukou; birthplace is used only as future calculation context, not as identity data.";
}

export function generateBaziChart(input: BirthInput): BaziChart {
  const parsed = parseDate(input);
  const solarCorrection = resolveTrueSolarTime(input, parsed);
  const calculationTime = solarCorrection.parsed;
  const solar = Solar.fromYmdHms(calculationTime.year, calculationTime.month, calculationTime.day, calculationTime.hour, calculationTime.minute, 0);
  const lunar = solar.getLunar();
  const eightChar = lunar.getEightChar();

  const yearLabel = eightChar.getYear();
  const monthLabel = eightChar.getMonth();
  const dayLabel = eightChar.getDay();
  const hourLabel = eightChar.getTime();
  const nativeStemGods = nativeStemRelations(eightChar);
  const nativeBranchGods = nativeBranchRelations(eightChar);
  const nayinValues = nayin(eightChar);

  const pillars = [
    toPillar("year", yearLabel),
    toPillar("month", monthLabel),
    toPillar("day", dayLabel),
    toPillar("hour", hourLabel || `${splitPillar(dayLabel).stem}${hourBranchByIndex[parsed.hour]}`)
  ];

  const dayMasterPillar = pillars[2];
  const dayInfo = stemElement[dayMasterPillar.stem] || { element: "earth", yinYang: "yang" as const };
  const hidden_stems = buildHiddenStems(pillars);
  const branch_interactions = buildBranchInteractions(pillars, input.language);
  const annualPillar = yearPillar(2026);
  const annualBranch = splitPillar(annualPillar).branch;
  const annualInteractions = branch_interactions
    .filter((interaction) => interaction.branches.includes(annualBranch))
    .map((interaction) => interaction.description);
  const dayMaster = {
    stem: dayMasterPillar.stem,
    element: dayInfo.element,
    yinYang: dayInfo.yinYang,
    label: input.language === "zh" ? `${dayMasterPillar.stem}日主` : `${dayMasterPillar.stem} Day Master`
  };
  const elements = countElements(pillars);
  const tenGods = pillars.map((pillar, index) => ({
    pillar: pillar.name,
    stemRelation: nativeStemGods[index] || relationForStem(dayMasterPillar.stem, pillar.stem, input.language),
    branchRelation: `${input.language === "zh" ? "藏干十神" : "Hidden-stem Ten Gods"}: ${(nativeBranchGods[index] || []).join(", ") || "-"}`
  }));

  return {
    input,
    solarDateTime: input.birthTimeUnknown ? `${input.birthDate} unknown` : formatDateParts(calculationTime),
    pillars,
    dayMaster,
    elements,
    tenGods,
    day_master: dayMaster,
    five_elements: elements,
    ten_gods: pillars.map((pillar, index) => ({
      pillar: pillar.name,
      stem: nativeStemGods[index] || relationForStem(dayMasterPillar.stem, pillar.stem, input.language),
      hidden_stems: nativeBranchGods[index] || []
    })),
    hidden_stems,
    nayin: Object.fromEntries(pillars.map((pillar, index) => [pillar.name, nayinValues[index] || ""])) as Record<PillarName, string>,
    luck_pillars: buildLuckPillars(eightChar, input),
    annual_transits: [
      {
        year: 2026,
        pillar: annualPillar,
        relation_to_day_master: relationForStem(dayMasterPillar.stem, splitPillar(annualPillar).stem, input.language),
        branch_interactions: annualInteractions
      }
    ],
    branch_interactions,
    calculation_policy: {
      engine: "lunar-typescript",
      calendar: "Gregorian birth input converted to Chinese lunar EightChar/Four Pillars",
      timezone: solarCorrection.timezone || input.timezone || "local civil time as entered",
      birth_place: input.birthPlace || undefined,
      true_solar_time_requested: Boolean(input.trueSolarTime),
      true_solar_time_applied: solarCorrection.applied,
      true_solar_time_correction_minutes: solarCorrection.correctionMinutes,
      true_solar_time_method: solarCorrection.method,
      unknown_birth_time: input.birthTimeUnknown,
      notes: [
        "LLM is not used to calculate Four Pillars.",
        "@openfate/bazi-mcp 0.2.6 is MIT licensed and was reviewed as a future deterministic engine option.",
        ...solarCorrection.notes
      ]
    },
    accuracyNote: accuracyNote(input, solarCorrection)
  };
}

export function elementLabel(element: string, language: "en" | "zh") {
  return elementLabels[language][element as keyof ElementBalance] || element;
}
