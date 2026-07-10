import crypto from "node:crypto";
import type { BirthInput, FullReport, PublicReading, ReadingRecord, ReadingStatus } from "../bazi/types";
import { generateBaziChart } from "../bazi/chart";
import { generateFreeReport } from "../reports/free-report";
import { generateFullReportWithAi } from "../reports/ai-report";
import { hasDatabaseUrl, readLocalStore, sql, writeLocalStore } from "./client";
import { logEvent } from "./events";
import { assertRateLimit } from "./rate-limit";

function now() {
  return new Date().toISOString();
}

function intEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function toJsonRecord(value?: Record<string, unknown>) {
  return value ? JSON.parse(JSON.stringify(value)) as Record<string, unknown> : {};
}

const READING_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function isValidReadingId(id: string) {
  return READING_ID_PATTERN.test(id);
}

function toPublic(record: ReadingRecord): PublicReading {
  if (record.paymentStatus === "paid") {
    if (record.fullReport?.generation?.fallbackReason) {
      return {
        ...record,
        fullReport: {
          ...record.fullReport,
          generation: {
            ...record.fullReport.generation,
            fallbackReason: undefined
          }
        }
      };
    }
    return record;
  }
  const { fullReport: _fullReport, ...safe } = record;
  return safe;
}

export function buildReadingStatus(reading: PublicReading | ReadingRecord, hasCheckoutSession = false): ReadingStatus {
  if (reading.paymentStatus !== "paid") {
    return {
      paymentStatus: reading.paymentStatus,
      reportState: hasCheckoutSession ? "confirming" : "locked",
      fullReportReady: false
    };
  }

  if (!reading.fullReport) {
    return {
      paymentStatus: "paid",
      reportState: "generating",
      fullReportReady: false
    };
  }

  const generationMode = reading.fullReport.generation?.mode;
  const isFallback = generationMode === "template";
  return {
    paymentStatus: "paid",
    reportState: isFallback ? "fallback_ready" : "ready",
    fullReportReady: true,
    generationMode
  };
}

function mapDbRow(row: Record<string, unknown>): ReadingRecord {
  return {
    id: String(row.id),
    name: row.name ? String(row.name) : undefined,
    gender: row.gender as ReadingRecord["gender"],
    birthDate: String(row.birth_date),
    birthTime: row.birth_time ? String(row.birth_time) : undefined,
    birthTimeUnknown: Boolean(row.birth_time_unknown),
    birthPlace: row.birth_place ? String(row.birth_place) : undefined,
    timezone: row.timezone ? String(row.timezone) : undefined,
    trueSolarTime: Boolean(row.true_solar_time),
    userQuestion: row.user_question ? String(row.user_question) : undefined,
    language: row.language as ReadingRecord["language"],
    chart: row.chart_json as ReadingRecord["chart"],
    freeReport: row.free_report_json as ReadingRecord["freeReport"],
    fullReport: row.full_report_json as ReadingRecord["fullReport"],
    paymentStatus: row.payment_status as ReadingRecord["paymentStatus"],
    email: row.email ? String(row.email) : undefined,
    createdAt: new Date(String(row.created_at)).toISOString(),
    updatedAt: new Date(String(row.updated_at)).toISOString()
  };
}

export async function createReading(input: BirthInput): Promise<PublicReading> {
  const chart = generateBaziChart(input);
  const freeReport = generateFreeReport(chart, input.language);
  const record: ReadingRecord = {
    id: crypto.randomUUID(),
    name: input.name,
    gender: input.gender,
    birthDate: input.birthDate,
    birthTime: input.birthTime,
    birthTimeUnknown: input.birthTimeUnknown,
    birthPlace: input.birthPlace,
    timezone: input.timezone,
    trueSolarTime: input.trueSolarTime,
    userQuestion: input.userQuestion,
    language: input.language,
    chart,
    freeReport,
    paymentStatus: "free",
    createdAt: now(),
    updatedAt: now()
  };

  if (hasDatabaseUrl()) {
    const db = sql();
    const [row] = await db.begin(async (tx) => {
      const rows = await tx`
        insert into readings (
          id, name, gender, birth_date, birth_time, birth_time_unknown, birth_place,
          timezone, true_solar_time, user_question, language,
          chart_json, free_report_json, payment_status, created_at, updated_at
        )
        values (
          ${record.id}, ${record.name || null}, ${record.gender || null}, ${record.birthDate},
          ${record.birthTime || null}, ${record.birthTimeUnknown}, ${record.birthPlace || null},
          ${record.timezone || null}, ${Boolean(record.trueSolarTime)}, ${record.userQuestion || null}, ${record.language},
          ${tx.json(record.chart)}, ${tx.json(record.freeReport)}, ${record.paymentStatus},
          ${record.createdAt}, ${record.updatedAt}
        )
        returning *
      `;
      await tx`
        insert into reports (reading_id, report_type, language, status, preview_json, created_at, updated_at)
        values (${record.id}, 'full_bazi', ${record.language}, 'preview_created', ${tx.json(record.freeReport)}, ${record.createdAt}, ${record.updatedAt})
        on conflict (reading_id) do update
        set preview_json = excluded.preview_json, updated_at = excluded.updated_at
      `;
      return rows;
    });
    const created = mapDbRow(row);
    await logEvent({ name: "reading_created", readingId: created.id, metadata: { language: created.language } });
    await logEvent({
      name: "preview_generated",
      readingId: created.id,
      metadata: { lockedSections: created.freeReport.lockedSections.length }
    });
    return toPublic(created);
  }

  const store = readLocalStore();
  store.readings.push(record);
  writeLocalStore(store);
  await logEvent({ name: "reading_created", readingId: record.id, metadata: { language: record.language } });
  await logEvent({
    name: "preview_generated",
    readingId: record.id,
    metadata: { lockedSections: record.freeReport.lockedSections.length }
  });
  return toPublic(record);
}

