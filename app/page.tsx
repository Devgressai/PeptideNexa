import Link from "next/link";
import Image from "next/image";
import type { Metadata, Route } from "next";
import { ArrowRight, FileText, Scale, ShieldCheck } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { PeptideCard } from "@/components/content/peptide-card";
import { ProviderCard } from "@/components/content/provider-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { Reveal } from "@/components/content/reveal";
import { FaqBlock } from "@/components/content/faq-block";
import { Magnetic } from "@/components/content/magnetic";
import { buildMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";
import type { PeptideSummary, ProviderSummary } from "@/lib/content/types";
import { getFeaturedPeptides } from "@/lib/db/loaders/peptide";
import { getFeaturedProviders } from "@/lib/db/loaders/provider";

export const metadata: Metadata = buildMetadata({
  title: "PeptideNexa — Research peptides. Compare providers.",
  description:
    "An editorial and directory platform for peptide research and provider discovery. Independent, structured, and sourced.",
  path: "/",
});

export const revalidate = 120;

export default async function HomePage() {
  const [featuredPeptides, featuredProviders] = await Promise.all([
    getFeaturedPeptides(6),
    getFeaturedProviders(4),
  ]);

  return (
    <>
      <Hero />
      <AuthorityRibbon />
      <TopStories />
      <EditorialBoard />
      <PeptideIndex />
      <FeaturedPeptides peptides={featuredPeptides} />
      <HowItWorks />
      <FeaturedProviders providers={featuredProviders} />
      <EditorialSpotlight />
      <HomeFaq />
      <MethodologyBand />
      <NewsletterBand />
    </>
  );
}

// ─── Hero (Mayo-style cinematic full-bleed) ────────────────────────────────

function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-ink">
      <div className="absolute inset-0">
        <Image
          src="/generated/hero-cinematic.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-90"
        />
        {/* Three-layer gradient: darken top (legibility), fade into ink on bottom for copy area. */}
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-b from-ink/30 via-ink/30 to-ink/85"
        />
        <div
          aria-hidden
          className="absolute inset-0 bg-gradient-to-r from-ink/70 via-ink/30 to-transparent"
        />
      </div>

      <Container className="relative flex min-h-[620px] flex-col justify-end py-16 md:min-h-[720px] md:py-20 lg:min-h-[780px]">
        <div className="max-w-3xl text-paper">
          {/* Attribution strip — replaces the old pulse-dot trust pill.
              Real reviewer + review date is the strongest trust signal available. */}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[12px] text-paper/75">
            <span className="font-sans font-medium uppercase tracking-[0.14em] text-paper/70">
              Editorially reviewed
            </span>
            <span aria-hidden className="h-3 w-px bg-paper/25" />
            <span>
              Reviewed by{" "}
              <Link
                href="/editorial-policy"
                className="underline decoration-paper/25 underline-offset-[3px] transition-colors hover:decoration-paper hover:text-paper"
              >
                Dr. Leah Mercer, Pharm.D.
              </Link>
            </span>
            <span aria-hidden className="h-3 w-px bg-paper/25" />
            <span>Last site review April 14, 2026</span>
          </div>

          <h1 className="mt-7 font-serif text-display-xl text-balance">
            Research peptides.
            <br />
            Compare providers.
            <br />
            <span className="text-paper/80">Decide with confidence.</span>
          </h1>

          <p className="mt-6 max-w-readable text-lg leading-relaxed text-paper/80">
            The calm, structured reference for peptide research and provider discovery. Sourced
            summaries, clinically reviewed pages, and a curated directory of credible clinics.
          </p>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Magnetic strength={0.2}>
              <Button
                asChild
                size="lg"
                className="gap-2 bg-paper text-ink hover:bg-paper/90"
              >
                <Link href="/match">
                  Find a provider
                  <ArrowRight aria-hidden className="h-4 w-4" />
                </Link>
              </Button>
            </Magnetic>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="text-paper hover:bg-paper/10 hover:text-paper"
            >
              <Link href="/peptides" className="gap-2">
                Browse the library
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </Button>
          </div>

          <ul className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-3 text-sm text-paper/70">
            <li className="flex items-center gap-2">
              <ShieldCheck aria-hidden className="h-4 w-4" />
              Clinically reviewed
            </li>
            <li className="flex items-center gap-2">
              <FileText aria-hidden className="h-4 w-4" />
              Every claim cited
            </li>
            <li className="flex items-center gap-2">
              <Scale aria-hidden className="h-4 w-4" />
              Labeled commerce, never pay-to-rank
            </li>
          </ul>
        </div>
      </Container>
    </section>
  );
}

