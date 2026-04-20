import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  BookOpen,
  ClipboardCheck,
  FileText,
  Scale,
  Stethoscope,
  Users,
} from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
import { EvidenceTier } from "@/components/content/evidence-tier";
import { buildMetadata } from "@/lib/seo/metadata";
import { cn } from "@/lib/utils";

export const metadata: Metadata = buildMetadata({
  title: "Methodology",
  description: "How PeptideNexa researches, sources, and reviews its content.",
  path: "/methodology",
});

type Pillar = {
  Icon: typeof FileText;
  title: string;
  body: string;
};

const PILLARS: Pillar[] = [
  {
    Icon: FileText,
    title: "Sourcing",
    body: "Every peptide page lists the primary sources behind its claims. We prioritize peer-reviewed literature and primary studies. Secondary sources are labeled as such. We note speculation explicitly when it exists.",
  },
  {
    Icon: Stethoscope,
    title: "Clinical review",
    body: "Peptide pages are reviewed by a clinically credentialed advisor before publication. High-traffic pages are re-reviewed quarterly to catch drift in the underlying research.",
  },
  {
    Icon: ClipboardCheck,
    title: "Evidence ladder",
    body: "We distinguish in-vitro, animal, and human evidence explicitly. A page that says \u201CBPC-157 has been studied for tendon repair\u201D means something different than \u201CBPC-157 has been shown to repair tendons.\u201D",
  },
  {
    Icon: Scale,
    title: "Editorial independence",
    body: "Featured and affiliate placements are clearly labeled. Editorial rankings, comparisons, and review language are never influenced by advertiser payment. We will say when a provider is featured.",
  },
  {
    Icon: Users,
    title: "Corrections",
    body: "If you identify an error, email corrections@peptidenexa.com. Corrections are documented with the date of revision and, where material, a visible change-log on the page.",
  },
  {
    Icon: BookOpen,
    title: "Provider verification",
    body: "Every provider is reviewed for licensing, service clarity, and compliance posture before listing. Providers are re-verified at least every 180 days; stale verifications are flagged in the admin and on the page.",
  },
];

const EVIDENCE_TIERS: Array<{
  level: number;
  name: string;
  description: string;
}> = [
  {
    level: 5,
    name: "Extensive clinical",
    description:
      "Multiple controlled human trials. Mechanism well-characterized. Use in conventional medicine or near-standard-of-care.",
  },
  {
    level: 4,
    name: "Strong clinical",
    description:
      "Several controlled human trials. Effect size and side-effect profile reasonably mapped.",
  },
  {
    level: 3,
    name: "Moderate clinical",
    description:
      "Early-phase human trials or consistent observational data. Mechanism plausible; dosing in research.",
  },
  {
    level: 2,
    name: "Limited clinical",
    description:
      "Case reports, very small studies, or off-label research. Evidence signal present but thin.",
  },
  {
    level: 1,
    name: "Preclinical only",
    description:
      "In-vitro and animal work only. Mechanism of interest; no human evidence available.",
  },
  {
    level: 0,
    name: "Theoretical",
    description:
      "Hypothesis based on adjacent research. No direct evidence in the peptide itself yet.",
  },
];

export default function MethodologyPage() {
  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-paper">
        <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[38%] opacity-70 lg:block"
        >
          <Image
            src="/generated/trust-research.png"
            alt=""
            fill
            sizes="38vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-paper/0" />
        </div>

        <Container className="relative py-14 md:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Methodology" }]} />
          <p className="eyebrow mt-6">How we work</p>
          <h1 className="mt-3 max-w-2xl font-serif text-display-xl text-ink-strong text-balance">
            Trust is a product feature, not a footer link.
          </h1>
          <p className="mt-6 max-w-readable text-lg leading-relaxed text-ink-muted">
            These are the editorial principles that govern what we publish, how we review it,
            and how we distinguish independent content from commercial placements.
          </p>
        </Container>
      </header>

      <Container className="py-16">
        <Reveal>
          <div className="grid gap-0 border-t border-line sm:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar, i) => (
              <div
                key={pillar.title}
                className={cn(
                  "flex h-full flex-col p-6 md:p-8",
                  "border-b border-line",
                  i % 3 !== 2 && "lg:border-r lg:border-line",
                  i % 2 !== 1 && "sm:border-r sm:border-line lg:border-r-0",
                  // last row on lg has 3 items (indices 3,4,5) — remove bottom border only if row fills
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-paper-raised text-brand">
                  <pillar.Icon aria-hidden className="h-5 w-5" />
                </div>
                <h2 className="mt-5 font-serif text-xl leading-tight text-ink-strong">
                  {pillar.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{pillar.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <section
            aria-labelledby="evidence-tiers"
            id="evidence-tiers"
            className="mt-20 scroll-mt-24"
          >
            <div className="max-w-readable">
              <p className="eyebrow text-brand">Evidence tiers</p>
              <h2
                id="evidence-tiers-heading"
                className="mt-2 font-serif text-display-md text-ink-strong"
              >
                What our 0–5 evidence bar means
              </h2>
              <p className="mt-4 text-ink-muted">
                Every peptide page carries a visible evidence tier. The tier is an editorial
                judgment by our clinical reviewers based on the quality and quantity of available
                literature. Here&rsquo;s the scale in plain English.
              </p>
            </div>

            <ul className="mt-10 border-t border-line">
              {EVIDENCE_TIERS.map((tier) => (
                <li key={tier.level} className="border-b border-line">
                  <div className="grid grid-cols-[auto_1fr] items-start gap-x-6 py-6 md:grid-cols-[auto_minmax(0,1fr)_minmax(0,2fr)] md:gap-x-10">
                    <EvidenceTier level={tier.level} size="md" />
                    <div>
                      <p className="font-mono text-xs text-ink-subtle">Tier {tier.level}</p>
                      <p className="mt-1 font-serif text-lg text-ink-strong">{tier.name}</p>
                    </div>
                    <p className="col-span-2 mt-3 text-sm leading-relaxed text-ink-muted md:col-span-1 md:mt-0">
                      {tier.description}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          </section>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 rounded-md border border-line bg-paper-raised p-8">
            <p className="eyebrow">Disclosure</p>
            <p className="mt-3 max-w-readable leading-relaxed text-ink-muted">
              PeptideNexa is an educational and informational platform. We are not a medical
              provider. Nothing on this site is medical advice. Always consult a qualified
              clinician before acting on anything you read here. See our{" "}
              <Link
                href="/editorial-policy"
                className="font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
              >
                editorial policy
              </Link>{" "}
              for the full governance model.
            </p>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
