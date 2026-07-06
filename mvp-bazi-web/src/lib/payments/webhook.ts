import type Stripe from "stripe";
import { markReadingPaid } from "../db/readings";

export async function applyStripeEvent(event: Stripe.Event) {
  if (event.type !== "checkout.session.completed") {
    return { handled: false };
  }

  const session = event.data.object as Stripe.Checkout.Session;
  const readingId = session.metadata?.reading_id;
  if (!readingId) {
    throw new Error("Stripe session missing reading_id metadata.");
  }

  await markReadingPaid({
    readingId,
    email: session.customer_details?.email || session.customer_email || undefined,
    stripeSessionId: session.id,
    stripePaymentIntent: typeof session.payment_intent === "string" ? session.payment_intent : undefined,
    amount: session.amount_total || 299,
    currency: session.currency || "usd"
  });

  return { handled: true, readingId };
}
