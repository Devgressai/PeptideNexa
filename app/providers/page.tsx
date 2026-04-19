import type { Metadata, Route } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { ProviderCard } from "@/components/content/provider-card";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo/metadata";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, itemListSchema } from "@/lib/seo/schema";
import type { DirectoryFilter } from "@/lib/content/types";
import { searchProviders } from "@/lib/db/loaders/provider";

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
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Providers" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">Peptide providers</h1>
          <p className="mt-3 max-w-readable text-ink-muted">
            Online providers, clinics, and compounding pharmacies in the peptide space. Independently
            reviewed and clearly labeled when sponsored.
          </p>
        </Container>
      </header>

      <Container className="py-10">
        <div className="grid gap-10 lg:grid-cols-[280px_minmax(0,1fr)]">
          <FilterRail filter={filter} />
          <div>
            <div className="flex items-center justify-between">
              <p className="text-sm text-ink-muted">
                Showing <span className="font-medium text-ink">{providers.length}</span> providers
              </p>
              {/* Sort select to land in phase 2 */}
            </div>

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
    <aside aria-label="Filters" className="space-y-8">
      <FilterGroup label="Type" param="type" active={filter.type}>
        <FilterLink label="All" href="/providers" />
        <FilterLink label="Online" href="/providers?type=ONLINE" />
        <FilterLink label="Clinic" href="/providers?type=CLINIC" />
        <FilterLink label="Compounding" href="/providers?type=COMPOUNDING" />
      </FilterGroup>

      <FilterGroup label="Price tier" param="price" active={filter.priceTier}>
        <FilterLink label="All" href="/providers" />
        <FilterLink label="$" href="/providers?price=ECONOMY" />
        <FilterLink label="$$" href="/providers?price=STANDARD" />
        <FilterLink label="$$$" href="/providers?price=PREMIUM" />
      </FilterGroup>

      <FilterGroup label="Featured" param="featured" active={filter.featuredOnly ? "1" : undefined}>
        <FilterLink label="All" href="/providers" />
        <FilterLink label="Featured only" href="/providers?featured=1" />
      </FilterGroup>
    </aside>
  );
}

function FilterGroup({
  label,
  children,
}: {
  label: string;
  param: string;
  active?: string | null;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">{label}</h3>
      <ul className="mt-3 space-y-1">{children}</ul>
    </section>
  );
}

function FilterLink({ label, href }: { label: string; href: Route }) {
  return (
    <li>
      <Link href={href} className="block rounded-sm px-2 py-1 text-sm text-ink-muted hover:bg-paper-sunken hover:text-ink">
        {label}
      </Link>
    </li>
  );
}

function EmptyState() {
  return (
    <div className="mt-12 rounded-lg border border-dashed border-line bg-paper-raised p-10 text-center">
      <Badge variant="muted">No matches</Badge>
      <p className="mt-4 font-serif text-xl text-ink">No providers match these filters.</p>
      <p className="mt-2 text-sm text-ink-muted">
        Try clearing a filter or{" "}
        <Link href="/match" className="text-brand underline">
          use our matching quiz
        </Link>{" "}
        instead.
      </p>
    </div>
  );
}

