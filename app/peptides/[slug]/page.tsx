import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AlertCircle, ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { EditorialLayout } from "@/components/layout/editorial-layout";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { DisclaimerBanner } from "@/components/content/disclaimer-banner";
import { FaqBlock } from "@/components/content/faq-block";
import { SourcesList } from "@/components/content/sources-list";
import { PeptideCard } from "@/components/content/peptide-card";
import { ProviderCard } from "@/components/content/provider-card";
import { Button } from "@/components/ui/button";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, medicalWebPageSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { Mdx } from "@/lib/content/mdx";
import { TableOfContents } from "@/components/content/table-of-contents";
import { ReadingProgress } from "@/components/content/reading-progress";
import { extractMdxHeadings } from "@/lib/content/mdx-headings";
import { formatDate } from "@/lib/utils";
import { EvidenceTier } from "@/components/content/evidence-tier";
import type { PeptideDetail, PeptideSummary, ProviderSummary } from "@/lib/content/types";
import {
  getComparisonRefsBySlugs,
  type ComparisonRef,
} from "@/lib/db/loaders/comparison";
import { getProviderSummariesBySlugs } from "@/lib/db/loaders/provider";

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
  getPeptideSummariesBySlugs,
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

  // Hydrate related-content slugs into real summaries so the rails can render
  // shared cards. Each loader degrades to [] if the DB is unreachable.
  const [relatedPeptides, relatedComparisons, relatedProviders] = await Promise.all([
    getPeptideSummariesBySlugs(peptide.relatedPeptideSlugs, 3),
    getComparisonRefsBySlugs(peptide.comparisonSlugs, 3),
    getProviderSummariesBySlugs(peptide.providerSlugs, 2),
  ]);

  const aside = (
    <>
      {headings.length > 0 ? <TableOfContents items={headings} /> : null}
      <SpecCard peptide={peptide} />
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
            <p className="eyebrow">{peptide.category.name}</p>
            {peptide.goals.length > 0 ? (
              <>
                <span aria-hidden className="text-line-strong">
                  ·
                </span>
                <p className="eyebrow text-ink-subtle">
                  {peptide.goals.map((g) => g.name).join(" · ")}
                </p>
              </>
            ) : null}
          </div>
          <h1 className="mt-4 max-w-2xl font-serif text-display-xl text-ink-strong">
            {peptide.name}
          </h1>
          {peptide.aliases.length > 0 ? (
            <p className="mt-2 font-mono text-sm text-ink-subtle">
              Also known as · {peptide.aliases.join(", ")}
            </p>
          ) : null}
          <p className="mt-6 max-w-readable text-lg leading-relaxed text-ink-muted">
            {peptide.summary}
          </p>

          <BylineStrip peptide={peptide} />
        </Container>
      </header>

      <EditorialLayout aside={aside}>
        <DisclaimerBanner />
        <div className="mt-10">
          <Mdx source={peptide.bodyMdx} />
        </div>

        <SeekCareCallout />
        <FaqBlock items={peptide.faqs} />
        <SourcesList sources={peptide.sources} />
      </EditorialLayout>

      <RelatedContent
        peptide={peptide}
        relatedPeptides={relatedPeptides}
        relatedComparisons={relatedComparisons}
        relatedProviders={relatedProviders}
      />

      <NextStepBand peptide={peptide} />

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

// ─── Byline strip ─────────────────────────────────────────────────────────
// Above-the-fold trust row: author, reviewer, review date, source count,
// methodology link. Replaces the older Byline + LastUpdatedStamp combo.

function BylineStrip({ peptide }: { peptide: PeptideDetail }) {
  const { author, reviewer, lastReviewedAt, sources } = peptide;
  if (!author && !reviewer && !lastReviewedAt && sources.length === 0) return null;

  return (
    <dl className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-line py-4 text-sm">
      {author ? (
        <div className="flex items-center gap-2">
          <dt className="eyebrow">Written by</dt>
          <dd className="flex items-center gap-2 text-ink-strong">
            {author.photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={author.photoUrl}
                alt=""
                aria-hidden
                className="h-6 w-6 shrink-0 rounded-full border border-line object-cover"
              />
            ) : null}
            <span>
              <span className="font-medium">{author.name}</span>
              {author.credentials ? (
                <span className="text-ink-subtle">, {author.credentials}</span>
              ) : null}
            </span>
          </dd>
        </div>
      ) : null}
      {reviewer ? (
        <div className="flex items-center gap-2">
          <dt className="eyebrow">Reviewed by</dt>
          <dd className="flex items-center gap-2 text-ink-strong">
            {reviewer.photoUrl ? (
              /* eslint-disable-next-line @next/next/no-img-element */
              <img
                src={reviewer.photoUrl}
                alt=""
                aria-hidden
                className="h-6 w-6 shrink-0 rounded-full border border-line object-cover"
              />
            ) : null}
            <span>
              <span className="font-medium">{reviewer.name}</span>
              {reviewer.credentials ? (
                <span className="text-ink-subtle">, {reviewer.credentials}</span>
              ) : null}
            </span>
          </dd>
        </div>
      ) : null}
      {lastReviewedAt ? (
        <div className="flex items-center gap-2">
          <dt className="eyebrow">Last reviewed</dt>
          <dd>
            <time dateTime={lastReviewedAt} className="font-medium text-ink-strong">
              {formatDate(lastReviewedAt)}
            </time>
          </dd>
        </div>
      ) : null}
      <div className="flex items-center gap-2">
        <dt className="eyebrow">Sources</dt>
        <dd className="font-medium text-ink-strong">{sources.length}</dd>
      </div>
      <Link
        href="/methodology"
        className="ml-auto text-sm font-medium text-brand underline decoration-brand/35 underline-offset-[3px] transition-colors hover:decoration-brand"
      >
        How we review →
      </Link>
    </dl>
  );
}

