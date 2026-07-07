import { config } from "../config";

export type DeploymentReadiness = {
  ok: boolean;
  environment: string;
  databaseConfigured: boolean;
  stripeCheckoutConfigured: boolean;
  stripeWebhookConfigured: boolean;
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
  const stripeCheckoutConfigured = Boolean(config.stripeSecretKey && config.stripePriceId);
  const stripeWebhookConfigured = Boolean(config.stripeWebhookSecret);
  const siteUrlConfigured = Boolean(process.env.NEXT_PUBLIC_SITE_URL);
  const aiProvider = config.aiProvider.toLowerCase() || "deepseek";
  const aiConfigured = aiProvider === "deepseek"
    ? Boolean(config.deepSeekKey || config.openAiKey)
    : Boolean(config.openAiKey || config.deepSeekKey);
  const blockers: string[] = [];

  if (!databaseConfigured) blockers.push("DATABASE_URL is required for persistent readings.");
  if (!stripeCheckoutConfigured) blockers.push("STRIPE_SECRET_KEY and STRIPE_PRICE_ID are required for Stripe checkout.");
  if (!stripeWebhookConfigured) blockers.push("STRIPE_WEBHOOK_SECRET is required to unlock paid reports safely.");
  if (!siteUrlConfigured) blockers.push("NEXT_PUBLIC_SITE_URL should be set to the public Vercel URL.");
  if (!aiConfigured) blockers.push("OPENAI_API_KEY or DEEPSEEK_API_KEY is required for AI-written full reports; template fallback is active until configured.");

  return {
    ok: blockers.length === 0,
    environment: process.env.VERCEL ? "vercel" : process.env.NODE_ENV || "development",
    databaseConfigured,
    stripeCheckoutConfigured,
    stripeWebhookConfigured,
    siteUrlConfigured,
    aiConfigured,
    aiProvider: aiConfigured ? aiProvider : null,
    blockers
  };
}

export function assertPersistentStorageAvailable() {
  if (isProductionRuntime() && !config.databaseUrl) {
    throw new Error("DATABASE_URL is required in production. Local file storage is only for development.");
  }
}
