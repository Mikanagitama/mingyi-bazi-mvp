import Link from "next/link";
import { langFromSearchParams, localizeHref } from "@/lib/i18n/routing";

export default async function WhatIsBaziPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string | string[] }>;
}) {
  const language = langFromSearchParams(searchParams ? await searchParams : {});
  return (
    <main className="legalPage">
      <p className="eyebrow">{language === "zh" ? "八字指南" : "Bazi Guide"}</p>
      <h1>{language === "zh" ? "什么是八字？" : "What is Bazi?"}</h1>
      {language === "zh" ? (
        <>
          <p>八字，也叫四柱八字，是一种用出生时间来观察年、月、日、时四个时间柱的中国命理系统。Mingyi 把它作为一种结构化文化解读，用于娱乐、自我反思和时间节奏参考。</p>
          <p>八字命盘不是保证结果的预言。更适合把它理解为性格、节奏、倾向和取舍的象征地图。</p>
        </>
      ) : (
        <>
          <p>
            Bazi, also called the Eight Characters, is a Chinese metaphysics system that reads a birth moment through
            four time pillars: year, month, day, and hour. Mingyi uses it as a structured cultural interpretation for
            entertainment, self-reflection, and timing insight.
          </p>
          <p>
            A Bazi chart is not a guaranteed prediction. It is better understood as a symbolic map of temperament,
            timing, tendencies, and tradeoffs.
          </p>
        </>
      )}
      <Link className="primaryButton" href={localizeHref("/reading/new", language)}>{language === "zh" ? "获取免费预览" : "Get My Free Preview"}</Link>
    </main>
  );
}
