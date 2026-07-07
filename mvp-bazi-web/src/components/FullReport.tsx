"use client";

import type { FullReport as FullReportType, PublicReading } from "@/lib/bazi/types";
import { elementLabel } from "@/lib/bazi/chart";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";

const pillarDisplay: Record<string, string> = {
  year: "Year",
  month: "Month",
  day: "Day",
  hour: "Hour"
};

export function FullReport({ reading, report }: { reading: PublicReading; report: FullReportType }) {
  const copy = reading.language === "zh" ? zh : en;
  const currentEnergy = report.sections.find((section) => section.title.includes("30-Day"));
  const currentYear = reading.chart.annual_transits.find((transit) => transit.year === 2026) || reading.chart.annual_transits[0];
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

      <div className="visualEvidence">
        <section className="visualBlock">
          <div className="visualBlockHeader">
            <p className="eyebrow">Chart Evidence</p>
            <h2>Four Pillars Table</h2>
          </div>
          <div className="pillarTable" role="table" aria-label="Four Pillars Table">
            <div role="row" className="pillarRow header">
              <span />
              {reading.chart.pillars.map((pillar) => (
                <strong key={pillar.name}>{pillarDisplay[pillar.name] || pillar.name}</strong>
              ))}
            </div>
            <div role="row" className="pillarRow">
              <span>Heavenly Stem</span>
              {reading.chart.pillars.map((pillar) => (
                <b key={pillar.name}>{pillar.stem}</b>
              ))}
            </div>
            <div role="row" className="pillarRow">
              <span>Earthly Branch</span>
              {reading.chart.pillars.map((pillar) => (
                <b key={pillar.name}>{pillar.branch}</b>
              ))}
            </div>
            <div role="row" className="pillarRow">
              <span>Element</span>
              {reading.chart.pillars.map((pillar) => (
                <b key={pillar.name}>{elementLabel(pillar.element, reading.language)}</b>
              ))}
            </div>
            <div role="row" className="pillarRow">
              <span>Ten God</span>
              {reading.chart.pillars.map((pillar) => {
                const tenGod = reading.chart.ten_gods.find((item) => item.pillar === pillar.name);
                return <b key={pillar.name}>{tenGod?.stem || "Reference"}</b>;
              })}
            </div>
            <div role="row" className="pillarRow">
              <span>Hidden Stems</span>
              {reading.chart.pillars.map((pillar) => (
                <b key={pillar.name}>{reading.chart.hidden_stems[pillar.name]?.join(" / ") || "-"}</b>
              ))}
            </div>
          </div>
        </section>

        <section className="visualSplit">
          <article className="dayMasterCard fullDayMaster">
            <p className="eyebrow">Your Day Master</p>
            <h2>{reading.chart.dayMaster.label}</h2>
            <p>
              The Day Master is the chart's reference point: it describes the style through which the rest of
              the chart is interpreted.
            </p>
          </article>

          <article className="visualBlock compactVisual">
            <h2>Five Elements Balance</h2>
            <div className="elementGrid compactElements">
              {Object.entries(reading.chart.elements).map(([element, count]) => (
                <div key={element}>
                  <span>{elementLabel(element, reading.language)}</span>
                  <meter min={0} max={8} value={count} />
                  <small>{count}</small>
                </div>
              ))}
            </div>
          </article>
        </section>

        <section className="visualBlock">
          <h2>Luck Pillar Timeline</h2>
          <div className="luckTimeline">
            {reading.chart.luck_pillars.slice(0, 6).map((pillar) => (
              <article key={pillar.index}>
                <span>Age {pillar.start_age}-{pillar.end_age}</span>
                <strong>{pillar.gan_zhi}</strong>
                <small>{pillar.start_year}-{pillar.end_year}</small>
              </article>
            ))}
          </div>
        </section>

        <section className="currentEnergyCard">
          <p className="eyebrow">Timing Insight</p>
          <h2>Current Year / Current 30-Day Energy</h2>
          <div className="currentEnergyGrid">
            <article>
              <span>Current year</span>
              <strong>{currentYear ? `${currentYear.year} · ${currentYear.pillar}` : "Timing cycle"}</strong>
              <p>{currentYear?.relation_to_day_master || "Read as timing atmosphere, not a guaranteed outcome."}</p>
            </article>
            <article>
              <span>30-day focus</span>
              <strong>{currentEnergy?.title || "Current 30-Day Energy"}</strong>
              <p>{currentEnergy?.body || "A practical short-term focus is included in the full report."}</p>
            </article>
          </div>
        </section>
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