// ─── Spec card ────────────────────────────────────────────────────────────
// Aside card with evidence tier, category, and forms. The evidence tier bar
// is the visual anchor; clicking into methodology explains the tiers.

function SpecCard({ peptide }: { peptide: PeptideDetail }) {
  const clamped = Math.min(Math.max(peptide.researchLevel, 0), 5);
  const tierLabels: Record<number, string> = {
    0: "None · theoretical",
    1: "Preclinical only",
    2: "Limited clinical",
    3: "Moderate clinical",
    4: "Strong clinical",
    5: "Extensive clinical",
  };

  return (
    <section
      aria-labelledby="at-a-glance"
      className="rounded-md border border-line bg-paper-raised p-6"
    >
      <h2 id="at-a-glance" className="eyebrow">
        At a glance
      </h2>

      <div className="mt-5">
        <p className="eyebrow text-ink-subtle">Evidence tier</p>
        <EvidenceTier level={clamped} size="md" showCount className="mt-2" />
        <p className="mt-2 text-sm text-ink-strong">{tierLabels[clamped]}</p>
      </div>

      <dl className="mt-6 space-y-3 border-t border-line pt-5 text-sm">
        <div className="flex items-start justify-between gap-4">
          <dt className="text-ink-subtle">Category</dt>
          <dd className="text-right text-ink-strong">{peptide.category.name}</dd>
        </div>
        {peptide.commonForms.length > 0 ? (
          <div className="flex items-start justify-between gap-4">
            <dt className="text-ink-subtle">Forms discussed</dt>
            <dd className="text-right font-mono text-xs uppercase tracking-wider text-ink-strong">
              {peptide.commonForms.join(" · ")}
            </dd>
          </div>
        ) : null}
      </dl>

      <p className="mt-6 border-t border-line pt-5 text-xs text-ink-muted">
        Evidence tier is an editorial judgment based on available literature.{" "}
        <Link
          href="/methodology"
          className="text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
        >
          See methodology
        </Link>
      </p>
    </section>
  );
}

// ─── Next step band ───────────────────────────────────────────────────────
// Always-rendered CTA at the end of every peptide page. Restrained visual
// weight — hairline bordered row, not a loud banner — so it doesn't break the
// editorial tone built up through the body.

