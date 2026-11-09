import "server-only";
import { NextResponse, type NextRequest } from "next/server";
import { rateLimit } from "./leads";

export function clientIp(req: NextRequest): string {
  return req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || req.headers.get("x-real-ip") || "local";
}

export async function readJson(req: NextRequest): Promise<Record<string, unknown> | null> {
  try {
    const body = await req.json();
    return body && typeof body === "object" ? (body as Record<string, unknown>) : null;
  } catch {
    return null;
  }
}

export function limited(req: NextRequest, bucket: string, max: number): NextResponse | null {
  if (rateLimit(`${bucket}:${clientIp(req)}`, max)) return null;
  return NextResponse.json({ ok: false, error: "Too many requests. Please wait a minute and try again." }, { status: 429 });
}

export const bad = (error: string, status = 400, extra: Record<string, unknown> = {}) =>
  NextResponse.json({ ok: false, error, ...extra }, { status });
