import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { PeptideLibrary } from "@/components/content/peptide-library";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { buildMetadata } from "@/lib/seo/metadata";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import { getPublishedPeptides } from "@/lib/db/loaders/peptide";

export const metadata: Metadata = buildMetadata({
  title: "Peptide library — research summaries and category overviews",
  description:
    "Browse structured peptide summaries. Every entry is independently written, reviewed, and sourced.",
  path: "/peptides",
});

// ISR — revalidate at most every 5 minutes; on-demand revalidation fires from
// the admin publish action once that lands.
export const revalidate = 300;

const CATEGORY_CHIPS: Array<{ label: string; href: string }> = [
  { label: "Healing & repair", href: "/peptides/categories/healing-repair" },
  { label: "Growth hormone secretagogues", href: "/peptides/categories/ghs" },
  { label: "Metabolic", href: "/peptides/categories/metabolic" },
  { label: "Cognitive", href: "/peptides/categories/cognitive" },
  { label: "Longevity", href: "/peptides/categories/longevity" },
  { label: "Immune & inflammation", href: "/peptides/categories/immune" },
];

export default async function PeptidesIndexPage() {
  const peptides = await getPublishedPeptides();

  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-paper">
        <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[42%] opacity-70 lg:block"
        >
          <Image
            src="/generated/hero-molecular.png"
            alt=""
            fill
            sizes="42vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-paper/0" />
        </div>

        <Container className="relative py-14 md:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Peptides" }]} />
          <p className="eyebrow mt-6">The library</p>
          <h1 className="mt-3 max-w-2xl font-serif text-display-xl text-ink-strong text-balance">
            Structured, sourced peptide research summaries.
          </h1>
          <p className="mt-6 max-w-readable text-lg leading-relaxed text-ink-muted">
            Every peptide page lists the sources behind its claims and is reviewed by a clinically
            credentialed advisor. Educational and informational — not medical advice.
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-2">
            {CATEGORY_CHIPS.map((chip) => (
              <Link
                key={chip.href}
                href={chip.href as never}
                className="inline-flex items-center rounded-sm border border-line bg-paper-raised px-3 py-1.5 text-[12px] font-medium text-ink-muted transition-colors duration-sm hover:border-line-strong hover:bg-paper-sunken hover:text-ink-strong focus-ring"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </Container>
      </header>

      <Container className="py-14 md:py-16">
        <Reveal>
          {peptides.length === 0 ? <EmptyState /> : <PeptideLibrary peptides={peptides} />}
        </Reveal>
      </Container>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Peptides", path: "/peptides" },
        ])}
      />
      {peptides.length > 0 ? (
        <JsonLd
          data={itemListSchema(
            "Peptide library",
            peptides.map((p) => ({ name: p.name, path: `/peptides/${p.slug}` })),
          )}
        />
      ) : null}
    </>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-md border border-dashed border-line-strong bg-paper-raised p-12 text-center text-ink-muted">
      <p className="font-serif text-xl text-ink-strong">No peptides published yet.</p>
      <p className="mt-2 text-sm">
        Content is still being prepared. Subscribe to the{" "}
        <Link
          href="/"
          className="font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
        >
          research digest
        </Link>{" "}
        to be notified as the library opens.
      </p>
    </div>
  );
}
