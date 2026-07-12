export type Language = "en" | "zh";

export function langFromSearchParams(searchParams?: { lang?: string | string[] }): Language {
  const raw = Array.isArray(searchParams?.lang) ? searchParams?.lang[0] : searchParams?.lang;
  return raw === "zh" ? "zh" : "en";
}

export function localizeHref(href: string, language: Language) {
  if (language !== "zh" || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("#")) {
    return href;
  }
  const [path, hash = ""] = href.split("#");
  const separator = path.includes("?") ? "&" : "?";
  return `${path}${separator}lang=zh${hash ? `#${hash}` : ""}`;
}

export function homeHref(language: Language) {
  return language === "zh" ? "/zh" : "/";
}
