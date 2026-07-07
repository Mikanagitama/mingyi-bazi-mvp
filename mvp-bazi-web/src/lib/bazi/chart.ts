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

function accuracyNote(input: BirthInput) {
  if (input.birthTimeUnknown) {
    return input.language === "zh"
      ? "你选择了不知道准确出生时间，因此时柱采用中午作为临时参考，完整解读会降低对时柱细节的判断权重。"
      : "You selected unknown birth time, so the hour pillar uses noon as a temporary reference and the reading reduces confidence around hour-specific details.";
  }
  if (input.trueSolarTime) {
    return input.language === "zh"
      ? "你开启了真太阳时选项；当前 MVP 会记录该选择，但尚未根据经纬度校正出生时间，因此完整解读会避免过度依赖边界时刻。"
      : "You enabled true solar time; this MVP records that preference, but it has not yet corrected the birth time by longitude, so the reading avoids over-weighting boundary-hour details.";
  }
  return input.language === "zh"
    ? "本 MVP 不收集户籍地；出生地用于未来真太阳时校正，不会作为身份信息使用。"
    : "This MVP does not collect hukou; birthplace is used only as future calculation context, not as identity data.";
}

export function generateBaziChart(input: BirthInput): BaziChart {
  const parsed = parseDate(input);
  const solar = Solar.fromYmdHms(parsed.year, parsed.month, parsed.day, parsed.hour, parsed.minute, 0);
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
    solarDateTime: `${input.birthDate} ${input.birthTimeUnknown ? "unknown" : input.birthTime || "12:00"}`,
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
      timezone: input.timezone || "local civil time as entered",
      birth_place: input.birthPlace || undefined,
      true_solar_time_requested: Boolean(input.trueSolarTime),
      true_solar_time_applied: false,
      unknown_birth_time: input.birthTimeUnknown,
      notes: [
        "LLM is not used to calculate Four Pillars.",
        "@openfate/bazi-mcp 0.2.6 is MIT licensed and was reviewed as a future deterministic engine option.",
        "True solar time requires longitude correction and is recorded but not applied in this MVP increment."
      ]
    },
    accuracyNote: accuracyNote(input)
  };
}

export function elementLabel(element: string, language: "en" | "zh") {
  return elementLabels[language][element as keyof ElementBalance] || element;
}
