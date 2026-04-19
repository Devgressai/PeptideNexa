import { ProviderStatus } from "@prisma/client";

// Structural input type — anything with these fields is rankable. Lets us
// exercise the comparator from tests without standing up a Prisma client.
export type RankableProvider = {
  status: ProviderStatus;
  verified: boolean;
  lastVerifiedAt: Date | null;
  name: string;
};

/**
 * Deterministic ranking order for the matching engine and directory:
 *   1. Featured providers above listed.
 *   2. Verified providers above unverified.
 *   3. Most-recently-verified first (null / never-verified sort last).
 *   4. Name alphabetical — final tiebreaker.
 *
 * Split into a pure function so it can be unit-tested independently of the
 * Prisma client and the DB.
 */
export function compareProviderRanking(a: RankableProvider, b: RankableProvider): number {
  const aFeatured = a.status === ProviderStatus.FEATURED;
  const bFeatured = b.status === ProviderStatus.FEATURED;
  if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;

  if (a.verified !== b.verified) return a.verified ? -1 : 1;

  const aTs = a.lastVerifiedAt?.getTime() ?? 0;
  const bTs = b.lastVerifiedAt?.getTime() ?? 0;
  if (aTs !== bTs) return bTs - aTs;

  return a.name.localeCompare(b.name);
}
