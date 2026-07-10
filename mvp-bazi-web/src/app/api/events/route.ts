import { NextResponse } from "next/server";
import { logEvent, type EventName } from "@/lib/db/events";
import { assertRateLimit, RateLimitError } from "@/lib/db/rate-limit";

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

function intEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
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
  try {
    await assertRateLimit(
      `events:ip:${clientIp(request)}`,
      intEnv("MINGYI_EVENTS_RATE_LIMIT_PER_MINUTE", 120),
      60,
      "Too many analytics events. Please try again later."
    );
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
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message, resetAt: error.resetAt }, { status: 429 });
    }
    return NextResponse.json({ error: "Unable to record event." }, { status: 400 });
  }
}
