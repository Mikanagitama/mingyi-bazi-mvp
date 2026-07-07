import Link from "next/link";
import { en } from "@/lib/i18n/en";
import { contactLinks, seoPages } from "@/lib/site-links";

export function SiteFooter() {
  return (
    <footer className="footer">
      <div className="footerGroup">
        <span>MINGYI Bazi Destiny</span>
        {en.footer.links.map(([label, href]) => (
          <Link key={href} href={href}>
            {label}
          </Link>
        ))}
      </div>
      <div className="footerGroup">
        {seoPages.map((page) => (
          <Link key={page.path} href={page.path}>
            {page.label}
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
