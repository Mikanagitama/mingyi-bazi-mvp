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
  const payload = {
    mode: "payment" as const,
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
  };

  try {
    return await stripe.checkout.sessions.create(payload);
  } catch (error) {
    if (isStripeConnectionError(error)) {
      return createCheckoutSessionWithFetch(payload);
    }
    throw error;
  }
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

function isStripeConnectionError(error: unknown) {
  return error instanceof Error && error.message.toLowerCase().includes("connection to stripe");
}

async function createCheckoutSessionWithFetch(payload: Stripe.Checkout.SessionCreateParams) {
  const form = new URLSearchParams();
  form.set("mode", payload.mode || "payment");
  form.set("success_url", String(payload.success_url));
  form.set("cancel_url", String(payload.cancel_url));
  form.set("allow_promotion_codes", String(payload.allow_promotion_codes || false));
  form.set("line_items[0][price]", String(payload.line_items?.[0]?.price));
  form.set("line_items[0][quantity]", String(payload.line_items?.[0]?.quantity || 1));

  for (const [key, value] of Object.entries(payload.metadata || {})) {
    form.set(`metadata[${key}]`, String(value));
  }

  const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: {
      authorization: `Bearer ${config.stripeSecretKey}`,
      "content-type": "application/x-www-form-urlencoded"
    },
    body: form
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.error?.message || "Unable to create Stripe Checkout Session.");
  }
  return data as Stripe.Checkout.Session;
}
