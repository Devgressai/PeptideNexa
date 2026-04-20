import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CheckCircle2, Clock3, Mail, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { ProviderCard } from "@/components/content/provider-card";
import { DisclaimerBanner } from "@/components/content/disclaimer-banner";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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

export default async function MatchResultPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { token } = await params;
  const result = await getLeadResult(token);
  if (!result) notFound();

  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-paper">
        <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />

        <Container className="relative py-14 md:py-20">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Find a provider", href: "/match" },
              { label: "Matches" },
            ]}
          />

          <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-success/30 bg-success/10 px-3 py-1 text-xs font-medium text-success">
            <CheckCircle2 aria-hidden className="h-3.5 w-3.5" />
            Request received
          </div>

          <h1 className="mt-5 max-w-3xl font-serif text-display-xl text-ink">
            {result.name ? `Thanks, ${result.name}. ` : "Thanks. "}
            Here&rsquo;s who we&rsquo;ve matched for you.
          </h1>

          <p className="mt-6 max-w-readable text-lg text-ink-muted">
            Based on what you shared
            {result.locationState ? ` from ${result.locationState}` : ""}, these providers are the
            closest fit. We&rsquo;ve sent them your details and you&rsquo;ll hear from them directly.
          </p>

          <dl className="mt-8 grid gap-4 text-sm text-ink-muted sm:grid-cols-3">
            <div className="flex items-start gap-2">
              <Mail aria-hidden className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                <dt className="text-xs uppercase tracking-wider text-ink-subtle">Contact email</dt>
                <dd className="mt-0.5 text-ink">{result.email}</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Clock3 aria-hidden className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                <dt className="text-xs uppercase tracking-wider text-ink-subtle">Response time</dt>
                <dd className="mt-0.5 text-ink">Within 2 hours, typically</dd>
              </div>
            </div>
            <div className="flex items-start gap-2">
              <Sparkles aria-hidden className="mt-0.5 h-4 w-4 text-brand" />
              <div>
                <dt className="text-xs uppercase tracking-wider text-ink-subtle">Next step</dt>
                <dd className="mt-0.5 text-ink">A provider will reach out directly</dd>
              </div>
            </div>
          </dl>
        </Container>
      </header>

      <Container className="py-16">
        {result.matches.length === 0 ? (
          <EmptyMatches />
        ) : (
          <>
            <Reveal>
              <div className="flex items-end justify-between gap-6">
                <div>
                  <Badge variant="brand">Top matches</Badge>
                  <h2 className="mt-3 font-serif text-display-md text-ink">
                    {result.matches.length} {result.matches.length === 1 ? "provider" : "providers"}{" "}
                    matched
                  </h2>
                </div>
                <p className="hidden text-sm text-ink-subtle sm:block">
                  Ranked by fit, not by payment.
                </p>
              </div>
            </Reveal>

            <Reveal delay={0.04}>
              <div className="mt-8 grid gap-5 md:grid-cols-2">
                {result.matches.map((provider) => (
                  <ProviderCard key={provider.slug} provider={provider} />
                ))}
              </div>
            </Reveal>

            <Reveal delay={0.12}>
              <div className="mt-12 flex flex-wrap items-center gap-3 border-t border-line pt-8">
                <Button asChild variant="secondary">
                  <Link href="/providers">Browse the full directory</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/match">Start a new request</Link>
                </Button>
                <Button asChild variant="ghost">
                  <Link href="/peptides">Back to peptide library</Link>
                </Button>
              </div>
            </Reveal>
          </>
        )}

        <Reveal delay={0.14}>
          <div className="mt-14">
            <DisclaimerBanner />
          </div>
        </Reveal>
      </Container>
    </>
  );
}

function EmptyMatches() {
  return (
    <Reveal>
      <div className="rounded-lg border border-dashed border-line bg-paper-raised p-10">
        <Badge variant="muted">Reviewing</Badge>
        <p className="mt-4 font-serif text-2xl text-ink">
          We didn&rsquo;t find an immediate match in our directory.
        </p>
        <p className="mt-3 max-w-readable text-ink-muted">
          Every request is reviewed by our editorial team. If a provider on our bench looks like
          a fit, we&rsquo;ll reach out via email. Otherwise we&rsquo;ll suggest alternatives you
          can research independently.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Button asChild variant="secondary">
            <Link href="/providers">Browse full directory</Link>
          </Button>
          <Button asChild variant="ghost">
            <Link href="/peptides">Browse peptide library</Link>
          </Button>
        </div>
      </div>
    </Reveal>
  );
}
