import { NextResponse } from "next/server";
import { verifyStripeWebhook } from "@/lib/payments/stripe";
import { applyStripeEvent } from "@/lib/payments/webhook";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("stripe-signature");
    const event = verifyStripeWebhook(body, signature);
    const result = await applyStripeEvent(event);
    return NextResponse.json({ received: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid webhook." },
      { status: 400 }
    );
  }
}
