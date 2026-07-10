import type { Metadata } from "next";
import { Suspense } from "react";
import { AnalyticsTracker } from "@/components/AnalyticsTracker";
import { FULL_REPORT_PRICE, FULL_REPORT_PRICE_CURRENCY } from "@/lib/product";
import { SiteFooter } from "@/components/SiteFooter";
import { siteUrl } from "@/lib/site-links";
import "../styles/globals.css";

const ogImage = "/og/founter-saying-og.png";
const squareImage = "/og/founter-saying-square.png";
const siteDescription =
  "Generate a personalized Bazi reading based on Chinese Four Pillars, Five Elements, and AI interpretation. For entertainment and self-reflection.";

export const structuredData = [
  {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Mingyi Bazi",
    alternateName: "Founter Saying",
    url: siteUrl,
    logo: `${siteUrl}/icon-512.png`,
    email: "support@fountersaying.com"
  },
  {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Mingyi Bazi",
    alternateName: ["Founter Saying", "www.fountersaying.com"],
    url: siteUrl,
    inLanguage: ["en", "zh-CN"],
    description: siteDescription
  },
  {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: "Mingyi Bazi",
    applicationCategory: "LifestyleApplication",
    operatingSystem: "Web",
    url: siteUrl,
    offers: {
      "@type": "Offer",
      price: FULL_REPORT_PRICE,
      priceCurrency: FULL_REPORT_PRICE_CURRENCY,
      availability: "https://schema.org/InStock"
    }
  }
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: "Mingyi Bazi",
  title: "Mingyi Bazi | AI-Powered Chinese Four Pillars Reading",
  description: siteDescription,
  keywords: [
    "Mingyi Bazi",
    "Founter Saying",
    "www.fountersaying.com",
    "Bazi reading",
    "Chinese astrology",
    "Four Pillars of Destiny",
    "Day Master",
    "Five Elements"
  ],
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "zh-CN": "/zh",
      "x-default": "/"
    }
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1
    }
  },
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" }
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }]
  },
  openGraph: {
    title: "Mingyi Bazi | AI-Powered Chinese Four Pillars Reading",
    description: siteDescription,
    url: siteUrl,
    siteName: "Mingyi Bazi",
    type: "website",
    locale: "en_US",
    alternateLocale: ["zh_CN"],
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
    description: siteDescription,
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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, "\\u003c") }}
        />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
