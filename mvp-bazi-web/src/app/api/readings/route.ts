import { NextResponse } from "next/server";
import type { BirthInput, Gender, Language } from "@/lib/bazi/types";
import { createReading } from "@/lib/db/readings";
import { assertRateLimit, RateLimitError } from "@/lib/db/rate-limit";

function parseLanguage(value: unknown): Language {
  return value === "zh" ? "zh" : "en";
}

function parseGender(value: unknown): Gender {
  return value === "female" || value === "male" ? value : "unspecified";
}

function intEnv(name: string, fallback: number) {
  const value = Number(process.env[name]);
  return Number.isFinite(value) && value > 0 ? value : fallback;
}

function clientIp(request: Request) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip") || "unknown";
}

export async function POST(request: Request) {
  try {
    const ip = clientIp(request);
    await assertRateLimit(
      `preview:ip:${ip}`,
      intEnv("MINGYI_PREVIEW_RATE_LIMIT_PER_HOUR", 20),
      60 * 60,
      "Too many preview requests. Please try again later."
    );
    const body = await request.json();
    const sessionKey =
      request.headers.get("x-mingyi-session") ||
      (typeof body.email === "string" && body.email.trim()) ||
      ip;
    await assertRateLimit(
      `reading:session:${sessionKey}`,
      intEnv("MINGYI_READING_RATE_LIMIT_PER_DAY", 40),
      24 * 60 * 60,
      "Too many reading requests. Please try again later."
    );
    const input: BirthInput = {
      name: typeof body.name === "string" ? body.name.trim().slice(0, 80) : undefined,
      gender: parseGender(body.gender),
      birthDate: String(body.birthDate || ""),
      birthTime: typeof body.birthTime === "string" ? body.birthTime : undefined,
      birthTimeUnknown: Boolean(body.birthTimeUnknown),
      birthPlace: typeof body.birthPlace === "string" ? body.birthPlace.trim().slice(0, 120) : undefined,
      timezone: typeof body.timezone === "string" ? body.timezone.trim().slice(0, 80) : undefined,
      trueSolarTime: Boolean(body.trueSolarTime),
      userQuestion: typeof body.userQuestion === "string" ? body.userQuestion.trim().slice(0, 500) : undefined,
      language: parseLanguage(body.language)
    };

    const reading = await createReading(input);
    return NextResponse.json({ reading });
  } catch (error) {
    if (error instanceof RateLimitError) {
      return NextResponse.json({ error: error.message, resetAt: error.resetAt }, { status: 429 });
    }
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create reading." },
      { status: 400 }
    );
  }
}
