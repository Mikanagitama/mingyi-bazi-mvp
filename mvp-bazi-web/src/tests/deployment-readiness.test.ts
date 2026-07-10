import { afterEach, describe, expect, it } from "vitest";
import { config } from "@/lib/config";
import { assertPersistentStorageAvailable, getDeploymentReadiness } from "@/lib/deploy/readiness";

describe("deployment readiness", () => {
  const keys = [
    "DATABASE_URL",
    "PAYMENT_PROVIDER",
    "CREEM_API_KEY",
    "CREEM_PRODUCT_ID",
    "CREEM_API_BASE_URL",
    "CREEM_WEBHOOK_SECRET",
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
    delete process.env.PAYMENT_PROVIDER;
    delete process.env.CREEM_API_KEY;
    delete process.env.CREEM_PRODUCT_ID;
    delete process.env.CREEM_WEBHOOK_SECRET;
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
    process.env.PAYMENT_PROVIDER = "creem";
    process.env.CREEM_API_KEY = "creem_test_example";
    process.env.CREEM_PRODUCT_ID = "prod_example";
    process.env.CREEM_WEBHOOK_SECRET = "whsec_creem";
    process.env.OPENAI_API_KEY = "sk_test_ai";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.fountersaying.com";

    const readiness = getDeploymentReadiness();

    expect(readiness.ok).toBe(true);
    expect(readiness.aiConfigured).toBe(true);
    expect(readiness.aiProvider).toBe("deepseek");
    expect(readiness.paymentProvider).toBe("creem");
    expect(readiness.creemCheckoutConfigured).toBe(true);
    expect(readiness.creemApiEnvironment).toBe("test");
    expect(readiness.blockers).toEqual([]);
  });

  it("accepts DeepSeek provider with a key stored as OPENAI_API_KEY", () => {
    process.env.DATABASE_URL = "postgres://example";
    process.env.PAYMENT_PROVIDER = "stripe";
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

  it("allows Creem webhook secret to be empty in non-production test setup", () => {
    process.env.DATABASE_URL = "postgres://example";
    process.env.PAYMENT_PROVIDER = "creem";
    process.env.CREEM_API_KEY = "creem_test_example";
    process.env.CREEM_PRODUCT_ID = "prod_example";
    delete process.env.CREEM_WEBHOOK_SECRET;
    process.env.OPENAI_API_KEY = "sk_test_ai";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.fountersaying.com";

    const readiness = getDeploymentReadiness();

    expect(readiness.ok).toBe(true);
    expect(readiness.creemWebhookConfigured).toBe(false);
  });

  it("defaults Creem API base URL to test locally and production on Vercel", () => {
    delete process.env.CREEM_API_BASE_URL;
    delete process.env.VERCEL;
    expect(config.creemBaseUrl).toBe("https://test-api.creem.io");

    process.env.VERCEL = "1";
    expect(config.creemBaseUrl).toBe("https://api.creem.io");

    process.env.CREEM_API_BASE_URL = "https://custom-creem.example";
    expect(config.creemBaseUrl).toBe("https://custom-creem.example");
  });

  it("reports the configured Creem API environment without exposing secrets", () => {
    process.env.DATABASE_URL = "postgres://example";
    process.env.PAYMENT_PROVIDER = "creem";
    process.env.CREEM_API_KEY = "creem_example";
    process.env.CREEM_PRODUCT_ID = "prod_example";
    process.env.CREEM_WEBHOOK_SECRET = "whsec_creem";
    process.env.OPENAI_API_KEY = "sk_test_ai";
    process.env.NEXT_PUBLIC_SITE_URL = "https://www.fountersaying.com";

    process.env.CREEM_API_BASE_URL = "https://api.creem.io";
    expect(getDeploymentReadiness().creemApiEnvironment).toBe("live");

    process.env.CREEM_API_BASE_URL = "https://test-api.creem.io";
    expect(getDeploymentReadiness().creemApiEnvironment).toBe("test");

    process.env.CREEM_API_BASE_URL = "https://payments.example";
    expect(getDeploymentReadiness().creemApiEnvironment).toBe("custom");
  });

  it("blocks local file storage in Vercel runtime without a database", () => {
    process.env.VERCEL = "1";
    delete process.env.DATABASE_URL;

    expect(() => assertPersistentStorageAvailable()).toThrow("DATABASE_URL is required in production");
  });
});
