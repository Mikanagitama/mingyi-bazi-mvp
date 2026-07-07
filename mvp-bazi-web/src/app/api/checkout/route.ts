import { NextResponse } from "next/server";
import { logEvent } from "@/lib/db/events";
import { getInternalReading } from "@/lib/db/readings";
import { canCreateCheckout, createFullReadingCheckout } from "@/lib/payments/stripe";

export async function POST(request: Request) {
  try {
    if (!canCreateCheckout()) {
      return NextResponse.json(
        { error: "Stripe Checkout is not configured. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID." },
        { status: 503 }
      );
    }

    const body = await request.json();
    const readingId = String(body.readingId || "");
    const record = await getInternalReading(readingId);
    if (!record) {
      return NextResponse.json({ error: "Reading not found." }, { status: 404 });
    }
    await logEvent({ name: "checkout_started", readingId: record.id, metadata: { paymentStatus: record.paymentStatus } });

    if (record.paymentStatus === "paid") {
      return NextResponse.json({ url: `/reading/${record.id}/full` });
    }

    const origin = new URL(request.url).origin;
    const session = await createFullReadingCheckout(record, origin);
    return NextResponse.json({ url: session.url });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to start checkout." },
      { status: 400 }
    );
  }
}
