import Link from "next/link";
import { FullReport } from "@/components/FullReport";
import { FreeReport } from "@/components/FreeReport";
import { ensureFullReport, getReading } from "@/lib/db/readings";
import { en } from "@/lib/i18n/en";

export default async function FullReadingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const reading = await getReading(id);
  if (!reading) {
    return (
      <main className="readingPage">
        <p>{en.reading.notFound}</p>
        <Link href="/reading/new">Start again</Link>
      </main>
    );
  }

  const report = await ensureFullReport(id);
  return (
    <main className="readingPage">
      <header className="simpleNav">
        <Link href={reading.language === "zh" ? "/zh" : "/"} className="brand">
          <span className="brandMark">命</span>
          <span>
            <strong>MINGYI</strong>
            <small>Bazi Destiny</small>
          </span>
        </Link>
      </header>
      {report ? <FullReport reading={reading} report={report} /> : <FreeReport reading={reading} />}
    </main>
  );
}
