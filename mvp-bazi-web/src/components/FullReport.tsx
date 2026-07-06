"use client";

import type { FullReport as FullReportType, PublicReading } from "@/lib/bazi/types";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";

export function FullReport({ reading, report }: { reading: PublicReading; report: FullReportType }) {
  const copy = reading.language === "zh" ? zh : en;
  const text = [
    report.headline,
    ...report.sections.map((section) => `${section.title}\n${section.body}`),
    report.disclaimer
  ].join("\n\n");

  async function copyReport() {
    await navigator.clipboard.writeText(text);
  }

  return (
    <section className="reportShell full">
      <div className="reportHeader">
        <p className="eyebrow">{copy.reading.paid}</p>
        <h1>{report.headline}</h1>
        <div className="reportActions">
          <button type="button" onClick={copyReport}>{copy.reading.copy}</button>
          <button type="button" onClick={() => window.print()}>{copy.reading.print}</button>
        </div>
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
    </section>
  );
}
