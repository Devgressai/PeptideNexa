import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { EditorialLayout } from "@/components/layout/editorial-layout";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { Mdx } from "@/lib/content/mdx";
import { TableOfContents } from "@/components/content/table-of-contents";
import { ReadingProgress } from "@/components/content/reading-progress";
import { extractMdxHeadings } from "@/lib/content/mdx-headings";
import { formatDate } from "@/lib/utils";
import {
  getArticleBySlug,
  getPublishedArticleSlugs,
} from "@/lib/db/loaders/article";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPublishedArticleSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) {
    return buildMetadata({
      title: "Article not found",
      description: "",
      path: `/guides/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: article.seoTitle ?? article.title,
    description: article.seoDescription ?? article.excerpt,
    path: `/guides/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt ?? undefined,
    modifiedTime: article.updatedAt,
    authors: [article.author.name],
  });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await getArticleBySlug(slug);
  if (!article) notFound();

  const headings = extractMdxHeadings(article.bodyMdx);

  return (
    <>
      <ReadingProgress />
      <header className="border-b border-line bg-paper">
        <Container className="py-12 md:py-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/guides" },
              { label: article.title },
            ]}
          />
          <p className="eyebrow mt-6">Guide</p>
          <h1 className="mt-3 max-w-readable font-serif text-display-lg text-ink-strong text-balance">
            {article.title}
          </h1>
          <p className="mt-5 max-w-readable text-lg leading-relaxed text-ink-muted">
            {article.excerpt}
          </p>

          <dl className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-line py-4 text-sm">
            <div className="flex items-center gap-2">
              <dt className="eyebrow">Written by</dt>
              <dd className="text-ink-strong">
                <span className="font-medium">{article.author.name}</span>
                {article.author.credentials ? (
                  <span className="text-ink-subtle">, {article.author.credentials}</span>
                ) : null}
              </dd>
            </div>
            {article.updatedAt ? (
              <div className="flex items-center gap-2">
                <dt className="eyebrow">Updated</dt>
                <dd>
                  <time dateTime={article.updatedAt} className="font-medium text-ink-strong">
                    {formatDate(article.updatedAt)}
                  </time>
                </dd>
              </div>
            ) : null}
            <Link
              href="/editorial-policy"
              className="ml-auto text-sm font-medium text-brand underline decoration-brand/35 underline-offset-[3px] transition-colors hover:decoration-brand"
            >
              Editorial policy →
            </Link>
          </dl>
        </Container>
      </header>

      <EditorialLayout aside={headings.length > 0 ? <TableOfContents items={headings} /> : undefined}>
        <div className="mt-4">
          <Mdx source={article.bodyMdx} />
        </div>
      </EditorialLayout>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Guides", path: "/guides" },
          { name: article.title, path: `/guides/${article.slug}` },
        ])}
      />
      <JsonLd
        data={medicalWebPageSchema({
          headline: article.title,
          description: article.excerpt,
          path: `/guides/${article.slug}`,
          datePublished: article.publishedAt ?? undefined,
          dateModified: article.updatedAt,
          author: { name: article.author.name, credentials: article.author.credentials ?? undefined },
        })}
      />
    </>
  );
}
