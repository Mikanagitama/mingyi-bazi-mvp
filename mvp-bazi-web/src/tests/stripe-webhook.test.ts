import { beforeEach, describe, expect, it } from "vitest";
import type Stripe from "stripe";
import { readLocalStore, resetLocalStoreForTests } from "@/lib/db/client";
import { createReading, getReading } from "@/lib/db/readings";
import { applyStripeEvent } from "@/lib/payments/webhook";

describe("Stripe webhook application", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.DEEPSEEK_MODEL;
    delete process.env.AI_PROVIDER;
    delete process.env.VERCEL;
    process.env.NODE_ENV = "test";
    process.env.MINGYI_LOCAL_STORE_NAME = `stripe-webhook-${Date.now()}-${Math.random()}.json`;
    resetLocalStoreForTests();
  });

  it("marks a reading paid only from checkout.session.completed event", async () => {
    const reading = await createReading({
      birthDate: "1988-11-20",
      birthTime: "21:15",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });

    const event = {
      id: "evt_test",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_paid",
          object: "checkout.session",
          metadata: { reading_id: reading.id, product: "full_bazi_reading", language: "en" },
          amount_total: 299,
          currency: "usd",
          payment_intent: "pi_test_paid",
          customer_details: { email: "reader@example.com" }
        }
      }
    } as Stripe.Event;

    const result = await applyStripeEvent(event);
    const paid = await getReading(reading.id);

    expect(result).toEqual({ handled: true, readingId: reading.id });
    expect(paid?.paymentStatus).toBe("paid");
    expect(paid?.email).toBe("reader@example.com");
    expect(paid?.fullReport).toBeDefined();
  });

  it("ignores unrelated Stripe events", async () => {
    const event = {
      id: "evt_ignored",
      object: "event",
      type: "payment_intent.created",
      data: { object: { id: "pi_ignored", object: "payment_intent" } }
    } as Stripe.Event;

    await expect(applyStripeEvent(event)).resolves.toEqual({ handled: false });
  });

  it("does not duplicate payment rows when Stripe retries the same event", async () => {
    const reading = await createReading({
      birthDate: "1988-11-20",
      birthTime: "21:15",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });

    const event = {
      id: "evt_retry_once",
      object: "event",
      type: "checkout.session.completed",
      data: {
        object: {
          id: "cs_test_retry",
          object: "checkout.session",
          metadata: { reading_id: reading.id, product: "full_bazi_reading", language: "en" },
          amount_total: 299,
          currency: "usd",
          payment_intent: "pi_test_retry"
        }
      }
    } as Stripe.Event;

    await applyStripeEvent(event);
    await applyStripeEvent(event);

    const store = readLocalStore();
    expect(store.payments.filter((payment) => payment.stripeEventId === "evt_retry_once")).toHaveLength(1);
  });
});
