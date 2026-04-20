import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Search as SearchIcon } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Search — peptides, providers, and guides",
  description:
    "Search PeptideNexa's library of peptides, providers, comparisons, and editorial guides.",
  path: "/search",
  noIndex: true,
});

type SearchParams = Promise<{ q?: string }>;

type ResultGroup = {
  heading: string;
  description: string;
  href: string;
  browseLabel: string;
};

const RESULT_GROUPS: ResultGroup[] = [
  {
    heading: "Peptides",
    description: "Mechanism, forms, evidence tier, sources.",
    href: "/peptides",
    browseLabel: "Browse the library",
  },
  {
    heading: "Providers",
    description: "Online clinics, in-person, compounding — independently reviewed.",
    href: "/providers",
    browseLabel: "Browse the directory",
  },
  {
    heading: "Guides",
    description: "Editorial essays and research reading guides.",
    href: "/guides",
    browseLabel: "Read the guides",
  },
  {
    heading: "Comparisons",
    description: "Side-by-side matrices for peptides that readers research together.",
    href: "/compare",
    browseLabel: "Browse comparisons",
  },
];

// Meilisearch-backed results land in epic E7. This page scaffolds the final
// result layout so the URL, header, and empty-state already read as production.

export default async function SearchPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;
  const query = (params.q ?? "").trim();
  const hasQuery = query.length > 0;

  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12 md:py-16">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Search" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink-strong">
            Search PeptideNexa
          </h1>
          <p className="mt-3 max-w-readable text-ink-muted">
            Federated search across peptides, providers, comparisons, and guides.
          </p>

          <form
            role="search"
            action="/search"
            method="get"
            className="mt-8 flex max-w-2xl items-center gap-2"
          >
            <label htmlFor="q" className="sr-only">
              Search query
            </label>
            <div className="relative flex-1">
              <SearchIcon
                aria-hidden
                className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-subtle"
              />
              <Input
                id="q"
                name="q"
                type="search"
                defaultValue={query}
                placeholder="Search peptides, providers, or guides…"
                autoComplete="off"
                className="h-12 pl-10 text-base"
              />
            </div>
            <Button type="submit" size="lg" variant="brand">
              Search
            </Button>
          </form>
        </Container>
      </header>

      <Container className="py-14">
        {hasQuery ? (
          <ResultsForQuery query={query} />
        ) : (
          <BrowseFallback />
        )}
      </Container>
    </>
  );
}

function ResultsForQuery({ query }: { query: string }) {
  return (
    <div className="space-y-10">
      <section aria-label="Search status">
        <p className="eyebrow">Results for</p>
        <p className="mt-1 font-serif text-2xl text-ink-strong">&ldquo;{query}&rdquo;</p>
        <div className="mt-6 rounded-md border border-line bg-paper-sunken p-6 text-sm leading-relaxed text-ink-muted">
          Full-text search lands with our next release. Until then, the result groups below point
          to the relevant sections of the site — each may contain matches for your query.
        </div>
      </section>

      <ul className="grid gap-6 md:grid-cols-2">
        {RESULT_GROUPS.map((group) => (
          <li key={group.heading}>
            <ResultGroupCard group={group} showCount />
          </li>
        ))}
      </ul>
    </div>
  );
}

function BrowseFallback() {
  return (
    <div>
      <div className="max-w-readable">
        <p className="eyebrow text-brand">Browse by area</p>
        <h2 className="mt-2 font-serif text-display-md text-ink-strong">
          Not sure where to start?
        </h2>
        <p className="mt-3 text-ink-muted">
          Each area of the site is independently organized. Jump to the one that matches what
          you&rsquo;re researching.
        </p>
      </div>
      <ul className="mt-10 grid gap-6 md:grid-cols-2">
        {RESULT_GROUPS.map((group) => (
          <li key={group.heading}>
            <ResultGroupCard group={group} />
          </li>
        ))}
      </ul>
    </div>
  );
}

function ResultGroupCard({
  group,
  showCount,
}: {
  group: ResultGroup;
  showCount?: boolean;
}) {
  return (
    <Link
      href={group.href as never}
      className="group flex items-start justify-between gap-4 rounded-md border border-line bg-paper-raised p-6 transition-all duration-sm hover:border-line-strong hover:shadow-e2 focus-ring"
    >
      <div>
        <div className="flex items-center gap-3">
          <h3 className="font-serif text-xl leading-tight text-ink-strong transition-colors duration-sm group-hover:text-brand">
            {group.heading}
          </h3>
          {showCount ? (
            <span className="rounded-sm bg-paper-sunken px-1.5 py-0.5 font-mono text-[11px] text-ink-subtle">
              0 matches
            </span>
          ) : null}
        </div>
        <p className="mt-2 text-sm leading-relaxed text-ink-muted">
          {group.description}
        </p>
        <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-ink-strong transition-colors duration-sm group-hover:text-brand">
          {group.browseLabel}
          <ArrowRight
            aria-hidden
            className="h-3.5 w-3.5 transition-transform duration-sm group-hover:translate-x-0.5"
          />
        </span>
      </div>
    </Link>
  );
}
