import { NextResponse } from "next/server";
import { getDeploymentReadiness } from "@/lib/deploy/readiness";

export async function GET() {
  const readiness = getDeploymentReadiness();
  return NextResponse.json(readiness, { status: readiness.ok ? 200 : 503 });
}
