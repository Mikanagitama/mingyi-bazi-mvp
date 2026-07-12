import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { homeHref, langFromSearchParams, localizeHref } from "@/lib/i18n/routing";

describe("language routing", () => {
  it("keeps zh users on zh-aware public links", () => {
    expect(homeHref("zh")).toBe("/zh");
    expect(langFromSearchParams({ lang: "zh" })).toBe("zh");
    expect(localizeHref("/privacy", "zh")).toBe("/privacy?lang=zh");
    expect(localizeHref("/sample-report?reading_id=abc", "zh")).toBe("/sample-report?reading_id=abc&lang=zh");
    expect(localizeHref("/privacy", "en")).toBe("/privacy");
  });

  it("wires the main zh surfaces to language-aware links", () => {
    const landing = readFileSync("src/components/LandingPage.tsx", "utf8");
    const footer = readFileSync("src/components/SiteFooter.tsx", "utf8");
    const form = readFileSync("src/components/ReadingForm.tsx", "utf8");
    const freeReport = readFileSync("src/components/FreeReport.tsx", "utf8");

    expect(landing).toContain('localizeHref("/sample-report"');
    expect(landing).toContain('localizeHref("/privacy"');
    expect(footer).toContain('searchParams.get("lang") === "zh"');
    expect(form).toContain("?lang=zh");
    expect(freeReport).toContain("unlockActions");
  });
});
