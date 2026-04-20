import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Check, ExternalLink, Info, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Button } from "@/components/ui/button";
import { LeadForm } from "@/components/forms/lead-form";
import { PeptideCard } from "@/components/content/peptide-card";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbSchema, providerSchema } from "@/lib/seo/schema";
import { buildMetadata } from "@/lib/seo/metadata";
import { formatDate } from "@/lib/utils";
import type { ProviderDetail } from "@/lib/content/types";
import {
  getListedProviderSlugs,
  getProviderBySlug,
} from "@/lib/db/loaders/provider";
import { getPeptideSummariesBySlugs } from "@/lib/db/loaders/peptide";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getListedProviderSlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) {
    return buildMetadata({
      title: "Provider not found",
      description: "",
      path: `/providers/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${provider.name} — Review & profile`,
    description: provider.shortDescription,
    path: `/providers/${provider.slug}`,
  });
}

const TYPE_LABEL: Record<ProviderDetail["type"], string> = {
  ONLINE: "Online provider",
  CLINIC: "In-person clinic",
  COMPOUNDING: "Compounding pharmacy",
};

const PRICE_LABEL: Record<NonNullable<ProviderDetail["priceTier"]>, string> = {
  ECONOMY: "Economy ($)",
  STANDARD: "Standard ($$)",
  PREMIUM: "Premium ($$$)",
};

const VERIFICATION_ITEMS = [
  {
    label: "License verified",
    detail: "State medical board verification on file.",
  },
  {
    label: "State coverage confirmed",
    detail: "Serviceable states cross-checked against public filings.",
  },
  {
    label: "Pricing transparency",
    detail: "Plan structure and baseline pricing publicly accessible.",
  },
  {
    label: "Sourcing reviewed",
    detail: "Compounding relationships and sourcing practices disclosed.",
  },
] as const;

