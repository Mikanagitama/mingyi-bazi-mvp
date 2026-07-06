import { beforeEach, describe, expect, it } from "vitest";
import { resetLocalStoreForTests } from "@/lib/db/client";
import { createReading, ensureFullReport, getReading, markReadingPaid } from "@/lib/db/readings";

describe("reading access control", () => {
  beforeEach(() => {
    delete process.env.DATABASE_URL;
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
    expect(fullReport?.sections.length).toBeGreaterThan(8);
  });
});
