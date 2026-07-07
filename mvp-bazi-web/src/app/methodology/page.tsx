import Link from "next/link";
import { en } from "@/lib/i18n/en";

export default function MethodologyPage() {
  return (
    <main className="legalPage">
      <Link href="/">MINGYI</Link>
      <h1>{en.legal.methodology}</h1>
      <p>MINGYI separates calculation from interpretation. The Four Pillars chart is produced by deterministic calendar logic; AI text, when configured, is used only to explain the structured chart in plain language.</p>
      <p>The current engine uses Gregorian birth input converted into Chinese lunar EightChar data through lunar-typescript. The report stores structured fields including Four Pillars, Day Master, Five Elements, Ten Gods, hidden stems, Na Yin, annual transit, branch interactions, timing cycles, and calculation policy.</p>
      <p>AI explains the structured chart in natural language after the chart is calculated. AI is not used to invent the Four Pillars, Day Master, Five Elements, Ten Gods, or timing cycles.</p>
      <p>True solar time is optional. When the birthplace matches the built-in longitude table, MINGYI applies a longitude and equation-of-time correction before calculating the chart. If the birthplace cannot be resolved, no correction is forced.</p>
      <p>If AI generation is unavailable or does not pass safety checks, MINGYI falls back to a deterministic template report so paid access can still be restored.</p>
      <p>This service is for entertainment, cultural interest, self-reflection, and timing insight. It is not medical, legal, financial, investment, or professional advice.</p>
    </main>
  );
}
