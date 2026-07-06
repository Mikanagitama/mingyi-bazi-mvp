import Link from "next/link";
import { FreeReport } from "@/components/FreeReport";
import { FullReport } from "@/components/FullReport";
import { getReading } from "@/lib/db/readings";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";

export default async function ReadingPage({ params }: { params: Promise<{ id: string }> }) {
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

  const copy = reading.language === "zh" ? zh : en;
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
        <Link className="languageSwitch" href={reading.language === "zh" ? "/" : "/zh"}>
          {reading.language === "zh" ? "English" : "中文"}
        </Link>
      </header>
      {reading.paymentStatus === "paid" && reading.fullReport ? (
        <FullReport reading={reading} report={reading.fullReport} />
      ) : (
        <>
          <FreeReport reading={reading} />
          <p className="disclaimer">{copy.legal.body}</p>
        </>
      )}
    </main>
  );
}