export async function getReading(id: string): Promise<PublicReading | null> {
  const record = await getInternalReading(id);
  return record ? toPublic(record) : null;
}

export async function getInternalReading(id: string): Promise<ReadingRecord | null> {
  if (!isValidReadingId(id)) {
    return null;
  }

  if (hasDatabaseUrl()) {
    const db = sql();
    const rows = await db`select * from readings where id = ${id} limit 1`;
    return rows[0] ? mapDbRow(rows[0]) : null;
  }

  const store = readLocalStore();
  return store.readings.find((reading) => reading.id === id) || null;
}

export async function ensureFullReport(id: string): Promise<FullReport | null> {
  const record = await getInternalReading(id);
  if (!record || record.paymentStatus !== "paid") {
    return null;
  }
  if (record.fullReport) {
    return record.fullReport;
  }
  return createAndSaveFullReport(record);
}

export async function saveFullReport(id: string, report: FullReport) {
  if (hasDatabaseUrl()) {
    const db = sql();
    await db`
      update readings
      set full_report_json = ${db.json(report)}, updated_at = ${now()}
      where id = ${id}
    `;
    await db`
      insert into reports (reading_id, report_type, language, status, full_json, created_at, updated_at)
      values (${id}, 'full_bazi', ${report.language}, 'full_created', ${db.json(report)}, ${now()}, ${now()})
      on conflict (reading_id) do update
      set full_json = excluded.full_json, status = excluded.status, updated_at = excluded.updated_at
    `;
    return;
  }

  const store = readLocalStore();
  const index = store.readings.findIndex((reading) => reading.id === id);
  if (index >= 0) {
    store.readings[index].fullReport = report;
    store.readings[index].updatedAt = now();
    writeLocalStore(store);
  }
}

