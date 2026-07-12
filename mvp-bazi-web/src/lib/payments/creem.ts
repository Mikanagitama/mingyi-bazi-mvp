import crypto from "node:crypto";
import { config } from "../config";
import type { ReadingRecord } from "../bazi/types";
import { logEvent } from "../db/events";
import { getInternalReading, markReadingPaid } from "../db/readings";
import { FULL_REPORT_PRICE_CENTS, FULL_REPORT_PRICE_CURRENCY } from "../product";

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
  const successLang = record.language === "zh" ? "?lang=zh" : "";
  const payload = {
    product_id: config.creemProductId,
    request_id: record.id,
    units: 1,
    success_url: `${canonicalOrigin}/reading/${record.id}/full${successLang}`,
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
  const candidates = signatureCandidates(signature);
  const expectedBuffer = Buffer.from(expected, "hex");
  for (const received of candidates) {
    const receivedBuffer = Buffer.from(received, "hex");
    if (expectedBuffer.length === receivedBuffer.length && crypto.timingSafeEqual(expectedBuffer, receivedBuffer)) {
      return;
    }
  }
  throw new Error("Invalid Creem signature.");
}

function signatureCandidates(signature: string) {
  const candidates = new Set<string>();
  const add = (value: string) => {
    const normalized = value.replace(/\s+/g, "").trim().toLowerCase();
    if (/^[a-f0-9]{64}$/.test(normalized)) {
      candidates.add(normalized);
    }
  };

  add(signature);
  for (const part of signature.split(/[;,]/)) {
    add(part.includes("=") ? part.slice(part.indexOf("=") + 1) : part);
  }
  for (const match of signature.replace(/\s+/g, "").matchAll(/[a-f0-9]{64}/gi)) {
    add(match[0]);
  }
  return [...candidates];
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

function validateOfficialPrice(order: Record<string, unknown> | undefined) {
  const amount = numberValue(order, "amount");
  const currency = stringValue(order, "currency");
  if (
    (amount !== undefined && amount !== FULL_REPORT_PRICE_CENTS) ||
    (currency !== undefined && currency.toLowerCase() !== FULL_REPORT_PRICE_CURRENCY.toLowerCase())
  ) {
    throw new Error("Creem checkout amount does not match Full Bazi Reading price.");
  }
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
  const existingReading = await getInternalReading(readingId);
  if (!existingReading) {
    await logEvent({
      name: "webhook_received",
      stripeEventId: event.id,
      metadata: { type: eventType, provider: "creem", ignored: true, reason: "unknown_reading_id", readingId }
    });
    return { handled: false, ignored: true, reason: "unknown_reading_id" };
  }

  const order = objectValue(checkout, "order");
  const customer = objectValue(checkout, "customer");
  validateOfficialPrice(order);
  const checkoutId = stringValue(checkout, "id");
  const eventId = event.id;
  const customerId = stringValue(customer, "id") || stringValue(order, "customer");
  const email = stringValue(customer, "email");
  const amount = numberValue(order, "amount") || FULL_REPORT_PRICE_CENTS;
  const currency = stringValue(order, "currency") || FULL_REPORT_PRICE_CURRENCY.toLowerCase();

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
