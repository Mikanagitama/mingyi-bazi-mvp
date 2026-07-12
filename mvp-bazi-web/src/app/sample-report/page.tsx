import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { elementLabel } from "@/lib/bazi/chart";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";
import { homeHref, langFromSearchParams, localizeHref, type Language } from "@/lib/i18n/routing";
import { sampleReportReading, sampleReportReadingZh } from "@/lib/reports/sample-report";

function cleanReadingId(value: string | string[] | undefined) {
  const id = Array.isArray(value) ? value[0] : value;
  return id && /^[a-z0-9-]{8,80}$/i.test(id) ? id : "";
}

export function SampleReportCtas({ readingId, language }: { readingId: string; language: Language }) {
  const copy = language === "zh" ? zh : en;
  const readingTarget = readingId ? `/reading/${encodeURIComponent(readingId)}` : "/reading/new";
  return (
    <div className="sampleCta">
      <p className="finePrint">
        {language === "zh"
          ? "这是一份样例报告。你的付费报告会根据你自己的出生信息生成。"
          : "This is a sample report. Your paid report is generated from your own birth details."}
      </p>
      {readingId ? (
        <CheckoutButton
          readingId={readingId}
          label={copy.reading.unlock}
          secureText={copy.reading.secure}
          errorFallback={language === "zh" ? "暂时无法打开支付页面。" : "Checkout is unavailable."}
        />
      ) : (
        <div className="checkoutBox">
          <Link className="primaryButton" href={localizeHref("/reading/new", language)}>{copy.reading.unlock}</Link>
          <p className="finePrint">{copy.reading.secure}</p>
          <p className="finePrint">
            {language === "zh"
              ? "请先生成免费预览，这样付款后才能解锁对应的个人报告。"
              : "Generate your free preview first so checkout can unlock the right report."}
          </p>
        </div>
      )}
      <Link className="secondaryButton" href={localizeHref(readingTarget, language)}>
        {language === "zh" ? "生成我的免费预览" : "Generate My Free Preview"}
      </Link>
    </div>
  );
}

export default async function SampleReportPage({
  searchParams
}: {
  searchParams?: Promise<{ reading_id?: string | string[]; lang?: string | string[] }>;
}) {
  const query = searchParams ? await searchParams : {};
  const language = langFromSearchParams(query);
  const readingId = cleanReadingId(query.reading_id);
  const reading = language === "zh" ? sampleReportReadingZh : sampleReportReading;
  const report = reading.fullReport!;
  const copy = language === "zh" ? zh : en;

  return (
    <main className="readingPage sampleReportPage">
      <header className="simpleNav">
        <Link href={homeHref(language)} className="brand">
          <span className="brandMark">命</span>
          <span>
            <strong>MINGYI</strong>
            <small>{language === "zh" ? "八字命理" : "Bazi Destiny"}</small>
          </span>
        </Link>
        <Link className="navCta" href={localizeHref("/reading/new", language)}>{copy.nav.cta}</Link>
      </header>

      <section className="reportShell sampleReport">
        <div className="reportHeader">
          <p className="eyebrow">{copy.nav.sample}</p>
          <h1>{report.headline}</h1>
          <p className="sampleNotice">
            {language === "zh" ? "这是一份样例报告，不基于你的出生资料。" : "This is a sample report. It is not based on your birth details."}
          </p>
          <SampleReportCtas readingId={readingId} language={language} />
        </div>

        <div className="sampleProfile">
          <article>
            <span>{language === "zh" ? "样例资料" : "Sample profile"}</span>
            <strong>{reading.name}</strong>
            <small>{language === "zh" ? "女 · 新加坡 · 1992-08-14 · 09:30" : "Female · Singapore · 14 Aug 1992 · 09:30"}</small>
          </article>
          <article>
            <span>{copy.reading.dayMaster}</span>
            <strong>{reading.chart.dayMaster.label}</strong>
            <small>{elementLabel(reading.chart.dayMaster.element, language)}</small>
          </article>
        </div>

        <h2>{language === "zh" ? "四柱命盘" : "Four Pillars Chart"}</h2>
        <div className="chartGrid">
          {reading.chart.pillars.map((pillar) => (
            <article key={pillar.name}>
              <span>{pillar.name}</span>
              <strong>{pillar.label}</strong>
              <small>{elementLabel(pillar.element, language)}</small>
            </article>
          ))}
        </div>

        <h2>{language === "zh" ? "五行平衡" : "Five Elements Balance"}</h2>
        <div className="elementGrid">
          {Object.entries(reading.chart.elements).map(([element, count]) => (
            <div key={element}>
              <span>{elementLabel(element, language)}</span>
              <meter min={0} max={8} value={count} />
              <small>{count}</small>
            </div>
          ))}
        </div>

        <div className="reportSections">
          {report.sections.map((section) => (
            <article key={section.title} className="reportSection">
              <h2>{section.title}</h2>
              <p>{section.body}</p>
            </article>
          ))}
        </div>

        <p className="disclaimer">{report.disclaimer}</p>
        <SampleReportCtas readingId={readingId} language={language} />
      </section>
    </main>
  );
}