function NextStepBand({ peptide }: { peptide: PeptideDetail }) {
  return (
    <section
      aria-label="Next step"
      className="border-t border-line bg-paper"
    >
      <Container className="py-14">
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center lg:gap-10">
          <div>
            <p className="eyebrow text-brand">Next step</p>
            <h2 className="mt-2 font-serif text-display-md text-ink-strong text-balance">
              Ready to talk to a clinician about {peptide.name}?
            </h2>
            <p className="mt-3 max-w-readable leading-relaxed text-ink-muted">
              Our matching quiz routes you to independently reviewed providers that fit your
              goals, state, and budget. No bulk broadcasts, no lead farms.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row lg:flex-col lg:items-end">
            <Button asChild size="lg" variant="brand">
              <Link href="/match">
                Find a provider
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/providers">Browse directory</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Related content ──────────────────────────────────────────────────────
// Three rails shown after the body: related peptides, comparisons, and
// providers. Each rail suppresses itself when empty so the layout stays tight
// even for freshly-published pages with sparse relations.

type RelatedContentProps = {
  peptide: PeptideDetail;
  relatedPeptides: PeptideSummary[];
  relatedComparisons: ComparisonRef[];
  relatedProviders: ProviderSummary[];
};

function RelatedContent({
  peptide,
  relatedPeptides,
  relatedComparisons,
  relatedProviders,
}: RelatedContentProps) {
  const hasAny =
    relatedPeptides.length > 0 ||
    relatedComparisons.length > 0 ||
    relatedProviders.length > 0;
  if (!hasAny) return null;

  return (
    <section
      aria-label={`Related to ${peptide.name}`}
      className="border-t border-line bg-paper-sunken/60"
    >
      <Container className="py-16 md:py-20">
        {relatedPeptides.length > 0 ? (
          <div>
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="eyebrow text-brand">Related peptides</p>
                <h2 className="mt-1 font-serif text-display-md text-ink-strong">
                  Continue researching
                </h2>
              </div>
              <Link
                href="/peptides"
                className="text-sm font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
              >
                All peptides →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedPeptides.map((p) => (
                <PeptideCard key={p.slug} peptide={p} />
              ))}
            </div>
          </div>
        ) : null}

        {relatedComparisons.length > 0 ? (
          <div className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="eyebrow text-brand">Side-by-side</p>
                <h2 className="mt-1 font-serif text-display-md text-ink-strong">
                  Comparisons featuring {peptide.name}
                </h2>
              </div>
              <Link
                href="/compare"
                className="text-sm font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
              >
                All comparisons →
              </Link>
            </div>
            <ul className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {relatedComparisons.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/compare/${c.slug}` as Route}
                    className="group flex h-full items-center justify-between gap-4 rounded-md border border-line bg-paper-raised px-5 py-5 transition-all duration-sm hover:border-line-strong hover:shadow-e2 focus-ring"
                  >
                    <span className="flex items-baseline gap-2.5">
                      <span className="font-serif text-lg leading-tight text-ink-strong transition-colors duration-sm group-hover:text-brand">
                        {c.peptideA.name}
                      </span>
                      <span
                        aria-hidden
                        className="font-mono text-[10px] uppercase tracking-[0.2em] text-ink-subtle"
                      >
                        vs
                      </span>
                      <span className="font-serif text-lg leading-tight text-ink-strong transition-colors duration-sm group-hover:text-brand">
                        {c.peptideB.name}
                      </span>
                    </span>
                    <ArrowRight
                      aria-hidden
                      className="h-3.5 w-3.5 shrink-0 text-ink-subtle transition-transform duration-sm group-hover:translate-x-0.5 group-hover:text-ink-strong"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ) : null}

        {relatedProviders.length > 0 ? (
          <div className="mt-14">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="eyebrow text-brand">Where to go next</p>
                <h2 className="mt-1 font-serif text-display-md text-ink-strong">
                  Providers that work with {peptide.name}
                </h2>
              </div>
              <Link
                href="/match"
                className="text-sm font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
              >
                Take the matching quiz →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {relatedProviders.map((p) => (
                <ProviderCard key={p.slug} provider={p} />
              ))}
            </div>
          </div>
        ) : null}
      </Container>
    </section>
  );
}

// ─── Seek care callout ────────────────────────────────────────────────────
// Mayo-style "when to seek care" block. Inserted after the educational body
// and before FAQ + sources. Mandatory for trust and liability framing.

function SeekCareCallout() {
  return (
    <aside
      role="note"
      className="mt-14 overflow-hidden rounded-md border border-signal/30 bg-signal-soft"
    >
      <div className="flex gap-4 p-6">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-signal/15 text-signal">
          <AlertCircle aria-hidden className="h-4 w-4" />
        </div>
        <div>
          <h3 className="font-serif text-lg leading-tight text-ink-strong">
            When to seek clinical care
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-ink-muted">
            This page is educational. Peptides discussed here can interact with medications,
            hormones, and underlying conditions. Talk to a licensed clinician before starting,
            stopping, or changing any peptide protocol — especially if you have cardiovascular,
            endocrine, or oncologic history, or are pregnant or breastfeeding.
          </p>
          <p className="mt-3 text-sm">
            <Link
              href="/match"
              className="font-medium text-ink-strong underline decoration-ink-subtle underline-offset-[3px] transition-colors hover:decoration-ink-strong hover:text-brand"
            >
              Find a credentialed clinician →
            </Link>
          </p>
        </div>
      </div>
    </aside>
  );
}
