"use client";

import type { EventName } from "./db/events";

type ClientEventMetadata = Record<string, string | number | boolean | undefined>;

export function trackEvent(name: EventName, metadata: ClientEventMetadata = {}, readingId?: string) {
  if (typeof window === "undefined") {
    return;
  }

  const payload = {
    name,
    readingId,
    path: window.location.pathname,
    metadata
  };

  const body = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon("/api/events", new Blob([body], { type: "application/json" }));
    return;
  }

  void fetch("/api/events", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body,
    keepalive: true
  }).catch(() => undefined);
}
