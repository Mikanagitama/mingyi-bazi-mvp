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
      gender: "female",
      birthPlace: "Tokyo",
      timezone: "Asia/Tokyo",
      trueSolarTime: true,
      userQuestion: "What should I focus on?"
    });

    expect(chart.pillars).toHaveLength(4);
    expect(chart.dayMaster.stem).toMatch(/^[甲乙丙丁戊己庚辛壬癸]$/);
    expect(chart.elements.wood + chart.elements.fire + chart.elements.earth + chart.elements.metal + chart.elements.water).toBeGreaterThanOrEqual(8);
    expect(chart.day_master).toEqual(chart.dayMaster);
    expect(chart.five_elements).toEqual(chart.elements);
    expect(chart.ten_gods).toHaveLength(4);
    expect(chart.hidden_stems.day.length).toBeGreaterThan(0);
    expect(chart.nayin.year).toBeTruthy();
    expect(chart.luck_pillars.length).toBeGreaterThan(0);
    expect(chart.annual_transits[0].year).toBe(2026);
    expect(chart.calculation_policy.true_solar_time_requested).toBe(true);
    expect(chart.calculation_policy.true_solar_time_applied).toBe(false);
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
    expect(report.lockedSections.map((section) => section.title)).toContain("Career Direction");
    expect(JSON.stringify(report)).not.toContain("Your full Bazi reading is unlocked");
  });
});
