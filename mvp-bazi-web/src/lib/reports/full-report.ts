import { elementLabel } from "../bazi/chart";
import type { BaziChart, ElementBalance, FullReport, Language, ReportSection } from "../bazi/types";
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
      title: "Executive Summary",
      body: `Your chart centers on a ${dm} Day Master. This often reflects a life pattern where your best results come from understanding your natural pace, choosing supportive environments, and turning pressure into structure rather than urgency.`
    },
    {
      title: "Four Pillars Chart",
      body: `Year: ${chart.pillars[0].label}. Month: ${chart.pillars[1].label}. Day: ${chart.pillars[2].label}. Hour: ${chart.pillars[3].label}. The Day pillar is the anchor for this reading, while the other pillars describe background, timing, expression, and relationship dynamics.`
    },
    {
      title: "Day Master Interpretation",
      body: `A ${dm} Day Master can suggest a distinctive way of choosing, reacting, and recovering. When supported, this energy tends to become clear and constructive. When overstretched, it may become reactive or inconsistent, so rhythm and boundaries matter.`
    },
    {
      title: "Five Elements Balance",
      body: `${elementLabel(strong, "en")} is most visible in this chart, while ${elementLabel(weak, "en")} is quieter. The stronger element shows where life may naturally pull your attention. The quieter element points to a skill, habit, or environment that may need more conscious cultivation.`
    },
    {
      title: "Personality & Strengths",
      body: `This chart can suggest a person who benefits from reading the room before committing fully. Your strengths develop through repetition, reflection, and selecting situations where your natural element is respected instead of constantly forced.`
    },
    {
      title: "Career & Wealth",
      body: `Career growth is likely to feel better when it combines competence with timing. The chart suggests that money decisions should be structured, measured, and connected to real skill-building rather than emotional pressure or comparison.`
    },
    {
      title: "Relationships",
      body: `In relationships, the chart points toward the importance of consistency and emotional pacing. You may benefit from partners, friends, and collaborators who respect your tempo and communicate expectations directly.`
    },
    {
      title: "Health & Energy",
      body: `This is not a medical reading. Energetically, the element balance suggests paying attention to recovery rhythms, regular meals, sleep quality, and environments that reduce unnecessary friction.`
    },
    {
      title: "Yearly Forecast",
      body: `For the coming year, use this reading as a planning lens: choose fewer priorities, create better containers for work, and notice when pressure is asking for structure rather than speed.`
    },
    {
      title: "Lucky Guide",
      body: `Supportive choices may include colors, spaces, and habits connected to ${elementLabel(weak, "en")} when you need balance, and ${elementLabel(strong, "en")} when you need confidence. Use this as a symbolic guide, not a rigid rule.`
    },
    {
      title: "Practical Advice",
      body: `Pick one area where you want more momentum, then design a small weekly ritual around it. Your chart responds better to steady calibration than dramatic reinvention.`
    },
    {
      title: "Cultural Notes",
      body: "Bazi, or Four Pillars of Destiny, uses the year, month, day, and hour pillars to interpret patterns of temperament and timing. A modern reading should be reflective, practical, and non-fatalistic."
    }
  ];

  const report = {
    language: "en" as const,
    headline: "Your full Bazi reading is unlocked.",
    sections,
    disclaimer: disclaimer("en")
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
      title: "总览摘要",
      body: `你的命盘以${dm}日主为核心。它提示你的人生节奏更适合在理解自身气质后发力，找到支持自己的环境，把压力转化成秩序，而不是一味硬冲。`
    },
    {
      title: "四柱命盘",
      body: `年柱：${chart.pillars[0].label}。月柱：${chart.pillars[1].label}。日柱：${chart.pillars[2].label}。时柱：${chart.pillars[3].label}。日柱是解读核心，其余三柱分别提供背景、节奏、表达和关系线索。`
    },
    {
      title: "日主解读",
      body: `${dm}日主代表你选择、反应和恢复能量的基本方式。状态好时，这股能量会变得清晰、有建设性；压力过大时，则需要边界、节奏和稳定支持。`
    },
    {
      title: "五行平衡",
      body: `命盘中${elementLabel(strong, "zh")}较明显，${elementLabel(weak, "zh")}相对安静。强的五行代表你容易被牵动和发挥的地方，弱的五行则是需要后天习惯、环境和选择来补足的方向。`
    },
    {
      title: "性格与优势",
      body: "这个命盘提示，你适合先观察局面，再决定投入方式。你的优势不是靠一时冲刺显现，而是在反复校准、持续练习和合适环境里逐渐稳定。"
    },
    {
      title: "事业与财运",
      body: "事业上，适合把能力积累和时机判断结合起来。财富选择宜重视结构、风险边界和可持续技能，不宜因为比较、焦虑或情绪压力而仓促决定。"
    },
    {
      title: "感情关系",
      body: "关系里，稳定沟通和节奏感很重要。你更适合与能尊重你步调、愿意直接表达期待的人建立长期连接。"
    },
    {
      title: "健康与能量",
      body: "这不是医疗建议。从能量角度看，命盘提示你要重视恢复节奏、饮食睡眠和减少无谓消耗的环境。"
    },
    {
      title: "年度趋势",
      body: "接下来一年，可以把这份报告当作规划工具：减少同时推进的重点，建立更好的工作容器，并分辨压力背后真正需要的是秩序还是速度。"
    },
    {
      title: "幸运指南",
      body: `需要平衡时，可多使用与${elementLabel(weak, "zh")}相关的颜色、空间和习惯；需要自信时，可借助${elementLabel(strong, "zh")}的象征力量。它是提醒，不是硬性规则。`
    },
    {
      title: "实用建议",
      body: "选择一个你想推进的领域，设计一个每周都能重复的小仪式。这个命盘更适合稳定校准，而不是频繁推倒重来。"
    },
    {
      title: "术语说明",
      body: "八字又称四柱，以年、月、日、时四组干支观察人的气质和时间节奏。现代解读应当重视白话、实用和非宿命化表达。"
    }
  ];

  const report = {
    language: "zh" as const,
    headline: "你的完整八字解读已解锁。",
    sections,
    disclaimer: disclaimer("zh")
  };
  assertSafeReportText(JSON.stringify(report));
  return report;
}

export function generateFullReport(chart: BaziChart, language: Language): FullReport {
  return language === "zh" ? chinese(chart) : english(chart);
}
