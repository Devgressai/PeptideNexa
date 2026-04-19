import "server-only";
import { prisma } from "@/lib/db/client";
import type { ProviderSummary } from "@/lib/content/types";
import { searchProviders } from "@/lib/db/loaders/provider";

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
  // Resolve them into full ProviderSummary rows via the directory loader, so
  // the result page presents the same shape as any other listing.
  const all = await searchProviders({});
  const bySlug = new Map(all.map((p) => [p.slug, p]));
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