export default async function ProviderDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const provider = await getProviderBySlug(slug);
  if (!provider) notFound();

  const outboundHref = provider.affiliateUrl ?? provider.websiteUrl;
  const isAffiliate = Boolean(provider.affiliateUrl);

  // Hydrate the peptides this provider works with so we can render PeptideCards
  // (shared trust pattern) instead of a bare slug list.
  const offeredPeptides = await getPeptideSummariesBySlugs(provider.peptideSlugs, 6);

  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-paper">
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
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/80 to-paper/0" />
        </div>

        <Container className="relative py-12 md:py-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Providers", href: "/providers" },
              { label: provider.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
            <div className="max-w-2xl">
              <div className="flex flex-wrap items-center gap-3">
                <p className="eyebrow">{TYPE_LABEL[provider.type]}</p>
                {provider.featured ? (
                  <span className="inline-flex items-center gap-1.5 rounded-sm border border-signal/30 bg-signal-soft px-2 py-0.5 text-[10.5px] font-medium uppercase tracking-[0.1em] text-signal">
                    <span aria-hidden className="h-1 w-1 rounded-full bg-signal" />
                    Featured · Labeled commerce
                  </span>
                ) : null}
                {provider.verified ? (
                  <span className="inline-flex items-center gap-1 rounded-sm bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
                    <ShieldCheck aria-hidden className="h-3 w-3" />
                    Verified
                  </span>
                ) : null}
              </div>

              <h1 className="mt-4 font-serif text-display-lg text-ink-strong">
                {provider.name}
              </h1>
              <p className="mt-4 max-w-readable text-lg leading-relaxed text-ink-muted">
                {provider.shortDescription}
              </p>

              <VerificationStrip provider={provider} />
            </div>

            <div className="flex w-full flex-col items-stretch gap-2 sm:flex-row lg:w-auto lg:flex-col lg:items-end">
              <Button asChild size="lg" variant="brand">
                <a
                  href={outboundHref}
                  rel="sponsored nofollow noopener"
                  target="_blank"
                >
                  Visit {provider.name}
                  <ExternalLink aria-hidden className="h-4 w-4" />
                </a>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#contact">Request information</Link>
              </Button>
              {isAffiliate ? (
                <p className="max-w-[18rem] text-[11px] leading-snug text-ink-subtle lg:text-right">
                  <Info aria-hidden className="mb-0.5 mr-1 inline h-3 w-3" />
                  Affiliate link. We may earn a commission; editorial coverage is independent.{" "}
                  <Link
                    href="/legal/affiliate-disclosure"
                    className="underline decoration-ink-subtle underline-offset-[2px] hover:decoration-ink-strong"
                  >
                    Disclosure
                  </Link>
                </p>
              ) : null}
            </div>
          </div>
        </Container>
      </header>

      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="prose-editorial max-w-prose">
            <h2>Editorial note</h2>
            <p>
              {provider.editorialNote ??
                "Our team reviews providers for public information, licensing posture, and clarity of service. This is an independent assessment — not a medical recommendation."}
            </p>
            <h2>About {provider.name}</h2>
            <p>
              {provider.bodyMdx ??
                "Extended editorial overview will appear here once the provider body is populated."}
            </p>
          </article>

          <aside className="space-y-6">
            <VerificationCard provider={provider} />

            <section
              id="contact"
              className="rounded-md border border-line bg-paper-raised p-6"
            >
              <h2 className="font-serif text-lg text-ink-strong">Request information</h2>
              <p className="mt-1 text-sm text-ink-muted">
                We&rsquo;ll pass your details to {provider.name} and follow up with alternatives
                if needed.
              </p>
              <div className="mt-5">
                <LeadForm source={`provider:${provider.slug}`} compact />
              </div>
            </section>
          </aside>
        </div>
      </Container>

      {offeredPeptides.length > 0 ? (
        <section
          aria-label={`Peptides ${provider.name} works with`}
          className="border-t border-line bg-paper-sunken/60"
        >
          <Container className="py-16 md:py-20">
            <div className="flex flex-wrap items-end justify-between gap-4 border-b border-line pb-5">
              <div>
                <p className="eyebrow text-brand">Peptides referenced</p>
                <h2 className="mt-1 font-serif text-display-md text-ink-strong">
                  What {provider.name} works with
                </h2>
              </div>
              <Link
                href="/peptides"
                className="text-sm font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
              >
                Full library →
              </Link>
            </div>
            <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {offeredPeptides.map((p) => (
                <PeptideCard key={p.slug} peptide={p} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <JsonLd
        data={breadcrumbSchema([
          { name: "Home", path: "/" },
          { name: "Providers", path: "/providers" },
          { name: provider.name, path: `/providers/${provider.slug}` },
        ])}
      />
      <JsonLd
        data={providerSchema({
          name: provider.name,
          path: `/providers/${provider.slug}`,
          description: provider.shortDescription,
          websiteUrl: provider.websiteUrl,
          city: provider.city,
          state: provider.state,
        })}
      />
    </>
  );
}

// ─── Verification strip ──────────────────────────────────────────────────
// Hairline-ruled row under the title: verified state, last-verified date,
// coverage, and pricing transparency — mirrors the peptide ByLineStrip.

function VerificationStrip({ provider }: { provider: ProviderDetail }) {
  const coverage =
    provider.type === "ONLINE"
      ? provider.servesStates.length > 0
        ? `${provider.servesStates.length} states`
        : "Nationwide"
      : [provider.city, provider.state].filter(Boolean).join(", ");

  return (
    <dl className="mt-7 flex flex-wrap items-center gap-x-7 gap-y-3 border-y border-line py-4 text-sm">
      {provider.lastVerifiedAt ? (
        <div className="flex items-center gap-2">
          <dt className="eyebrow">Last verified</dt>
          <dd>
            <time
              dateTime={provider.lastVerifiedAt}
              className="font-medium text-ink-strong"
            >
              {formatDate(provider.lastVerifiedAt)}
            </time>
          </dd>
        </div>
      ) : null}
      {coverage ? (
        <div className="flex items-center gap-2">
          <dt className="eyebrow">Coverage</dt>
          <dd className="font-medium text-ink-strong">{coverage}</dd>
        </div>
      ) : null}
      {provider.priceTier ? (
        <div className="flex items-center gap-2">
          <dt className="eyebrow">Pricing</dt>
          <dd className="font-medium text-ink-strong">{PRICE_LABEL[provider.priceTier]}</dd>
        </div>
      ) : null}
      <Link
        href="/methodology"
        className="ml-auto text-sm font-medium text-brand underline decoration-brand/35 underline-offset-[3px] transition-colors hover:decoration-brand"
      >
        How we verify →
      </Link>
    </dl>
  );
}

// ─── Verification card (aside) ───────────────────────────────────────────
// Detail on the four verification pillars, with the last-verified date
// surfaced prominently. Appears only on verified providers.

function VerificationCard({ provider }: { provider: ProviderDetail }) {
  if (!provider.verified) return null;
  return (
    <section
      aria-labelledby="verification-heading"
      className="rounded-md border border-line bg-paper-raised"
    >
      <header className="flex items-center justify-between border-b border-line px-6 py-4">
        <h2 id="verification-heading" className="eyebrow">
          What we verified
        </h2>
        {provider.lastVerifiedAt ? (
          <time
            dateTime={provider.lastVerifiedAt}
            className="text-xs text-ink-subtle"
          >
            {formatDate(provider.lastVerifiedAt)}
          </time>
        ) : null}
      </header>
      <ul className="divide-y divide-line">
        {VERIFICATION_ITEMS.map((item) => (
          <li key={item.label} className="flex gap-3 px-6 py-4">
            <Check
              aria-hidden
              className="mt-0.5 h-4 w-4 shrink-0 text-success"
            />
            <div>
              <p className="text-sm font-medium text-ink-strong">{item.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-ink-muted">
                {item.detail}
              </p>
            </div>
          </li>
        ))}
      </ul>
      <footer className="border-t border-line px-6 py-4">
        <Link
          href="/methodology"
          className="text-xs font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
        >
          Full verification methodology →
        </Link>
      </footer>
    </section>
  );
}
