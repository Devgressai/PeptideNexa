import "server-only";
import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import type { PeptideDetail, PeptideSummary } from "@/lib/content/types";

// Loaders are the single persistence → presentation boundary. Pages never
// touch Prisma rows directly; they consume `PeptideSummary` / `PeptideDetail`.
// DB errors are caught and surfaced as empty/null so builds succeed even if
// the DB is unreachable (e.g. initial CI or local bootstraps without a DB).

const SUMMARY_SELECT = {
  id: true,
  slug: true,
  name: true,
  aliases: true,
  summary: true,
  researchLevel: true,
  commonForms: true,
  category: { select: { slug: true, name: true } },
} satisfies Prisma.PeptideSelect;

type SummaryRow = Prisma.PeptideGetPayload<{ select: typeof SUMMARY_SELECT }>;

function toSummary(row: SummaryRow): PeptideSummary {
  return {
    slug: row.slug,
    name: row.name,
    aliases: row.aliases,
    category: { slug: row.category.slug, name: row.category.name },
    summary: row.summary,
    researchLevel: row.researchLevel,
    commonForms: row.commonForms,
  };
}

function handle<T>(label: string, fallback: T): (err: unknown) => T {
  return (err) => {
    console.error(`[loaders/peptide] ${label} failed`, err);
    return fallback;
  };
}

export async function getPublishedPeptides(limit = 60): Promise<PeptideSummary[]> {
  return prisma.peptide
    .findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: SUMMARY_SELECT,
      orderBy: [{ publishedAt: "desc" }, { name: "asc" }],
      take: limit,
    })
    .then((rows) => rows.map(toSummary))
    .catch(handle("getPublishedPeptides", [] as PeptideSummary[]));
}

export async function getFeaturedPeptides(limit = 3): Promise<PeptideSummary[]> {
  return prisma.peptide
    .findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: SUMMARY_SELECT,
      orderBy: [{ researchLevel: "desc" }, { publishedAt: "desc" }],
      take: limit,
    })
    .then((rows) => rows.map(toSummary))
    .catch(handle("getFeaturedPeptides", [] as PeptideSummary[]));
}

export async function getPeptideBySlug(slug: string): Promise<PeptideDetail | null> {
  return prisma.peptide
    .findUnique({
      where: { slug },
      include: {
        category: true,
        goals: { select: { slug: true, name: true } },
        author: true,
        reviewer: true,
        faqs: { orderBy: { sortOrder: "asc" } },
        sources: true,
        relatedPeptides: { select: { slug: true } },
        comparisonsA: { select: { slug: true } },
        comparisonsB: { select: { slug: true } },
        offerings: { select: { providerId: true, provider: { select: { slug: true } } } },
      },
    })
    .then((row) => (row ? mapDetail(row) : null))
    .catch(handle("getPeptideBySlug", null));
}

function mapDetail(
  row: NonNullable<
    Prisma.PeptideGetPayload<{
      include: {
        category: true;
        goals: { select: { slug: true; name: true } };
        author: true;
        reviewer: true;
        faqs: true;
        sources: true;
        relatedPeptides: { select: { slug: true } };
        comparisonsA: { select: { slug: true } };
        comparisonsB: { select: { slug: true } };
        offerings: { select: { providerId: true; provider: { select: { slug: true } } } };
      };
    }>
  >,
): PeptideDetail {
  return {
    slug: row.slug,
    name: row.name,
    aliases: row.aliases,
    category: { slug: row.category.slug, name: row.category.name },
    summary: row.summary,
    researchLevel: row.researchLevel,
    commonForms: row.commonForms,
    bodyMdx: row.bodyMdx,
    goals: row.goals.map((g) => ({ slug: g.slug, name: g.name })),
    author: row.author
      ? {
          slug: row.author.slug,
          name: row.author.name,
          credentials: row.author.credentials,
          photoUrl: row.author.photoUrl,
        }
      : null,
    reviewer: row.reviewer
      ? {
          slug: row.reviewer.slug,
          name: row.reviewer.name,
          credentials: row.reviewer.credentials,
          photoUrl: row.reviewer.photoUrl,
        }
      : null,
    lastReviewedAt: row.lastReviewedAt ? row.lastReviewedAt.toISOString() : null,
    publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
    faqs: row.faqs.map((f) => ({ question: f.question, answer: f.answer })),
    sources: row.sources.map((s) => ({
      title: s.title,
      url: s.url,
      publisher: s.publisher,
      year: s.year,
    })),
    relatedPeptideSlugs: row.relatedPeptides.map((p) => p.slug),
    comparisonSlugs: [...row.comparisonsA, ...row.comparisonsB].map((c) => c.slug),
    providerSlugs: row.offerings.map((o) => o.provider.slug),
  };
}

export async function getPublishedPeptideSlugs(): Promise<string[]> {
  return prisma.peptide
    .findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true } })
    .then((rows) => rows.map((r) => r.slug))
    .catch(handle("getPublishedPeptideSlugs", [] as string[]));
}

// Hydrate a bounded set of peptide summaries from a slug list. Preserves the
// caller's slug order so pages can keep editorial ranking. Filters to
// PUBLISHED only so we never leak drafts via related-content rails.
export async function getPeptideSummariesBySlugs(
  slugs: string[],
  limit = 3,
): Promise<PeptideSummary[]> {
  if (slugs.length === 0) return [];
  const unique = Array.from(new Set(slugs)).slice(0, limit * 2);
  return prisma.peptide
    .findMany({
      where: { slug: { in: unique }, status: ContentStatus.PUBLISHED },
      select: SUMMARY_SELECT,
    })
    .then((rows) => {
      const bySlug = new Map(rows.map((r) => [r.slug, toSummary(r)]));
      return unique
        .map((slug) => bySlug.get(slug))
        .filter((p): p is PeptideSummary => p !== undefined)
        .slice(0, limit);
    })
    .catch(handle("getPeptideSummariesBySlugs", [] as PeptideSummary[]));
}
