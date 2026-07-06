import Link from "next/link";
import { en } from "@/lib/i18n/en";

export default function DisclaimerPage() {
  return (
    <main className="legalPage">
      <Link href="/">MINGYI</Link>
      <h1>{en.legal.disclaimer}</h1>
      <p>{en.legal.body}</p>
      <p>Bazi interpretation describes symbolic tendencies and timing patterns. It should not be treated as certainty, fate, or a guarantee of wealth, health, love, or success.</p>
      <p>If you are making important life decisions, consult qualified professionals and use this report only as one reflective input.</p>
    </main>
  );
}
