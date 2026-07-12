"use client";

import { useState } from "react";
import { trackEvent } from "@/lib/client-events";

export function CheckoutButton({
  readingId,
  label,
  secureText,
  errorFallback = "Checkout is unavailable."
}: {
  readingId: string;
  label: string;
  secureText: string;
  errorFallback?: string;
}) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
    trackEvent("unlock_clicked", {}, readingId);
    setLoading(true);
    setError("");
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ readingId })
    });
    const data = await response.json();
    setLoading(false);
    if (!response.ok) {
      setError(data.error || errorFallback);
      return;
    }
    window.location.href = data.url;
  }

  return (
    <div className="checkoutBox">
      <button className="primaryButton" type="button" onClick={startCheckout} disabled={loading}>
        {loading ? "..." : label}
      </button>
      <p className="finePrint">{secureText}</p>
      {error ? <p className="errorText">{error}</p> : null}
    </div>
  );
}
