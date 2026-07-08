import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const requiredFiles = [
  "package.json",
  "package-lock.json",
  "next.config.mjs",
  "vercel.json",
  "src/app/page.tsx",
  "src/app/zh/page.tsx",
  "src/app/reading/new/page.tsx",
  "src/app/api/readings/route.ts",
  "src/app/api/checkout/route.ts",
  "src/app/api/creem/create-checkout-session/route.ts",
  "src/app/api/creem/webhook/route.ts",
  "src/app/api/stripe/webhook/route.ts",
  "src/app/api/health/route.ts",
  "src/lib/db/schema.sql",
  "scripts/db-setup.mjs"
];

const requiredEnv = [
  "DATABASE_URL",
  "NEXT_PUBLIC_SITE_URL"
];

const requiredOneOfEnv = [["OPENAI_API_KEY", "DEEPSEEK_API_KEY"]];
const optionalEnv = ["OPENAI_MODEL", "DEEPSEEK_MODEL", "DEEPSEEK_BASE_URL", "AI_PROVIDER"];
const paymentProvider = (process.env.PAYMENT_PROVIDER || "stripe").toLowerCase() === "creem" ? "creem" : "stripe";

function exists(relativePath) {
  return fs.existsSync(path.join(root, relativePath));
}

function isSet(name) {
  return Boolean(process.env[name] && process.env[name].trim());
}

function printStatus(label, ok, detail = "", optional = false) {
  const icon = ok ? "OK" : optional ? "OPTIONAL" : "MISSING";
  console.log(`${icon} ${label}${detail ? ` - ${detail}` : ""}`);
}

let failed = false;

console.log("MINGYI Bazi MVP preflight");
console.log(`Root: ${root}`);
console.log("");

for (const file of requiredFiles) {
  const ok = exists(file);
  printStatus(file, ok);
  if (!ok) failed = true;
}

console.log("");
console.log("Environment variables");

for (const name of requiredEnv) {
  const ok = isSet(name);
  printStatus(name, ok);
  if (!ok) failed = true;
}

const requiredPaymentEnv = paymentProvider === "creem"
  ? ["CREEM_API_KEY", "CREEM_PRODUCT_ID"]
  : ["STRIPE_SECRET_KEY", "STRIPE_PRICE_ID", "STRIPE_WEBHOOK_SECRET"];

for (const name of requiredPaymentEnv) {
  const ok = isSet(name);
  printStatus(name, ok, `required for ${paymentProvider} checkout`);
  if (!ok) failed = true;
}

printStatus("PAYMENT_PROVIDER", true, paymentProvider);
printStatus("CREEM_WEBHOOK_SECRET", isSet("CREEM_WEBHOOK_SECRET"), "required before commercial Creem launch", true);

for (const group of requiredOneOfEnv) {
  const ok = group.some(isSet);
  printStatus(group.join(" or "), ok, "required for AI-written full reports");
  if (!ok) failed = true;
}

for (const name of optionalEnv) {
  printStatus(name, isSet(name), "optional; defaults to the app model setting", true);
}

console.log("");

if (failed) {
  console.error("Preflight failed. Configure the missing files or environment variables before production deployment.");
  process.exit(1);
}

console.log("Preflight passed. This project is ready for Vercel build and payment flow verification.");
