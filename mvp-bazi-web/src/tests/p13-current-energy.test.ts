import { beforeEach, describe, expect, it, vi } from "vitest";
import { generateBaziChart } from "@/lib/bazi/chart";
import { generateFullReportWithAi } from "@/lib/reports/ai-report";
import { generateFullReport } from "@/lib/reports/full-report";

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

describe("P1.3 current 30-day energy", () => {
  beforeEach(() => {
    delete process.env.OPENAI_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.AI_PROVIDER;
    vi.restoreAllMocks();
  });

  it("makes the fallback Current 30-Day Energy section product-grade", () => {
    const report = generateFullReport(chart(), "en");
    const currentEnergy = report.sections.find((section) => section.title === "Current 30-Day Energy");

    expect(currentEnergy?.body).toContain("emotional energy");
    expect(currentEnergy?.body).toContain("career/work momentum");
    expect(currentEnergy?.body).toContain("money opportunities");
    expect(currentEnergy?.body).toContain("relationship atmosphere");
    expect(currentEnergy?.body).toContain("what to push forward");
    expect(currentEnergy?.body).toContain("what to avoid");
    expect(currentEnergy?.body).toContain("stronger/weaker days");
    expect(currentEnergy?.body).toContain("practical suggestion");
  });

  it("instructs AI generation to write the same current-energy structure without guarantees", async () => {
    process.env.OPENAI_API_KEY = "sk_deepseek_fake";
    const fetchMock = vi.spyOn(globalThis, "fetch").mockResolvedValue({
      ok: false,
      status: 500,
      json: async () => ({})
    } as Response);

    await generateFullReportWithAi(chart(), "en");
    const [, init] = fetchMock.mock.calls[0];
    const body = JSON.stringify((init as RequestInit).body);

    expect(body).toContain("current emotional energy");
    expect(body).toContain("career/work momentum");
    expect(body).toContain("money opportunities");
    expect(body).toContain("relationship atmosphere");
    expect(body).toContain("what to push forward");
    expect(body).toContain("what to avoid");
    expect(body).toContain("stronger/weaker days");
    expect(body).toContain("one practical suggestion");
    expect(body).toContain("avoid absolute predictions");
  });
});
