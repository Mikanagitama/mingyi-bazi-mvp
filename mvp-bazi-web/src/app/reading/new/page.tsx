import Link from "next/link";
import { Suspense } from "react";
import { ReadingForm } from "@/components/ReadingForm";

export default async function NewReadingPage({
  searchParams
}: {
  searchParams?: Promise<{ lang?: string | string[] }>;
}) {
  const query = searchParams ? await searchParams : {};
  const language = (Array.isArray(query.lang) ? query.lang[0] : query.lang) === "zh" ? "zh" : "en";
  return (
    <main className="readingPage">
      <header className="simpleNav">
        <Link href={language === "zh" ? "/zh" : "/"} className="brand">
          <span className="brandMark">命</span>
          <span>
            <strong>MINGYI</strong>
            <small>{language === "zh" ? "八字命理" : "Bazi Destiny"}</small>
          </span>
        </Link>
      </header>
      <Suspense fallback={<div className="formPanel">{language === "zh" ? "加载中..." : "Loading..."}</div>}>
        <ReadingForm />
      </Suspense>
    </main>
  );
}
