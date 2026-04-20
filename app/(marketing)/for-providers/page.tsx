import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  BadgeCheck,
  Clock3,
  LineChart,
  MessageSquareText,
  Sparkles,
  Target,
  Users,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LeadForm } from "@/components/forms/lead-form";
import { Reveal } from "@/components/content/reveal";
import { Magnetic } from "@/components/content/magnetic";
import { Counter } from "@/components/content/counter";
import { HeroPattern } from "@/components/content/hero-pattern";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Partner with PeptideNexa — reach pre-educated peptide demand",
  description:
    "A curated editorial audience researches peptides on PeptideNexa. Featured listings, direct CPL partnerships, and category sponsorships for credible providers.",
  path: "/for-providers",
});

export default function ForProvidersPage() {
  return (
    <>
      <ProviderHero />
      <ProviderMetrics />
      <TheProblem />
      <TheOffer />
      <PlacementTiers />
      <Process />
      <ProviderFaq />
      <FinalCta />
    </>
  );
}

// ─── Hero ───────────────────────────────────────────────────────────────────

function ProviderHero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />

      <Container className="relative py-16 md:py-24">
        <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "For providers" }]} />

        <div className="mt-8 grid items-center gap-14 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-20">
          <div>
            <p className="eyebrow text-brand">For clinics · compounders · telehealth</p>
            <h1 className="mt-3 font-serif text-display-xl text-ink-strong text-balance">
              Reach readers who already did the homework.
            </h1>
            <p className="mt-6 max-w-readable text-lg leading-relaxed text-ink-muted">
              PeptideNexa readers aren&rsquo;t clicking from a Facebook ad. They arrive after
              reading our editorial, compared mechanisms, checked sources. They know what they
              want. We match them to the credible providers who can help.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Magnetic strength={0.2}>
                <Button asChild size="lg" className="gap-2">
                  <Link href="#apply">
                    Apply to list
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                </Button>
              </Magnetic>
              <Button asChild size="lg" variant="secondary">
                <Link href="#tiers">See placement tiers</Link>
              </Button>
            </div>

            <ul className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-ink-muted">
              <li className="flex items-center gap-2">
                <BadgeCheck aria-hidden className="h-4 w-4 text-brand" />
                Annual or monthly plans
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck aria-hidden className="h-4 w-4 text-brand" />
                Labeled, not hidden
              </li>
              <li className="flex items-center gap-2">
                <BadgeCheck aria-hidden className="h-4 w-4 text-brand" />
                CPL deals available
              </li>
            </ul>
          </div>

          <div className="relative hidden aspect-[4/5] overflow-hidden rounded-lg shadow-e2 lg:block">
            <Image
              src="/generated/trust-research.png"
              alt=""
              fill
              priority
              sizes="(min-width: 1024px) 40vw, 100vw"
              className="object-cover"
            />
            <div
              aria-hidden
              className="absolute inset-0 bg-gradient-to-tr from-ink/10 via-transparent to-transparent"
            />
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Metrics ────────────────────────────────────────────────────────────────

