import "server-only";
import { ProviderStatus } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import type { ProviderSummary } from "@/lib/content/types";

export type LeadResult = {
  id: string;
  email: string;
  name: string | null;
  intentGoalSlug: string | null;
  locationState: string | null;
  createdAt: string;
  matches: ProviderSummary[];
};

/**
 * Resolve a lead + its matched providers by token. Returns null when the token
 * does not exist — the result page is public-ish (anyone with the token can
 * see it), which is safe because matches are already non-sensitive summaries.
 */
export async function getLeadResult(token: string): Promise<LeadResult | null> {
  const lead = await prisma.lead
    .findUnique({
      where: { id: token },
      select: {
        id: true,
        email: true,
        name: true,
        intentGoalSlug: true,
        locationState: true,
        createdAt: true,
        matchedProviderIds: true,
      },
    })
    .catch((err) => {
      console.error("[loaders/lead] getLeadResult failed", err);
      return null;
    });

  if (!lead) return null;

  // matchedProviderIds is persisted as provider slugs (see leads route).
  // Fetch just those slugs rather than scanning the full directory, then
  // re-order the result to preserve the original ranking.
  const providerRows =
    lead.matchedProviderIds.length === 0
      ? []
      : await prisma.provider
          .findMany({
            where: {
              slug: { in: lead.matchedProviderIds },
              status: { in: [ProviderStatus.LISTED, ProviderStatus.FEATURED] },
            },
            select: {
              slug: true,
              name: true,
              type: true,
              status: true,
              verified: true,
              city: true,
              state: true,
              servesStates: true,
              shortDescription: true,
              priceTier: true,
              peptides: { select: { peptide: { select: { slug: true } } } },
            },
          })
          .catch((err) => {
            console.error("[loaders/lead] provider hydration failed", err);
            return [];
          });

  const bySlug = new Map<string, ProviderSummary>(
    providerRows.map((row) => [
      row.slug,
      {
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
      },
    ]),
  );

  const matches = lead.matchedProviderIds
    .map((slug) => bySlug.get(slug))
    .filter((p): p is ProviderSummary => Boolean(p));

  return {
    id: lead.id,
    email: lead.email,
    name: lead.name,
    intentGoalSlug: lead.intentGoalSlug,
    locationState: lead.locationState,
    createdAt: lead.createdAt.toISOString(),
    matches,
  };
}
