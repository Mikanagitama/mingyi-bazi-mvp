import { beforeEach, describe, expect, it } from "vitest";
import { readLocalStore, resetLocalStoreForTests, writeLocalStore } from "@/lib/db/client";
import {
  buildReadingStatus,
  createReading,
  ensureFullReport,
  getReading,
  markReadingPaid
} from "@/lib/db/readings";

describe("reading access control", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.DEEPSEEK_MODEL;
    delete process.env.AI_PROVIDER;
    delete process.env.VERCEL;
    process.env.NODE_ENV = "test";
    process.env.MINGYI_LOCAL_STORE_NAME = `report-access-${Date.now()}-${Math.random()}.json`;
    resetLocalStoreForTests();
  });

  it("does not expose full report before payment", async () => {
    const reading = await createReading({
      birthDate: "1990-02-03",
      birthTime: "10:00",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });

    const publicReading = await getReading(reading.id);
    const fullReport = await ensureFullReport(reading.id);

    expect(publicReading?.paymentStatus).toBe("free");
    expect(publicReading?.fullReport).toBeUndefined();
    expect(fullReport).toBeNull();
  });

  it("describes locked and confirming states without exposing full report", async () => {
    const reading = await createReading({
      birthDate: "1990-02-03",
      birthTime: "10:00",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });

    const publicReading = await getReading(reading.id);

    expect(buildReadingStatus(publicReading!, false)).toMatchObject({
      paymentStatus: "free",
      reportState: "locked",
      fullReportReady: false
    });
    expect(buildReadingStatus(publicReading!, true)).toMatchObject({
      paymentStatus: "free",
      reportState: "confirming",
      fullReportReady: false
    });
    expect(publicReading?.fullReport).toBeUndefined();
  });

  it("describes generating, ready, and fallback ready paid report states", async () => {
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

    const generating = await getReading(reading.id);
    expect(buildReadingStatus(generating!, false)).toMatchObject({
      paymentStatus: "paid",
      reportState: "generating",
      fullReportReady: false
    });

    await ensureFullReport(reading.id);
    const ready = await getReading(reading.id);
    expect(buildReadingStatus(ready!, false)).toMatchObject({
      paymentStatus: "paid",
      reportState: "fallback_ready",
      fullReportReady: true,
      generationMode: "template"
    });

    const readyStore = readLocalStore();
    readyStore.readings[0].fullReport = {
      ...readyStore.readings[0].fullReport!,
      generation: { mode: "ai", model: "deepseek:deepseek-v4-flash", attempts: 1 }
    };
    writeLocalStore(readyStore);

    const aiReady = await getReading(reading.id);
    expect(buildReadingStatus(aiReady!, false)).toMatchObject({
      paymentStatus: "paid",
      reportState: "ready",
      fullReportReady: true,
      generationMode: "ai"
    });
  });

  it("exposes full report after verified paid marker", async () => {
    const reading = await createReading({
      birthDate: "1990-02-03",
      birthTime: "10:00",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });

    await markReadingPaid({
      readingId: reading.id,
      stripeSessionId: "cs_test_access",
      stripePaymentIntent: "pi_test_access",
      amount: 299,
      currency: "usd"
    });

    const publicReading = await getReading(reading.id);
    const fullReport = await ensureFullReport(reading.id);

    expect(publicReading?.paymentStatus).toBe("paid");
    expect(publicReading?.fullReport?.headline).toContain("full Bazi reading");
    expect(fullReport?.sections.map((section) => section.title)).toEqual([
      "Core Personality",
      "Five Elements Balance",
      "Career Direction",
      "Wealth Pattern",
      "Love & Relationships",
      "Current 30-Day Energy",
      "2026 Yearly Timing",
      "Practical Advice"
    ]);
  });
});
