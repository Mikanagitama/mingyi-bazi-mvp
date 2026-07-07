import { describe, expect, it } from "vitest";
import { en } from "@/lib/i18n/en";

describe("P1.4 future product entry points", () => {
  it("defines non-disruptive coming-soon product cards without new payment paths", async () => {
    const landing = await import("@/components/LandingPage");
    const source = landing.LandingPage.toString();

    expect(en.landing.futureTitle).toBe("Future Report Editions");
    expect(en.landing.futureReports.map(([title]) => title)).toEqual([
      "Wealth Pattern Report",
      "Love & Relationship Report"
    ]);
    expect(en.landing.futureReports.map(([, body]) => body).join(" ")).toContain(
      "money, opportunity, and long-term earning style"
    );
    expect(en.landing.futureReports.map(([, body]) => body).join(" ")).toContain(
      "relationship patterns, attraction style, and emotional needs"
    );
    expect(source).toContain("futureReports");
    expect(source).toContain("Coming Soon");
    expect(source).not.toContain("futureCheckout");
  });
});
