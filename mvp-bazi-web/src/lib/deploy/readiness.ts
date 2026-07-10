import { config } from "../config";

export type DeploymentReadiness = {
  ok: boolean;
  environment: string;
  databaseConfigured: boolean;
  paymentProvider: string;
  stripeCheckoutConfigured: boolean;
  stripeWebhookConfigured: boolean;
  creemCheckoutConfigured: boolean;
  creemWebhookConfigured: boolean;
  creemApiEnvironment: "live" | "test" | "custom" | null;
  siteUrlConfigured: boolean;
  aiConfigured: boolean;
  aiProvider: string | null;
  blockers: string[];
};

export function isProductionRuntime() {
  return process.env.VERCEL === "1" || process.env.NODE_ENV === "production";
}

export function getDeploymentReadiness(): DeploymentReadiness {
  const databaseConfigured = Boolean(config.databaseUrl);
  const paymentProvider = config.paymentProvider.toLowerCase() || "stripe";
  const stripeCheckoutConfigured = Boolean(config.stripeSecretKey && config.stripePriceId);
  const stripeWebhookConfigured = Boolean(config.stripeWebhookSecret);
  const creemCheckoutConfigured = Boolean(config.creemApiKey && config.creemProductId);
  const creemWebhookConfigured = Boolean(config.creemWebhookSecret);
  const creemApiEnvironment = paymentProvider === "creem" ? getCreemApiEnvironment() : null;
  const siteUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
  const aiProvider = config.aiProvider.toLowerCase() || "deepseek";
  const aiConfigured = aiProvider === "deepseek"
    ? Boolean(config.deepSeekKey || config.openAiKey)
    : Boolean(config.openAiKey || config.deepSeekKey);
  const blockers: string[] = [];

  if (!databaseConfigured) blockers.push("DATABASE_URL is required for persistent readings.");
  if (paymentProvider === "creem") {
    if (!creemCheckoutConfigured) blockers.push("CREEM_API_KEY and CREEM_PRODUCT_ID are required for Creem checkout.");
    if (isProductionRuntime() && !creemWebhookConfigured) blockers.push("CREEM_WEBHOOK_SECRET is required for signed Creem webhooks before commercial launch.");
  } else {
    if (!stripeCheckoutConfigured) blockers.push("STRIPE_SECRET_KEY and STRIPE_PRICE_ID are required for Stripe checkout.");
    if (!stripeWebhookConfigured) blockers.push("STRIPE_WEBHOOK_SECRET is required to unlock paid reports safely.");
  }
  if (!siteUrlConfigured) blockers.push("NEXT_PUBLIC_SITE_URL should be set to https://www.fountersaying.com.");
  if (!aiConfigured) blockers.push("OPENAI_API_KEY or DEEPSEEK_API_KEY is required for AI-written full reports; template fallback is active until configured.");

  return {
    ok: blockers.length === 0,
    environment: process.env.VERCEL ? "vercel" : process.env.NODE_ENV || "development",
    databaseConfigured,
    paymentProvider,
    stripeCheckoutConfigured,
    stripeWebhookConfigured,
    creemCheckoutConfigured,
    creemWebhookConfigured,
    creemApiEnvironment,
    siteUrlConfigured,
    aiConfigured,
    aiProvider: aiConfigured ? aiProvider : null,
    blockers
  };
}

function getCreemApiEnvironment(): "live" | "test" | "custom" {
  try {
    const hostname = new URL(config.creemBaseUrl).hostname;
    if (hostname === "api.creem.io") {
      return "live";
    }
    if (hostname === "test-api.creem.io") {
      return "test";
    }
  } catch {
    return "custom";
  }
  return "custom";
}

export function assertPersistentStorageAvailable() {
  if (isProductionRuntime() && !config.databaseUrl) {
    throw new Error("DATABASE_URL is required in production. Local file storage is only for development.");
  }
}
