import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { generateBaziChart } from "@/lib/bazi/chart";
import { generateFullReportWithAi } from "@/lib/reports/ai-report";

function chart() {
  return generateBaziChart({
    birthDate: "1992-08-14",
    birthTime: "09:30",
    birthTimeUnknown: false,
    birthPlace: "Tokyo",
    timezone: "Asia/Tokyo",
    trueSolarTime: true,
    userQuestion: "What should I focus on this month?",
    language: "en",
    gender: "female"
  });
}

const aiSections = [
  "Core Personality",
  "Five Elements Balance",
  "Career Direction",
  "Wealth Pattern",
  "Love & Relationships",
  "Current 30-Day Energy",
  "2026 Yearly Timing",
  "Practical Advice"
].map((title) => ({
  title,
  body: `This section interprets the deterministic Bazi chart in practical and reflective language for ${title}. It stays careful, grounded, and non-fatalistic while giving the reader useful timing insight.`
}));

describe("AI full report generation", () => {
  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.OPENAI_MODEL;
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("falls back to template report when OpenAI is not configured", async () => {
    const report = await generateFullReportWithAi(chart(), "en");

    expect(report.generation?.mode).toBe("template");
    expect(report.generation?.fallbackReason).toContain("OPENAI_API_KEY");
  });

  it("uses OpenAI JSON when configured and valid", async () => {
    process.env.OPENAI_API_KEY = "sk_test_fake";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: true,
      json: async () => ({
        output_text: JSON.stringify({
          headline: "Your full Bazi reading is ready.",
          sections: aiSections
        })
      })
    } as Response);

    const report = await generateFullReportWithAi(chart(), "en");

    expect(fetchMock).toHaveBeenCalledOnce();
    expect(report.generation?.mode).toBe("ai");
    expect(report.sections.map((section) => section.title)).toEqual(aiSections.map((section) => section.title));
  });

  it("retries AI generation and falls back safely on repeated failure", async () => {
    process.env.OPENAI_API_KEY = "sk_test_fake";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({})
    } as Response);

    const report = await generateFullReportWithAi(chart(), "en");

    expect(fetchMock).toHaveBeenCalledTimes(2);
    expect(report.generation?.mode).toBe("template");
    expect(report.generation?.attempts).toBe(2);
    expect(report.generation?.fallbackReason).toContain("500");
  });
});
