import Link from "next/link";
import { Suspense } from "react";
import { ReadingForm } from "@/components/ReadingForm";

export default function NewReadingPage() {
  return (
    <main className="readingPage">
      <header className="simpleNav">
        <Link href="/" className="brand">
          <span className="brandMark">命</span>
          <span>
            <strong>MINGYI</strong>
            <small>Bazi Destiny</small>
          </span>
        </Link>
      </header>
      <Suspense fallback={<div className="formPanel">Loading...</div>}>
        <ReadingForm />
      </Suspense>
    </main>
  );
}
