import Stripe from "stripe";
import { config } from "../config";
import type { ReadingRecord } from "../bazi/types";

let stripeClient: Stripe | null = null;

export function getStripe() {
  if (!config.stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured.");
  }
  if (!stripeClient) {
    stripeClient = new Stripe(config.stripeSecretKey);
  }
  return stripeClient;
}

export function canCreateCheckout() {
  return Boolean(config.stripeSecretKey && config.stripePriceId);
}

export async function createFullReadingCheckout(record: ReadingRecord, origin: string) {
  if (!config.stripePriceId) {
    throw new Error("STRIPE_PRICE_ID is not configured.");
  }

  const stripe = getStripe();
  return stripe.checkout.sessions.create({
    mode: "payment",
    line_items: [
      {
        price: config.stripePriceId,
        quantity: 1
      }
    ],
    metadata: {
      reading_id: record.id,
      product: "full_bazi_reading",
      language: record.language
    },
    success_url: `${origin}/reading/${record.id}/full?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${origin}/reading/${record.id}`,
    allow_promotion_codes: false
  });
}

export function verifyStripeWebhook(body: string, signature: string | null) {
  if (!signature) {
    throw new Error("Missing Stripe signature.");
  }
  if (!config.stripeWebhookSecret) {
    throw new Error("STRIPE_WEBHOOK_SECRET is not configured.");
  }
  return getStripe().webhooks.constructEvent(body, signature, config.stripeWebhookSecret);
}
