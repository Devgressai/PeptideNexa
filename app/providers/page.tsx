import type { Metadata, Route } from "next";
import Image from "next/image";
import Link from "next/link";
import { X } from "lucide-react";

import { Container } from "@/components/layout/container";
import { ProviderCard } from "@/components/content/provider-card";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { HeroPattern } from "@/components/content/hero-pattern";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import type { DirectoryFilter } from "@/lib/content/types";
import { searchProviders } from "@/lib/db/loaders/provider";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Peptide Providers — Online providers and clinics",
  description:
    "Browse independently reviewed peptide providers. Filter by type, state, peptide, and price tier.",
  path: "/providers",
});

// Directory filtering is URL-driven; ISR so filtered URLs cache per query.
export const revalidate = 120;

type SearchParams = {
  type?: string;
  state?: string;
  peptide?: string;
  price?: string;
  featured?: string;
};

export default async function ProvidersDirectoryPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;
  const filter = parseFilter(params);
  const providers = await searchProviders(filter);

  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-paper">
        <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[40%] opacity-70 lg:block"
        >
          <Image
            src="/generated/trust-research.png"
            alt=""
            fill
            sizes="40vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-paper/0" />
        </div>

        <Container className="relative py-14 md:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Providers" }]} />
          <p className="eyebrow mt-6">The directory</p>
          <h1 className="mt-3 max-w-2xl font-serif text-display-xl text-ink-strong text-balance">
            Peptide providers, independently reviewed.
          </h1>
          <p className="mt-6 max-w-readable text-lg leading-relaxed text-ink-muted">
            Online providers, clinics, and compounding pharmacies — every one reviewed by our
            editorial team for licensing, clarity of service, and compliance posture. Featured
            placements are clearly labeled.
          </p>
        </Container>
      </header>

      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-[260px_minmax(0,1fr)] lg:gap-14">
          <FilterRail filter={filter} />
          <div>
            <div className="flex items-end justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="eyebrow">Results</p>
                <p className="mt-1 font-mono text-xs text-ink-subtle">
                  {providers.length} {providers.length === 1 ? "provider" : "providers"}
                </p>
              </div>
              <Link
                href="/methodology"
                className="text-sm font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
              >
                How we verify →
              </Link>
            </div>

            <ActiveFilters filter={filter} />

            {providers.length === 0 ? (
              <EmptyState />
            ) : (
              <div className="mt-6 grid gap-5 md:grid-cols-2">
                {providers.map((provider) => (
                  <ProviderCard key={provider.slug} provider={provider} />
                ))}
              </div>
            )}
          </div>
        </div>
      </Container>

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Providers", path: "/providers" },
        ])}
      />
      {providers.length > 0 ? (
        <JsonLd
          data={itemListSchema(
            "Peptide provider directory",
            providers.map((p) => ({ name: p.name, path: `/providers/${p.slug}` })),
          )}
        />
      ) : null}
    </>
  );
}

// Chip row that echoes the active filters inline above the grid with a
// "clear each" affordance. Stays hidden when no filters are set.

const TYPE_CHIP_LABEL: Record<NonNullable<DirectoryFilter["type"]>, string> = {
  ONLINE: "Online",
  CLINIC: "In-person clinic",
  COMPOUNDING: "Compounding pharmacy",
};

const PRICE_CHIP_LABEL: Record<NonNullable<DirectoryFilter["priceTier"]>, string> = {
  ECONOMY: "Price · $",
  STANDARD: "Price · $$",
  PREMIUM: "Price · $$$",
};

type ActiveFilter = { label: string; href: string };

function ActiveFilters({ filter }: { filter: DirectoryFilter }) {
  const active: ActiveFilter[] = [];
  if (filter.type) {
    active.push({
      label: TYPE_CHIP_LABEL[filter.type],
      href: buildFilterHref(filter, { type: undefined }),
    });
  }
  if (filter.state) {
    active.push({
      label: `State · ${filter.state}`,
      href: buildFilterHref(filter, { state: undefined }),
    });
  }
  if (filter.priceTier) {
    active.push({
      label: PRICE_CHIP_LABEL[filter.priceTier],
      href: buildFilterHref(filter, { priceTier: undefined }),
    });
  }
  if (filter.featuredOnly) {
    active.push({
      label: "Featured only",
      href: buildFilterHref(filter, { featuredOnly: false }),
    });
  }

  if (active.length === 0) return null;

  return (
    <div className="mt-5 flex flex-wrap items-center gap-2 text-[12px]">
      <p className="eyebrow mr-1">Active filters</p>
      {active.map((chip) => (
        <Link
          key={chip.label}
          href={chip.href as Route}
          className="group inline-flex items-center gap-1.5 rounded-sm border border-brand/25 bg-brand-soft px-2 py-0.5 font-medium text-brand-deep transition-colors duration-sm hover:border-brand/50 focus-ring"
        >
          {chip.label}
          <X aria-hidden className="h-3 w-3 opacity-60 transition-opacity group-hover:opacity-100" />
        </Link>
      ))}
      <Link
        href="/providers"
        className="ml-1 text-xs font-medium text-ink-muted underline decoration-ink-faint underline-offset-[3px] transition-colors hover:text-ink-strong hover:decoration-ink-muted"
      >
        Clear all
      </Link>
    </div>
  );
}

