import "server-only";
import { ContentStatus, type Prisma } from "@prisma/client";
import { prisma } from "@/lib/db/client";
import type { Author } from "@/lib/content/types";

export type ArticleSummary = {
  slug: string;
  title: string;
  excerpt: string;
  author: Author;
  publishedAt: string | null;
};

export type ArticleDetail = ArticleSummary & {
  bodyMdx: string;
  updatedAt: string;
  seoTitle: string | null;
  seoDescription: string | null;
};

function toAuthor(row: { slug: string; name: string; credentials: string | null; photoUrl: string | null }): Author {
  return { slug: row.slug, name: row.name, credentials: row.credentials, photoUrl: row.photoUrl };
}

function handle<T>(label: string, fallback: T): (err: unknown) => T {
  return (err) => {
    console.error(`[loaders/article] ${label} failed`, err);
    return fallback;
  };
}

const SUMMARY_SELECT = {
  slug: true,
  title: true,
  excerpt: true,
  publishedAt: true,
  author: { select: { slug: true, name: true, credentials: true, photoUrl: true } },
} satisfies Prisma.ArticleSelect;

export async function getPublishedArticles(limit = 30): Promise<ArticleSummary[]> {
  return prisma.article
    .findMany({
      where: { status: ContentStatus.PUBLISHED },
      select: SUMMARY_SELECT,
      orderBy: { publishedAt: "desc" },
      take: limit,
    })
    .then((rows) =>
      rows.map((r) => ({
        slug: r.slug,
        title: r.title,
        excerpt: r.excerpt,
        author: toAuthor(r.author),
        publishedAt: r.publishedAt ? r.publishedAt.toISOString() : null,
      })),
    )
    .catch(handle("getPublishedArticles", [] as ArticleSummary[]));
}

export async function getArticleBySlug(slug: string): Promise<ArticleDetail | null> {
  return prisma.article
    .findUnique({
      where: { slug },
      include: {
        author: { select: { slug: true, name: true, credentials: true, photoUrl: true } },
      },
    })
    .then((row) => {
      if (!row) return null;
      if (row.status !== ContentStatus.PUBLISHED) return null;
      return {
        slug: row.slug,
        title: row.title,
        excerpt: row.excerpt,
        bodyMdx: row.bodyMdx,
        author: toAuthor(row.author),
        publishedAt: row.publishedAt ? row.publishedAt.toISOString() : null,
        updatedAt: row.updatedAt.toISOString(),
        seoTitle: row.seoTitle,
        seoDescription: row.seoDescription,
      };
    })
    .catch(handle("getArticleBySlug", null));
}

export async function getPublishedArticleSlugs(): Promise<string[]> {
  return prisma.article
    .findMany({ where: { status: ContentStatus.PUBLISHED }, select: { slug: true } })
    .then((rows) => rows.map((r) => r.slug))
    .catch(handle("getPublishedArticleSlugs", [] as string[]));
}
