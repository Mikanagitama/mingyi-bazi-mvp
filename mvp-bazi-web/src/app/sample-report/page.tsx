import Link from "next/link";
import { elementLabel } from "@/lib/bazi/chart";
import { sampleReportReading } from "@/lib/reports/sample-report";

export default function SampleReportPage() {
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
        <div className="sampleCta">
          <Link className="primaryButton" href="/reading/new">Generate My Free Preview</Link>
        </div>
      </section>
    </main>
  );
}
