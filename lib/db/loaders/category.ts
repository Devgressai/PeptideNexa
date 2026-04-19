import "server-only";
import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import type { PeptideSummary } from "@/lib/content/types";

export type CategoryWithPeptides = {
  slug: string;
  name: string;
  description: string | null;
  peptides: PeptideSummary[];
};

function handle<T>(label: string, fallback: T): (err: unknown) => T {
  return (err) => {
    console.error(`[loaders/category] ${label} failed`, err);
    return fallback;
  };
}

const CATEGORY_INCLUDE = {
  peptides: {
    where: { status: ContentStatus.PUBLISHED },
    include: { category: { select: { slug: true, name: true } } },
    orderBy: [{ researchLevel: "desc" }, { name: "asc" }],
  },
} satisfies Prisma.CategoryInclude;

type CategoryRow = Prisma.CategoryGetPayload<{ include: typeof CATEGORY_INCLUDE }>;

function toCategory(row: CategoryRow): CategoryWithPeptides {
  return {
    slug: row.slug,
    name: row.name,
    description: row.description,
    peptides: row.peptides.map((p) => ({
      slug: p.slug,
      name: p.name,
      aliases: p.aliases,
      category: { slug: p.category.slug, name: p.category.name },
      summary: p.summary,
      researchLevel: p.researchLevel,
      commonForms: p.commonForms,
    })),
  };
}

export async function getCategoryBySlug(slug: string): Promise<CategoryWithPeptides | null> {
  return prisma.category
    .findUnique({ where: { slug }, include: CATEGORY_INCLUDE })
    .then((row) => (row ? toCategory(row) : null))
    .catch(handle("getCategoryBySlug", null));
}

export async function getAllCategorySlugs(): Promise<string[]> {
  return prisma.category
    .findMany({ select: { slug: true } })
    .then((rows) => rows.map((r) => r.slug))
    .catch(handle("getAllCategorySlugs", [] as string[]));
}
