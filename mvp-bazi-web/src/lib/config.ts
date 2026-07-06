export const config = {
  get siteUrl() {
    return cleanEnv(process.env.NEXT_PUBLIC_SITE_URL) || "http://localhost:3000";
  },
  get stripePriceId() {
    return cleanEnv(process.env.STRIPE_PRICE_ID);
  },
  get stripeSecretKey() {
    return cleanEnv(process.env.STRIPE_SECRET_KEY);
  },
  get stripeWebhookSecret() {
    return cleanEnv(process.env.STRIPE_WEBHOOK_SECRET);
  },
  get databaseUrl() {
    return cleanEnv(process.env.DATABASE_URL);
  },
  get openAiKey() {
    return cleanEnv(process.env.OPENAI_API_KEY);
  }
};

function cleanEnv(value: string | undefined) {
  return (value || "").trim();
}

export function requiredServerConfig(name: keyof typeof config) {
  const value = config[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
