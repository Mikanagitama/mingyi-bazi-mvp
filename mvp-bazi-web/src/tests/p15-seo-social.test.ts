import { describe, expect, it } from "vitest";
import { metadata } from "@/app/layout";
import { contactLinks, siteUrl } from "@/lib/site-links";

describe("P1.5 SEO and social links", () => {
  it("defines homepage SEO, Open Graph, and Twitter metadata", () => {
    expect(metadata.title).toBe("Mingyi Bazi | AI-Powered Chinese Four Pillars Reading");
    expect(metadata.description).toBe(
      "Generate a personalized Bazi reading based on Chinese Four Pillars, Five Elements, and AI interpretation. For entertainment and self-reflection."
    );
    expect(metadata.openGraph).toMatchObject({
      title: "Mingyi Bazi | AI-Powered Chinese Four Pillars Reading"
    });
    expect(metadata.openGraph).toMatchObject({
      url: "https://www.fountersaying.com",
      images: expect.arrayContaining([
        expect.objectContaining({ url: "/og/founter-saying-og.png", width: 1200, height: 630 }),
        expect.objectContaining({ url: "/og/founter-saying-square.png", width: 1080, height: 1080 })
      ])
    });
    expect(metadata.twitter).toMatchObject({ card: "summary_large_image", images: ["/og/founter-saying-og.png"] });
    expect(metadata.icons).toMatchObject({
      icon: expect.arrayContaining([expect.objectContaining({ url: "/favicon.svg" })]),
      apple: expect.arrayContaining([expect.objectContaining({ url: "/apple-touch-icon.png" })])
    });
    expect(siteUrl).toBe("https://www.fountersaying.com");
  });

  it("keeps configured contact/social links professional and hides empty placeholders", () => {
    expect(contactLinks.map((link) => link.label)).toEqual([
      "Email",
      "X",
      "TikTok",
      "Instagram",
      "Xiaohongshu",
      "Douyin"
    ]);
    expect(contactLinks.find((link) => link.label === "Email")?.href).toBe("mailto:support@fountersaying.com");
    expect(contactLinks.every((link) => link.href.length > 0)).toBe(true);
  });

  it("adds basic SEO pages plus sitemap and robots routes", async () => {
    const bazi = await import("@/app/what-is-bazi/page");
    const pillars = await import("@/app/four-pillars-of-destiny/page");
    const dayMaster = await import("@/app/day-master-bazi/page");
    const sitemap = await import("@/app/sitemap");
    const robots = await import("@/app/robots");

    expect(bazi.default.toString()).toContain("What is Bazi");
    expect(pillars.default.toString()).toContain("Four Pillars of Destiny");
    expect(dayMaster.default.toString()).toContain("Day Master");
    expect((await sitemap.default()).map((item) => item.url).join(" ")).toContain("/what-is-bazi");
    expect(robots.default()).toMatchObject({ rules: { userAgent: "*", allow: "/" } });
  });
});
