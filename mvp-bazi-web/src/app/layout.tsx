import type { Metadata } from "next";
import { SiteFooter } from "@/components/SiteFooter";
import { siteUrl } from "@/lib/site-links";
import "../styles/globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mingyi Bazi | AI-Powered Chinese Four Pillars Reading",
  description:
    "Generate a personalized Bazi reading based on Chinese Four Pillars, Five Elements, and AI interpretation. For entertainment and self-reflection.",
  openGraph: {
    title: "Mingyi Bazi | AI-Powered Chinese Four Pillars Reading",
    description:
      "Generate a personalized Bazi reading based on Chinese Four Pillars, Five Elements, and AI interpretation. For entertainment and self-reflection.",
    url: siteUrl,
    siteName: "Mingyi Bazi",
    type: "website"
  },
  twitter: {
    card: "summary_large_image",
    title: "Mingyi Bazi | AI-Powered Chinese Four Pillars Reading",
    description:
      "Generate a personalized Bazi reading based on Chinese Four Pillars, Five Elements, and AI interpretation. For entertainment and self-reflection."
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
