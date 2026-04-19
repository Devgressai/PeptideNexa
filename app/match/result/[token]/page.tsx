import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2 } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ProviderCard } from "@/components/content/provider-card";
import { DisclaimerBanner } from "@/components/content/disclaimer-banner";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";
import { getLeadResult } from "@/lib/db/loaders/lead";

export const dynamic = "force-dynamic";

export const metadata: Metadata = buildMetadata({
  title: "Your matched providers",
  description: "Providers that match the research goals and preferences you shared.",
  path: "/match/result",
  noIndex: true,
});

type Params = { token: string };

export default async function MatchResultPage({ params }: { params: Promise<Params> }) {
  const { token } = await params;
  const result = await getLeadResult(token);
  if (!result) notFound();

  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-10">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Find a provider", href: "/match" },
              { label: "Matches" },
            ]}
          />
          <div className="mt-4 flex items-start gap-3">
            <CheckCircle2 aria-hidden className="mt-1 h-5 w-5 text-success" />
            <div>
              <h1 className="font-serif text-display-lg text-ink">
                Thanks{result.name ? `, ${result.name}` : ""} — here are your matches
              </h1>
              <p className="mt-2 max-w-readable text-ink-muted">
                Based on what you shared, these providers are the closest fit. We&rsquo;ll follow
                up via email ({result.email}) with next steps.
              </p>
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-10">
        {result.matches.length === 0 ? (
          <EmptyMatches />
        ) : (
          <>
            <p className="text-xs uppercase tracking-wider text-ink-subtle">
              Top {result.matches.length} {result.matches.length === 1 ? "match" : "matches"}
            </p>
            <div className="mt-5 grid gap-5 md:grid-cols-2">
              {result.matches.map((provider) => (
                <ProviderCard key={provider.slug} provider={provider} />
              ))}
            </div>
            <div className="mt-10 flex flex-wrap items-center gap-3">
              <Button asChild variant="secondary">
                <Link href="/providers">Browse full directory</Link>
              </Button>
              <Button asChild variant="ghost">
                <Link href="/match">Start a new request</Link>
              </Button>
            </div>
          </>
        )}
        <div className="mt-12">
          <DisclaimerBanner />
        </div>
      </Container>
    </>
  );
}

function EmptyMatches() {
  return (
    <div className="rounded-lg border border-dashed border-line bg-paper-raised p-10">
      <p className="font-serif text-xl text-ink">
        We didn&rsquo;t find an immediate match in our directory.
      </p>
      <p className="mt-2 max-w-readable text-ink-muted">
        Our team reviews every request. We&rsquo;ll reach out if a provider comes online that fits
        your goals, or suggest alternatives you can research independently.
      </p>
      <div className="mt-6 flex flex-wrap gap-3">
        <Button asChild variant="secondary">
          <Link href="/providers">Browse full directory</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/peptides">Browse peptide library</Link>
        </Button>
      </div>
    </div>
  );
}
