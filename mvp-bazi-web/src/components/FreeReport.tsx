import type { PublicReading } from "@/lib/bazi/types";
import Link from "next/link";
import { elementLabel } from "@/lib/bazi/chart";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";
import { CheckoutButton } from "./CheckoutButton";
import { LockedSection } from "./LockedSection";

export function FreeReport({ reading }: { reading: PublicReading }) {
  const copy = reading.language === "zh" ? zh : en;
  return (
    <section className="reportShell">
      <div className="reportHeader">
        <p className="eyebrow">{copy.reading.freeTitle}</p>
        <h1>{reading.freeReport.headline}</h1>
        <p>{reading.freeReport.summary}</p>
      </div>

      <div className="chartGrid">
        {reading.chart.pillars.map((pillar) => (
          <article key={pillar.name}>
            <span>{pillar.name}</span>
            <strong>{pillar.label}</strong>
            <small>{elementLabel(pillar.element, reading.language)}</small>
          </article>
        ))}
      </div>

      <article className="dayMasterCard">
        <p className="eyebrow">{copy.reading.dayMaster}</p>
        <h2>{reading.chart.dayMaster.label}</h2>
        <p>
          {reading.language === "zh"
            ? `日主代表你观察世界、回应压力和使用能量的核心方式。本盘日主属于${elementLabel(reading.chart.dayMaster.element, reading.language)}。`
            : `The Day Master represents your core style for meeting pressure, opportunity, and relationships. This chart's Day Master is associated with ${elementLabel(reading.chart.dayMaster.element, reading.language)}.`}
        </p>
      </article>

      <div className="elementGrid">
        {Object.entries(reading.chart.elements).map(([element, count]) => (
          <div key={element}>
            <span>{elementLabel(element, reading.language)}</span>
            <meter min={0} max={8} value={count} />
            <small>{count}</small>
          </div>
        ))}
      </div>

      <div className="reportSections">
        {reading.freeReport.sections.map((section) => (
          <article key={section.title} className="reportSection">
            <h2>{section.title}</h2>
            <p>{section.body}</p>
          </article>
        ))}
      </div>

      <div className="unlockPanel">
        <h2>{copy.reading.lockedTitle}</h2>
        <p>{copy.reading.lockedText}</p>
        <div className="lockedGrid">
          {reading.freeReport.lockedSections.map((section) => (
            <LockedSection key={section.title} section={section} />
          ))}
        </div>
        <div className="trustList">
          {copy.reading.trustBullets.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <p className="finePrint">{copy.reading.privacyReassurance}</p>
        <p className="finePrint">{copy.reading.refundReassurance}</p>
        <Link className="sampleLink" href="/sample-report">
          {reading.language === "zh" ? "先看样例报告" : "View a sample full report"}
        </Link>
        <CheckoutButton readingId={reading.id} label={copy.reading.unlock} secureText={copy.reading.secure} />
      </div>
    </section>
  );
}
