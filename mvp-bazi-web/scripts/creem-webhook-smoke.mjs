import crypto from "node:crypto";
import fs from "node:fs";

const siteUrl = (process.env.MINGYI_SITE_URL || "https://www.fountersaying.com").replace(/\/$/, "");

function loadLocalEnv() {
  if (!fs.existsSync(".env.local")) {
    return;
  }
  const text = fs.readFileSync(".env.local", "utf8");
  for (const line of text.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#") || !trimmed.includes("=")) {
      continue;
    }
    const key = trimmed.slice(0, trimmed.indexOf("="));
    const value = trimmed.slice(trimmed.indexOf("=") + 1);
    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

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

async function createReading() {
  const result = await request("/api/readings", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-mingyi-session": `creem-webhook-smoke-${Date.now()}`
    },
    body: JSON.stringify({
      name: "Creem Webhook Smoke",
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
  assert(result.response.ok, `/api/readings returned ${result.response.status}: ${result.text}`);
  const data = JSON.parse(result.text);
  assert(data.reading?.id, "Reading response did not include an id.");
  assert(data.reading.fullReport === undefined, "Free preview leaked fullReport before payment.");
  return data.reading.id;
}

async function getReading(readingId, ensureFull = false) {
  const result = await request(`/api/readings/${readingId}${ensureFull ? "?ensure_full=1" : ""}`);
  assert(result.response.ok, `/api/readings/${readingId} returned ${result.response.status}: ${result.text}`);
  return JSON.parse(result.text);
}

function signedCreemEvent(readingId) {
  const event = {
    id: `evt_creem_smoke_${Date.now()}`,
    eventType: "checkout.completed",
    object: {
      id: `ch_creem_smoke_${Date.now()}`,
      object: "checkout",
      request_id: readingId,
      status: "completed",
      metadata: {
        reading_id: readingId,
        product_type: "full_bazi_report",
        product: "full_bazi_reading",
        language: "en"
      },
      order: {
        id: `ord_creem_smoke_${Date.now()}`,
        amount: 299,
        currency: "USD",
        status: "paid"
      },
      customer: {
        id: `cust_creem_smoke_${Date.now()}`,
        email: "creem-webhook-smoke@fountersaying.com"
      }
    }
  };
  const body = JSON.stringify(event);
  const signature = crypto.createHmac("sha256", process.env.CREEM_WEBHOOK_SECRET).update(body).digest("hex");
  return { body, signature };
}

async function main() {
  loadLocalEnv();
  console.log("MINGYI Creem signed webhook smoke");
  console.log(`Site: ${siteUrl}`);
  assert(process.env.CREEM_WEBHOOK_SECRET, "CREEM_WEBHOOK_SECRET is required in the local environment.");

  const healthResult = await request("/api/health");
  assert(healthResult.response.ok, `/api/health returned ${healthResult.response.status}: ${healthResult.text}`);
  const health = JSON.parse(healthResult.text);
  assert(health.paymentProvider === "creem", `Expected paymentProvider=creem, got ${health.paymentProvider || "missing"}.`);
  assert(health.creemWebhookConfigured, "Production does not report CREEM_WEBHOOK_SECRET configured.");
  console.log("OK /api/health creem webhook configured");

  const readingId = await createReading();
  const before = await getReading(readingId);
  assert(before.reading.paymentStatus !== "paid", "New reading was unexpectedly paid before webhook.");
  assert(before.reading.fullReport === undefined, "Unpaid reading leaked fullReport before webhook.");
  console.log(`OK created unpaid reading ${readingId}`);

  const { body, signature } = signedCreemEvent(readingId);
  const webhookResult = await request("/api/creem/webhook", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "creem-signature": signature
    },
    body
  });
  assert(webhookResult.response.ok, `/api/creem/webhook returned ${webhookResult.response.status}: ${webhookResult.text}`);
  const webhook = JSON.parse(webhookResult.text);
  assert(webhook.handled === true && webhook.readingId === readingId, `Webhook did not unlock expected reading: ${webhookResult.text}`);
  console.log("OK signed checkout.completed webhook handled");

  let paid;
  for (let attempt = 0; attempt < 12; attempt += 1) {
    paid = await getReading(readingId, true);
    if (paid.reading.paymentStatus === "paid" && paid.reading.fullReport?.sections?.length === 8) {
      break;
    }
    await new Promise((resolve) => setTimeout(resolve, 5000));
  }
  assert(paid.reading.paymentStatus === "paid", "Reading was not marked paid after signed Creem webhook.");
  assert(paid.reading.fullReport?.sections?.length === 8, "Paid reading did not include the 8-section full report.");
  console.log("OK paid reading unlocked with 8-section full report");

  console.log("Creem signed webhook smoke passed.");
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
});
