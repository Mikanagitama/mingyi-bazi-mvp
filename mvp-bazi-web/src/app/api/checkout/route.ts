import { NextResponse } from "next/server";
import { logEvent } from "@/lib/db/events";
import { getInternalReading } from "@/lib/db/readings";
import { canCreateActiveCheckout, checkoutConfigurationMessage, createFullReadingCheckout } from "@/lib/payments/provider";

export async function POST(request: Request) {
  try {
    if (!canCreateActiveCheckout()) {
      return NextResponse.json({ error: checkoutConfigurationMessage() }, { status: 503 });
    }

    const body = await request.json();
    const readingId = String(body.readingId || "");
    const record = await getInternalReading(readingId);
    if (!record) {
      return NextResponse.json({ error: "Reading not found." }, { status: 404 });
    }
    await logEvent({ name: "checkout_started", readingId: record.id, metadata: { paymentStatus: record.paymentStatus } });

    if (record.paymentStatus === "paid") {
      return NextResponse.json({ url: record.language === "zh" ? `/reading/${record.id}/full?lang=zh` : `/reading/${record.id}/full` });
    }

    const origin = new URL(request.url).origin;
    const session = await createFullReadingCheckout(record, origin);
    return NextResponse.json({ url: session.url, provider: session.provider });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start checkout." },
      { status: 400 }
    );
  }
}
