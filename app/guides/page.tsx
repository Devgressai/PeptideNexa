import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";
import { getPublishedArticles } from "@/lib/db/loaders/article";

export const metadata: Metadata = buildMetadata({
  title: "Guides — editorial research and explainers",
  description:
    "Research explainers, how-to guides, and category context from the PeptideNexa editorial team.",
  path: "/guides",
});

export const revalidate = 300;

export default async function GuidesIndexPage() {
  const articles = await getPublishedArticles();

  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">Guides</h1>
          <p className="mt-3 max-w-readable text-ink-muted">
            Editorial explainers and research summaries. Independent, sourced, and reviewed.
          </p>
        </Container>
      </header>
      <Container className="py-12">
        {articles.length === 0 ? (
          <p className="max-w-readable text-sm text-ink-muted">
            New guides are being prepared. Check back shortly.
          </p>
        ) : (
          <ul className="divide-y divide-line border-y border-line">
            {articles.map((article) => (
              <li key={article.slug} className="py-6">
                <Link href={`/guides/${article.slug}`} className="group block">
                  <h2 className="font-serif text-2xl text-ink group-hover:text-brand">
                    {article.title}
                  </h2>
                  <p className="mt-2 max-w-readable text-ink-muted">{article.excerpt}</p>
                  <p className="mt-2 text-xs text-ink-subtle">
                    by {article.author.name}
                    {article.author.credentials ? `, ${article.author.credentials}` : ""}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
