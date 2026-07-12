import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { sampleReportReading, sampleReportReadingZh } from "@/lib/reports/sample-report";
import { en } from "@/lib/i18n/en";

describe("P1.1 sample report", () => {
  it("uses clearly fake sample data and the full paid-report section shape", () => {
    expect(sampleReportReading.id).toBe("sample-report");
    expect(sampleReportReading.name).toBe("Sample Reader");
    expect(sampleReportReading.fullReport?.headline).toContain("Sample");
    expect(sampleReportReading.fullReport?.disclaimer).toContain("This is a sample report");
    expect(sampleReportReading.fullReport?.disclaimer).toContain("not based on your birth details");
    expect(sampleReportReading.fullReport?.sections.map((section) => section.title)).toEqual([
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

  it("keeps the Chinese sample report in Chinese when lang=zh is used", () => {
    expect(sampleReportReadingZh.language).toBe("zh");
    expect(sampleReportReadingZh.name).toBe("样例用户");
    expect(sampleReportReadingZh.fullReport?.headline).toBe("完整八字报告示例");
    expect(sampleReportReadingZh.fullReport?.sections.map((section) => section.title)).toEqual([
      "核心性格",
      "五行平衡",
      "事业方向",
      "财富模式",
      "感情关系",
      "未来30天能量",
      "2026 年度节奏",
      "实用建议"
    ]);
    expect(sampleReportReadingZh.fullReport?.disclaimer).toContain("这是一份样例报告");
  });

  it("adds sample report entry points from marketing and preview surfaces", async () => {
    const samplePage = await import("@/app/sample-report/page");
    const landing = await import("@/components/LandingPage");
    const preview = await import("@/components/FreeReport");
    const sampleSource = readFileSync("src/app/sample-report/page.tsx", "utf8");

    expect(samplePage.default.toString()).toContain("This is a sample report");
    expect(sampleSource).toContain("copy.reading.unlock");
    expect(sampleSource).toContain("copy.reading.secure");
    expect(sampleSource).toContain("CheckoutButton");
    expect(sampleSource).toContain("reading_id");
    expect(sampleSource).toContain("langFromSearchParams");
    expect(en.nav.sample).toBe("Sample Report");
    expect(landing.LandingPage.toString()).toContain("/sample-report");
    expect(landing.LandingPage.toString()).toContain("localizeHref");
    expect(preview.FreeReport.toString()).toContain("reading_id");
  });
});
