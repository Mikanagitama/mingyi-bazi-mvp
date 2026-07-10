export const config = {
  get siteUrl() {
    return canonicalUrl(cleanEnv(process.env.NEXT_PUBLIC_SITE_URL));
  },
  get paymentProvider() {
    return cleanEnv(process.env.PAYMENT_PROVIDER) || "stripe";
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
  get creemApiKey() {
    return cleanEnv(process.env.CREEM_API_KEY);
  },
  get creemProductId() {
    return cleanEnv(process.env.CREEM_PRODUCT_ID);
  },
  get creemWebhookSecret() {
    return cleanEnv(process.env.CREEM_WEBHOOK_SECRET);
  },
  get creemBaseUrl() {
    const configured = cleanEnv(process.env.CREEM_API_BASE_URL);
    if (configured) {
      return configured;
    }
    return isProductionRuntime() ? "https://api.creem.io" : "https://test-api.creem.io";
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

function isProductionRuntime() {
  return process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
}

function normalizeUrl(value: string) {
  return (value.startsWith("http://") || value.startsWith("https://") ? value : `https://${value}`).replace(/\/$/, "");
}

function canonicalUrl(value: string) {
  const normalized = value ? normalizeUrl(value) : "";
  return !normalized || normalized.includes("mingyi-bazi-mvp.vercel.app")
    ? "https://www.fountersaying.com"
    : normalized;
}

export function requiredServerConfig(name: keyof typeof config) {
  const value = config[name];
  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }
  return value;
}
