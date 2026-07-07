import { NextResponse } from "next/server";
import { buildReadingStatus, ensureFullReport, getReading } from "@/lib/db/readings";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const url = new URL(request.url);
  let reading = await getReading(id);
  if (!reading) {
    return NextResponse.json({ error: "Reading not found." }, { status: 404 });
  }

  const shouldEnsureFull = url.searchParams.get("ensure_full") === "1";
  if (shouldEnsureFull && reading.paymentStatus === "paid" && !reading.fullReport) {
    await ensureFullReport(id);
    reading = await getReading(id);
    if (!reading) {
      return NextResponse.json({ error: "Reading not found." }, { status: 404 });
    }
  }

  const sessionId = url.searchParams.get("session_id");
  return NextResponse.json({ reading, status: buildReadingStatus(reading, Boolean(sessionId)) });
}
