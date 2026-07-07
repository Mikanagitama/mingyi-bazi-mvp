import { hasDatabaseUrl, readLocalStore, sql, writeLocalStore } from "./client";

export class RateLimitError extends Error {
  constructor(
    message: string,
    public resetAt: string
  ) {
    super(message);
  }
}

const memoryCounters = new Map<string, { count: number; resetAt: number }>();

function nowMs() {
  return Date.now();
}

function fallbackMemoryLimit(key: string, limit: number, windowSeconds: number) {
  const current = nowMs();
  const existing = memoryCounters.get(key);
  const resetAt = existing && existing.resetAt > current ? existing.resetAt : current + windowSeconds * 1000;
  const count = existing && existing.resetAt > current ? existing.count + 1 : 1;
  memoryCounters.set(key, { count, resetAt });
  return { allowed: count <= limit, resetAt: new Date(resetAt).toISOString(), count };
}

export async function checkRateLimit(key: string, limit: number, windowSeconds: number) {
  if (!Number.isFinite(limit) || limit <= 0) {
    return { allowed: true, resetAt: new Date(nowMs()).toISOString(), count: 0 };
  }

  if (hasDatabaseUrl()) {
    try {
      const db = sql();
      const windowInterval = `${Math.max(1, Math.trunc(windowSeconds))} seconds`;
      const [row] = await db`
        insert into app_rate_limits (rate_key, count, reset_at, updated_at)
        values (${key}, 1, now() + ${windowInterval}::interval, now())
        on conflict (rate_key) do update
        set count = case
              when app_rate_limits.reset_at <= now() then 1
              else app_rate_limits.count + 1
            end,
            reset_at = case
              when app_rate_limits.reset_at <= now() then now() + ${windowInterval}::interval
              else app_rate_limits.reset_at
            end,
            updated_at = now()
        returning count, reset_at
      `;
      const count = Number(row.count);
      return { allowed: count <= limit, resetAt: new Date(String(row.reset_at)).toISOString(), count };
    } catch {
      return fallbackMemoryLimit(key, limit, windowSeconds);
    }
  }

  const store = readLocalStore();
  const current = nowMs();
  const existing = store.rateLimits.find((item) => item.key === key);
  const existingReset = existing ? new Date(existing.resetAt).getTime() : 0;
  const resetAt = existing && existingReset > current ? existing.resetAt : new Date(current + windowSeconds * 1000).toISOString();
  const count = existing && existingReset > current ? existing.count + 1 : 1;

  if (existing) {
    existing.count = count;
    existing.resetAt = resetAt;
  } else {
    store.rateLimits.push({ key, count, resetAt });
  }
  writeLocalStore(store);
  return { allowed: count <= limit, resetAt, count };
}

export async function assertRateLimit(key: string, limit: number, windowSeconds: number, message: string) {
  const result = await checkRateLimit(key, limit, windowSeconds);
  if (!result.allowed) {
    throw new RateLimitError(message, result.resetAt);
  }
  return result;
}
