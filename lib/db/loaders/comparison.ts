import "server-only";
import { ContentStatus } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import type { ComparisonDetail, ComparisonRow } from "@/lib/content/types";

export type ComparisonRef = {
  slug: string;
  peptideA: { slug: string; name: string };
  peptideB: { slug: string; name: string };
};

// Loader for the /compare/[slug] detail template. Mirrors the peptide/provider
// loader pattern: catch DB errors and return null so build-time static params
// and page rendering degrade gracefully in offline/dev bootstrap.

function handle<T>(label: string, fallback: T): (err: unknown) => T {
  return (err) => {
    console.error(`[loaders/comparison] ${label} failed`, err);
    return fallback;
  };
}

export async function getPublishedComparisonSlugs(): Promise<string[]> {
  return prisma.comparison
    .findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: { slug: true },
    })
    .then((rows) => rows.map((r) => r.slug))
    .catch(handle("getPublishedComparisonSlugs", [] as string[]));
}

export async function getComparisonBySlug(
  slug: string,
): Promise<ComparisonDetail | null> {
  return prisma.comparison
    .findUnique({
      where: { slug },
      include: {
        peptideA: { select: { slug: true, name: true } },
        peptideB: { select: { slug: true, name: true } },
        faqs: { select: { question: true, answer: true } },
      },
    })
    .then((row) => {
      if (!row) return null;
      return {
        slug: row.slug,
        peptideA: { slug: row.peptideA.slug, name: row.peptideA.name },
        peptideB: { slug: row.peptideB.slug, name: row.peptideB.name },
        bodyMdx: row.bodyMdx,
        matrix: parseMatrix(row.matrixJson),
        faqs: row.faqs.map((f) => ({ question: f.question, answer: f.answer })),
      } satisfies ComparisonDetail;
    })
    .catch(handle("getComparisonBySlug", null));
}

// Lightweight reference loader for related-rails. Returns just enough to
// render "X vs Y" links without pulling matrix/body/faqs for every card.
export async function getComparisonRefsBySlugs(
  slugs: string[],
  limit = 3,
): Promise<ComparisonRef[]> {
  if (slugs.length === 0) return [];
  const unique = Array.from(new Set(slugs)).slice(0, limit * 2);
  return prisma.comparison
    .findMany({
      where: { slug: { in: unique }, status: ContentStatus.PUBLISHED },
      select: {
        slug: true,
        peptideA: { select: { slug: true, name: true } },
        peptideB: { select: { slug: true, name: true } },
      },
    })
    .then((rows) => {
      const bySlug = new Map(
        rows.map((r) => [
          r.slug,
          {
            slug: r.slug,
            peptideA: { slug: r.peptideA.slug, name: r.peptideA.name },
            peptideB: { slug: r.peptideB.slug, name: r.peptideB.name },
          } satisfies ComparisonRef,
        ]),
      );
      return unique
        .map((slug) => bySlug.get(slug))
        .filter((r): r is ComparisonRef => r !== undefined)
        .slice(0, limit);
    })
    .catch(handle("getComparisonRefsBySlugs", [] as ComparisonRef[]));
}

// Matrix is stored as JSON in Prisma. We validate at the boundary so the page
// template can trust its shape.
function parseMatrix(raw: unknown): ComparisonRow[] {
  if (!Array.isArray(raw)) return [];
  const rows: ComparisonRow[] = [];
  for (const row of raw) {
    if (
      row &&
      typeof row === "object" &&
      "label" in row &&
      "a" in row &&
      "b" in row &&
      typeof (row as { label: unknown }).label === "string" &&
      typeof (row as { a: unknown }).a === "string" &&
      typeof (row as { b: unknown }).b === "string"
    ) {
      rows.push({
        label: (row as ComparisonRow).label,
        a: (row as ComparisonRow).a,
        b: (row as ComparisonRow).b,
      });
    }
  }
  return rows;
}
