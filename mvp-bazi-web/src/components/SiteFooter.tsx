"use client";

import Link from "next/link";
import { en } from "@/lib/i18n/en";
import { zh } from "@/lib/i18n/zh";
import { localizeHref } from "@/lib/i18n/routing";
import { contactLinks, seoPages } from "@/lib/site-links";
import { usePathname, useSearchParams } from "next/navigation";

export function SiteFooter() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const language = pathname === "/zh" || searchParams.get("lang") === "zh" ? "zh" : "en";
  const copy = language === "zh" ? zh : en;
  const seoLabels =
    language === "zh"
      ? ["什么是八字？", "四柱命理", "八字日主"]
      : seoPages.map((page) => page.label);

  return (
    <footer className="footer">
      <div className="footerGroup">
        <span>
          {language === "zh"
            ? "© 2026 Founter Saying。Mingyi Bazi 是 AI 辅助的八字数字报告产品。"
            : "© 2026 Founter Saying. Mingyi Bazi is an AI-powered Bazi digital report product."}
        </span>
        {copy.footer.links.map(([label, href]) => (
          <Link key={href} href={localizeHref(href, language)}>
            {label}
          </Link>
        ))}
      </div>
      <div className="footerGroup">
        {seoPages.map((page, index) => (
          <Link key={page.path} href={localizeHref(page.path, language)}>
            {seoLabels[index]}
          </Link>
        ))}
      </div>
      <div className="footerGroup">
        {contactLinks.map((link) => (
          <a key={link.label} href={link.href}>
            {link.label}
          </a>
        ))}
      </div>
    </footer>
  );
}
