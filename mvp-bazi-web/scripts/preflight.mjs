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
  "src/app/api/stripe/webhook/route.ts",
  "src/app/api/health/route.ts",
  "src/lib/db/schema.sql",
  "scripts/db-setup.mjs"
];

const requiredEnv = [
  "DATABASE_URL",
  "STRIPE_SECRET_KEY",
  "STRIPE_PRICE_ID",
  "STRIPE_WEBHOOK_SECRET",
  "OPENAI_API_KEY",
  "NEXT_PUBLIC_SITE_URL"
];

const optionalEnv = ["OPENAI_MODEL"];

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

for (const name of optionalEnv) {
  printStatus(name, isSet(name), "optional; defaults to the app model setting", true);
}

console.log("");

if (failed) {
  console.error("Preflight failed. Configure the missing files or environment variables before production deployment.");
  process.exit(1);
}

console.log("Preflight passed. This project is ready for Vercel build and payment flow verification.");