function buildFilterHref(
  current: DirectoryFilter,
  overrides: Partial<DirectoryFilter>,
): string {
  const next: DirectoryFilter = { ...current, ...overrides };
  const params = new URLSearchParams();
  if (next.type) params.set("type", next.type);
  if (next.state) params.set("state", next.state);
  if (next.priceTier) params.set("price", next.priceTier);
  if (next.featuredOnly) params.set("featured", "1");
  const qs = params.toString();
  return qs ? `/providers?${qs}` : "/providers";
}

function parseFilter(params: SearchParams): DirectoryFilter {
  return {
    type: asProviderType(params.type),
    state: params.state?.toUpperCase().slice(0, 2),
    peptide: params.peptide?.toLowerCase(),
    priceTier: asPriceTier(params.price),
    featuredOnly: params.featured === "1",
  };
}

function asProviderType(value: string | undefined): DirectoryFilter["type"] {
  if (value === "ONLINE" || value === "CLINIC" || value === "COMPOUNDING") return value;
  return undefined;
}

function asPriceTier(value: string | undefined): DirectoryFilter["priceTier"] {
  if (value === "ECONOMY" || value === "STANDARD" || value === "PREMIUM") return value;
  return undefined;
}

function FilterRail({ filter }: { filter: DirectoryFilter }) {
  return (
    <aside aria-label="Filters" className="space-y-8 lg:sticky lg:top-24 lg:self-start">
      <FilterGroup label="Type">
        <FilterLink label="All types" href="/providers" active={!filter.type} />
        <FilterLink
          label="Online"
          href="/providers?type=ONLINE"
          active={filter.type === "ONLINE"}
        />
        <FilterLink
          label="In-person clinic"
          href="/providers?type=CLINIC"
          active={filter.type === "CLINIC"}
        />
        <FilterLink
          label="Compounding pharmacy"
          href="/providers?type=COMPOUNDING"
          active={filter.type === "COMPOUNDING"}
        />
      </FilterGroup>

      <FilterGroup label="Price tier">
        <FilterLink label="Any" href="/providers" active={!filter.priceTier} />
        <FilterLink
          label="Economy · $"
          href="/providers?price=ECONOMY"
          active={filter.priceTier === "ECONOMY"}
        />
        <FilterLink
          label="Standard · $$"
          href="/providers?price=STANDARD"
          active={filter.priceTier === "STANDARD"}
        />
        <FilterLink
          label="Premium · $$$"
          href="/providers?price=PREMIUM"
          active={filter.priceTier === "PREMIUM"}
        />
      </FilterGroup>

      <FilterGroup label="State">
        <FilterLink label="All states" href="/providers" active={!filter.state} />
        <FilterLink
          label="California"
          href="/providers?state=CA"
          active={filter.state === "CA"}
        />
        <FilterLink
          label="Florida"
          href="/providers?state=FL"
          active={filter.state === "FL"}
        />
        <FilterLink
          label="Texas"
          href="/providers?state=TX"
          active={filter.state === "TX"}
        />
        <FilterLink
          label="New York"
          href="/providers?state=NY"
          active={filter.state === "NY"}
        />
        <FilterLink
          label="Arizona"
          href="/providers?state=AZ"
          active={filter.state === "AZ"}
        />
      </FilterGroup>

      <FilterGroup label="Editorial">
        <FilterLink label="All listed" href="/providers" active={!filter.featuredOnly} />
        <FilterLink
          label="Featured only"
          href="/providers?featured=1"
          active={filter.featuredOnly === true}
        />
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="eyebrow">{label}</h3>
      <ul className="mt-3 space-y-0.5">{children}</ul>
    </section>
  );
}

function FilterLink({
  label,
  href,
  active,
}: {
  label: string;
  href: Route;
  active?: boolean;
}) {
  return (
    <li>
      <Link
        href={href}
        aria-current={active ? "page" : undefined}
        className={cn(
          "flex items-center justify-between rounded-sm px-2 py-1.5 text-sm transition-colors duration-sm focus-ring",
          active
            ? "bg-brand-soft font-medium text-brand-deep"
            : "text-ink-muted hover:bg-paper-sunken hover:text-ink-strong",
        )}
      >
        <span>{label}</span>
        {active ? (
          <span aria-hidden className="font-mono text-xs">
            ✓
          </span>
        ) : null}
      </Link>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="mt-8 rounded-md border border-dashed border-line-strong bg-paper-raised p-12 text-center">
      <p className="eyebrow">No matches</p>
      <p className="mt-3 font-serif text-xl text-ink-strong">
        No providers match these filters.
      </p>
      <p className="mt-2 text-sm text-ink-muted">
        Try clearing a filter or{" "}
        <Link
          href="/match"
          className="font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
        >
          use our matching quiz
        </Link>{" "}
        instead.
      </p>
    </div>
  );
}
