import { beforeEach, describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { POST as createReadingRoute } from "@/app/api/readings/route";
import { readLocalStore, resetLocalStoreForTests } from "@/lib/db/client";
import { createReading } from "@/lib/db/readings";
import { applyStripeEvent } from "@/lib/payments/webhook";

function resetTestEnv(name: string) {
  delete process.env.DATABASE_URL;
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_MODEL;
  delete process.env.DEEPSEEK_API_KEY;
  delete process.env.DEEPSEEK_MODEL;
  delete process.env.AI_PROVIDER;
  delete process.env.VERCEL;
  delete process.env.MINGYI_PREVIEW_RATE_LIMIT_PER_HOUR;
  delete process.env.MINGYI_READING_RATE_LIMIT_PER_DAY;
  process.env.NODE_ENV = "test";
  process.env.MINGYI_LOCAL_STORE_NAME = `${name}-${Date.now()}-${Math.random()}.json`;
  resetLocalStoreForTests();
}

function checkoutCompletedEvent(readingId: string, eventId = "evt_p08_once", sessionId = "cs_p08_once") {
  return {
    id: eventId,
    object: "event",
    type: "checkout.session.completed",
    data: {
      object: {
        id: sessionId,
        object: "checkout.session",
        metadata: { reading_id: readingId, product: "full_bazi_reading", language: "en" },
        amount_total: 500,
        currency: "usd",
        payment_intent: "pi_p08_once",
        customer_details: { email: "p08@example.com" }
      }
    }
  } as Stripe.Event;
}

describe("P0.8 stability protections", () => {
  beforeEach(() => {
    resetTestEnv("p08-stability");
  });

  it("logs reading, preview, webhook, payment, and full generation events", async () => {
    const reading = await createReading({
      birthDate: "1992-08-14",
      birthTime: "09:30",
      birthTimeUnknown: false,
      language: "en",
      gender: "female"
    });

    await applyStripeEvent(checkoutCompletedEvent(reading.id));

    const events = readLocalStore().events.map((event) => event.name);
    expect(events).toEqual(
      expect.arrayContaining([
        "reading_created",
        "preview_generated",
        "webhook_received",
        "checkout_completed",
        "payment_marked_paid",
        "full_generation_started",
        "full_generation_completed"
      ])
    );
  });

  it("does not regenerate full reports for duplicate Stripe event or session ids", async () => {
    const reading = await createReading({
      birthDate: "1992-08-14",
      birthTime: "09:30",
      birthTimeUnknown: false,
      language: "en",
      gender: "female"
    });
    const event = checkoutCompletedEvent(reading.id, "evt_p08_duplicate", "cs_p08_duplicate");

    await applyStripeEvent(event);
    await applyStripeEvent(event);

    const store = readLocalStore();
    expect(store.payments.filter((payment) => payment.stripeEventId === "evt_p08_duplicate")).toHaveLength(1);
    expect(store.events.filter((eventLog) => eventLog.name === "full_generation_started")).toHaveLength(1);
  });

  it("rate limits repeated preview creation from the same client", async () => {
    process.env.MINGYI_PREVIEW_RATE_LIMIT_PER_HOUR = "2";
    const body = JSON.stringify({
      birthDate: "1992-08-14",
      birthTime: "09:30",
      birthTimeUnknown: false,
      language: "en",
      gender: "female"
    });
    const headers = { "content-type": "application/json", "x-forwarded-for": "203.0.113.8" };

    const first = await createReadingRoute(new Request("https://example.test/api/readings", { method: "POST", headers, body }));
    const second = await createReadingRoute(new Request("https://example.test/api/readings", { method: "POST", headers, body }));
    const third = await createReadingRoute(new Request("https://example.test/api/readings", { method: "POST", headers, body }));

    expect(first.status).toBe(200);
    expect(second.status).toBe(200);
    expect(third.status).toBe(429);
    await expect(third.json()).resolves.toMatchObject({ error: "Too many preview requests. Please try again later." });
  });
});
