import { NextResponse } from "next/server";
import { ZodError } from "zod";

import { newsletterInputSchema } from "@/lib/validators/newsletter";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`newsletter:${ip}`, { limit: 10, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let input;
  try {
    input = newsletterInputSchema.parse(payload);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: "Invalid input" }, { status: 422 });
    }
    throw error;
  }

  // Honeypot is enforced at the Zod layer (`company: z.string().max(0)`).
  logger.info("newsletter.subscribed", { email: input.email, source: input.source });
  return NextResponse.json({ ok: true });
}
