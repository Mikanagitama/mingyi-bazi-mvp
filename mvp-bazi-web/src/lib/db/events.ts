import crypto from "node:crypto";
import type postgres from "postgres";
import { hasDatabaseUrl, readLocalStore, sql, writeLocalStore } from "./client";

export type EventName =
  | "reading_created"
  | "preview_generated"
  | "checkout_started"
  | "checkout_completed"
  | "webhook_received"
  | "payment_marked_paid"
  | "full_generation_started"
  | "full_generation_completed"
  | "full_generation_failed"
  | "full_report_viewed";

type EventMetadata = {
  readonly [key: string]: postgres.JSONValue | undefined;
};

type LogEventInput = {
  name: EventName;
  readingId?: string;
  stripeEventId?: string;
  stripeSessionId?: string;
  metadata?: EventMetadata;
};

function now() {
  return new Date().toISOString();
}

export async function logEvent(input: LogEventInput) {
  try {
    if (hasDatabaseUrl()) {
      const db = sql();
      const metadata = (input.metadata || {}) as postgres.JSONValue;
      await db`
        insert into app_events (event_name, reading_id, stripe_event_id, stripe_session_id, metadata_json, created_at)
        values (
          ${input.name},
          ${input.readingId || null},
          ${input.stripeEventId || null},
          ${input.stripeSessionId || null},
          ${db.json(metadata)},
          ${now()}
        )
      `;
      return;
    }

    const store = readLocalStore();
    store.events.push({
      id: crypto.randomUUID(),
      name: input.name,
      readingId: input.readingId,
      stripeEventId: input.stripeEventId,
      stripeSessionId: input.stripeSessionId,
      metadata: input.metadata,
      createdAt: now()
    });
    writeLocalStore(store);
  } catch (error) {
    console.warn("Mingyi event logging skipped:", error instanceof Error ? error.message : "unknown error");
  }
}
