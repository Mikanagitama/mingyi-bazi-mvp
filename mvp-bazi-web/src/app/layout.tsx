import type { Metadata } from "next";
import { Suspense } from "react";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { SiteFooter } from "@/components/SiteFooter";
import { siteUrl } from "@/lib/site-links";
import "../styles/globals.css";

const ogImage = "/og/founter-saying-og.png";
const squareImage = "/og/founter-saying-square.png";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "Mingyi Bazi | AI-Powered Chinese Four Pillars Reading",
  description:
    "Generate a personalized Bazi reading based on Chinese Four Pillars, Five Elements, and AI interpretation. For entertainment and self-reflection.",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: "Mingyi Bazi | AI-Powered Chinese Four Pillars Reading",
    description:
      "Generate a personalized Bazi reading based on Chinese Four Pillars, Five Elements, and AI interpretation. For entertainment and self-reflection.",
    url: siteUrl,
    siteName: "Mingyi Bazi",
    type: "website",
    images: [
      {
        url: ogImage,
        width: 1200,
        height: 630,
        alt: "Mingyi Bazi AI-Powered Chinese Four Pillars Reading"
      },
      {
        url: squareImage,
        width: 1080,
        height: 1080,
        alt: "Mingyi Bazi social preview"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Mingyi Bazi | AI-Powered Chinese Four Pillars Reading",
    description:
      "Generate a personalized Bazi reading based on Chinese Four Pillars, Five Elements, and AI interpretation. For entertainment and self-reflection.",
    images: [ogImage]
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Suspense fallback={null}>
          <AnalyticsTracker />
        </Suspense>
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
