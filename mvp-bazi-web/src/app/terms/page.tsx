import Link from "next/link";
import { en } from "@/lib/i18n/en";

export default function TermsPage() {
  return (
    <main className="legalPage">
      <Link href="/">MINGYI</Link>
      <h1>{en.legal.terms}</h1>
      <p>MINGYI provides a digital Bazi reading for entertainment, cultural interpretation, and self-reflection.</p>
      <p>The $2.99 purchase unlocks one full report for the birth information submitted. Refund handling should be requested through the support contact listed on the live site.</p>
      <p>You agree not to use this service as a substitute for professional medical, legal, financial, or psychological advice.</p>
    </main>
  );
}
