import crypto from "node:crypto";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST as checkoutRoute } from "@/app/api/checkout/route";
import { POST as creemCheckoutRoute } from "@/app/api/creem/create-checkout-session/route";
import { readLocalStore, resetLocalStoreForTests } from "@/lib/db/client";
import { createReading, getReading } from "@/lib/db/readings";
import { applyCreemEvent, verifyCreemWebhook } from "@/lib/payments/creem";

function resetTestEnv(name: string) {
  delete process.env.DATABASE_URL;
  delete process.env.OPENAI_API_KEY;
  delete process.env.OPENAI_MODEL;
  delete process.env.DEEPSEEK_API_KEY;
  delete process.env.DEEPSEEK_MODEL;
  delete process.env.AI_PROVIDER;
  delete process.env.VERCEL;
  process.env.NODE_ENV = "test";
  process.env.PAYMENT_PROVIDER = "creem";
  process.env.CREEM_API_KEY = "creem_test_key";
  process.env.CREEM_PRODUCT_ID = "prod_full_bazi";
  process.env.CREEM_API_BASE_URL = "https://test-api.creem.io";
  process.env.NEXT_PUBLIC_SITE_URL = "https://www.fountersaying.com";
  process.env.MINGYI_LOCAL_STORE_NAME = `${name}-${Date.now()}-${Math.random()}.json`;
  resetLocalStoreForTests();
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
}

function creemCompletedEvent(readingId: string, eventId = "evt_creem_once", checkoutId = "ch_creem_once") {
  return {
    id: eventId,
    eventType: "checkout.completed",
    object: {
      id: checkoutId,
      object: "checkout",
      request_id: readingId,
      status: "completed",
      metadata: {
        reading_id: readingId,
        product_type: "full_bazi_report"
      },
      order: {
        id: "ord_creem_once",
        amount: 299,
        currency: "USD",
        status: "paid"
      },
      customer: {
        id: "cust_creem_once",
        email: "creem-reader@example.com"
      }
    }
  };
}

describe("Creem payment provider", () => {
  beforeEach(() => {
    resetTestEnv("creem-payment");
  });

  it("creates a Creem checkout with reading metadata and official success URL", async () => {
    const reading = await createReading({
      birthDate: "1992-08-14",
      birthTime: "09:30",
      birthTimeUnknown: false,
      language: "en",
      gender: "female"
    });
    const fetchMock = vi.fn(async (_url: string | URL | Request, init?: RequestInit) => {
      const body = JSON.parse(String(init?.body));
      expect(body.product_id).toBe("prod_full_bazi");
      expect(body.request_id).toBe(reading.id);
      expect(body.success_url).toBe(`https://www.fountersaying.com/reading/${reading.id}/full`);
      expect(body.metadata).toMatchObject({
        reading_id: reading.id,
        product_type: "full_bazi_report",
        product: "full_bazi_reading"
      });
      expect((init?.headers as Record<string, string>)["x-api-key"]).toBe("creem_test_key");
      return new Response(JSON.stringify({ id: "ch_created", checkout_url: "https://checkout.creem.io/ch_created" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    });
    vi.stubGlobal("fetch", fetchMock);

    const response = await checkoutRoute(
      new Request("https://www.fountersaying.com/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ readingId: reading.id })
      })
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ url: "https://checkout.creem.io/ch_created", provider: "creem" });
    expect(fetchMock).toHaveBeenCalledOnce();
  });

  it("keeps the Creem-specific checkout route on Creem even when Stripe fallback is active", async () => {
    process.env.PAYMENT_PROVIDER = "stripe";
    const reading = await createReading({
      birthDate: "1992-08-14",
      birthTime: "09:30",
      birthTimeUnknown: false,
      language: "en",
      gender: "female"
    });
    vi.stubGlobal(
      "fetch",
      vi.fn(async () => new Response(JSON.stringify({ id: "ch_direct", checkout_url: "https://checkout.creem.io/ch_direct" }), {
        status: 200,
        headers: { "content-type": "application/json" }
      }))
    );

    const response = await creemCheckoutRoute(
      new Request("https://www.fountersaying.com/api/creem/create-checkout-session", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ readingId: reading.id })
      })
    );
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ url: "https://checkout.creem.io/ch_direct", provider: "creem" });
  });

  it("marks the matching reading paid from checkout.completed and ignores duplicates", async () => {
    const reading = await createReading({
      birthDate: "1988-11-20",
      birthTime: "21:15",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });
    const event = creemCompletedEvent(reading.id, "evt_creem_duplicate", "ch_creem_duplicate");

    await applyCreemEvent(event);
    await applyCreemEvent(event);

    const paid = await getReading(reading.id);
    const store = readLocalStore();
    expect(paid?.paymentStatus).toBe("paid");
    expect(paid?.email).toBe("creem-reader@example.com");
    expect(paid?.fullReport?.sections).toHaveLength(8);
    expect(store.payments.filter((payment) => payment.providerEventId === "evt_creem_duplicate")).toHaveLength(1);
    expect(store.events.filter((eventLog) => eventLog.name === "full_generation_started")).toHaveLength(1);
  });

  it("verifies Creem webhook signatures when a secret is configured", () => {
    process.env.CREEM_WEBHOOK_SECRET = "whsec_creem_test";
    const body = JSON.stringify(creemCompletedEvent("reading_123"));
    const signature = crypto.createHmac("sha256", process.env.CREEM_WEBHOOK_SECRET).update(body).digest("hex");

    expect(() => verifyCreemWebhook(body, signature)).not.toThrow();
    expect(() => verifyCreemWebhook(body, "00")).toThrow("Invalid Creem signature.");
  });
});
