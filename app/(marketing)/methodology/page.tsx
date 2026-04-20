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
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo/metadata";

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
    body: "We distinguish in-vitro, animal, and human evidence explicitly. A page that says “BPC-157 has been studied for tendon repair” means something different than “BPC-157 has been shown to repair tendons.”",
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
          <Badge variant="muted" className="mt-6">
            How we work
          </Badge>
          <h1 className="mt-5 max-w-2xl font-serif text-display-xl text-ink">
            Trust is a product feature, not a footer link.
          </h1>
          <p className="mt-6 max-w-readable text-lg text-ink-muted">
            These are the editorial principles that govern what we publish, how we review it,
            and how we distinguish independent content from commercial placements.
          </p>
        </Container>
      </header>

      <Container className="py-16">
        <Reveal>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {PILLARS.map((pillar) => (
              <div
                key={pillar.title}
                className="flex h-full flex-col rounded-lg border border-line bg-paper p-6"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-md bg-brand/10 text-brand">
                  <pillar.Icon aria-hidden className="h-5 w-5" />
                </div>
                <h2 className="mt-5 font-serif text-xl text-ink">{pillar.title}</h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-muted">{pillar.body}</p>
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <div className="mt-16 rounded-lg border border-line bg-paper-raised p-8">
            <p className="text-xs uppercase tracking-wider text-ink-subtle">Disclosure</p>
            <p className="mt-3 max-w-readable text-ink-muted">
              PeptideNexa is an educational and informational platform. We are not a medical
              provider. Nothing on this site is medical advice. Always consult a qualified
              clinician before acting on anything you read here. See our{" "}
              <Link href="/editorial-policy" className="text-brand underline">
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
