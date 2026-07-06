export const config = {
  get siteUrl() {
    return process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  },
  get stripePriceId() {
    return process.env.STRIPE_PRICE_ID || "";
  },
  get stripeSecretKey() {
    return process.env.STRIPE_SECRET_KEY || "";
  },
  get stripeWebhookSecret() {
    return process.env.STRIPE_WEBHOOK_SECRET || "";
  },
  get databaseUrl() {
    return process.env.DATABASE_URL || "";
  },
  get openAiKey() {
    return process.env.OPENAI_API_KEY || "";
  }
};

export function requiredServerConfig(name: keyof typeof config) {
  const value = config[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
