import Link from "next/link";
import { en } from "@/lib/i18n/en";

export default function MethodologyPage() {
  return (
    <main className="legalPage">
      <Link href="/">MINGYI</Link>
      <h1>{en.legal.methodology}</h1>
      <p>MINGYI separates calculation from interpretation. The Four Pillars chart is produced by deterministic calendar logic; AI-style text is used only to explain the structured chart in plain language.</p>
      <p>The current engine uses Gregorian birth input converted into Chinese lunar EightChar data through lunar-typescript. The report stores structured fields including pillars, Day Master, Five Elements, Ten Gods, hidden stems, Na Yin, annual transit, branch interactions, and calculation policy.</p>
      <p>True solar time is recorded as a user preference in this MVP. Longitude-based correction is not yet applied, so the report avoids presenting boundary-hour details as certainty.</p>
    </main>
  );
}
