import { NextResponse } from "next/server";
import { getReading } from "@/lib/db/readings";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const reading = await getReading(id);
  if (!reading) {
    return NextResponse.json({ error: "Reading not found." }, { status: 404 });
  }
  return NextResponse.json({ reading });
}
