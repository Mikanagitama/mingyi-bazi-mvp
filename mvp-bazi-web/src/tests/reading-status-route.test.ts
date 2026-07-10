import { beforeEach, describe, expect, it } from "vitest";
import { GET } from "@/app/api/readings/[id]/route";
import { readLocalStore, resetLocalStoreForTests, writeLocalStore } from "@/lib/db/client";
import { createReading } from "@/lib/db/readings";

describe("reading status route", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.DEEPSEEK_MODEL;
    delete process.env.AI_PROVIDER;
    delete process.env.VERCEL;
    process.env.NODE_ENV = "test";
    process.env.MINGYI_LOCAL_STORE_NAME = `reading-status-route-${Date.now()}-${Math.random()}.json`;
    resetLocalStoreForTests();
  });

  it("returns locked status for unpaid readings without leaking full report", async () => {
    const reading = await createReading({
      birthDate: "1990-02-03",
      birthTime: "10:00",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });

    const response = await GET(new Request(`https://example.test/api/readings/${reading.id}`), {
      params: Promise.resolve({ id: reading.id })
    });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.status).toMatchObject({
      paymentStatus: "free",
      reportState: "locked",
      fullReportReady: false
    });
    expect(data.reading.fullReport).toBeUndefined();
  });

  it("returns 404 for invalid reading ids before querying storage", async () => {
    const response = await GET(new Request("https://example.test/api/readings/not-a-real-reading-id"), {
      params: Promise.resolve({ id: "not-a-real-reading-id" })
    });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe("Reading not found.");
  });

  it("returns confirming status when a checkout session id is present but payment is not yet marked paid", async () => {
    const reading = await createReading({
      birthDate: "1990-02-03",
      birthTime: "10:00",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });

    const response = await GET(
      new Request(`https://example.test/api/readings/${reading.id}?session_id=cs_test_pending`),
      { params: Promise.resolve({ id: reading.id }) }
    );
    const data = await response.json();

    expect(data.status).toMatchObject({
      paymentStatus: "free",
      reportState: "confirming",
      fullReportReady: false
    });
    expect(data.reading.fullReport).toBeUndefined();
  });

  it("returns generating status for paid readings that do not have a full report yet", async () => {
    const reading = await createReading({
      birthDate: "1990-02-03",
      birthTime: "10:00",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });
    const store = readLocalStore();
    store.readings[0].paymentStatus = "paid";
    writeLocalStore(store);

    const response = await GET(new Request(`https://example.test/api/readings/${reading.id}`), {
      params: Promise.resolve({ id: reading.id })
    });
    const data = await response.json();

    expect(data.status).toMatchObject({
      paymentStatus: "paid",
      reportState: "generating",
      fullReportReady: false
    });
  });

  it("can prepare a missing paid full report when requested by the polling client", async () => {
    const reading = await createReading({
      birthDate: "1990-02-03",
      birthTime: "10:00",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });
    const store = readLocalStore();
    store.readings[0].paymentStatus = "paid";
    writeLocalStore(store);

    const response = await GET(
      new Request(`https://example.test/api/readings/${reading.id}?ensure_full=1`),
      { params: Promise.resolve({ id: reading.id }) }
    );
    const data = await response.json();

    expect(data.status).toMatchObject({
      paymentStatus: "paid",
      reportState: "fallback_ready",
      fullReportReady: true,
      generationMode: "template"
    });
    expect(data.reading.fullReport.sections).toHaveLength(8);
    expect(data.reading.fullReport.generation.fallbackReason).toBeUndefined();
  });
});
