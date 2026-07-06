import type { BaziChart, Language } from "../bazi/types";

export function buildReportPrompt(chart: BaziChart, language: Language) {
  const lang = language === "zh" ? "Chinese" : "English";
  return [
    `Write a ${lang} Bazi report using plain, non-fatalistic language.`,
    `Day Master: ${chart.dayMaster.stem} (${chart.dayMaster.element}, ${chart.dayMaster.yinYang}).`,
    `Pillars: ${chart.pillars.map((pillar) => `${pillar.name}:${pillar.label}`).join(", ")}.`,
    "Avoid guarantees, fear-based claims, medical advice, legal advice, and financial promises.",
    "Use tendencies such as may indicate, can suggest, often reflects."
  ].join("\n");
}
