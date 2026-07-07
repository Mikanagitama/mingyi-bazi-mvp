import Link from "next/link";
import { FullReportStatus } from "@/components/FullReportStatus";
import { logEvent } from "@/lib/db/events";
import { buildReadingStatus, getReading } from "@/lib/db/readings";
import { en } from "@/lib/i18n/en";

export default async function FullReadingPage({
  params,
  searchParams
}: {
  params: Promise<{ id: string }>;
  searchParams?: Promise<{ session_id?: string | string[] }>;
}) {
  const { id } = await params;
  const query = searchParams ? await searchParams : {};
  const sessionId = Array.isArray(query.session_id) ? query.session_id[0] : query.session_id;
  const reading = await getReading(id);
  if (!reading) {
    return (
      <main className="readingPage">
        <p>{en.reading.notFound}</p>
        <Link href="/reading/new">Start again</Link>
      </main>
    );
  }
  if (reading.paymentStatus === "paid" && reading.fullReport) {
    await logEvent({ name: "full_report_viewed", readingId: reading.id, metadata: { path: "full" } });
  }

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
      <FullReportStatus
        initialReading={reading}
        initialStatus={buildReadingStatus(reading, Boolean(sessionId))}
        sessionId={sessionId}
      />
    </main>
  );
}