function ProviderMetrics() {
  const metrics: Array<{ value: number; suffix?: string; label: string; sub?: string }> = [
    { value: 68, suffix: "%", label: "Avg scroll depth", sub: "on peptide detail pages" },
    { value: 4, suffix: "+ min", label: "Time on page", sub: "median editorial reader" },
    { value: 73, suffix: "%", label: "Match-quiz completion", sub: "once started" },
    { value: 2, suffix: "h", label: "Lead SLA", sub: "to accept or reroute" },
  ];
  return (
    <section aria-label="Audience metrics" className="border-b border-line bg-paper-raised">
      <Container className="py-12">
        <dl className="grid grid-cols-2 gap-8 md:grid-cols-4">
          {metrics.map((m) => (
            <div key={m.label}>
              <dd className="font-serif text-3xl leading-none text-ink md:text-4xl">
                <Counter value={m.value} suffix={m.suffix} />
              </dd>
              <dt className="mt-2 text-sm font-medium text-ink">{m.label}</dt>
              {m.sub ? <p className="mt-0.5 text-xs text-ink-subtle">{m.sub}</p> : null}
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

// ─── The problem ────────────────────────────────────────────────────────────

function TheProblem() {
  const points: Array<{ title: string; body: string }> = [
    {
      title: "Paid ads are hostile territory",
      body: "Google and Meta enforce aggressive policies on peptide-adjacent advertising. Accounts get disabled, landing pages get flagged, CAC creeps up every quarter.",
    },
    {
      title: "SEO is a two-year play",
      body: "Topical authority in a medically-adjacent space takes 12–24 months of consistent editorial investment. Most clinics can&rsquo;t staff that. We already did.",
    },
    {
      title: "Lead farms poison the well",
      body: "Generic health lead brokers sell the same email to five providers. Intent is low, reply rates are worse. Readers who arrive through our editorial are different.",
    },
  ];
  return (
    <section aria-labelledby="problem" className="border-b border-line">
      <Container className="py-20">
        <Reveal>
          <div className="max-w-readable">
            <p className="eyebrow">Why this matters</p>
            <h2 id="problem" className="mt-2 font-serif text-display-lg text-ink">
              Peptide demand is loud.
              <br />
              Quality peptide channels are not.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          {points.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.05}>
              <div className="rounded-lg border border-line bg-paper p-6">
                <h3 className="font-serif text-xl text-ink">{p.title}</h3>
                <p className="mt-3 text-sm text-ink-muted">{p.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── The offer ──────────────────────────────────────────────────────────────

function TheOffer() {
  const items: Array<{ Icon: typeof Target; title: string; body: string }> = [
    {
      Icon: Target,
      title: "Matched, not blasted",
      body: "Readers who submit a matching request are routed to up to three providers that fit their state, goals, and budget. No bulk lead broadcasts.",
    },
    {
      Icon: Users,
      title: "Pre-educated audience",
      body: "Our readers consume peptide research before they ever fill out a form. They arrive knowing what BPC-157 is and why they&rsquo;re asking.",
    },
    {
      Icon: BadgeCheck,
      title: "Editorial halo",
      body: "Being listed on an independent, clinically-reviewed platform lends trust you can&rsquo;t buy with a Google ad. That credibility transfers.",
    },
    {
      Icon: LineChart,
      title: "Plain-English reporting",
      body: "Monthly dashboards show leads sent, acceptance rate, and outbound affiliate clicks. No vanity metrics. You&rsquo;ll know what&rsquo;s working.",
    },
  ];
  return (
    <section aria-labelledby="offer" className="border-b border-line bg-paper-raised">
      <Container className="py-20">
        <Reveal>
          <div className="max-w-readable">
            <p className="eyebrow">What we offer</p>
            <h2 id="offer" className="mt-2 font-serif text-display-lg text-ink">
              A high-intent channel that didn&rsquo;t exist before.
            </h2>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.04}>
              <div className="flex h-full flex-col rounded-lg border border-line bg-paper p-6">
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand">
                  <item.Icon aria-hidden className="h-5 w-5" />
                </div>
                <h3 className="mt-5 font-serif text-lg text-ink">{item.title}</h3>
                <p className="mt-2 text-sm text-ink-muted">{item.body}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Placement tiers ────────────────────────────────────────────────────────

function PlacementTiers() {
  const tiers: Array<{
    name: string;
    price: string;
    cadence: string;
    tag?: "Recommended" | "Founding";
    features: string[];
    cta: string;
  }> = [
    {
      name: "Listed",
      price: "Free",
      cadence: "Application-based",
      features: [
        "Basic directory profile",
        "Verified badge after our editorial review",
        "Inclusion in matching-quiz results when relevant",
        "Manual re-verification every 180 days",
      ],
      cta: "Apply",
    },
    {
      name: "Featured",
      price: "$799",
      cadence: "per month (annual)",
      tag: "Recommended",
      features: [
        "Top of category and location pages",
        "Enhanced profile (services, team, pricing ranges)",
        "Two comparisons highlighted",
        "Priority placement in matching results (when genuine match)",
        "Monthly analytics email",
      ],
      cta: "Start pilot",
    },
    {
      name: "Premium",
      price: "$2,499",
      cadence: "per month (annual)",
      tag: "Founding",
      features: [
        "Everything in Featured",
        "Sponsored editorial module (clearly labeled)",
        "Category takeover window (2 weeks / quarter)",
        "Priority lead routing + 2h acceptance SLA",
        "Quarterly strategy call with editorial lead",
      ],
      cta: "Talk to partnerships",
    },
  ];
  return (
    <section aria-labelledby="tiers" className="border-b border-line">
      <Container className="py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-readable">
              <p className="eyebrow">Placement tiers</p>
              <h2 id="tiers" className="mt-2 font-serif text-display-lg text-ink">
                Labeled placements.
                <br />
                Honest rankings.
              </h2>
              <p className="mt-5 text-ink-muted">
                Featured providers pay for visibility and enhanced profile real estate. Editorial
                rankings, reviews, and match logic are independent of payment. Everything is
                labeled where it appears.
              </p>
            </div>
          </div>
        </Reveal>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {tiers.map((tier, i) => (
            <Reveal key={tier.name} delay={i * 0.05}>
              <div
                className={
                  "relative flex h-full flex-col rounded-lg border bg-paper p-8 transition-shadow " +
                  (tier.tag === "Recommended"
                    ? "border-brand shadow-e2"
                    : "border-line shadow-e1 hover:shadow-e2")
                }
              >
                {tier.tag ? (
                  <span className="absolute -top-3 left-8">
                    <Badge variant={tier.tag === "Recommended" ? "brand" : "signal"}>
                      {tier.tag}
                    </Badge>
                  </span>
                ) : null}

                <h3 className="font-serif text-2xl text-ink">{tier.name}</h3>
                <p className="mt-4 flex items-baseline gap-2">
                  <span className="font-serif text-4xl text-ink">{tier.price}</span>
                  <span className="text-sm text-ink-muted">{tier.cadence}</span>
                </p>

                <ul className="mt-6 space-y-3 text-sm text-ink-muted">
                  {tier.features.map((feature) => (
                    <li key={feature} className="flex gap-2.5">
                      <BadgeCheck
                        aria-hidden
                        className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand"
                      />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  size="lg"
                  variant={tier.tag === "Recommended" ? "primary" : "secondary"}
                  className="mt-8 w-full"
                >
                  <Link href="#apply">{tier.cta}</Link>
                </Button>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <p className="mt-10 max-w-readable text-sm text-ink-muted">
            Direct CPL partnerships available for top partners at $35–$150 per qualified lead
            depending on goal, geography, and exclusivity. Talk to us.
          </p>
        </Reveal>
      </Container>
    </section>
  );
}

// ─── Process ────────────────────────────────────────────────────────────────

function Process() {
  const steps: Array<{ n: string; title: string; body: string; Icon: typeof MessageSquareText }> = [
    {
      n: "01",
      title: "Apply",
      body: "Tell us where you operate, what peptides you work with, and what your volume looks like. 5-minute form.",
      Icon: MessageSquareText,
    },
    {
      n: "02",
      title: "Editorial review",
      body: "We verify licensing, sourcing, and compliance posture. Most applicants hear back within a week.",
      Icon: BadgeCheck,
    },
    {
      n: "03",
      title: "Go live",
      body: "Profile goes live, leads start routing. Featured partners get white-glove onboarding and a dedicated contact.",
      Icon: Sparkles,
    },
  ];
  return (
    <section aria-labelledby="process" className="border-b border-line bg-paper-raised">
      <Container className="py-20">
        <Reveal>
          <p className="eyebrow">How it works</p>
          <h2 id="process" className="mt-2 font-serif text-display-lg text-ink">
            From first email to first lead in under two weeks.
          </h2>
        </Reveal>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.05}>
              <li className="relative flex h-full flex-col rounded-lg border border-line bg-paper p-8">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                    {step.n}
                  </span>
                  <step.Icon aria-hidden className="h-5 w-5 text-ink-subtle" />
                </div>
                <h3 className="mt-5 font-serif text-2xl text-ink">{step.title}</h3>
                <p className="mt-3 text-ink-muted">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

// ─── FAQ ────────────────────────────────────────────────────────────────────

function ProviderFaq() {
  const items = [
    {
      question: "How does lead routing work?",
      answer:
        "When a reader submits a matching request, our engine ranks providers by goal fit, geography, verification, and tier. The top match is routed to you via webhook + email. You have two hours to accept or reject; unacknowledged leads reroute to the next match. No bulk broadcasts.",
    },
    {
      question: "Do you gate placements by exclusivity?",
      answer:
        "Not by default. Category takeovers and direct CPL agreements can include exclusivity terms. For most Featured and Premium partners, you compete on profile quality and match fit rather than on zero-sum exclusivity.",
    },
    {
      question: "What counts as 'clearly labeled'?",
      answer:
        "Featured placements display a 'Featured' badge everywhere they appear. Sponsored editorial modules carry an inline disclosure. Affiliate outbound links use rel='sponsored nofollow noopener'. Editorial rankings and comparisons are never moved by advertiser payment.",
    },
    {
      question: "Can I cancel monthly?",
      answer:
        "Annual plans save two months. Monthly billing is available at a small premium with 30 days notice. Early cancellation on annual refunds unused months on a pro-rata basis.",
    },
    {
      question: "Do you accept compounding pharmacies?",
      answer:
        "Yes, provided licensing and compounding posture are sound. We review on a case-by-case basis. Wholesale and B2B compounders can be listed in a dedicated directory surface separate from the consumer-facing provider list.",
    },
  ];
  return (
    <section aria-labelledby="partner-faq" className="border-b border-line">
      <Container className="py-20">
        <Reveal>
          <div className="grid gap-12 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <div>
              <p className="eyebrow">FAQ</p>
              <h2 id="partner-faq" className="mt-2 font-serif text-display-lg text-ink">
                Questions we hear most often
              </h2>
              <p className="mt-4 text-ink-muted">
                Still have questions? Write partnerships@peptidenexa.com — a real person replies.
              </p>
            </div>

            <dl className="divide-y divide-line border-y border-line">
              {items.map((item) => (
                <div
                  key={item.question}
                  className="grid gap-2 py-6 md:grid-cols-[minmax(0,1fr)_2fr] md:gap-8"
                >
                  <dt className="font-medium text-ink">{item.question}</dt>
                  <dd className="text-ink-muted">{item.answer}</dd>
                </div>
              ))}
            </dl>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

// ─── Final CTA ──────────────────────────────────────────────────────────────

function FinalCta() {
  return (
    <section aria-labelledby="apply" className="bg-paper-sunken">
      <Container className="py-20">
        <div className="grid gap-12 lg:grid-cols-[1fr_1fr] lg:gap-20">
          <Reveal>
            <div>
              <p className="eyebrow">Apply</p>
              <h2 id="apply" className="mt-2 font-serif text-display-lg text-ink">
                Ready to talk?
              </h2>
              <p className="mt-4 max-w-readable text-ink-muted">
                Tell us a bit about where you operate and what you&rsquo;re looking for. We&rsquo;ll
                send a short follow-up within two business days and set up a 30-minute call if it
                looks like a fit.
              </p>

              <ul className="mt-8 space-y-3 text-sm text-ink-muted">
                <li className="flex items-center gap-2">
                  <Clock3 aria-hidden className="h-4 w-4 text-brand" />
                  2 business day response, always
                </li>
                <li className="flex items-center gap-2">
                  <BadgeCheck aria-hidden className="h-4 w-4 text-brand" />
                  No hard sell — if we&rsquo;re not a fit, we&rsquo;ll say so
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="rounded-lg border border-line bg-paper p-8 shadow-e1">
              <LeadForm source="for-providers" compact />
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
