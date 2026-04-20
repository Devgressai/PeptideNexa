import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import {
  ArrowRight,
  BookOpen,
  FileText,
  FlaskConical,
  MessageSquareText,
  ShieldCheck,
  Sparkles,
  Stethoscope,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { PeptideCard } from "@/components/content/peptide-card";
import { ProviderCard } from "@/components/content/provider-card";
import { NewsletterForm } from "@/components/forms/newsletter-form";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
import { FaqBlock } from "@/components/content/faq-block";
import { Counter } from "@/components/content/counter";
import { Magnetic } from "@/components/content/magnetic";
import { ParallaxImage } from "@/components/content/parallax-image";
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

export const revalidate = 120;

export default async function HomePage() {
  const [featuredPeptides, featuredProviders] = await Promise.all([
    getFeaturedPeptides(6),
    getFeaturedProviders(4),
  ]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <ExploreByCategory />
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

// ─── Hero ───────────────────────────────────────────────────────────────────

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-line bg-paper">
      <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />

      <Container className="relative py-20 md:py-28 lg:py-32">
        <div className="grid items-center gap-16 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:gap-24">
          <div>
            <div className="flex items-center gap-2">
              <span className="relative inline-flex h-2 w-2 items-center justify-center">
                <span className="absolute h-2 w-2 animate-ping rounded-full bg-brand opacity-40" />
                <span className="relative h-1.5 w-1.5 rounded-full bg-brand" />
              </span>
              <Badge variant="muted">Independent · Editorial · Sourced</Badge>
            </div>

            <h1 className="mt-7 font-serif text-display-xl text-ink">
              Research peptides.
              <br />
              <span className="text-brand">Compare providers.</span>
              <br />
              Decide with confidence.
            </h1>

            <p className="mt-7 max-w-readable text-lg leading-relaxed text-ink-muted">
              The calm, structured reference for peptide research and provider discovery. No hype,
              no pay-to-win rankings — just sourced summaries and independently reviewed clinics.
            </p>

            <div className="mt-10 flex flex-col gap-3 sm:flex-row">
              <Magnetic strength={0.2}>
                <Button asChild size="lg" className="gap-2">
                  <Link href="/match">
                    Find a provider
                    <ArrowRight aria-hidden className="h-4 w-4" />
                  </Link>
                </Button>
              </Magnetic>
              <Button asChild size="lg" variant="secondary">
                <Link href="/peptides">Browse the library</Link>
              </Button>
            </div>

            <dl className="mt-12 flex flex-wrap items-center gap-x-10 gap-y-3 text-sm text-ink-muted">
              <div className="flex items-center gap-2">
                <ShieldCheck aria-hidden className="h-4 w-4 text-brand" />
                <dt className="sr-only">Review</dt>
                <dd>Clinically reviewed content</dd>
              </div>
              <div className="flex items-center gap-2">
                <FileText aria-hidden className="h-4 w-4 text-brand" />
                <dt className="sr-only">Citations</dt>
                <dd>Every claim cited</dd>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles aria-hidden className="h-4 w-4 text-brand" />
                <dt className="sr-only">Independence</dt>
                <dd>No pay-to-win rankings</dd>
              </div>
            </dl>
          </div>

          <ParallaxImage
            wrapperClassName="relative hidden aspect-square overflow-hidden rounded-2xl shadow-raised lg:block"
            src="/generated/hero-molecular.png"
            alt="Abstract molecular rendering"
            priority
            sizes="(min-width: 1024px) 40vw, 100vw"
            intensity={30}
          />
        </div>
      </Container>
    </section>
  );
}

// ─── Trust strip ────────────────────────────────────────────────────────────

function TrustStrip() {
  type Stat =
    | { label: string; kind: "number"; value: number; suffix?: string }
    | { label: string; kind: "text"; value: string };

  const stats: Stat[] = [
    { label: "Peptides researched", kind: "number", value: 40, suffix: "+" },
    { label: "Providers reviewed", kind: "number", value: 20, suffix: "+" },
    { label: "Re-verification cadence", kind: "text", value: "Quarterly" },
    { label: "Sources minimum per page", kind: "number", value: 2 },
  ];
  return (
    <section aria-label="By the numbers" className="border-b border-line bg-paper-raised">
      <Container className="py-10">
        <dl className="grid grid-cols-2 gap-6 md:grid-cols-4 md:gap-10">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col">
              <dt className="text-xs uppercase tracking-wider text-ink-subtle">{stat.label}</dt>
              <dd className="mt-1.5 font-serif text-3xl leading-none text-ink md:text-4xl">
                {stat.kind === "number" ? (
                  <Counter value={stat.value} suffix={stat.suffix} />
                ) : (
                  stat.value
                )}
              </dd>
            </div>
          ))}
        </dl>
      </Container>
    </section>
  );
}

// ─── Explore by category ───────────────────────────────────────────────────

