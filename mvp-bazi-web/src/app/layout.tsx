import type { Metadata } from "next";
import "../styles/globals.css";

export const metadata: Metadata = {
  title: "MINGYI Bazi Destiny",
  description: "A bilingual Four Pillars of Destiny reading with a free preview and full paid report."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
