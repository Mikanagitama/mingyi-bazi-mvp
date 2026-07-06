import Link from "next/link";
import { en } from "@/lib/i18n/en";

export default function PrivacyPage() {
  return (
    <main className="legalPage">
      <Link href="/">MINGYI</Link>
      <h1>{en.legal.privacy}</h1>
      <p>We collect only the birth details needed to create your Bazi reading, optional display name, optional email from payment, and payment status from Stripe.</p>
      <p>We do not collect hukou. Birthplace is not required in this MVP. Payment card details are handled by Stripe Checkout and are not stored on this site.</p>
      <p>You may contact support to request report deletion, refund review, or data questions.</p>
    </main>
  );
}
