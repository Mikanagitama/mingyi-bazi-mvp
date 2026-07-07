import Link from "next/link";

export default function FourPillarsPage() {
  return (
    <main className="legalPage">
      <p className="eyebrow">Bazi Guide</p>
      <h1>What are the Four Pillars of Destiny?</h1>
      <p>
        The Four Pillars of Destiny are the year, month, day, and hour pillars in a Bazi chart. Each pillar combines
        a Heavenly Stem and an Earthly Branch, creating the core structure used to discuss elements, timing, and life
        themes.
      </p>
      <p>
        Mingyi calculates the chart first, then explains the structure in plain language so the report feels readable
        rather than like a list of technical terms.
      </p>
      <Link className="primaryButton" href="/sample-report">View Sample Report</Link>
    </main>
  );
}
