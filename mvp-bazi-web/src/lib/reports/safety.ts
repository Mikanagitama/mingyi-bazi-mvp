const riskyPhrases = [
  "guaranteed",
  "doomed",
  "cursed",
  "will definitely",
  "一定会",
  "必定",
  "诅咒",
  "没救"
];

export function assertSafeReportText(text: string) {
  const lower = text.toLowerCase();
  const found = riskyPhrases.find((phrase) => lower.includes(phrase.toLowerCase()));
  if (found) {
    throw new Error(`Report text contains unsafe deterministic phrasing: ${found}`);
  }
}

export function disclaimer(language: "en" | "zh") {
  return language === "zh"
    ? "本报告用于文化解读、娱乐参考和自我理解，不构成医疗、法律、财务或心理建议，也不保证任何具体结果。"
    : "This report is for cultural interpretation, entertainment, and self-reflection. It is not medical, legal, financial, or psychological advice and does not guarantee any outcome.";
}
