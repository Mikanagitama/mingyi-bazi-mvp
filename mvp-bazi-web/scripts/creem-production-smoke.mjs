const siteUrl = (process.env.MINGYI_SITE_URL || "https://www.fountersaying.com").replace(/\/$/, "");

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function request(path, init) {
  const response = await fetch(`${siteUrl}${path}`, init);
  const text = await response.text();
  return { response, text };
}

async function main() {
  console.log("MINGYI Creem production smoke");
  console.log(`Site: ${siteUrl}`);

  const healthResult = await request("/api/health");
  assert(healthResult.response.ok, `/api/health returned ${healthResult.response.status}: ${healthResult.text}`);
  const health = JSON.parse(healthResult.text);
  assert(health.ok, `Production health is not OK. Blockers: ${(health.blockers || []).join(" | ")}`);
  assert(health.paymentProvider === "creem", `Expected paymentProvider=creem, got ${health.paymentProvider || "missing"}.`);
  assert(health.creemCheckoutConfigured, "Creem checkout is not configured in production.");
  assert(health.creemWebhookConfigured, "CREEM_WEBHOOK_SECRET is not configured in production.");
  console.log("OK /api/health creem");

  const createResult = await request("/api/readings", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-mingyi-session": `creem-smoke-${Date.now()}`
    },
    body: JSON.stringify({
      name: "Creem Smoke",
      gender: "female",
      birthDate: "1992-08-14",
      birthTime: "09:30",
      birthTimeUnknown: false,
      birthPlace: "Tokyo",
      timezone: "Asia/Tokyo",
      trueSolarTime: true,
      userQuestion: "What should I focus on this month?",
      language: "en"
    })
  });
  assert(createResult.response.ok, `/api/readings returned ${createResult.response.status}: ${createResult.text}`);
  const created = JSON.parse(createResult.text);
  const reading = created.reading;
  assert(reading?.id, "Reading response did not include an id.");
  assert(reading.fullReport === undefined, "Free preview leaked fullReport before payment.");
  assert(reading.chart?.calculation_policy?.true_solar_time_applied === true, "True solar time was not applied for Tokyo smoke input.");
  console.log(`OK /api/readings created ${reading.id}`);

  const checkoutResult = await request("/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ readingId: reading.id })
  });
  assert(checkoutResult.response.ok, `/api/checkout returned ${checkoutResult.response.status}: ${checkoutResult.text}`);
  const checkout = JSON.parse(checkoutResult.text);
  assert(checkout.provider === "creem", `Expected checkout provider creem, got ${checkout.provider || "missing"}.`);
  assert(typeof checkout.url === "string" && checkout.url.includes("creem"), "Checkout response did not include a Creem checkout URL.");
  console.log("OK /api/checkout creem");

  const directCheckoutResult = await request("/api/creem/create-checkout-session", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ readingId: reading.id })
  });
  assert(directCheckoutResult.response.ok, `/api/creem/create-checkout-session returned ${directCheckoutResult.response.status}: ${directCheckoutResult.text}`);
  const directCheckout = JSON.parse(directCheckoutResult.text);
  assert(directCheckout.provider === "creem", "Creem-specific checkout endpoint did not return provider=creem.");
  assert(typeof directCheckout.url === "string" && directCheckout.url.includes("creem"), "Creem-specific checkout endpoint did not return a Creem URL.");
  console.log("OK /api/creem/create-checkout-session");

  console.log("Creem production smoke passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
