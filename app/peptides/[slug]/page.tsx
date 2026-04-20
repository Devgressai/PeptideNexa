import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { EditorialLayout } from "@/components/layout/editorial-layout";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Byline } from "@/components/content/byline";
import { DisclaimerBanner } from "@/components/content/disclaimer-banner";
import { FaqBlock } from "@/components/content/faq-block";
import { SourcesList } from "@/components/content/sources-list";
import { LastUpdatedStamp } from "@/components/content/last-updated-stamp";
import { Badge } from "@/components/ui/badge";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { Mdx } from "@/lib/content/mdx";
import { TableOfContents } from "@/components/content/table-of-contents";
import { ReadingProgress } from "@/components/content/reading-progress";
import { extractMdxHeadings } from "@/lib/content/mdx-headings";
import type { PeptideDetail } from "@/lib/content/types";

// Category slug → brand image. Falls through to the generic hero if the
// category doesn't have a bespoke illustration yet.
const CATEGORY_IMAGES: Record<string, string> = {
  "healing-repair": "/generated/cat-healing.png",
  ghs: "/generated/cat-ghs.png",
  metabolic: "/generated/cat-metabolic.png",
  cognitive: "/generated/cat-cognitive.png",
  longevity: "/generated/cat-longevity.png",
};
const DEFAULT_PEPTIDE_IMAGE = "/generated/hero-molecular.png";
import {
  getPeptideBySlug,
  getPublishedPeptideSlugs,
} from "@/lib/db/loaders/peptide";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getPublishedPeptideSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const peptide = await getPeptideBySlug(slug);
  if (!peptide) {
    return buildMetadata({
      title: "Peptide not found",
      description: "",
      path: `/peptides/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${peptide.name} — Research overview`,
    description: peptide.summary,
    path: `/peptides/${peptide.slug}`,
    type: "article",
    publishedTime: peptide.publishedAt ?? undefined,
    modifiedTime: peptide.lastReviewedAt ?? undefined,
    authors: peptide.author ? [peptide.author.name] : undefined,
  });
}

export default async function PeptideDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const peptide = await getPeptideBySlug(slug);
  if (!peptide) notFound();

  const headings = extractMdxHeadings(peptide.bodyMdx);
  const coverImage = CATEGORY_IMAGES[peptide.category.slug] ?? DEFAULT_PEPTIDE_IMAGE;

  const aside = (
    <>
      {headings.length > 0 ? <TableOfContents items={headings} /> : null}
      <SpecCard peptide={peptide} />
      <TrustCard peptide={peptide} />
    </>
  );

  return (
    <>
      <ReadingProgress />
      <header className="relative overflow-hidden border-b border-line bg-paper">
        {/* Cover image anchored top-right, fades into the copy area. Decorative. */}
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[46%] opacity-80 lg:block"
        >
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="46vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-paper/0" />
        </div>

        <Container className="relative py-14 md:py-20">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Peptides", href: "/peptides" },
              { label: peptide.name },
            ]}
          />
          <div className="mt-6 flex flex-wrap items-center gap-2">
            <Badge variant="muted">{peptide.category.name}</Badge>
            {peptide.goals.map((goal) => (
              <Badge key={goal.slug}>{goal.name}</Badge>
            ))}
          </div>
          <h1 className="mt-5 max-w-2xl font-serif text-display-xl text-ink">{peptide.name}</h1>
          {peptide.aliases.length > 0 ? (
            <p className="mt-2 text-sm text-ink-subtle">
              Also known as {peptide.aliases.join(", ")}
            </p>
          ) : null}
          <p className="mt-6 max-w-readable text-lg text-ink-muted">{peptide.summary}</p>
          <div className="mt-7 flex flex-wrap items-center gap-6">
            <Byline author={peptide.author} reviewer={peptide.reviewer} />
            <LastUpdatedStamp date={peptide.lastReviewedAt} />
          </div>
        </Container>
      </header>

      <EditorialLayout aside={aside}>
        <DisclaimerBanner />
        <div className="mt-10">
          <Mdx source={peptide.bodyMdx} />
        </div>

        <FaqBlock items={peptide.faqs} />
        <SourcesList sources={peptide.sources} />
      </EditorialLayout>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Peptides", path: "/peptides" },
          { name: peptide.name, path: `/peptides/${peptide.slug}` },
        ])}
      />
      <JsonLd
        data={medicalWebPageSchema({
          headline: peptide.name,
          description: peptide.summary,
          path: `/peptides/${peptide.slug}`,
          datePublished: peptide.publishedAt ?? undefined,
          dateModified: peptide.lastReviewedAt ?? undefined,
          author: peptide.author
            ? { name: peptide.author.name, credentials: peptide.author.credentials ?? undefined }
            : undefined,
          reviewer: peptide.reviewer
            ? { name: peptide.reviewer.name, credentials: peptide.reviewer.credentials ?? undefined }
            : undefined,
        })}
      />
    </>
  );
}

function SpecCard({ peptide }: { peptide: PeptideDetail }) {
  return (
    <section className="rounded-lg border border-line bg-paper-raised p-6">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">At a glance</h2>
      <dl className="mt-4 space-y-3 font-mono text-sm">
        <SpecRow label="Category" value={peptide.category.name} />
        <SpecRow label="Research level" value={`${peptide.researchLevel}/5`} />
        {peptide.commonForms.length > 0 ? (
          <SpecRow label="Forms discussed" value={peptide.commonForms.join(", ")} />
        ) : null}
      </dl>
    </section>
  );
}

function SpecRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <dt className="text-ink-subtle">{label}</dt>
      <dd className="text-right text-ink">{value}</dd>
    </div>
  );
}

function TrustCard({ peptide }: { peptide: PeptideDetail }) {
  return (
    <section className="rounded-lg border border-line bg-paper p-6 text-sm text-ink-muted">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">Editorial</h2>
      <p className="mt-3">
        {peptide.sources.length} sources cited • reviewed {peptide.reviewer ? "by" : "quarterly"}
        {peptide.reviewer ? ` ${peptide.reviewer.name}` : ""}
      </p>
      <p className="mt-3">
        Our{" "}
        <Link href="/methodology" className="text-ink underline">
          methodology
        </Link>{" "}
        outlines how we research, cite, and review.
      </p>
    </section>
  );
}

