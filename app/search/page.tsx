import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Input } from "@/components/ui/input";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Search — peptides, providers, and guides",
  description: "Search PeptideNexa's library of peptides, providers, comparisons, and editorial guides.",
  path: "/search",
  noIndex: true,
});

// Meilisearch-backed search lands under epic E7. This shell exists so typedRoutes
// accepts header and footer links today.
export default function SearchPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">Search</h1>
          <p className="mt-3 max-w-readable text-ink-muted">
            Federated search across peptides, providers, comparisons, and guides.
          </p>
        </Container>
      </header>
      <Container className="py-12">
        <form role="search" action="/search" method="get" className="max-w-xl">
          <label htmlFor="q" className="sr-only">
            Search query
          </label>
          <Input
            id="q"
            name="q"
            type="search"
            placeholder="Search peptides, providers, or guides…"
            autoComplete="off"
          />
        </form>
        <p className="mt-8 text-sm text-ink-subtle">
          Full-text results arrive with the Meilisearch pipeline. Until then, start from the{" "}
          <Link className="text-brand underline" href="/peptides">
            peptide library
          </Link>{" "}
          or the{" "}
          <Link className="text-brand underline" href="/providers">
            provider directory
          </Link>
          .
        </p>
      </Container>
    </>
  );
}
