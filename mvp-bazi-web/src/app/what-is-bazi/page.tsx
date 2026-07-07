import Link from "next/link";

export default function WhatIsBaziPage() {
  return (
    <main className="legalPage">
      <p className="eyebrow">Bazi Guide</p>
      <h1>What is Bazi?</h1>
      <p>
        Bazi, also called the Eight Characters, is a Chinese metaphysics system that reads a birth moment through
        four time pillars: year, month, day, and hour. Mingyi uses it as a structured cultural interpretation for
        entertainment, self-reflection, and timing insight.
      </p>
      <p>
        A Bazi chart is not a guaranteed prediction. It is better understood as a symbolic map of temperament,
        timing, tendencies, and tradeoffs.
      </p>
      <Link className="primaryButton" href="/reading/new">Get My Free Preview</Link>
    </main>
  );
}
