import { afterEach, describe, expect, it } from "vitest";
import { assertPersistentStorageAvailable, getDeploymentReadiness } from "@/lib/deploy/readiness";

describe("deployment readiness", () => {
  const keys = [
    "DATABASE_URL",
    "STRIPE_SECRET_KEY",
    "STRIPE_PRICE_ID",
    "STRIPE_WEBHOOK_SECRET",
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
    delete process.env.NEXT_PUBLIC_SITE_URL;

    const readiness = getDeploymentReadiness();

    expect(readiness.ok).toBe(false);
    expect(readiness.blockers).toContain("DATABASE_URL is required for persistent readings.");
    expect(readiness.blockers).toContain("STRIPE_SECRET_KEY and STRIPE_PRICE_ID are required for $2.99 checkout.");
  });

  it("blocks local file storage in Vercel runtime without a database", () => {
    process.env.VERCEL = "1";
    delete process.env.DATABASE_URL;

    expect(() => assertPersistentStorageAvailable()).toThrow("DATABASE_URL is required in production");
  });
});
