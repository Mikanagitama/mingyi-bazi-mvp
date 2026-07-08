"use client";

import { useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import { trackEvent } from "@/lib/client-events";

const trustPages = new Set(["/privacy", "/terms", "/refund", "/disclaimer", "/methodology", "/contact"]);

export function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const query = searchParams.toString();
    trackEvent("page_view", { path: query ? `${pathname}?${query}` : pathname });
    if (pathname === "/sample-report") {
      trackEvent("sample_report_viewed");
    }
    if (trustPages.has(pathname)) {
      trackEvent("trust_page_viewed", { page: pathname });
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    function onClick(event: MouseEvent) {
      const target = event.target instanceof Element ? event.target.closest<HTMLElement>("[data-track-event]") : null;
      const name = target?.dataset.trackEvent;
      if (target && name === "homepage_cta_clicked") {
        trackEvent("homepage_cta_clicked", { href: target.getAttribute("href") || "" });
      }
    }

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
