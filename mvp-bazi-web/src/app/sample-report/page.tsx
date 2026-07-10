import Link from "next/link";
import { CheckoutButton } from "@/components/CheckoutButton";
import { elementLabel } from "@/lib/bazi/chart";
import { FULL_REPORT_CTA, PAYMENT_TRUST_COPY } from "@/lib/product";
import { sampleReportReading } from "@/lib/reports/sample-report";

function cleanReadingId(value: string | string[] | undefined) {
  const id = Array.isArray(value) ? value[0] : value;
  return id && /^[a-z0-9-]{8,80}$/i.test(id) ? id : "";
}

export function SampleReportCtas({ readingId }: { readingId: string }) {
  return (
    <div className="sampleCta">
      <p className="finePrint">
        This is a sample report. Your paid report is generated from your own birth details.
      </p>
      {readingId ? (
        <CheckoutButton readingId={readingId} label={FULL_REPORT_CTA} secureText={PAYMENT_TRUST_COPY} />
      ) : (
        <div className="checkoutBox">
          <Link className="primaryButton" href="/reading/new">{FULL_REPORT_CTA}</Link>
          <p className="finePrint">Generate your free preview first so checkout can unlock the right report.</p>
        </div>
      )}
      <Link className="secondaryButton" href={readingId ? `/reading/${encodeURIComponent(readingId)}` : "/reading/new"}>
        Generate My Free Preview
      </Link>
    </div>
  );
}

export default async function SampleReportPage({
  searchParams
}: {
  searchParams?: Promise<{ reading_id?: string | string[] }>;
}) {
  const query = searchParams ? await searchParams : {};
  const readingId = cleanReadingId(query.reading_id);
  const reading = sampleReportReading;
  const report = reading.fullReport!;

  return (
    <main className="readingPage sampleReportPage">
      <header className="simpleNav">
        <Link href="/" className="brand">
          <span className="brandMark">命</span>
          <span>
            <strong>MINGYI</strong>
            <small>Bazi Destiny</small>
          </span>
        </Link>
        <Link className="navCta" href="/reading/new">Get My Free Preview</Link>
      </header>

      <section className="reportShell sampleReport">
        <div className="reportHeader">
          <p className="eyebrow">Sample Report</p>
          <h1>{report.headline}</h1>
          <p className="sampleNotice">
            This is a sample report. It is not based on your birth details.
          </p>
          <SampleReportCtas readingId={readingId} />
        </div>

        <div className="sampleProfile">
          <article>
            <span>Sample profile</span>
            <strong>{reading.name}</strong>
            <small>Female · Singapore · 14 Aug 1992 · 09:30</small>
          </article>
          <article>
            <span>Day Master</span>
            <strong>{reading.chart.dayMaster.label}</strong>
            <small>{elementLabel(reading.chart.dayMaster.element, "en")}</small>
          </article>
        </div>

        <h2>Four Pillars Chart</h2>
        <div className="chartGrid">
          {reading.chart.pillars.map((pillar) => (
            <article key={pillar.name}>
              <span>{pillar.name}</span>
              <strong>{pillar.label}</strong>
              <small>{elementLabel(pillar.element, "en")}</small>
            </article>
          ))}
        </div>

        <h2>Five Elements Balance</h2>
        <div className="elementGrid">
          {Object.entries(reading.chart.elements).map(([element, count]) => (
            <div key={element}>
              <span>{elementLabel(element, "en")}</span>
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
        <SampleReportCtas readingId={readingId} />
      </section>
    </main>
  );
}
