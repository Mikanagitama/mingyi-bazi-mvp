import { describe, expect, it } from "vitest";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";

describe("P0.6 conversion copy", () => {
  it("presents the English homepage as a free-preview Bazi product", () => {
    expect(en.landing.title).toBe("Ancient Chinese Bazi Reading, Explained by AI");
    expect(en.landing.primary).toBe("Get My Free Preview");
    expect(en.nav.cta).toBe("Get My Free Preview");
    expect(en.landing.discover.map(([title]) => title)).toEqual([
      "Core Personality",
      "Five Elements Balance",
      "Career Direction",
      "Wealth Pattern",
      "Love & Relationships",
      "Current 30-Day Energy"
    ]);
    expect(en.landing.method.map(([title]) => title)).toEqual([
      "Structured Bazi calculation first",
      "AI interpretation second",
      "True solar time supported",
      "Private birth data",
      "Secure checkout",
      "One-time payment"
    ]);
  });

  it("explains true solar time and unknown birth time in the birth form", () => {
    expect(en.form.trueSolarTimeHelp).toContain("True solar time adjusts your birth time based on location");
    expect(en.form.unknownTimeHelp).toContain("less detailed");
    expect(en.form.note).toContain("Your birth details are used only to generate your report");
  });

  it("keeps Chinese copy aligned with the free-preview flow", () => {
    expect(zh.landing.primary).toBe("获取免费预览");
    expect(zh.form.trueSolarTimeHelp).toContain("真太阳时");
    expect(zh.form.unknownTimeHelp).toContain("细节会减少");
  });
});
