import { NextResponse } from "next/server";
import { logEvent, type EventName } from "@/lib/db/events";

const allowedEvents = new Set<EventName>([
  "page_view",
  "homepage_cta_clicked",
  "form_started",
  "form_submitted",
  "unlock_clicked",
  "checkout_returned",
  "payment_confirmed",
  "full_report_generating",
  "sample_report_viewed",
  "trust_page_viewed"
]);

function safeString(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.slice(0, maxLength) : undefined;
}

function safeMetadata(input: unknown) {
  if (!input || typeof input !== "object") {
    return {};
  }
  const output: Record<string, string | number | boolean> = {};
  for (const [key, value] of Object.entries(input)) {
    if (!/^[a-zA-Z0-9_:-]{1,40}$/.test(key)) {
      continue;
    }
    if (typeof value === "string") {
      output[key] = value.slice(0, 160);
    } else if (typeof value === "number" && Number.isFinite(value)) {
      output[key] = value;
    } else if (typeof value === "boolean") {
      output[key] = value;
    }
  }
  return output;
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const name = safeString(body?.name, 80) as EventName | undefined;
  if (!name || !allowedEvents.has(name)) {
    return NextResponse.json({ error: "Unsupported event." }, { status: 400 });
  }

  await logEvent({
    name,
    readingId: safeString(body?.readingId, 80),
    metadata: {
      path: safeString(body?.path, 180),
      ...safeMetadata(body?.metadata)
    }
  });

  return NextResponse.json({ ok: true });
}
