import type { MetadataRoute } from "next";
import { seoPages, siteUrl } from "@/lib/site-links";

const staticPaths = [
  "/",
  "/zh",
  "/reading/new",
  "/sample-report",
  "/privacy",
  "/terms",
  "/refund",
  "/disclaimer",
  "/methodology",
  "/contact"
];

export default function sitemap(): MetadataRoute.Sitemap {
  return [...staticPaths, ...seoPages.map((page) => page.path)].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-07-07")
  }));
}
