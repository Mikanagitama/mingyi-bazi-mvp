import crypto from "node:crypto";
import type { BirthInput, FullReport, PublicReading, ReadingRecord } from "../bazi/types";
import { generateBaziChart } from "../bazi/chart";
import { generateFreeReport } from "../reports/free-report";
import { generateFullReport } from "../reports/full-report";
import { hasDatabaseUrl, readLocalStore, sql, writeLocalStore } from "./client";

function now() {
  return new Date().toISOString();
}

function toPublic(record: ReadingRecord): PublicReading {
  if (record.paymentStatus === "paid") {
    return record;
  }
  const { fullReport: _fullReport, ...safe } = record;
  return safe;
}

function mapDbRow(row: Record<string, unknown>): ReadingRecord {
  return {
    id: String(row.id),
    name: row.name ? String(row.name) : undefined,
    gender: row.gender as ReadingRecord["gender"],
    birthDate: String(row.birth_date),
    birthTime: row.birth_time ? String(row.birth_time) : undefined,
    birthTimeUnknown: Boolean(row.birth_time_unknown),
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
    language: input.language,
    chart,
    freeReport,
    paymentStatus: "free",
    createdAt: now(),
    updatedAt: now()
  };

  if (hasDatabaseUrl()) {
    const db = sql();
    const [row] = await db`
      insert into readings (
        id, name, gender, birth_date, birth_time, birth_time_unknown, language,
        chart_json, free_report_json, payment_status, created_at, updated_at
      )
      values (
        ${record.id}, ${record.name || null}, ${record.gender || null}, ${record.birthDate},
        ${record.birthTime || null}, ${record.birthTimeUnknown}, ${record.language},
        ${db.json(record.chart)}, ${db.json(record.freeReport)}, ${record.paymentStatus},
        ${record.createdAt}, ${record.updatedAt}
      )
      returning *
    `;
    return toPublic(mapDbRow(row));
  }

  const store = readLocalStore();
  store.readings.push(record);
  writeLocalStore(store);
  return toPublic(record);
}

export async function getReading(id: string): Promise<PublicReading | null> {
  const record = await getInternalReading(id);
  return record ? toPublic(record) : null;
}

export async function getInternalReading(id: string): Promise<ReadingRecord | null> {
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
  const report = generateFullReport(record.chart, record.language);
  await saveFullReport(id, report);
  return report;
}

export async function saveFullReport(id: string, report: FullReport) {
  if (hasDatabaseUrl()) {
    const db = sql();
    await db`
      update readings
      set full_report_json = ${db.json(report)}, updated_at = ${now()}
      where id = ${id}
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
  stripeSessionId?: string;
  stripePaymentIntent?: string;
  amount: number;
  currency: string;
}) {
  const fullReport = await ensureGeneratedPaidReport(params.readingId);

  if (hasDatabaseUrl()) {
    const db = sql();
    await db.begin(async (tx) => {
      await tx`
        update readings
        set payment_status = 'paid', email = coalesce(${params.email || null}, email),
            full_report_json = ${tx.json(fullReport)}, updated_at = ${now()}
        where id = ${params.readingId}
      `;
      await tx`
        insert into payments (reading_id, stripe_session_id, stripe_payment_intent, amount, currency, status)
        values (${params.readingId}, ${params.stripeSessionId || null}, ${params.stripePaymentIntent || null}, ${params.amount}, ${params.currency}, 'paid')
        on conflict (stripe_session_id) do nothing
      `;
    });
    return;
  }

  const store = readLocalStore();
  const index = store.readings.findIndex((reading) => reading.id === params.readingId);
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
    stripeSessionId: params.stripeSessionId,
    stripePaymentIntent: params.stripePaymentIntent,
    amount: params.amount,
    currency: params.currency,
    status: "paid",
    createdAt: now()
  });
  writeLocalStore(store);
}

async function ensureGeneratedPaidReport(readingId: string) {
  const record = await getInternalReading(readingId);
  if (!record) {
    throw new Error("Reading not found.");
  }
  return record.fullReport || generateFullReport(record.chart, record.language);
}
