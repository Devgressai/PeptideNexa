import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { PeptideCard } from "@/components/content/peptide-card";
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

export default async function PeptidesIndexPage() {
  const peptides = await getPublishedPeptides();

  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Peptides" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">Peptide library</h1>
          <p className="mt-3 max-w-readable text-ink-muted">
            Structured, sourced summaries of peptides discussed in the research literature.
            Educational and informational — not medical advice.
          </p>
        </Container>
      </header>

      <Container className="py-12">
        {peptides.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {peptides.map((peptide) => (
              <PeptideCard key={peptide.slug} peptide={peptide} />
            ))}
          </div>
        )}

        <div className="mt-12">
          <Link
            href="/peptides/categories/ghs"
            className="text-sm font-medium text-brand hover:underline"
          >
            Browse by category →
          </Link>
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
