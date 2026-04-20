import type { Metadata } from "next";
import Image from "next/image";
import { BadgeCheck, ShieldCheck, Sparkles } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { DisclaimerBanner } from "@/components/content/disclaimer-banner";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
import { QuizStepper } from "@/components/match/quiz-stepper";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Find a peptide provider — matching request",
  description:
    "Tell us what you're researching. We'll share a short list of providers that fit your goals, state, and preferences.",
  path: "/match",
});

export default function MatchPage() {
  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-paper">
        <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[38%] opacity-60 lg:block"
        >
          <Image
            src="/generated/editorial-spotlight.png"
            alt=""
            fill
            sizes="38vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-paper/0" />
        </div>

        <Container className="relative py-14 md:py-20">
          <Breadcrumbs
            items={[{ label: "Home", href: "/" }, { label: "Find a provider" }]}
          />
          <Badge variant="muted" className="mt-6">
            Matching quiz · 5 steps · ~60 seconds
          </Badge>
          <h1 className="mt-5 max-w-2xl font-serif text-display-xl text-ink">
            Find a peptide provider matched to what you&rsquo;re researching.
          </h1>
          <p className="mt-6 max-w-readable text-lg text-ink-muted">
            Tell us what you&rsquo;re researching and where you&rsquo;re located. We&rsquo;ll share
            a short list of independently reviewed providers that fit — no bulk broadcasts, no
            lead farms.
          </p>
        </Container>
      </header>

      <Container className="py-16">
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_460px] lg:gap-20">
          <Reveal>
            <div className="max-w-prose">
              <h2 className="font-serif text-display-md text-ink">How matching works</h2>

              <ol className="mt-8 space-y-6">
                <HowItem
                  n="01"
                  title="You share your research focus"
                  body="Goal, state, preference for online vs. in-person, budget. Five quick steps. You can skip fields you're not sure about."
                  Icon={Sparkles}
                />
                <HowItem
                  n="02"
                  title="We match to reviewed providers"
                  body="Our engine ranks providers by fit — state, peptide offerings, and price tier — then by editorial verification and recency. No pay-to-win."
                  Icon={BadgeCheck}
                />
                <HowItem
                  n="03"
                  title="A short list, not a broadcast"
                  body="Up to three providers receive your details. Providers have two hours to accept before your request is rerouted. You'll see the list on the next page."
                  Icon={ShieldCheck}
                />
              </ol>

              <div className="mt-12">
                <DisclaimerBanner variant="strong" />
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.06}>
            <aside className="lg:sticky lg:top-24">
              <div className="rounded-2xl border border-line bg-paper-raised p-6 shadow-raised md:p-8">
                <QuizStepper source="match:quiz" />
              </div>
              <p className="mt-4 px-1 text-xs text-ink-subtle">
                Your details are shared with matched providers, never sold to brokers. See our{" "}
                <a className="underline" href="/legal/privacy">
                  privacy policy
                </a>
                .
              </p>
            </aside>
          </Reveal>
        </div>
      </Container>
    </>
  );
}

function HowItem({
  n,
  title,
  body,
  Icon,
}: {
  n: string;
  title: string;
  body: string;
  Icon: typeof Sparkles;
}) {
  return (
    <li className="relative flex gap-5">
      <div className="flex-shrink-0">
        <div className="flex h-10 w-10 items-center justify-center rounded-md border border-line bg-paper text-brand">
          <Icon aria-hidden className="h-5 w-5" />
        </div>
      </div>
      <div>
        <p className="font-mono text-xs font-semibold uppercase tracking-[0.2em] text-brand">
          {n}
        </p>
        <h3 className="mt-1 font-serif text-xl text-ink">{title}</h3>
        <p className="mt-2 text-ink-muted">{body}</p>
      </div>
    </li>
  );
}
