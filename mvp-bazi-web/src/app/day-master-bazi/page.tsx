import Link from "next/link";

export default function DayMasterPage() {
  return (
    <main className="legalPage">
      <p className="eyebrow">Bazi Guide</p>
      <h1>What is a Day Master in Bazi?</h1>
      <p>
        The Day Master is the Heavenly Stem of the day pillar. In many Bazi readings, it acts as the reference point
        for interpreting personality, pressure, support, expression, wealth themes, and relationship dynamics.
      </p>
      <p>
        Mingyi shows the Day Master clearly in both the free preview and the paid report, then explains it in calm,
        practical language.
      </p>
      <Link className="primaryButton" href="/reading/new">Start Your Free Preview</Link>
    </main>
  );
}
