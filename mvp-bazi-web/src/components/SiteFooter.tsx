import Link from "next/link";
import { en } from "@/lib/i18n/en";

export function SiteFooter() {
  return (
    <footer className="footer">
      <span>MINGYI Bazi Destiny</span>
      {en.footer.links.map(([label, href]) => (
        <Link key={href} href={href}>
          {label}
        </Link>
      ))}
    </footer>
  );
}
