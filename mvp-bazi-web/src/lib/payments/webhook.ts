import type Stripe from "stripe";
import { logEvent } from "../db/events";
import { markReadingPaid } from "../db/readings";

export async function applyStripeEvent(event: Stripe.Event) {
  await logEvent({ name: "webhook_received", stripeEventId: event.id, metadata: { type: event.type } });
  if (event.type !== "checkout.session.completed") {
    return { handled: false };
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const readingId = session.metadata?.reading_id;
  if (!readingId) {
    throw new Error("Stripe session missing reading_id metadata.");
  }
  await logEvent({
    name: "checkout_completed",
    readingId,
    stripeEventId: event.id,
    stripeSessionId: session.id,
    metadata: { amount: session.amount_total || 500, currency: session.currency || "jpy" }
  });

  await markReadingPaid({
    readingId,
    email: session.customer_details?.email || session.customer_email || undefined,
    stripeSessionId: session.id,
    stripeEventId: event.id,
    stripePaymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
    amount: session.amount_total || 500,
    currency: session.currency || "jpy"
  });

  return { handled: true, readingId };
}
