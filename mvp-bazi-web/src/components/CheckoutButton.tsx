"use client";

import { useState } from "react";

export function CheckoutButton({ readingId, label, secureText }: { readingId: string; label: string; secureText: string }) {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function startCheckout() {
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
      setError(data.error || "Checkout is unavailable.");
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
