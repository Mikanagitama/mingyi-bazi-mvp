import type { ReadingRecord } from "../bazi/types";
import { config } from "../config";
import { canCreateCreemCheckout, createCreemCheckout } from "./creem";
import { canCreateCheckout as canCreateStripeCheckout, createFullReadingCheckout as createStripeCheckout } from "./stripe";

export type PaymentProvider = "creem" | "stripe";

export function activePaymentProvider(): PaymentProvider {
  return config.paymentProvider.toLowerCase() === "creem" ? "creem" : "stripe";
}

export function canCreateActiveCheckout() {
  return activePaymentProvider() === "creem" ? canCreateCreemCheckout() : canCreateStripeCheckout();
}

export function checkoutConfigurationMessage() {
  return activePaymentProvider() === "creem"
    ? "Creem checkout is not configured. Add CREEM_API_KEY and CREEM_PRODUCT_ID."
    : "Stripe Checkout is not configured. Add STRIPE_SECRET_KEY and STRIPE_PRICE_ID.";
}

export async function createFullReadingCheckout(record: ReadingRecord, origin: string) {
  if (activePaymentProvider() === "creem") {
    return createCreemCheckout(record, origin);
  }
  const session = await createFullReadingCheckoutWithStripe(record, origin);
  return { id: session.id, url: session.url || "", provider: "stripe" as const };
}

async function createFullReadingCheckoutWithStripe(record: ReadingRecord, origin: string) {
  return createStripeCheckout(record, origin);
}