function ExploreByCategory() {
  const categories: Array<{
    slug: string;
    name: string;
    description: string;
    Icon: typeof FlaskConical;
    image: string;
  }> = [
    {
      slug: "healing-repair",
      name: "Healing & repair",
      description: "Peptides discussed in tissue-repair and recovery research.",
      Icon: Sparkles,
      image: "/generated/cat-healing.png",
    },
    {
      slug: "ghs",
      name: "Growth hormone secretagogues",
      description: "The GH-axis peptides — pulsatile release, short half-life, careful dosing.",
      Icon: FlaskConical,
      image: "/generated/cat-ghs.png",
    },
    {
      slug: "metabolic",
      name: "Metabolic peptides",
      description: "GLP-1 adjacent compounds discussed in weight-management research.",
      Icon: Stethoscope,
      image: "/generated/cat-metabolic.png",
    },
    {
      slug: "cognitive",
      name: "Cognitive peptides",
      description: "Discussed for memory, focus, and neuroprotection research.",
      Icon: BookOpen,
      image: "/generated/cat-cognitive.png",
    },
    {
      slug: "longevity",
      name: "Longevity peptides",
      description: "Epitalon, GHK-Cu, and the broader healthspan conversation.",
      Icon: ShieldCheck,
      image: "/generated/cat-longevity.png",
    },
    {
      slug: "healing-repair",
      name: "Immune & inflammation",
      description: "Peptides in inflammation-modulation and immune-support research.",
      Icon: MessageSquareText,
      image: "/generated/cat-immune.png",
    },
  ];
  return (
    <section aria-labelledby="explore" className="border-b border-line">
      <Container className="py-20">
        <Reveal>
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-readable">
              <p className="text-xs uppercase tracking-wider text-ink-subtle">Explore</p>
              <h2 id="explore" className="mt-2 font-serif text-display-lg text-ink">
                Start with a category
              </h2>
              <p className="mt-4 text-ink-muted">
                The peptide landscape is wide. Categories give you a lay of the land and a path to
                the individual research summaries underneath.
              </p>
            </div>
            <Link href="/peptides" className="text-sm font-medium text-ink hover:text-brand">
              All peptides →
            </Link>
          </div>
        </Reveal>

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat, i) => (
            <Reveal key={`${cat.slug}-${cat.name}`} delay={i * 0.03}>
              <Link
                href={`/peptides/categories/${cat.slug}`}
                className="group relative flex h-full flex-col overflow-hidden rounded-lg border border-line bg-paper transition-all hover:-translate-y-0.5 hover:border-ink-subtle hover:shadow-raised"
              >
                <div className="relative aspect-[16/10] overflow-hidden bg-paper-sunken">
                  <Image
                    src={cat.image}
                    alt=""
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                  />
                  <div
                    aria-hidden
                    className="absolute inset-0 bg-gradient-to-t from-paper/30 via-transparent to-transparent"
                  />
                  <div className="absolute left-4 top-4 flex h-9 w-9 items-center justify-center rounded-md bg-paper/85 text-brand shadow-card backdrop-blur-sm">
                    <cat.Icon aria-hidden className="h-4.5 w-4.5" />
                  </div>
                </div>
                <div className="flex flex-1 flex-col p-6">
                  <h3 className="font-serif text-xl text-ink">{cat.name}</h3>
                  <p className="mt-2 text-sm text-ink-muted">{cat.description}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-5 text-sm font-medium text-ink transition-colors group-hover:text-brand">
                    Explore
                    <ArrowRight
                      aria-hidden
                      className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5"
                    />
                  </span>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
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
              <p className="text-xs uppercase tracking-wider text-ink-subtle">Peptide library</p>
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
    <section aria-labelledby="how" className="border-b border-line">
      <Container className="py-20">
        <Reveal>
          <div className="max-w-readable">
            <p className="text-xs uppercase tracking-wider text-ink-subtle">How to use PeptideNexa</p>
            <h2 id="how" className="mt-2 font-serif text-display-lg text-ink">
              From first question to credible provider
            </h2>
          </div>
        </Reveal>

        <ol className="mt-12 grid gap-6 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.n} delay={i * 0.06}>
              <li className="relative flex h-full flex-col rounded-lg border border-line bg-paper p-8">
                <span
                  aria-hidden
                  className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand"
                >
                  {step.n}
                </span>
                <h3 className="mt-4 font-serif text-2xl text-ink">{step.title}</h3>
                <p className="mt-3 text-ink-muted">{step.body}</p>
              </li>
            </Reveal>
          ))}
        </ol>

        <Reveal delay={0.18}>
          <div className="mt-10">
            <Button asChild size="lg" className="gap-2">
              <Link href="/match">
                Start with the matching quiz
                <ArrowRight aria-hidden className="h-4 w-4" />
              </Link>
            </Button>
          </div>
        </Reveal>
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
              <p className="text-xs uppercase tracking-wider text-ink-subtle">Provider directory</p>
              <h2 id="featured-providers" className="mt-2 font-serif text-display-lg text-ink">
                Independently reviewed providers
              </h2>
              <p className="mt-4 max-w-readable text-ink-muted">
                Every provider on PeptideNexa is reviewed by our editorial team. Featured placements
                are clearly labeled — they pay for visibility, not ranking.
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
              className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-paper-sunken"
            >
              <Image
                src="/generated/editorial-spotlight.png"
                alt="Research notebook and lab flask still life"
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
              <p className="text-xs uppercase tracking-wider text-ink-subtle">From the essay</p>
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
              <p className="text-xs uppercase tracking-wider text-ink-subtle">FAQ</p>
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
              <p className="text-xs uppercase tracking-wider text-ink-subtle">How we work</p>
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

function NewsletterBand() {
  return (
    <section aria-labelledby="newsletter" className="bg-paper-sunken">
      <Container className="py-20">
        <div className="grid gap-10 md:grid-cols-[1fr_1fr]">
          <Reveal>
            <div>
              <p className="text-xs uppercase tracking-wider text-ink-subtle">Research digest</p>
              <h2 id="newsletter" className="mt-2 font-serif text-display-md text-ink">
                Short, careful updates. No hype.
              </h2>
              <p className="mt-4 max-w-readable text-ink-muted">
                A monthly dispatch on peptide research, provider news, and category shifts. Written
                by our editorial team, not a content mill.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <NewsletterForm source="homepage" />
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
