import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { config } from "../config";
import type { ReadingRecord } from "../bazi/types";
import { assertPersistentStorageAvailable } from "../deploy/readiness";

export type AppEventRecord = {
  id: string;
  name: string;
  readingId?: string;
  stripeEventId?: string;
  stripeSessionId?: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
};

export type RateLimitRecord = {
  key: string;
  count: number;
  resetAt: string;
};

type LocalStore = {
  readings: ReadingRecord[];
  payments: Array<{
    id: string;
    readingId: string;
    provider?: string;
    providerCheckoutId?: string;
    providerEventId?: string;
    providerCustomerId?: string;
    stripeSessionId?: string;
    stripeEventId?: string;
    stripePaymentIntent?: string;
    amount: number;
    currency: string;
    status: string;
    rawEvent?: Record<string, unknown>;
    createdAt: string;
    updatedAt?: string;
  }>;
  events: AppEventRecord[];
  rateLimits: RateLimitRecord[];
};

let sqlClient: ReturnType<typeof postgres> | null = null;

export function hasDatabaseUrl() {
  return Boolean(config.databaseUrl);
}

export function sql() {
  if (!config.databaseUrl) {
    throw new Error("DATABASE_URL is not configured.");
  }
  if (!sqlClient) {
    sqlClient = postgres(config.databaseUrl, { ssl: "require" });
  }
  return sqlClient;
}

function localFilePath() {
  const requestedName = process.env.MINGYI_LOCAL_STORE_NAME || "readings.json";
  const safeName = requestedName.replace(/[^a-zA-Z0-9._-]/g, "-");
  return path.join(process.cwd(), ".local-data", safeName);
}

function emptyStore(): LocalStore {
  return { readings: [], payments: [], events: [], rateLimits: [] };
}

export function readLocalStore(): LocalStore {
  assertPersistentStorageAvailable();
  const localFile = localFilePath();
  if (!fs.existsSync(localFile)) {
    return emptyStore();
  }
  const content = fs.readFileSync(localFile, "utf8");
  if (!content.trim()) {
    return emptyStore();
  }
  const parsed = JSON.parse(content) as Partial<LocalStore>;
  return {
    readings: parsed.readings || [],
    payments: parsed.payments || [],
    events: parsed.events || [],
    rateLimits: parsed.rateLimits || []
  };
}

export function writeLocalStore(store: LocalStore) {
  assertPersistentStorageAvailable();
  const localFile = localFilePath();
  fs.mkdirSync(path.dirname(localFile), { recursive: true });
  const tempFile = `${localFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), "utf8");
  for (let attempt = 0; attempt < 3; attempt += 1) {
    try {
      fs.renameSync(tempFile, localFile);
      return;
    } catch (error) {
      if (attempt === 2 || !(error instanceof Error) || !("code" in error) || error.code !== "EPERM") {
        throw error;
      }
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 25);
    }
  }
}

export function resetLocalStoreForTests() {
  const localFile = localFilePath();
  if (fs.existsSync(localFile)) {
    fs.unlinkSync(localFile);
  }
}
