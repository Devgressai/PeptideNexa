import "server-only";
import { ProviderStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import type { ProviderSummary } from "@/lib/content/types";
import type { LeadInput } from "@/lib/validators/lead";

type ProviderMatchRow = Prisma.ProviderGetPayload<{
  include: { peptides: { select: { peptide: { select: { slug: true } } } } };
}>;

/**
 * Rank providers against a lead.
 *
 * The function is deliberately small and deterministic — no ML, no hidden
 * heuristics. Every ranking signal is explicit:
 *   1. type / geography / peptide / budget must match what the lead asked for
 *   2. featured providers sort above listed
 *   3. verified providers sort above unverified
 *   4. most-recently-verified ties are broken by name
 *
 * Expanded scoring (capacity caps, historical lead-accept rate, provider NPS)
 * lands with the provider portal in phase 3.
 */
export async function matchProviders(
  lead: LeadInput,
  limit = 3,
): Promise<ProviderSummary[]> {
  const where: Prisma.ProviderWhereInput = {
    status: { in: [ProviderStatus.LISTED, ProviderStatus.FEATURED] },
  };

  // Online vs. in-person preference.
  if (lead.onlineOk === false) {
    where.type = { not: "ONLINE" };
  }

  // Geography: online providers whose `servesStates` includes the lead's
  // state count as a match, in addition to in-state clinics.
  if (lead.locationState && lead.locationState.length === 2) {
    where.OR = [
      { type: "ONLINE", servesStates: { has: lead.locationState } },
      { state: lead.locationState },
      { type: "ONLINE", servesStates: { isEmpty: true } }, // nationwide online
    ];
  }

  // Peptide intent — direct offering match.
  if (lead.intentPeptideSlug) {
    where.peptides = { some: { peptide: { slug: lead.intentPeptideSlug } } };
  }

  // Budget tier → provider priceTier, lenient (one step up or down).
  if (lead.budgetTier === "UNDER_250") {
    where.priceTier = { in: ["ECONOMY", "STANDARD"] };
  } else if (lead.budgetTier === "HIGH") {
    where.priceTier = { in: ["STANDARD", "PREMIUM"] };
  }

  const rows: ProviderMatchRow[] = await prisma.provider
    .findMany({
      where,
      include: { peptides: { select: { peptide: { select: { slug: true } } } } },
      orderBy: [
        // ProviderStatus.FEATURED < ProviderStatus.LISTED alphabetically,
        // so `asc` puts featured first.
        { status: "asc" },
        { verified: "desc" },
        { lastVerifiedAt: "desc" },
        { name: "asc" },
      ],
      take: limit,
    })
    .catch((err) => {
      console.error("[matching] query failed", err);
      return [] as ProviderMatchRow[];
    });

  return rows.map(toSummary);
}

function toSummary(row: ProviderMatchRow): ProviderSummary {
  return {
    slug: row.slug,
    name: row.name,
    type: row.type,
    verified: row.verified,
    featured: row.status === ProviderStatus.FEATURED,
    city: row.city,
    state: row.state,
    servesStates: row.servesStates,
    shortDescription: row.shortDescription,
    priceTier: row.priceTier,
    peptideSlugs: row.peptides.map((p) => p.peptide.slug),
  };
}
