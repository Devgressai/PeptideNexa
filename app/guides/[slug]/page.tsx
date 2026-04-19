import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { EditorialLayout } from "@/components/layout/editorial-layout";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Byline } from "@/components/content/byline";
import { LastUpdatedStamp } from "@/components/content/last-updated-stamp";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { Mdx } from "@/lib/content/mdx";
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

  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Guides", href: "/guides" },
              { label: article.title },
            ]}
          />
          <h1 className="mt-4 max-w-readable font-serif text-display-lg text-ink">
            {article.title}
          </h1>
          <p className="mt-4 max-w-readable text-lg text-ink-muted">{article.excerpt}</p>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Byline author={article.author} />
            <LastUpdatedStamp date={article.updatedAt} label="Updated" />
          </div>
        </Container>
      </header>

      <EditorialLayout>
        <div className="mt-8">
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
