import Link from "next/link";
import { langFromSearchParams, localizeHref } from "@/lib/i18n/routing";

export default async function FourPillarsPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string | string[] }>;
}) {
  const language = langFromSearchParams(searchParams ? await searchParams : {});
  return (
    <main className="legalPage">
      <p className="eyebrow">{language === "zh" ? "八字指南" : "Bazi Guide"}</p>
      <h1>{language === "zh" ? "什么是四柱？" : "What are the Four Pillars of Destiny?"}</h1>
      {language === "zh" ? (
        <>
          <p>四柱指八字命盘中的年柱、月柱、日柱和时柱。每一柱由天干和地支组成，是讨论五行、时间节奏和人生主题的基础结构。</p>
          <p>Mingyi 会先计算命盘，再用白话解释结构，让报告更像能读懂的说明，而不是一串专业术语。</p>
        </>
      ) : (
        <>
          <p>
            The Four Pillars of Destiny are the year, month, day, and hour pillars in a Bazi chart. Each pillar combines
            a Heavenly Stem and an Earthly Branch, creating the core structure used to discuss elements, timing, and life
            themes.
          </p>
          <p>
            Mingyi calculates the chart first, then explains the structure in plain language so the report feels readable
            rather than like a list of technical terms.
          </p>
        </>
      )}
      <Link className="primaryButton" href={localizeHref("/sample-report", language)}>{language === "zh" ? "查看报告示例" : "View Sample Report"}</Link>
    </main>
  );
}
