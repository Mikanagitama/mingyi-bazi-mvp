import { elementLabel } from "../bazi/chart";
import type { BaziChart, ElementBalance, FullReport, Language, ReportSection } from "../bazi/types";
import { currentEnergySection } from "./current-energy";
import { assertSafeReportText, disclaimer } from "./safety";

function dominant(elements: ElementBalance) {
  return Object.entries(elements).sort((a, b) => b[1] - a[1])[0]?.[0] || "earth";
}

function quiet(elements: ElementBalance) {
  return Object.entries(elements).sort((a, b) => a[1] - b[1])[0]?.[0] || "water";
}

function english(chart: BaziChart): FullReport {
  const strong = dominant(chart.elements);
  const weak = quiet(chart.elements);
  const dm = `${chart.dayMaster.stem} ${elementLabel(chart.dayMaster.element, "en")}`;
  const sections: ReportSection[] = [
    {
      title: "Core Personality",
      body: `Your chart centers on a ${dm} Day Master. This often reflects a life pattern where your best results come from understanding your natural pace, choosing supportive environments, and turning pressure into structure rather than urgency.`
    },
    {
      title: "Five Elements Balance",
      body: `${elementLabel(strong, "en")} is most visible in this chart, while ${elementLabel(weak, "en")} is quieter. The stronger element shows where life may naturally pull your attention. The quieter element points to a skill, habit, or environment that may need more conscious cultivation.`
    },
    {
      title: "Career Direction",
      body: `Career growth is likely to feel better when it combines competence with timing. Your Four Pillars are ${chart.pillars.map((pillar) => pillar.label).join(", ")}, so the most useful path is one where your visible strengths can become repeatable skill.`
    },
    {
      title: "Wealth Pattern",
      body: `The chart suggests that money decisions should be structured, measured, and connected to real skill-building rather than emotional pressure or comparison. Treat wealth timing as a planning signal, not a promise.`
    },
    {
      title: "Love & Relationships",
      body: `In relationships, the chart points toward the importance of consistency and emotional pacing. You may benefit from partners, friends, and collaborators who respect your tempo and communicate expectations directly.`
    },
    currentEnergySection(chart, "en"),
    {
      title: "2026 Yearly Timing",
      body: `The 2026 annual pillar is ${chart.annual_transits[0]?.pillar || "available in the chart data"}. Use it as a timing reference for self-reflection, planning, and tradeoff awareness rather than fixed prediction.`
    },
    {
      title: "Practical Advice",
      body: `Pick one area where you want more momentum, then design a small weekly ritual around it. Your chart responds better to steady calibration than dramatic reinvention.`
    }
  ];

  const report = {
    language: "en" as const,
    headline: "Your full Bazi reading is unlocked.",
    sections,
    disclaimer: disclaimer("en"),
    generation: { mode: "template" as const }
  };
  assertSafeReportText(JSON.stringify(report));
  return report;
}

function chinese(chart: BaziChart): FullReport {
  const strong = dominant(chart.elements);
  const weak = quiet(chart.elements);
  const dm = `${chart.dayMaster.stem}${elementLabel(chart.dayMaster.element, "zh")}`;
  const sections: ReportSection[] = [
    {
      title: "核心性格",
      body: `你的命盘以${dm}日主为核心。它提示你的人生节奏更适合在理解自身气质后发力，找到支持自己的环境，把压力转化成秩序，而不是一味硬冲。`
    },
    {
      title: "五行平衡",
      body: `命盘中${elementLabel(strong, "zh")}较明显，${elementLabel(weak, "zh")}相对安静。强的五行代表你容易被牵动和发挥的地方，弱的五行则是需要后天习惯、环境和选择来补足的方向。`
    },
    {
      title: "事业方向",
      body: `事业上，适合把能力积累和时机判断结合起来。你的四柱为${chart.pillars.map((pillar) => pillar.label).join("、")}，更适合把可见优势变成可重复的能力。`
    },
    {
      title: "财富模式",
      body: "财富选择宜重视结构、风险边界和可持续技能，不宜因为比较、焦虑或情绪压力而仓促决定。把财运节奏当作规划参考，不当作保证。"
    },
    {
      title: "感情关系",
      body: "关系里，稳定沟通和节奏感很重要。你更适合与能尊重你步调、愿意直接表达期待的人建立长期连接。"
    },
    currentEnergySection(chart, "zh"),
    {
      title: "2026年度节奏",
      body: `2026年的流年柱为${chart.annual_transits[0]?.pillar || "已写入命盘数据"}。它适合作为自我观察、规划和取舍提醒，不代表确定结果。`
    },
    {
      title: "实用建议",
      body: "选择一个你想推进的领域，设计一个每周都能重复的小仪式。这个命盘更适合稳定校准，而不是频繁推倒重来。"
    }
  ];

  const report = {
    language: "zh" as const,
    headline: "你的完整八字解读已解锁。",
    sections,
    disclaimer: disclaimer("zh"),
    generation: { mode: "template" as const }
  };
  assertSafeReportText(JSON.stringify(report));
  return report;
}

export function generateFullReport(chart: BaziChart, language: Language): FullReport {
  return language === "zh" ? chinese(chart) : english(chart);
}
