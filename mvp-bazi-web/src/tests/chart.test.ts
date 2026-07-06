import { describe, expect, it } from "vitest";
import { generateBaziChart } from "@/lib/bazi/chart";
import { generateFreeReport } from "@/lib/reports/free-report";

describe("Bazi chart generation", () => {
  it("generates four pillars from valid Gregorian birth data", () => {
    const chart = generateBaziChart({
      birthDate: "1992-08-14",
      birthTime: "09:30",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });

    expect(chart.pillars).toHaveLength(4);
    expect(chart.dayMaster.stem).toMatch(/^[甲乙丙丁戊己庚辛壬癸]$/);
    expect(chart.elements.wood + chart.elements.fire + chart.elements.earth + chart.elements.metal + chart.elements.water).toBeGreaterThanOrEqual(8);
  });

  it("marks lower confidence when exact birth time is unknown", () => {
    const chart = generateBaziChart({
      birthDate: "1992-08-14",
      birthTimeUnknown: true,
      language: "en",
      gender: "unspecified"
    });

    expect(chart.accuracyNote).toContain("unknown birth time");
  });

  it("creates free preview without paid full sections", () => {
    const chart = generateBaziChart({
      birthDate: "1992-08-14",
      birthTime: "09:30",
      birthTimeUnknown: false,
      language: "en",
      gender: "unspecified"
    });
    const report = generateFreeReport(chart, "en");

    expect(report.sections.length).toBeGreaterThan(0);
    expect(report.lockedSections.map((section) => section.title)).toContain("Career & Wealth");
    expect(JSON.stringify(report)).not.toContain("Your full Bazi reading is unlocked");
  });
});
