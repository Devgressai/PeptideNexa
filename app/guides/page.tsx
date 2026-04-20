import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
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
      <header className="relative overflow-hidden border-b border-line bg-paper">
        <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[40%] opacity-80 lg:block"
        >
          <Image
            src="/generated/editorial-spotlight.png"
            alt=""
            fill
            sizes="40vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-paper/0" />
        </div>

        <Container className="relative py-14 md:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
          <p className="eyebrow mt-6">Editorial library</p>
          <h1 className="mt-3 max-w-2xl font-serif text-display-xl text-ink-strong text-balance">
            Calm, sourced editorial on peptide research.
          </h1>
          <p className="mt-6 max-w-readable text-lg leading-relaxed text-ink-muted">
            Long-form explainers, category primers, and research roundups. Written in-house,
            reviewed by clinically credentialed advisors, sourced back to primary literature.
          </p>
        </Container>
      </header>

      <Container className="py-16">
        {articles.length === 0 ? (
          <div className="rounded-md border border-dashed border-line-strong bg-paper-raised p-12 text-center">
            <p className="font-serif text-xl text-ink-strong">New guides are being prepared.</p>
            <p className="mt-2 text-sm text-ink-muted">
              Check back soon, or subscribe to the research digest on the homepage.
            </p>
          </div>
        ) : (
          <ul className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {articles.map((article, i) => (
              <Reveal key={article.slug} delay={i * 0.04}>
                <li className="h-full">
                  <Link
                    href={`/guides/${article.slug}`}
                    className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-paper-raised transition-all duration-sm hover:border-line-strong hover:shadow-e2 focus-ring"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden bg-paper-sunken">
                      <Image
                        src="/generated/editorial-spotlight.png"
                        alt=""
                        fill
                        sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                        className="object-cover transition-transform duration-lg ease-standard group-hover:scale-[1.03]"
                      />
                      <div
                        aria-hidden
                        className="absolute inset-0 bg-gradient-to-t from-ink/25 via-transparent to-transparent"
                      />
                    </div>
                    <div className="flex flex-1 flex-col p-6">
                      <p className="eyebrow">Guide</p>
                      <h2 className="mt-2 font-serif text-xl leading-tight text-ink-strong transition-colors duration-sm group-hover:text-brand">
                        {article.title}
                      </h2>
                      <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-ink-muted">
                        {article.excerpt}
                      </p>
                      <div className="mt-auto flex items-center justify-between gap-3 border-t border-line pt-5 text-xs text-ink-subtle">
                        <span>
                          {article.author.name}
                          {article.author.credentials ? `, ${article.author.credentials}` : ""}
                        </span>
                        <ArrowRight
                          aria-hidden
                          className="h-3.5 w-3.5 text-ink-strong transition-transform duration-sm group-hover:translate-x-0.5"
                        />
                      </div>
                    </div>
                  </Link>
                </li>
              </Reveal>
            ))}
          </ul>
        )}
      </Container>
    </>
  );
}
