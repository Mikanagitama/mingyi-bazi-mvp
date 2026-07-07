import fs from "node:fs";
import path from "node:path";
import postgres from "postgres";
import { config } from "../config";
import type { ReadingRecord } from "../bazi/types";
import { assertPersistentStorageAvailable } from "../deploy/readiness";

type LocalStore = {
  readings: ReadingRecord[];
  payments: Array<{
    id: string;
    readingId: string;
    stripeSessionId?: string;
    stripeEventId?: string;
    stripePaymentIntent?: string;
    amount: number;
    currency: string;
    status: string;
    createdAt: string;
  }>;
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
  return { readings: [], payments: [] };
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
  return JSON.parse(content) as LocalStore;
}

export function writeLocalStore(store: LocalStore) {
  assertPersistentStorageAvailable();
  const localFile = localFilePath();
  fs.mkdirSync(path.dirname(localFile), { recursive: true });
  const tempFile = `${localFile}.${process.pid}.${Date.now()}.tmp`;
  fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), "utf8");
  fs.renameSync(tempFile, localFile);
}

export function resetLocalStoreForTests() {
  const localFile = localFilePath();
  if (fs.existsSync(localFile)) {
    fs.unlinkSync(localFile);
  }
}
