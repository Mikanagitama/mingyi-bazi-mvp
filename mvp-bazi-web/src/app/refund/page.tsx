import Link from "next/link";
import { en } from "@/lib/i18n/en";

export default function RefundPage() {
  return (
    <main className="legalPage">
      <Link href="/">MINGYI</Link>
      <h1>{en.legal.refund}</h1>
      <p>Each purchase unlocks one digital Bazi report for the birth information submitted at checkout.</p>
      <p>If payment succeeds but the report does not unlock, contact support with your checkout email and reading link so we can restore access or review a refund.</p>
      <p>Because the report is generated and delivered digitally, refunds are reviewed case by case for duplicate payments, technical failures, or accidental purchases.</p>
    </main>
  );
}
