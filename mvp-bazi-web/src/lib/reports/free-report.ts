import { elementLabel } from "../bazi/chart";
import type { BaziChart, ElementBalance, FreeReport, Language, ReportSection } from "../bazi/types";

function strongestElement(elements: ElementBalance) {
  return Object.entries(elements).sort((a, b) => b[1] - a[1])[0]?.[0] || "earth";
}

function weakestElement(elements: ElementBalance) {
  return Object.entries(elements).sort((a, b) => a[1] - b[1])[0]?.[0] || "water";
}

function enPreview(chart: BaziChart): FreeReport {
  const strong = strongestElement(chart.elements);
  const weak = weakestElement(chart.elements);
  const sections: ReportSection[] = [
    {
      title: "Core Snapshot",
      body: `Your Day Master is ${chart.dayMaster.stem}, associated with ${elementLabel(chart.dayMaster.element, "en")} and ${chart.dayMaster.yinYang} energy. This points to the way you instinctively meet pressure, opportunity, and relationships.`
    },
    {
      title: "Element Balance",
      body: `${elementLabel(strong, "en")} is the most visible element in this chart, while ${elementLabel(weak, "en")} appears less emphasized. The full report explains how this balance can shape work style, decision rhythm, and recovery needs.`
    },
    {
      title: "Accuracy Note",
      body: chart.accuracyNote
    }
  ];

  return {
    language: "en",
    headline: "Your free Bazi preview is ready.",
    summary: "This preview opens the chart structure and gives you a first plain-language interpretation before the full reading.",
    sections,
    lockedSections: [
      { title: "Career & Wealth", body: "Unlock work strengths, money timing, and practical career guidance." },
      { title: "Relationships", body: "Unlock patterns around affection, partnership, and social support." },
      { title: "Yearly Forecast", body: "Unlock this year's opportunities, pressure points, and timing notes." },
      { title: "Lucky Guide", body: "Unlock supportive elements, colors, directions, and daily-life suggestions." }
    ]
  };
}

function zhPreview(chart: BaziChart): FreeReport {
  const strong = strongestElement(chart.elements);
  const weak = weakestElement(chart.elements);
  const sections: ReportSection[] = [
    {
      title: "命局底色",
      body: `你的日主是${chart.dayMaster.stem}，对应${elementLabel(chart.dayMaster.element, "zh")}与${chart.dayMaster.yinYang === "yang" ? "阳" : "阴"}的气质。它代表你面对压力、机会和关系时的本能反应。`
    },
    {
      title: "五行分布",
      body: `这个命盘里${elementLabel(strong, "zh")}比较明显，${elementLabel(weak, "zh")}相对较弱。完整报告会进一步解释它如何影响事业节奏、决策方式和恢复能量。`
    },
    {
      title: "准确度说明",
      body: chart.accuracyNote
    }
  ];

  return {
    language: "zh",
    headline: "你的免费八字预览已生成。",
    summary: "这份预览先打开命盘结构，并用白话给你第一层解读。完整内容可在付费后解锁。",
    sections,
    lockedSections: [
      { title: "事业与财运", body: "解锁工作优势、财富节奏和职业建议。" },
      { title: "感情关系", body: "解锁亲密关系、人际互动和支持模式。" },
      { title: "年度趋势", body: "解锁今年的机会、压力点和时间提示。" },
      { title: "幸运指南", body: "解锁有帮助的五行、颜色、方向和生活建议。" }
    ]
  };
}

export function generateFreeReport(chart: BaziChart, language: Language): FreeReport {
  return language === "zh" ? zhPreview(chart) : enPreview(chart);
}
