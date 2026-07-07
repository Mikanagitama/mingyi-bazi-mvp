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
  },
  get openAiModel() {
    return cleanEnv(process.env.OPENAI_MODEL) || "gpt-5.2-mini";
  },
  get deepSeekKey() {
    return cleanEnv(process.env.DEEPSEEK_API_KEY);
  },
  get deepSeekModel() {
    return cleanEnv(process.env.DEEPSEEK_MODEL) || "deepseek-v4-flash";
  },
  get deepSeekBaseUrl() {
    return cleanEnv(process.env.DEEPSEEK_BASE_URL) || "https://api.deepseek.com";
  },
  get aiProvider() {
    return cleanEnv(process.env.AI_PROVIDER);
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
