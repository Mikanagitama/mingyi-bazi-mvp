import { NextResponse } from "next/server";
import { logEvent } from "@/lib/db/events";
import { getInternalReading } from "@/lib/db/readings";
import { canCreateCreemCheckout, createCreemCheckout } from "@/lib/payments/creem";

export async function POST(request: Request) {
  try {
    if (!canCreateCreemCheckout()) {
      return NextResponse.json(
        { error: "Creem checkout is not configured. Add CREEM_API_KEY and CREEM_PRODUCT_ID." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const readingId = String(body.readingId || "");
    const record = await getInternalReading(readingId);
    if (!record) {
      return NextResponse.json({ error: "Reading not found." }, { status: 404 });
    }
    await logEvent({ name: "checkout_started", readingId: record.id, metadata: { paymentStatus: record.paymentStatus, provider: "creem" } });

    if (record.paymentStatus === "paid") {
      return NextResponse.json({ url: `/reading/${record.id}/full`, provider: "creem" });
    }

    const origin = new URL(request.url).origin;
    const session = await createCreemCheckout(record, origin);
    return NextResponse.json({ url: session.url, provider: session.provider });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start Creem checkout." },
      { status: 400 }
    );
  }
}
