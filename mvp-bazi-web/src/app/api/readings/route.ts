import { NextResponse } from "next/server";
import type { BirthInput, Gender, Language } from "@/lib/bazi/types";
import { createReading } from "@/lib/db/readings";

function parseLanguage(value: unknown): Language {
  return value === "zh" ? "zh" : "en";
}

function parseGender(value: unknown): Gender {
  return value === "female" || value === "male" ? value : "unspecified";
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
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
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to create reading." },
      { status: 400 }
    );
  }
}
