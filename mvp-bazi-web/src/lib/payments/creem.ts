import crypto from "node:crypto";
import { config } from "../config";
import type { ReadingRecord } from "../bazi/types";
import { logEvent } from "../db/events";
import { markReadingPaid } from "../db/readings";

type CreemCheckoutResponse = {
  id?: string;
  checkout_url?: string;
  checkoutUrl?: string;
  url?: string;
};

type CreemWebhookEvent = {
  id?: string;
  eventType?: string;
  type?: string;
  object?: Record<string, unknown>;
};

export function canCreateCreemCheckout() {
  return Boolean(config.creemApiKey && config.creemProductId);
}

export async function createCreemCheckout(record: ReadingRecord, origin: string) {
  if (!config.creemApiKey) {
    throw new Error("CREEM_API_KEY is not configured.");
  }
  if (!config.creemProductId) {
    throw new Error("CREEM_PRODUCT_ID is not configured.");
  }

  const canonicalOrigin = config.siteUrl || origin;
  const payload = {
    product_id: config.creemProductId,
    request_id: record.id,
    units: 1,
    success_url: `${canonicalOrigin}/reading/${record.id}/full`,
    metadata: {
      reading_id: record.id,
      product_type: "full_bazi_report",
      product: "full_bazi_reading",
      language: record.language
    }
  };

  const response = await fetch(`${config.creemBaseUrl.replace(/\/$/, "")}/v1/checkouts`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": config.creemApiKey
    },
    body: JSON.stringify(payload),
    signal: AbortSignal.timeout(20000)
  });
  const data = (await response.json()) as CreemCheckoutResponse & { error?: { message?: string }; message?: string };
  if (!response.ok) {
    throw new Error(data.error?.message || data.message || "Unable to create Creem checkout.");
  }

  const url = data.checkout_url || data.checkoutUrl || data.url;
  if (!url) {
    throw new Error("Creem checkout response did not include checkout_url.");
  }
  return { id: data.id, url, provider: "creem" as const };
}

export function verifyCreemWebhook(body: string, signature: string | null) {
  if (!config.creemWebhookSecret) {
    return;
  }
  if (!signature) {
    throw new Error("Missing Creem signature.");
  }
  const expected = crypto.createHmac("sha256", config.creemWebhookSecret).update(body).digest("hex");
  const received = signature.replace(/\s+/g, "").trim().toLowerCase();
  const expectedBuffer = Buffer.from(expected, "hex");
  const receivedBuffer = Buffer.from(received, "hex");
  if (expectedBuffer.length !== receivedBuffer.length || !crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
    throw new Error("Invalid Creem signature.");
  }
}

function objectValue(record: Record<string, unknown> | undefined, key: string) {
  return record && typeof record[key] === "object" && record[key] !== null ? (record[key] as Record<string, unknown>) : undefined;
}

function stringValue(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "string" ? value : undefined;
}

function numberValue(record: Record<string, unknown> | undefined, key: string) {
  const value = record?.[key];
  return typeof value === "number" && Number.isFinite(value) ? value : undefined;
}

function metadataFrom(checkout: Record<string, unknown> | undefined) {
  return objectValue(checkout, "metadata");
}

function extractReadingId(checkout: Record<string, unknown> | undefined) {
  const metadata = metadataFrom(checkout);
  return stringValue(metadata, "reading_id") || stringValue(metadata, "referenceId") || stringValue(checkout, "request_id");
}

export async function applyCreemEvent(event: CreemWebhookEvent) {
  const eventType = event.eventType || event.type;
  await logEvent({ name: "webhook_received", stripeEventId: event.id, metadata: { type: eventType, provider: "creem" } });
  if (eventType !== "checkout.completed") {
    return { handled: false };
  }

  const checkout = event.object;
  const readingId = extractReadingId(checkout);
  if (!readingId) {
    await logEvent({
      name: "webhook_received",
      stripeEventId: event.id,
      metadata: { type: eventType, provider: "creem", ignored: true, reason: "missing_reading_id" }
    });
    return { handled: false, ignored: true, reason: "missing_reading_id" };
  }

  const order = objectValue(checkout, "order");
  const customer = objectValue(checkout, "customer");
  const checkoutId = stringValue(checkout, "id");
  const eventId = event.id;
  const customerId = stringValue(customer, "id") || stringValue(order, "customer");
  const email = stringValue(customer, "email");
  const amount = numberValue(order, "amount") || 299;
  const currency = stringValue(order, "currency") || "usd";

  await logEvent({
    name: "checkout_completed",
    readingId,
    stripeEventId: eventId,
    stripeSessionId: checkoutId,
    metadata: { amount, currency, provider: "creem", checkoutId, customerId }
  });

  await markReadingPaid({
    readingId,
    email,
    provider: "creem",
    providerCheckoutId: checkoutId,
    providerEventId: eventId,
    providerCustomerId: customerId,
    amount,
    currency,
    rawEvent: event as Record<string, unknown>
  });

  return { handled: true, readingId };
}
