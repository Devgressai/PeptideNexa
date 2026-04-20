import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BadgeCheck, FileText, ShieldCheck, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "About PeptideNexa",
  description:
    "PeptideNexa is an independent editorial and directory platform for peptide research and provider discovery.",
  path: "/about",
});

export default function AboutPage() {
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
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <Badge variant="muted" className="mt-6">
            About
          </Badge>
          <h1 className="mt-5 max-w-2xl font-serif text-display-xl text-ink">
            An independent reference for a category that deserves one.
          </h1>
          <p className="mt-6 max-w-readable text-lg text-ink-muted">
            PeptideNexa is an editorial and directory platform for peptide research and provider
            discovery. We exist because the peptide conversation online is loud, commercial, and
            too often ahead of the evidence. We&rsquo;re the cold-water counterweight.
          </p>
        </Container>
      </header>

      <Container className="py-16">
        <div className="grid gap-14 lg:grid-cols-[2fr_1fr] lg:gap-20">
          <Reveal>
            <article className="prose-editorial max-w-prose">
              <h2>What we are</h2>
              <p>
                A research reference and provider directory. Every peptide page on this site is
                written in-house, reviewed by a clinically credentialed advisor, and cited back
                to the public literature. Every provider is reviewed independently before we
                list them.
              </p>
              <h2>What we are not</h2>
              <p>
                We are not a medical provider. We do not prescribe, diagnose, or deliver care.
                Nothing on this site is medical advice. Always consult a qualified clinician
                before acting on anything you read here.
              </p>
              <h2>How we pay the bills</h2>
              <p>
                PeptideNexa is funded by a mix of affiliate referrals to compliant providers,
                featured listings that providers pay for (always labeled), and direct lead-routing
                contracts. Featured placement buys visibility, not ranking — editorial verdicts
                are independent of payment.
              </p>
              <h2>Who&rsquo;s behind it</h2>
              <p>
                A small in-house editorial team, plus a rotating bench of clinically credentialed
                reviewers. We&rsquo;ll publish bylines and credentials on every page once the
                editorial roster is finalized.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.06}>
            <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="rounded-lg border border-line bg-paper-raised p-6">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-ink-subtle">
                  Commitments
                </h3>
                <ul className="mt-4 space-y-3 text-sm text-ink-muted">
                  <CommitmentItem
                    Icon={FileText}
                    label="Every claim cited"
                  />
                  <CommitmentItem
                    Icon={BadgeCheck}
                    label="Clinical review before publish"
                  />
                  <CommitmentItem
                    Icon={ShieldCheck}
                    label="Labeled sponsored placements"
                  />
                  <CommitmentItem
                    Icon={Sparkles}
                    label="Rankings independent of payment"
                  />
                </ul>
              </div>

              <div className="rounded-lg border border-line bg-paper p-6">
                <h3 className="font-serif text-lg text-ink">More to read</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>
                    <Link href="/methodology" className="text-brand hover:underline">
                      Methodology →
                    </Link>
                  </li>
                  <li>
                    <Link href="/editorial-policy" className="text-brand hover:underline">
                      Editorial policy →
                    </Link>
                  </li>
                  <li>
                    <Link href="/for-providers" className="text-brand hover:underline">
                      For providers →
                    </Link>
                  </li>
                </ul>

                <div className="mt-6">
                  <Button asChild className="w-full">
                    <Link href="/match">Find a provider</Link>
                  </Button>
                </div>
              </div>
            </aside>
          </Reveal>
        </div>
      </Container>
    </>
  );
}

function CommitmentItem({
  Icon,
  label,
}: {
  Icon: typeof BadgeCheck;
  label: string;
}) {
  return (
    <li className="flex items-start gap-2.5">
      <Icon aria-hidden className="mt-0.5 h-4 w-4 flex-shrink-0 text-brand" />
      <span>{label}</span>
    </li>
  );
}
