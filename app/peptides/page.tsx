import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { PeptideCard } from "@/components/content/peptide-card";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
import { JsonLd } from "@/components/seo/json-ld";
import { Badge } from "@/components/ui/badge";
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
          <Badge variant="muted" className="mt-6">
            The library
          </Badge>
          <h1 className="mt-5 max-w-2xl font-serif text-display-xl text-ink">
            Structured, sourced peptide research summaries.
          </h1>
          <p className="mt-6 max-w-readable text-lg text-ink-muted">
            Every peptide page lists the sources behind its claims and is reviewed by a clinically
            credentialed advisor. Educational and informational — not medical advice.
          </p>
        </Container>
      </header>

      <Container className="py-16">
        <Reveal>
          {peptides.length === 0 ? (
            <EmptyState />
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {peptides.map((peptide) => (
                <PeptideCard key={peptide.slug} peptide={peptide} />
              ))}
            </div>
          )}
        </Reveal>

        <div className="mt-14 border-t border-line pt-10">
          <p className="text-xs uppercase tracking-wider text-ink-subtle">Or browse another way</p>
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
            <Link
              href="/peptides/categories/healing-repair"
              className="font-medium text-ink hover:text-brand"
            >
              Healing & repair →
            </Link>
            <Link
              href="/peptides/categories/ghs"
              className="font-medium text-ink hover:text-brand"
            >
              Growth hormone secretagogues →
            </Link>
            <Link
              href="/peptides/categories/longevity"
              className="font-medium text-ink hover:text-brand"
            >
              Longevity →
            </Link>
            <Link
              href="/peptides/categories/cognitive"
              className="font-medium text-ink hover:text-brand"
            >
              Cognitive →
            </Link>
          </div>
        </div>
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
    <div className="rounded-lg border border-dashed border-line bg-paper-raised p-10 text-center text-ink-muted">
      <p className="font-serif text-xl text-ink">No peptides published yet.</p>
      <p className="mt-2 text-sm">
        Content is still being prepared. Subscribe to the{" "}
        <Link href="/" className="text-brand underline">
          research digest
        </Link>{" "}
        to be notified as the library opens.
      </p>
    </div>
  );
}
