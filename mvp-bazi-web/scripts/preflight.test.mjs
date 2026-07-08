import { spawnSync } from "node:child_process";

const result = spawnSync(process.execPath, ["scripts/preflight.mjs"], {
  cwd: process.cwd(),
  env: {
    ...process.env,
    DATABASE_URL: "postgres://example",
    PAYMENT_PROVIDER: "creem",
    CREEM_API_KEY: "creem_test_example",
    CREEM_PRODUCT_ID: "prod_example",
    CREEM_WEBHOOK_SECRET: "whsec_creem",
    OPENAI_API_KEY: "sk_test_example_ai",
    NEXT_PUBLIC_SITE_URL: "https://www.fountersaying.com"
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
