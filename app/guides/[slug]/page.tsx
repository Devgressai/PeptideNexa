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
import type { Author } from "@/lib/content/types";

type Params = { slug: string };

type Article = {
  slug: string;
  title: string;
  excerpt: string;
  bodyMdx: string;
  author: Author;
  publishedAt: string;
  updatedAt: string;
};

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await loadArticle(slug);
  if (!article) {
    return buildMetadata({ title: "Article not found", description: "", path: `/guides/${slug}`, noIndex: true });
  }
  return buildMetadata({
    title: article.title,
    description: article.excerpt,
    path: `/guides/${article.slug}`,
    type: "article",
    publishedTime: article.publishedAt,
    modifiedTime: article.updatedAt,
    authors: [article.author.name],
  });
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const article = await loadArticle(slug);
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
          <h1 className="mt-4 max-w-readable font-serif text-display-lg text-ink">{article.title}</h1>
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
          datePublished: article.publishedAt,
          dateModified: article.updatedAt,
          author: { name: article.author.name, credentials: article.author.credentials ?? undefined },
        })}
      />
    </>
  );
}

// TODO(E4-T6 follow-up): migrate to a DB-backed article loader. Left as a
// fixture so the /guides/[slug] route renders before the Article admin lands.
async function loadArticle(slug: string): Promise<Article | null> {
  const articles: Article[] = [
    {
      slug: "calm-guide-to-peptide-research",
      title: "A calm guide to peptide research",
      excerpt:
        "How to read public peptide research without getting hype-pilled — and what to look for when evaluating a provider.",
      bodyMdx: [
        "Peptide research is having a moment, and most of what gets shared online is either hype or fear.",
        "",
        "<Callout tone=\"info\" title=\"How to read the rest of this guide\">",
        "  We summarize the public literature, cite primary sources where they exist, and mark anything speculative as such.",
        "</Callout>",
        "",
        "## Start with the mechanism",
        "",
        "When evaluating any peptide, the first question is mechanism. What does it do at the receptor level, and which tissues express those receptors? Mechanism tells you what questions to ask — of the research and of the provider.",
        "",
        "## Evaluate the evidence ladder",
        "",
        "- In vitro studies answer *can this happen at all*.",
        "- Animal studies answer *does it happen in a living system*.",
        "- Human trials answer *does it help real people, at doses a clinician would use*.",
        "",
        "Most peptides sold online live in the first two rungs. That doesn't mean they're useless — it means the confidence interval is wide.",
        "",
        "## Evaluating a provider",
        "",
        "A credible provider will:",
        "",
        "1. Explain what the research does and does not support.",
        "2. Discuss compounding pharmacy sourcing and sterility.",
        "3. Insist on follow-up, not just a one-shot prescription.",
        "",
        "<DisclaimerBanner />",
      ].join("\n"),
      author: { slug: "editorial", name: "PeptideNexa Editorial", credentials: null, photoUrl: null },
      publishedAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ];
  return articles.find((a) => a.slug === slug) ?? null;
}
