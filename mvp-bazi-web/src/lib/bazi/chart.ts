import { Solar } from "lunar-typescript";
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

function accuracyNote(input: BirthInput) {
  if (input.birthTimeUnknown) {
    return input.language === "zh"
      ? "你选择了不知道准确出生时间，因此时柱采用中午作为临时参考，完整解读会降低对时柱细节的判断权重。"
      : "You selected unknown birth time, so the hour pillar uses noon as a temporary reference and the reading reduces confidence around hour-specific details.";
  }
  return input.language === "zh"
    ? "本 MVP 不收集户籍地，也不强制出生地；未来可加入真太阳时校正作为进阶功能。"
    : "This MVP does not collect hukou or require birthplace; advanced solar-time correction may be added later.";
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

  const pillars = [
    toPillar("year", yearLabel),
    toPillar("month", monthLabel),
    toPillar("day", dayLabel),
    toPillar("hour", hourLabel || `${splitPillar(dayLabel).stem}${hourBranchByIndex[parsed.hour]}`)
  ];

  const dayMasterPillar = pillars[2];
  const dayInfo = stemElement[dayMasterPillar.stem] || { element: "earth", yinYang: "yang" as const };

  return {
    input,
    solarDateTime: `${input.birthDate} ${input.birthTimeUnknown ? "unknown" : input.birthTime || "12:00"}`,
    pillars,
    dayMaster: {
      stem: dayMasterPillar.stem,
      element: dayInfo.element,
      yinYang: dayInfo.yinYang,
      label: input.language === "zh" ? `${dayMasterPillar.stem}日主` : `${dayMasterPillar.stem} Day Master`
    },
    elements: countElements(pillars),
    tenGods: pillars.map((pillar) => ({
      pillar: pillar.name,
      stemRelation: relationForStem(dayMasterPillar.stem, pillar.stem, input.language),
      branchRelation: `${input.language === "zh" ? "地支主气" : "Branch element"}: ${elementLabels[input.language][(branchElement[pillar.branch] || "earth") as keyof ElementBalance]}`
    })),
    accuracyNote: accuracyNote(input)
  };
}

export function elementLabel(element: string, language: "en" | "zh") {
  return elementLabels[language][element as keyof ElementBalance] || element;
}
