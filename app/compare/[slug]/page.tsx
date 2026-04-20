import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { FaqBlock } from "@/components/content/faq-block";
import { DisclaimerBanner } from "@/components/content/disclaimer-banner";
import { JsonLd } from "@/components/seo/json-ld";
import { Mdx } from "@/lib/content/mdx";
import { Button } from "@/components/ui/button";
import { breadcrumbSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getComparisonBySlug,
  getPublishedComparisonSlugs,
} from "@/lib/db/loaders/comparison";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPublishedComparisonSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) {
    return buildMetadata({
      title: "Comparison not found",
      description: "",
      path: `/compare/${slug}`,
      noIndex: true,
    });
  }
  const title = `${comparison.peptideA.name} vs ${comparison.peptideB.name} — Side-by-side research`;
  return buildMetadata({
    title,
    description: `Independent, sourced comparison of ${comparison.peptideA.name} and ${comparison.peptideB.name}.`,
    path: `/compare/${comparison.slug}`,
  });
}

export default async function ComparisonDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const comparison = await getComparisonBySlug(slug);
  if (!comparison) notFound();

  const { peptideA, peptideB, matrix, bodyMdx, faqs } = comparison;

  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12 md:py-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Compare", href: "/compare" },
              { label: `${peptideA.name} vs ${peptideB.name}` },
            ]}
          />
          <p className="eyebrow mt-6">Comparison</p>

          <h1 className="mt-3 flex flex-wrap items-baseline gap-3 font-serif text-display-xl leading-tight text-ink-strong text-balance md:gap-5">
            <Link
              href={`/peptides/${peptideA.slug}` as never}
              className="transition-colors duration-sm hover:text-brand focus-ring rounded-sm"
            >
              {peptideA.name}
            </Link>
            <span
              aria-hidden
              className="font-mono text-sm uppercase tracking-[0.2em] text-ink-subtle"
            >
              vs
            </span>
            <Link
              href={`/peptides/${peptideB.slug}` as never}
              className="transition-colors duration-sm hover:text-brand focus-ring rounded-sm"
            >
              {peptideB.name}
            </Link>
          </h1>

          <p className="mt-6 max-w-readable text-lg leading-relaxed text-ink-muted">
            A sourced, side-by-side overview of {peptideA.name} and {peptideB.name}. The matrix
            below summarizes the research picture; the narrative dives into how clinicians reason
            about choosing between them.
          </p>
        </Container>
      </header>

      <Container className="py-12 md:py-14">
        {matrix.length > 0 ? (
          <section aria-labelledby="matrix-heading">
            <div className="flex items-baseline justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="eyebrow">At a glance</p>
                <h2
                  id="matrix-heading"
                  className="mt-1 font-serif text-display-md text-ink-strong"
                >
                  Side-by-side matrix
                </h2>
              </div>
              <Link
                href="/methodology"
                className="text-sm font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
              >
                How we compare →
              </Link>
            </div>

            <div className="mt-6 overflow-hidden rounded-md border border-line bg-paper-raised">
              <table className="w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b border-line bg-paper-sunken/60 text-left">
                    <th className="px-5 py-3 font-mono text-[11px] font-medium uppercase tracking-[0.12em] text-ink-subtle">
                      Dimension
                    </th>
                    <th className="px-5 py-3 font-serif text-lg text-ink-strong">
                      {peptideA.name}
                    </th>
                    <th className="px-5 py-3 font-serif text-lg text-ink-strong">
                      {peptideB.name}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {matrix.map((row, i) => (
                    <tr
                      key={`${row.label}-${i}`}
                      className="border-b border-line last:border-b-0"
                    >
                      <td className="px-5 py-4 align-top font-medium text-ink-strong">
                        {row.label}
                      </td>
                      <td className="px-5 py-4 align-top leading-relaxed text-ink-muted">
                        {row.a}
                      </td>
                      <td className="px-5 py-4 align-top leading-relaxed text-ink-muted">
                        {row.b}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        ) : null}

        {bodyMdx ? (
          <article className="prose-editorial mt-14 max-w-prose">
            <Mdx source={bodyMdx} />
          </article>
        ) : null}

        <DisclaimerBanner className="mt-12" />

        {faqs.length > 0 ? <FaqBlock items={faqs} /> : null}

        <section aria-label="Keep researching" className="mt-16 border-t border-line pt-10">
          <p className="eyebrow">Keep researching</p>
          <div className="mt-4 flex flex-wrap items-center gap-3">
            <Button asChild variant="secondary">
              <Link href={`/peptides/${peptideA.slug}` as never}>
                {peptideA.name} page
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href={`/peptides/${peptideB.slug}` as never}>
                {peptideB.name} page
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="ghost">
              <Link href="/compare">All comparisons</Link>
            </Button>
          </div>
        </section>
      </Container>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Compare", path: "/compare" },
          {
            name: `${peptideA.name} vs ${peptideB.name}`,
            path: `/compare/${comparison.slug}`,
          },
        ])}
      />
    </>
  );
}
