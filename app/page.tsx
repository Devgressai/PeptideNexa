import Link from "next/link";
import type { Metadata } from "next";
import { ArrowRight } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PeptideCard } from "@/components/content/peptide-card";
import { ProviderCard } from "@/components/content/provider-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { buildMetadata } from "@/lib/seo/metadata";
import type { PeptideSummary, ProviderSummary } from "@/lib/content/types";
import { getFeaturedPeptides } from "@/lib/db/loaders/peptide";
import { getFeaturedProviders } from "@/lib/db/loaders/provider";

export const metadata: Metadata = buildMetadata({
  title: "PeptideNexa — Research peptides. Compare providers.",
  description:
    "An editorial and directory platform for peptide research and provider discovery. Independent, structured, and sourced.",
  path: "/",
});

// Homepage revalidates relatively eagerly — when a peptide or provider is
// published, users should see it appear within a few minutes without waiting
// for on-demand revalidation.
export const revalidate = 120;

export default async function HomePage() {
  const [featuredPeptides, featuredProviders] = await Promise.all([
    getFeaturedPeptides(3),
    getFeaturedProviders(4),
  ]);

  return (
    <>
      <Hero />
      <FeaturedPeptides peptides={featuredPeptides} />
      <FeaturedProviders providers={featuredProviders} />
      <MethodologyBand />
      <NewsletterBand />
    </>
  );
}

function Hero() {
  return (
    <section className="border-b border-line bg-paper">
      <Container className="py-20 md:py-28">
        <div className="max-w-3xl">
          <Badge variant="muted">Independent. Editorial. Sourced.</Badge>
          <h1 className="mt-6 font-serif text-display-xl text-ink">
            Research peptides. Compare providers. Decide with confidence.
          </h1>
          <p className="mt-6 max-w-readable text-lg leading-relaxed text-ink-muted">
            PeptideNexa is an editorial and directory platform for peptide research and provider
            discovery. We are not a medical provider — we help you get oriented and find credible
            ones.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href="/match">
                Find a provider
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <Link href="/peptides">Browse peptides</Link>
            </Button>
          </div>
        </div>
      </Container>
    </section>
  );
}

function FeaturedPeptides({ peptides }: { peptides: PeptideSummary[] }) {
  if (peptides.length === 0) return null;
  return (
    <section aria-labelledby="featured-peptides" className="border-b border-line">
      <Container className="py-16 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-subtle">Peptide library</p>
            <h2 id="featured-peptides" className="mt-2 font-serif text-display-lg text-ink">
              Start with the fundamentals
            </h2>
          </div>
          <Link
            href="/peptides"
            className="hidden text-sm font-medium text-ink hover:text-brand md:inline-flex"
          >
            Browse all peptides →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {peptides.map((peptide) => (
            <PeptideCard key={peptide.slug} peptide={peptide} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function FeaturedProviders({ providers }: { providers: ProviderSummary[] }) {
  if (providers.length === 0) return null;
  return (
    <section aria-labelledby="featured-providers" className="border-b border-line bg-paper-raised">
      <Container className="py-16 md:py-20">
        <div className="flex items-end justify-between gap-6">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-subtle">Provider directory</p>
            <h2 id="featured-providers" className="mt-2 font-serif text-display-lg text-ink">
              Independently reviewed providers
            </h2>
          </div>
          <Link
            href="/providers"
            className="hidden text-sm font-medium text-ink hover:text-brand md:inline-flex"
          >
            Browse directory →
          </Link>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {providers.map((provider) => (
            <ProviderCard key={provider.slug} provider={provider} />
          ))}
        </div>
      </Container>
    </section>
  );
}

function MethodologyBand() {
  return (
    <section aria-labelledby="methodology" className="border-b border-line">
      <Container className="py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-subtle">How we work</p>
            <h2 id="methodology" className="mt-2 font-serif text-display-md text-ink">
              Transparent, sourced, and reviewed.
            </h2>
          </div>
          <div className="grid gap-8 md:grid-cols-3">
            <MethodologyItem
              title="Cited research"
              body="Every peptide page lists the sources behind each claim. We cite peer-reviewed and primary literature where available."
            />
            <MethodologyItem
              title="Clinical review"
              body="Peptide pages are reviewed by clinically credentialed advisors before publication and re-reviewed quarterly."
            />
            <MethodologyItem
              title="Labeled commerce"
              body="Featured and affiliate placements are visibly labeled. Editorial rankings are independent of payment."
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

function MethodologyItem({ title, body }: { title: string; body: string }) {
  return (
    <div>
      <h3 className="font-medium text-ink">{title}</h3>
      <p className="mt-2 text-sm text-ink-muted">{body}</p>
    </div>
  );
}

function NewsletterBand() {
  return (
    <section aria-labelledby="newsletter" className="bg-paper-sunken">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
          <div>
            <p className="text-xs uppercase tracking-wider text-ink-subtle">Research digest</p>
            <h2 id="newsletter" className="mt-2 font-serif text-display-md text-ink">
              Short, careful updates. No hype.
            </h2>
            <p className="mt-4 max-w-readable text-ink-muted">
              A monthly dispatch on peptide research, provider news, and category shifts. Written by
              our editorial team, not a content mill.
            </p>
          </div>
          <NewsletterForm source="homepage" />
        </div>
      </Container>
    </section>
  );
}
