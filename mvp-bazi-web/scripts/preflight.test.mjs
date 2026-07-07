import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["scripts/preflight.mjs"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    DATABASE_URL: "postgres://example",
    STRIPE_SECRET_KEY: "sk_test_example",
    STRIPE_PRICE_ID: "price_example",
    STRIPE_WEBHOOK_SECRET: "whsec_example",
    OPENAI_API_KEY: "sk_test_example_ai",
    NEXT_PUBLIC_SITE_URL: "https://example.vercel.app"
  },
  encoding: "utf8"
});

if (result.status !== 0) {
  console.error(result.stdout);
  console.error(result.stderr);
  process.exit(result.status ?? 1);
}

if (!result.stdout.includes("Preflight passed")) {
  console.error(result.stdout);
  throw new Error("Expected preflight success message.");
}

console.log("preflight smoke test passed");
