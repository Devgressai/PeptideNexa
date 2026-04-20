import "server-only";
import { ProviderStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import type {
  DirectoryFilter,
  ProviderDetail,
  ProviderSummary,
} from "@/lib/content/types";

const SUMMARY_SELECT = {
  id: true,
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
  lastVerifiedAt: true,
  peptides: { select: { peptide: { select: { slug: true } } } },
} satisfies Prisma.ProviderSelect;

type SummaryRow = Prisma.ProviderGetPayload<{ select: typeof SUMMARY_SELECT }>;

function toSummary(row: SummaryRow): ProviderSummary {
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
    lastVerifiedAt: row.lastVerifiedAt ? row.lastVerifiedAt.toISOString() : null,
  };
}

function handle<T>(label: string, fallback: T): (err: unknown) => T {
  return (err) => {
    console.error(`[loaders/provider] ${label} failed`, err);
    return fallback;
  };
}

const LISTED_STATUSES = [ProviderStatus.LISTED, ProviderStatus.FEATURED] as const;

export async function getFeaturedProviders(limit = 4): Promise<ProviderSummary[]> {
  return prisma.provider
    .findMany({
      where: { status: ProviderStatus.FEATURED },
      select: SUMMARY_SELECT,
      orderBy: [{ verified: "desc" }, { lastVerifiedAt: "desc" }, { name: "asc" }],
      take: limit,
    })
    .then((rows) => rows.map(toSummary))
    .catch(handle("getFeaturedProviders", [] as ProviderSummary[]));
}

export async function searchProviders(filter: DirectoryFilter): Promise<ProviderSummary[]> {
  const where: Prisma.ProviderWhereInput = {
    status: filter.featuredOnly
      ? ProviderStatus.FEATURED
      : { in: [...LISTED_STATUSES] },
  };
  if (filter.type) where.type = filter.type;
  if (filter.priceTier) where.priceTier = filter.priceTier;
  if (filter.state) {
    where.OR = [{ state: filter.state }, { servesStates: { has: filter.state } }];
  }
  if (filter.peptide) {
    where.peptides = { some: { peptide: { slug: filter.peptide } } };
  }

  return prisma.provider
    .findMany({
      where,
      select: SUMMARY_SELECT,
      // Prisma cannot sort Postgres enums in our intended featured-first
      // order (it uses enum declaration order). We fetch a bounded pool and
      // rank in JS below.
      take: 60,
    })
    .then((rows) =>
      rows
        .slice()
        .sort(compareProviderRows)
        .map(toSummary),
    )
    .catch(handle("searchProviders", [] as ProviderSummary[]));
}

function compareProviderRows(a: SummaryRow, b: SummaryRow): number {
  const aFeatured = a.status === ProviderStatus.FEATURED;
  const bFeatured = b.status === ProviderStatus.FEATURED;
  if (aFeatured !== bFeatured) return aFeatured ? -1 : 1;
  if (a.verified !== b.verified) return a.verified ? -1 : 1;
  return a.name.localeCompare(b.name);
}

export async function getProviderBySlug(slug: string): Promise<ProviderDetail | null> {
  return prisma.provider
    .findUnique({
      where: { slug },
      include: { peptides: { select: { peptide: { select: { slug: true } } } } },
    })
    .then((row) => {
      if (!row) return null;
      const summary = toSummary({
        id: row.id,
        slug: row.slug,
        name: row.name,
        type: row.type,
        status: row.status,
        verified: row.verified,
        city: row.city,
        state: row.state,
        servesStates: row.servesStates,
        shortDescription: row.shortDescription,
        priceTier: row.priceTier,
        lastVerifiedAt: row.lastVerifiedAt,
        peptides: row.peptides,
      });
      const detail: ProviderDetail = {
        ...summary,
        websiteUrl: row.websiteUrl,
        affiliateUrl: row.affiliateUrl,
        bodyMdx: row.bodyMdx,
        licensing: row.licensing,
        editorialNote: row.editorialNote,
      };
      return detail;
    })
    .catch(handle("getProviderBySlug", null));
}

export async function getListedProviderSlugs(): Promise<string[]> {
  return prisma.provider
    .findMany({
      where: { status: { in: [...LISTED_STATUSES] } },
      select: { slug: true },
    })
    .then((rows) => rows.map((r) => r.slug))
    .catch(handle("getListedProviderSlugs", [] as string[]));
}

// Hydrate provider summaries from a slug list, preserving order. Scoped to
// listed + featured so draft/archived providers never appear in related rails.
export async function getProviderSummariesBySlugs(
  slugs: string[],
  limit = 3,
): Promise<ProviderSummary[]> {
  if (slugs.length === 0) return [];
  const unique = Array.from(new Set(slugs)).slice(0, limit * 2);
  return prisma.provider
    .findMany({
      where: {
        slug: { in: unique },
        status: { in: [...LISTED_STATUSES] },
      },
      select: SUMMARY_SELECT,
    })
    .then((rows) => {
      const bySlug = new Map(rows.map((r) => [r.slug, toSummary(r)]));
      return unique
        .map((slug) => bySlug.get(slug))
        .filter((p): p is ProviderSummary => p !== undefined)
        .slice(0, limit);
    })
    .catch(handle("getProviderSummariesBySlugs", [] as ProviderSummary[]));
}
