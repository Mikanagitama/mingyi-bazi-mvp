import Link from "next/link";

export function LanguageSwitch({ language }: { language: "en" | "zh" }) {
  const href = language === "en" ? "/zh" : "/";
  const label = language === "en" ? "中文" : "English";
  return (
    <Link className="languageSwitch" href={href} aria-label={`Switch language to ${label}`}>
      {label}
    </Link>
  );
}