export async function markReadingPaid(params: {
  readingId: string;
  email?: string;
  provider?: "stripe" | "creem";
  providerCheckoutId?: string;
  providerEventId?: string;
  providerCustomerId?: string;
  stripeSessionId?: string;
  stripeEventId?: string;
  stripePaymentIntent?: string;
  amount: number;
  currency: string;
  rawEvent?: Record<string, unknown>;
}) {
  const provider = params.provider || "stripe";
  const providerEventId = params.providerEventId || params.stripeEventId;
  const providerCheckoutId = params.providerCheckoutId || params.stripeSessionId;
  if (hasDatabaseUrl()) {
    const db = sql();
    if (providerEventId) {
      const rows = await db`
        select id from payments
        where provider = ${provider} and provider_event_id = ${providerEventId}
        limit 1
      `;
      if (rows[0]) return;
    }
    if (providerCheckoutId) {
      const rows = await db`
        select id from payments
        where provider = ${provider} and provider_checkout_id = ${providerCheckoutId}
        limit 1
      `;
      if (rows[0]) return;
    }
    if (params.stripeEventId) {
      const rows = await db`select id from payments where stripe_event_id = ${params.stripeEventId} limit 1`;
      if (rows[0]) return;
    }
    if (params.stripeSessionId) {
      const rows = await db`select id from payments where stripe_session_id = ${params.stripeSessionId} limit 1`;
      if (rows[0]) return;
    }
    const fullReport = await ensureGeneratedPaidReport(params.readingId);
    await db.begin(async (tx) => {
      await tx`
        update readings
        set payment_status = 'paid', email = coalesce(${params.email || null}, email),
            full_report_json = ${tx.json(fullReport)}, updated_at = ${now()}
        where id = ${params.readingId}
      `;
      await tx`
        insert into payments (
          reading_id, provider, provider_checkout_id, provider_event_id, provider_customer_id,
          stripe_session_id, stripe_event_id, stripe_payment_intent,
          amount, currency, status, raw_event_json, updated_at
        )
        values (
          ${params.readingId}, ${provider}, ${providerCheckoutId || null}, ${providerEventId || null}, ${params.providerCustomerId || null},
          ${params.stripeSessionId || null}, ${params.stripeEventId || null}, ${params.stripePaymentIntent || null},
          ${params.amount}, ${params.currency}, 'paid', ${tx.json(toJsonRecord(params.rawEvent) as never)}, ${now()}
        )
        on conflict do nothing
      `;
    });
    await logEvent({
      name: "payment_marked_paid",
      readingId: params.readingId,
      stripeEventId: params.stripeEventId,
      stripeSessionId: params.stripeSessionId,
      metadata: { amount: params.amount, currency: params.currency, provider, providerCheckoutId, providerEventId }
    });
    await logEvent({
      name: "payment_confirmed",
      readingId: params.readingId,
      stripeEventId: params.stripeEventId,
      stripeSessionId: params.stripeSessionId,
      metadata: { amount: params.amount, currency: params.currency, provider }
    });
    return;
  }

  let store = readLocalStore();
  let index = store.readings.findIndex((reading) => reading.id === params.readingId);
  if (index < 0) {
    throw new Error("Reading not found.");
  }
  const duplicatePayment = store.payments.some((payment) => {
    return (
      (providerEventId && payment.provider === provider && payment.providerEventId === providerEventId) ||
      (providerCheckoutId && payment.provider === provider && payment.providerCheckoutId === providerCheckoutId) ||
      (params.stripeEventId && payment.stripeEventId === params.stripeEventId) ||
      (params.stripeSessionId && payment.stripeSessionId === params.stripeSessionId)
    );
  });
  if (duplicatePayment) {
    return;
  }
  const fullReport = await ensureGeneratedPaidReport(params.readingId);
  store = readLocalStore();
  index = store.readings.findIndex((reading) => reading.id === params.readingId);
  if (index < 0) {
    throw new Error("Reading not found.");
  }
  store.readings[index].paymentStatus = "paid";
  store.readings[index].email = params.email || store.readings[index].email;
  store.readings[index].fullReport = fullReport;
  store.readings[index].updatedAt = now();
  store.payments.push({
    id: crypto.randomUUID(),
    readingId: params.readingId,
    provider,
    providerCheckoutId,
    providerEventId,
    providerCustomerId: params.providerCustomerId,
    stripeSessionId: params.stripeSessionId,
    stripeEventId: params.stripeEventId,
    stripePaymentIntent: params.stripePaymentIntent,
    amount: params.amount,
    currency: params.currency,
    status: "paid",
    rawEvent: params.rawEvent,
    createdAt: now(),
    updatedAt: now()
  });
  writeLocalStore(store);
  await logEvent({
    name: "payment_marked_paid",
    readingId: params.readingId,
    stripeEventId: params.stripeEventId,
    stripeSessionId: params.stripeSessionId,
    metadata: { amount: params.amount, currency: params.currency, provider, providerCheckoutId, providerEventId }
  });
  await logEvent({
    name: "payment_confirmed",
    readingId: params.readingId,
    stripeEventId: params.stripeEventId,
    stripeSessionId: params.stripeSessionId,
    metadata: { amount: params.amount, currency: params.currency, provider }
  });
}

async function ensureGeneratedPaidReport(readingId: string) {
  const record = await getInternalReading(readingId);
  if (!record) {
    throw new Error("Reading not found.");
  }
  if (record.fullReport) {
    return record.fullReport;
  }
  return createAndSaveFullReport(record);
}

async function createAndSaveFullReport(record: ReadingRecord) {
  await assertRateLimit(
    `full-generation:${record.id}`,
    intEnv("MINGYI_FULL_REPORT_REGEN_LIMIT_PER_DAY", 3),
    24 * 60 * 60,
    "Full report generation limit reached."
  );
  await logEvent({ name: "full_generation_started", readingId: record.id });
  await logEvent({ name: "full_report_generating", readingId: record.id });
  try {
    const report = await generateFullReportWithAi(record.chart, record.language);
    await saveFullReport(record.id, report);
    await logEvent({
      name: "full_generation_completed",
      readingId: record.id,
      metadata: { mode: report.generation?.mode || "unknown" }
    });
    return report;
  } catch (error) {
    await logEvent({
      name: "full_generation_failed",
      readingId: record.id,
      metadata: { message: error instanceof Error ? error.message : "unknown error" }
    });
    throw error;
  }
}
