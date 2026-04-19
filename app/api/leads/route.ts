import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { LeadStatus } from "@prisma/client";

import { leadInputSchema, type LeadInput } from "@/lib/validators/lead";
import { rateLimit, getClientIp } from "@/lib/rate-limit";
import { prisma } from "@/lib/db/client";
import { matchProviders } from "@/lib/matching/engine";
import { logger } from "@/lib/logger";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const ip = getClientIp(request.headers);
  const limit = rateLimit(`leads:${ip}`, { limit: 5, windowMs: 60_000 });
  if (!limit.success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again shortly." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.ceil((limit.resetAt - Date.now()) / 1000)) },
      },
    );
  }

  let json: unknown;
  try {
    json = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  let input: LeadInput;
  try {
    input = leadInputSchema.parse(json);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json(
        { error: "Invalid input", details: error.flatten().fieldErrors },
        { status: 422 },
      );
    }
    throw error;
  }

  // Honeypot is enforced at the Zod layer (`company: z.string().max(0)`).
  // Bots that fill the field fail schema validation with a 422 above.

  const matches = await matchProviders(input);
  const matchedProviderIds = matches.map((m) => m.slug);

  try {
    const lead = await prisma.lead.create({
      data: {
        source: input.source,
        email: input.email.toLowerCase(),
        name: input.name ?? null,
        phone: input.phone || null,
        locationState: input.locationState || null,
        onlineOk: input.onlineOk,
        budgetTier: input.budgetTier,
        intentGoalSlug: input.intentGoalSlug ?? null,
        intentPeptideSlug: input.intentPeptideSlug ?? null,
        notes: input.notes ?? null,
        matchedProviderIds,
        status: LeadStatus.NEW,
        events: {
          create: {
            type: "CREATED",
            payload: { source: input.source, matched: matchedProviderIds.length },
          },
        },
      },
      select: { id: true },
    });

    // Routing (E6-T5): enqueue a background job here once Inngest is wired.
    // For now, a server log stands in for the CRM webhook + provider email.
    logger.info("lead.created", {
      leadId: lead.id,
      source: input.source,
      state: input.locationState || undefined,
      goal: input.intentGoalSlug,
      peptide: input.intentPeptideSlug,
      budget: input.budgetTier,
      matchCount: matchedProviderIds.length,
    });

    return NextResponse.json({ ok: true, token: lead.id, matches: matchedProviderIds });
  } catch (err) {
    logger.error("lead.persistence_failed", { error: String(err) });
    return NextResponse.json(
      { error: "We couldn't record your request. Please try again shortly." },
      { status: 500 },
    );
  }
}
