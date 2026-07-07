import { describe, expect, it } from "vitest";
import { generateBaziChart } from "@/lib/bazi/chart";
import { en } from "@/lib/i18n/en";
import { generateFreeReport } from "@/lib/reports/free-report";

describe("P0.7 preview and trust conversion", () => {
  it("shows the expected locked full report modules without full report leakage", () => {
    const chart = generateBaziChart({
      birthDate: "1992-08-14",
      birthTime: "09:30",
      birthTimeUnknown: false,
      language: "en",
      gender: "female",
      birthPlace: "Tokyo",
      timezone: "Asia/Tokyo",
      trueSolarTime: true
    });
    const report = generateFreeReport(chart, "en");

    expect(report.lockedSections.map((section) => section.title)).toEqual([
      "Career Direction",
      "Wealth Pattern",
      "Love & Relationships",
      "Current 30-Day Energy",
      "2026 Yearly Timing",
      "Practical Advice"
    ]);
    expect(JSON.stringify(report)).not.toContain("Your full Bazi reading is unlocked");
    expect(JSON.stringify(report)).not.toContain("Payment confirmed");
  });

  it("defines trust, privacy, and access reassurance near checkout", () => {
    expect(en.reading.trustBullets).toEqual([
      "One-time payment",
      "Secure checkout by Stripe",
      "Instant digital access",
      "No recurring charge"
    ]);
    expect(en.reading.privacyReassurance).toContain("used only to generate your report");
    expect(en.reading.refundReassurance).toContain("paid but cannot access your report");
  });

  it("includes footer contact and methodology trust copy", async () => {
    const methodology = await import("@/app/methodology/page");
    const pageText = methodology.default.toString();

    expect(en.footer.links.map(([label]) => label)).toEqual([
      "Privacy Policy",
      "Terms of Service",
      "Refund Policy",
      "Disclaimer",
      "Methodology",
      "Contact"
    ]);
    expect(pageText).toContain("Four Pillars");
    expect(pageText).toContain("Five Elements");
    expect(pageText).toContain("Ten Gods");
    expect(pageText).toContain("timing cycles");
    expect(pageText).toContain("not medical, legal, financial, investment, or professional advice");
  });
});
