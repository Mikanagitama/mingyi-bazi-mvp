import Link from "next/link";
import { langFromSearchParams, localizeHref } from "@/lib/i18n/routing";

export default async function DayMasterPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string | string[] }>;
}) {
  const language = langFromSearchParams(searchParams ? await searchParams : {});
  return (
    <main className="legalPage">
      <p className="eyebrow">{language === "zh" ? "八字指南" : "Bazi Guide"}</p>
      <h1>{language === "zh" ? "八字日主是什么？" : "What is a Day Master in Bazi?"}</h1>
      {language === "zh" ? (
        <>
          <p>日主是日柱的天干。很多八字解读会以日主为参考点，观察性格、压力、支持、表达、财富主题和关系模式。</p>
          <p>Mingyi 会在免费预览和付费报告中清楚显示日主，并用稳定、实用的语言解释它。</p>
        </>
      ) : (
        <>
          <p>
            The Day Master is the Heavenly Stem of the day pillar. In many Bazi readings, it acts as the reference point
            for interpreting personality, pressure, support, expression, wealth themes, and relationship dynamics.
          </p>
          <p>
            Mingyi shows the Day Master clearly in both the free preview and the paid report, then explains it in calm,
            practical language.
          </p>
        </>
      )}
      <Link className="primaryButton" href={localizeHref("/reading/new", language)}>{language === "zh" ? "开始免费预览" : "Start Your Free Preview"}</Link>
    </main>
  );
}
