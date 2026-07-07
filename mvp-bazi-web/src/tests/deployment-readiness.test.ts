import { afterEach, describe, expect, it } from "vitest";
import { assertPersistentStorageAvailable, getDeploymentReadiness } from "@/lib/deploy/readiness";

describe("deployment readiness", () => {
  const keys = [
    "DATABASE_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_PRICE_ID",
    "STRIPE_WEBHOOK_SECRET",
    "OPENAI_API_KEY",
    "DEEPSEEK_API_KEY",
    "AI_PROVIDER",
    "NEXT_PUBLIC_SITE_URL",
    "VERCEL"
  ];
  const originalEnv = Object.fromEntries(keys.map((key) => [key, process.env[key]]));

  afterEach(() => {
    for (const key of keys) {
      if (originalEnv[key]) {
        process.env[key] = originalEnv[key];
      } else {
        delete process.env[key];
      }
    }
  });

  it("reports blockers when required production services are missing", () => {
    delete process.env.DATABASE_URL;
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.STRIPE_PRICE_ID;
    delete process.env.STRIPE_WEBHOOK_SECRET;
    delete process.env.OPENAI_API_KEY;
    delete process.env.DEEPSEEK_API_KEY;
    delete process.env.AI_PROVIDER;
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const readiness = getDeploymentReadiness();

    expect(readiness.ok).toBe(false);
    expect(readiness.blockers).toContain("DATABASE_URL is required for persistent readings.");
    expect(readiness.blockers).toContain("STRIPE_SECRET_KEY and STRIPE_PRICE_ID are required for Stripe checkout.");
    expect(readiness.blockers).toContain("OPENAI_API_KEY or DEEPSEEK_API_KEY is required for AI-written full reports; template fallback is active until configured.");
  });

  it("reports ready when payment, storage, site URL, and AI are configured", () => {
    process.env.DATABASE_URL = "postgres://example";
    process.env.STRIPE_SECRET_KEY = "sk_test_example";
    process.env.STRIPE_PRICE_ID = "price_example";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_example";
    process.env.OPENAI_API_KEY = "sk_test_ai";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.vercel.app";

    const readiness = getDeploymentReadiness();

    expect(readiness.ok).toBe(true);
    expect(readiness.aiConfigured).toBe(true);
    expect(readiness.blockers).toEqual([]);
  });

  it("accepts DeepSeek provider with a key stored as OPENAI_API_KEY", () => {
    process.env.DATABASE_URL = "postgres://example";
    process.env.STRIPE_SECRET_KEY = "sk_test_example";
    process.env.STRIPE_PRICE_ID = "price_example";
    process.env.STRIPE_WEBHOOK_SECRET = "whsec_example";
    process.env.OPENAI_API_KEY = "sk_deepseek_example";
    process.env.AI_PROVIDER = "deepseek";
    process.env.NEXT_PUBLIC_SITE_URL = "https://example.vercel.app";

    const readiness = getDeploymentReadiness();

    expect(readiness.ok).toBe(true);
    expect(readiness.aiConfigured).toBe(true);
  });

  it("blocks local file storage in Vercel runtime without a database", () => {
    process.env.VERCEL = "1";
    delete process.env.DATABASE_URL;

    expect(() => assertPersistentStorageAvailable()).toThrow("DATABASE_URL is required in production");
  });
});