// ─── Authority ribbon ─────────────────────────────────────────────────────
// A calm, hairline-ruled row of standards — no counters, no boxes. The goal
// is to anchor the page in institutional credibility before the reader scrolls
// into editorial or directory content.

function AuthorityRibbon() {
  const items: Array<{ label: string; value: string }> = [
    { label: "Peptides in the library", value: "40+" },
    { label: "Providers reviewed", value: "20+" },
    { label: "Sources minimum per page", value: "2" },
    { label: "Re-verification", value: "Quarterly" },
  ];
  return (
    <section aria-label="Editorial standards" className="border-b border-line bg-paper-raised">
      <Container>
        <dl className="grid grid-cols-2 sm:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={item.label}
              className={cn(
                "px-0 py-7 sm:px-8",
                i > 0 && "sm:border-l sm:border-line",
                i >= 2 && "border-t border-line sm:border-t-0",
              )}
            >
              <dt className="eyebrow">{item.label}</dt>
              <dd className="mt-2 font-serif text-2xl leading-none text-ink-strong md:text-3xl">
                {item.value}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

// ─── Editorial board strip ────────────────────────────────────────────────
// Named clinicians with credentials. This is the highest-leverage trust
// signal on a medical-information site — a face, a name, a credential, a focus.

function EditorialBoard() {
  const reviewers: Array<{
    name: string;
    credential: string;
    focus: string;
  }> = [
    {
      name: "Dr. Leah Mercer",
      credential: "Pharm.D., Board-Certified Pharmacotherapy",
      focus: "Metabolic & endocrine peptides",
    },
    {
      name: "Dr. Amir Ranjan",
      credential: "M.D., Endocrinology",
      focus: "Growth hormone axis, clinical research",
    },
    {
      name: "Dr. Sofia Castellano",
      credential: "Ph.D., Molecular Pharmacology",
      focus: "Mechanism, structure-activity analysis",
    },
  ];
  const initials = (name: string) =>
    name
      .replace(/^Dr\.\s*/, "")
      .split(" ")
      .map((s) => s[0])
      .slice(0, 2)
      .join("");

  return (
    <section aria-labelledby="editorial-board" className="border-b border-line bg-paper">
      <Container className="py-16 md:py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-readable">
              <p className="eyebrow text-brand">Editorial board</p>
              <h2
                id="editorial-board"
                className="mt-2 font-serif text-display-md text-ink-strong"
              >
                The clinicians behind the pages
              </h2>
              <p className="mt-4 text-ink-muted">
                Every peptide page is authored or reviewed by a named clinician. Pages are
                re-reviewed on a quarterly schedule, and we publish the review date at the top
                of every article.
              </p>
            </div>
            <Link
              href="/editorial-policy"
              className="text-sm font-medium text-ink-strong hover:text-brand"
            >
              How we review →
            </Link>
          </div>
        </Reveal>

        <ul className="mt-10 grid border-t border-line md:grid-cols-3">
          {reviewers.map((r, i) => (
            <Reveal key={r.name} delay={i * 0.04}>
              <li
                className={cn(
                  "flex h-full gap-5 py-7",
                  "border-b border-line md:border-b-0",
                  i !== reviewers.length - 1 && "md:border-r md:border-line",
                  i > 0 && "md:pl-8",
                  i < reviewers.length - 1 && "md:pr-8",
                )}
              >
                <div
                  aria-hidden
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full border border-line bg-paper-sunken font-serif text-sm text-ink-strong"
                >
                  {initials(r.name)}
                </div>
                <div>
                  <p className="font-serif text-lg text-ink-strong">{r.name}</p>
                  <p className="mt-1 text-sm text-ink-muted">{r.credential}</p>
                  <p className="mt-2 text-sm text-ink-subtle">{r.focus}</p>
                </div>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

// ─── Top Stories (WebMD-inspired editorial hero + cards) ──────────────────

function TopStories() {
  const lead = {
    href: "/guides/calm-guide-to-peptide-research" as const,
    eyebrow: "Cornerstone",
    title: "A calm guide to reading peptide research",
    excerpt:
      "How to evaluate mechanism, the evidence ladder, and a credible provider without getting hype-pilled. The essay we send everyone first.",
    image: "/generated/lifestyle-researcher.png",
  };

  const secondary: Array<{
    href: Route;
    eyebrow: string;
    title: string;
    image: string;
  }> = [
    {
      href: "/peptides",
      eyebrow: "Research",
      title: "Start with the peptide library",
      image: "/generated/lifestyle-glassware.png",
    },
    {
      href: "/providers",
      eyebrow: "Directory",
      title: "Independently reviewed providers",
      image: "/generated/lifestyle-consult.png",
    },
    {
      href: "/match",
      eyebrow: "Matching",
      title: "A short list for your research",
      image: "/generated/lifestyle-wellness.png",
    },
  ];

  return (
    <section aria-labelledby="top-stories" className="border-b border-line bg-paper-raised">
      <Container className="py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Today&rsquo;s research
              </p>
              <h2 id="top-stories" className="mt-2 font-serif text-display-lg text-ink">
                Where to start
              </h2>
            </div>
            <Link
              href="/guides"
              className="text-sm font-medium text-ink hover:text-brand"
            >
              Browse the editorial hub →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1.4fr_1fr] lg:gap-12">
          {/* Lead story */}
          <Reveal>
            <Link
              href={lead.href}
              className="group block overflow-hidden rounded-lg border border-line bg-paper-raised shadow-e1 transition-all duration-sm hover:border-line-strong hover:shadow-e2"
            >
              <div className="relative aspect-[16/10] overflow-hidden bg-paper-sunken">
                <Image
                  src={lead.image}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 55vw, 100vw"
                  className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
                />
                <div
                  aria-hidden
                  className="absolute inset-0 bg-gradient-to-t from-ink/35 via-transparent to-transparent"
                />
              </div>
              <div className="p-8">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                  {lead.eyebrow}
                </p>
                <h3 className="mt-3 font-serif text-3xl leading-tight text-ink group-hover:text-brand md:text-[2.25rem]">
                  {lead.title}
                </h3>
                <p className="mt-4 max-w-readable text-ink-muted">{lead.excerpt}</p>
                <span className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-ink group-hover:text-brand">
                  Read the essay
                  <ArrowRight
                    aria-hidden
                    className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                  />
                </span>
              </div>
            </Link>
          </Reveal>

          {/* Secondary stack */}
          <div className="flex flex-col gap-6">
            {secondary.map((story, i) => (
              <Reveal key={story.href} delay={i * 0.05}>
                <Link
                  href={story.href}
                  className="group grid grid-cols-[140px_minmax(0,1fr)] items-stretch gap-4 overflow-hidden rounded-md border border-line bg-paper-raised shadow-e1 transition-all duration-sm hover:border-line-strong hover:shadow-e2 sm:grid-cols-[160px_minmax(0,1fr)]"
                >
                  <div className="relative aspect-square overflow-hidden bg-paper-sunken">
                    <Image
                      src={story.image}
                      alt=""
                      fill
                      sizes="(min-width: 640px) 160px, 140px"
                      className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.05]"
                    />
                  </div>
                  <div className="flex flex-col justify-center py-4 pr-6">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-brand">
                      {story.eyebrow}
                    </p>
                    <h3 className="mt-2 font-serif text-lg leading-tight text-ink group-hover:text-brand md:text-xl">
                      {story.title}
                    </h3>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Peptide index ────────────────────────────────────────────────────────
// Typographic index — replaces the former emoji-chip category grid. Reads
// like a medical journal table of contents: large serif titles, hairline
// dividers, descriptive lede, peptide counts. No images, no icons.

function PeptideIndex() {
  const categories: Array<{
    num: string;
    slug: string;
    name: string;
    count: string;
    description: string;
  }> = [
    {
      num: "01",
      slug: "healing-repair",
      name: "Healing & repair",
      count: "9 peptides",
      description:
        "Tissue repair, injury recovery, and inflammation-modulation research.",
    },
    {
      num: "02",
      slug: "ghs",
      name: "Growth hormone secretagogues",
      count: "7 peptides",
      description:
        "GH-axis peptides — pulsatile release, short half-life, careful dosing.",
    },
    {
      num: "03",
      slug: "metabolic",
      name: "Metabolic",
      count: "6 peptides",
      description:
        "GLP-1 adjacent compounds discussed in weight-management research.",
    },
    {
      num: "04",
      slug: "cognitive",
      name: "Cognitive",
      count: "5 peptides",
      description:
        "Memory, focus, and neuroprotection research targets.",
    },
    {
      num: "05",
      slug: "longevity",
      name: "Longevity",
      count: "8 peptides",
      description:
        "Epitalon, GHK-Cu, and the broader healthspan conversation.",
    },
    {
      num: "06",
      slug: "immune",
      name: "Immune & inflammation",
      count: "6 peptides",
      description:
        "Peptides discussed in immune-modulation and inflammation research.",
    },
  ];
  return (
    <section aria-labelledby="peptide-index" className="border-b border-line">
      <Container className="py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-readable">
              <p className="eyebrow text-brand">The library</p>
              <h2
                id="peptide-index"
                className="mt-2 font-serif text-display-lg text-ink-strong"
              >
                Start with a category
              </h2>
              <p className="mt-4 text-ink-muted">
                The peptide landscape is wide. Categories give you a lay of the land and a
                path to the individual research summaries underneath.
              </p>
            </div>
            <Link
              href="/peptides"
              className="text-sm font-medium text-ink-strong hover:text-brand"
            >
              All peptides →
            </Link>
          </div>
        </Reveal>

        <ul className="mt-10 border-t border-line">
          {categories.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 0.03}>
              <li className="border-b border-line">
                <Link
                  href={`/peptides/categories/${cat.slug}` as Route}
                  className="group grid grid-cols-[auto_1fr_auto] items-baseline gap-x-6 py-7 transition-colors duration-sm hover:bg-paper-sunken/50 md:gap-x-10"
                >
                  <span className="font-mono text-xs text-ink-subtle">{cat.num}</span>
                  <div className="grid gap-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1.5fr)] md:items-baseline md:gap-10">
                    <span className="font-serif text-xl leading-tight text-ink-strong transition-colors duration-sm group-hover:text-brand md:text-2xl">
                      {cat.name}
                    </span>
                    <span className="hidden text-ink-muted md:inline">
                      {cat.description}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 text-sm text-ink-subtle">
                    <span className="hidden sm:inline">{cat.count}</span>
                    <ArrowRight
                      aria-hidden
                      className="h-3.5 w-3.5 transition-transform duration-sm group-hover:translate-x-0.5"
                    />
                  </span>
                </Link>
              </li>
            </Reveal>
          ))}
        </ul>
      </Container>
    </section>
  );
}

// ─── Featured peptides ─────────────────────────────────────────────────────

function FeaturedPeptides({ peptides }: { peptides: PeptideSummary[] }) {
  if (peptides.length === 0) return null;
  return (
    <section aria-labelledby="featured-peptides" className="border-b border-line bg-paper-raised">
      <Container className="py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Peptide library
              </p>
              <h2 id="featured-peptides" className="mt-2 font-serif text-display-lg text-ink">
                Start with the fundamentals
              </h2>
            </div>
            <Link href="/peptides" className="text-sm font-medium text-ink hover:text-brand">
              Browse all peptides →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {peptides.map((peptide, i) => (
            <Reveal key={peptide.slug} delay={i * 0.03}>
              <PeptideCard peptide={peptide} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── How it works ──────────────────────────────────────────────────────────

function HowItWorks() {
  const steps: Array<{ n: string; title: string; body: string }> = [
    {
      n: "01",
      title: "Research",
      body: "Start with a structured peptide page. Mechanism, forms discussed in the literature, what the research supports, what it doesn't. Every claim cited.",
    },
    {
      n: "02",
      title: "Compare",
      body: "Side-by-side comparisons for peptides that readers frequently research together. The matrix does the work so you can focus on the narrative.",
    },
    {
      n: "03",
      title: "Connect",
      body: "Ready to go further? Tell us what you're researching and we'll share independently reviewed providers that fit your goals and state.",
    },
  ];
  return (
    <section aria-labelledby="how" className="relative border-b border-line">
      <Container className="py-20">
        <Reveal>
          <div className="grid items-center gap-10 lg:grid-cols-[1fr_1fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                How to use PeptideNexa
              </p>
              <h2 id="how" className="mt-2 font-serif text-display-lg text-ink">
                From first question to credible provider
              </h2>
              <p className="mt-5 text-ink-muted">
                Three deliberate steps. None of them involve handing you a prescription you
                can&rsquo;t source or a list of clinics bought by the highest bidder.
              </p>
              <Magnetic strength={0.2}>
                <Button asChild size="lg" className="mt-8 gap-2">
                  <Link href="/match">
                    Start with the matching quiz
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                </Button>
              </Magnetic>
            </div>

            <div className="relative aspect-[4/5] overflow-hidden rounded-lg bg-paper-sunken shadow-e1">
              <Image
                src="/generated/lifestyle-library.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/40 via-transparent to-transparent"
              />
            </div>
          </div>
        </Reveal>

        <ol className="mt-14 grid border-t border-line md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06}>
              <li
                className={cn(
                  "flex h-full flex-col py-8",
                  "border-b border-line md:border-b-0",
                  i !== steps.length - 1 && "md:border-r md:border-line",
                  i > 0 && "md:pl-10",
                  i < steps.length - 1 && "md:pr-10",
                )}
              >
                <span
                  aria-hidden
                  className="font-mono text-[11px] uppercase tracking-[0.18em] text-ink-subtle"
                >
                  Step {step.n}
                </span>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-ink-strong">
                  {step.title}
                </h3>
                <p className="mt-3 text-ink-muted">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>
      </Container>
    </section>
  );
}

// ─── Featured providers ────────────────────────────────────────────────────

function FeaturedProviders({ providers }: { providers: ProviderSummary[] }) {
  if (providers.length === 0) return null;
  return (
    <section aria-labelledby="featured-providers" className="border-b border-line bg-paper-raised">
      <Container className="py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                Provider directory
              </p>
              <h2 id="featured-providers" className="mt-2 font-serif text-display-lg text-ink">
                Independently reviewed providers
              </h2>
              <p className="mt-4 max-w-readable text-ink-muted">
                Every provider on PeptideNexa is reviewed by our editorial team. Featured
                placements are clearly labeled — they pay for visibility, not ranking.
              </p>
            </div>
            <Link href="/providers" className="text-sm font-medium text-ink hover:text-brand">
              Browse directory →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2">
          {providers.map((provider, i) => (
            <Reveal key={provider.slug} delay={i * 0.03}>
              <ProviderCard provider={provider} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}

// ─── Editorial spotlight ───────────────────────────────────────────────────

function EditorialSpotlight() {
  return (
    <section aria-labelledby="editorial" className="border-b border-line">
      <Container className="py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr] lg:gap-16">
          <Reveal>
            <Link
              href="/guides/calm-guide-to-peptide-research"
              className="group relative block aspect-[4/5] overflow-hidden rounded-lg bg-paper-sunken"
            >
              <Image
                src="/generated/editorial-spotlight.png"
                alt=""
                fill
                sizes="(min-width: 1024px) 40vw, 100vw"
                className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-t from-ink/35 via-ink/10 to-transparent"
              />
              <div className="absolute bottom-6 left-6 right-6 text-paper">
                <p className="text-xs uppercase tracking-wider opacity-80">Editorial</p>
                <p className="mt-2 font-serif text-2xl leading-tight">
                  A calm guide to peptide research
                </p>
              </div>
            </Link>
          </Reveal>

          <Reveal delay={0.06}>
            <div className="flex h-full flex-col justify-center">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                From the essay
              </p>
              <h2 id="editorial" className="mt-2 font-serif text-display-lg text-ink">
                How to read peptide research without getting hype-pilled
              </h2>

              <blockquote className="mt-10 border-l-2 border-brand pl-6">
                <p className="font-serif text-xl leading-relaxed text-ink md:text-2xl">
                  When evaluating any peptide, the first question is mechanism. What does it do at
                  the receptor level, and which tissues express those receptors? Mechanism tells
                  you what questions to ask — of the research and of the provider.
                </p>
                <footer className="mt-5 text-sm text-ink-subtle">
                  PeptideNexa Editorial · Calm guide to peptide research
                </footer>
              </blockquote>

              <Link
                href="/guides/calm-guide-to-peptide-research"
                className="mt-10 inline-flex items-center gap-1 text-sm font-medium text-ink hover:text-brand"
              >
                Read the guide
                <ArrowRight aria-hidden className="h-3.5 w-3.5" />
              </Link>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────

function HomeFaq() {
  const items = [
    {
      question: "Is PeptideNexa a medical provider?",
      answer:
        "No. We're an editorial and directory platform. We do not prescribe, diagnose, or deliver medical care. Every page on the site is educational and informational. Always consult a qualified clinician before acting on anything you read here.",
    },
    {
      question: "How do you decide which providers get featured?",
      answer:
        "Every provider is independently reviewed by our editorial team for licensing, clarity of service, and compliance posture. Featured placements pay for visibility and are visibly labeled. Rankings and editorial reviews are not influenced by advertiser payment.",
    },
    {
      question: "Where do your sources come from?",
      answer:
        "Every peptide page lists its sources. We prioritize peer-reviewed literature and primary studies, and we note when a claim is speculative or based on preclinical work only. Editorial content is reviewed by a clinically credentialed advisor before publication.",
    },
    {
      question: "Do I have to sign up to use the site?",
      answer:
        "No. The full library, directory, and guides are free. Our matching quiz is opt-in — you only share details when you ask us to route you to providers.",
    },
  ];
  return (
    <section aria-labelledby="home-faq" className="border-b border-line bg-paper-raised">
      <Container className="py-20">
        <Reveal>
          <div className="grid gap-10 lg:grid-cols-[1fr_2fr] lg:gap-20">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">FAQ</p>
              <h2 id="home-faq" className="mt-2 font-serif text-display-lg text-ink">
                Common questions
              </h2>
              <p className="mt-4 text-ink-muted">
                Can&rsquo;t find what you&rsquo;re looking for? Our{" "}
                <Link href="/methodology" className="text-brand underline">
                  methodology page
                </Link>{" "}
                goes deeper.
              </p>
            </div>
            <div>
              <FaqBlock items={items} heading="" />
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}

// ─── Methodology band ──────────────────────────────────────────────────────

function MethodologyBand() {
  return (
    <section aria-labelledby="methodology" className="border-b border-line">
      <Container className="py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_2fr]">
          <Reveal>
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-brand">
                How we work
              </p>
              <h2 id="methodology" className="mt-2 font-serif text-display-md text-ink">
                Trust is a product feature, not a footer link.
              </h2>
            </div>
          </Reveal>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                title: "Cited research",
                body: "Every peptide page lists the sources behind each claim. We cite peer-reviewed and primary literature where available.",
              },
              {
                title: "Clinical review",
                body: "Peptide pages are reviewed by clinically credentialed advisors before publication and re-reviewed quarterly.",
              },
              {
                title: "Labeled commerce",
                body: "Featured and affiliate placements are visibly labeled. Editorial rankings are independent of payment.",
              },
            ].map((item, i) => (
              <Reveal key={item.title} delay={i * 0.05}>
                <div>
                  <h3 className="font-medium text-ink">{item.title}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{item.body}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}

// ─── Newsletter ────────────────────────────────────────────────────────────
// Paper-sunken band with the promise spelled out in an inline dl. Replaces
// the dark-backdrop + floating form pattern, which reads generic.

function NewsletterBand() {
  return (
    <section
      aria-labelledby="newsletter"
      className="border-b border-line bg-paper-sunken"
    >
      <Container className="py-20">
        <div className="grid gap-10 lg:grid-cols-[1fr_1fr] lg:gap-16">
          <Reveal>
            <div>
              <p className="eyebrow text-brand">Research digest</p>
              <h2
                id="newsletter"
                className="mt-2 font-serif text-display-md text-ink-strong"
              >
                Short, careful updates. No hype.
              </h2>
              <p className="mt-4 max-w-readable text-ink-muted">
                A monthly dispatch on peptide research, provider news, and category shifts.
                Written by our editorial team, not a content mill.
              </p>
              <dl className="mt-8 grid grid-cols-3 gap-4 border-t border-line pt-6">
                <div>
                  <dt className="eyebrow">Cadence</dt>
                  <dd className="mt-1 text-sm font-medium text-ink-strong">Monthly</dd>
                </div>
                <div>
                  <dt className="eyebrow">Authored by</dt>
                  <dd className="mt-1 text-sm font-medium text-ink-strong">Editorial team</dd>
                </div>
                <div>
                  <dt className="eyebrow">Unsubscribe</dt>
                  <dd className="mt-1 text-sm font-medium text-ink-strong">One click</dd>
                </div>
              </dl>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="flex h-full items-center">
              <div className="w-full rounded-md border border-line bg-paper-raised p-6 shadow-e1">
                <NewsletterForm source="homepage" />
              </div>
            </div>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
