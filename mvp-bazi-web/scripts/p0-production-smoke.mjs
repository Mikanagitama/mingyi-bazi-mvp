const siteUrl = (process.env.MINGYI_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL || "https://www.fountersaying.com").replace(/\/$/, "");

function log(message) {
  console.log(message);
}

async function request(path, init) {
  const response = await fetch(`${siteUrl}${path}`, init);
  const text = await response.text();
  return { response, text };
}

function assert(condition, message) {
  if (!condition) {
    throw new Error(message);
  }
}

async function assertPage(path, expectedText) {
  const { response, text } = await request(path);
  assert(response.ok, `${path} returned ${response.status}`);
  assert(text.includes(expectedText), `${path} did not include expected text: ${expectedText}`);
  log(`OK ${path}`);
}

async function main() {
  log(`MINGYI P0 production smoke`);
  log(`Site: ${siteUrl}`);

  const healthResult = await request("/api/health");
  assert(healthResult.response.ok, `/api/health returned ${healthResult.response.status}: ${healthResult.text}`);
  const health = JSON.parse(healthResult.text);
  assert(health.databaseConfigured, "DATABASE_URL is not configured in production.");
  if (health.paymentProvider === "creem") {
    assert(health.creemCheckoutConfigured, "Creem checkout is not configured in production.");
  } else {
    assert(health.stripeCheckoutConfigured, "Stripe Checkout is not configured in production.");
    assert(health.stripeWebhookConfigured, "Stripe webhook is not configured in production.");
  }
  assert(health.siteUrlConfigured, "NEXT_PUBLIC_SITE_URL is not configured in production.");
  assert(health.aiConfigured, `OPENAI_API_KEY is not configured in production. Blockers: ${(health.blockers || []).join(" | ")}`);
  assert(health.ok, `Production health is not OK. Blockers: ${(health.blockers || []).join(" | ")}`);
  log("OK /api/health");

  await assertPage("/privacy", "Privacy Policy");
  await assertPage("/terms", "Terms of Service");
  await assertPage("/refund", "Refund Policy");
  await assertPage("/disclaimer", "Disclaimer");
  await assertPage("/methodology", "Methodology");

  const createResult = await request("/api/readings", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({
      name: "P0 Smoke",
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
  assert(reading.chart?.day_master?.stem, "Structured chart did not include day_master.");
  assert(reading.chart?.nayin?.year, "Structured chart did not include nayin.year.");
  assert(Array.isArray(reading.chart?.annual_transits), "Structured chart did not include annual_transits.");
  log(`OK /api/readings created ${reading.id}`);

  const checkoutResult = await request("/api/checkout", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ readingId: reading.id })
  });
  assert(checkoutResult.response.ok, `/api/checkout returned ${checkoutResult.response.status}: ${checkoutResult.text}`);
  const checkout = JSON.parse(checkoutResult.text);
  assert(typeof checkout.url === "string", "Checkout response did not include a checkout URL.");
  if (health.paymentProvider === "creem") {
    assert(checkout.provider === "creem", "Checkout response did not use Creem provider.");
    assert(checkout.url.includes("creem"), "Checkout response did not include a Creem checkout URL.");
  } else {
    assert(checkout.url.includes("checkout.stripe.com"), "Checkout response did not include a Stripe Checkout URL.");
  }
  log(`OK /api/checkout ${checkout.provider || health.paymentProvider || "stripe"}`);

  log("P0 production smoke passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
