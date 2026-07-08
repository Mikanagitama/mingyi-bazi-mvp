import { NextResponse } from "next/server";
import { applyCreemEvent, verifyCreemWebhook } from "@/lib/payments/creem";

export const runtime = "nodejs";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    verifyCreemWebhook(body, request.headers.get("creem-signature"));
    const event = JSON.parse(body);
    const result = await applyCreemEvent(event);
    return NextResponse.json({ received: true, ...result });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid Creem webhook." },
      { status: 400 }
    );
  }
}
