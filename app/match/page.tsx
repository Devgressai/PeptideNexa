import type { Metadata } from "next";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { DisclaimerBanner } from "@/components/content/disclaimer-banner";
import { QuizStepper } from "@/components/match/quiz-stepper";
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
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Find a provider" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">Find a peptide provider</h1>
          <p className="mt-3 max-w-readable text-ink-muted">
            Tell us what you&rsquo;re researching and where you&rsquo;re located. We&rsquo;ll share a
            short list of providers that we have independently reviewed.
          </p>
        </Container>
      </header>

      <Container className="py-12">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_440px]">
          <div className="prose-editorial max-w-prose">
            <h2>How matching works</h2>
            <p>
              We use what you share — goals, state, preference for online or in-person, budget — to
              filter our provider directory. We never sell raw lead data. Providers you&rsquo;re
              matched with receive your contact details and will follow up directly.
            </p>
            <h2>Our promises</h2>
            <ul>
              <li>We only feature providers we have independently reviewed.</li>
              <li>Sponsored placements are clearly labeled and do not override match logic.</li>
              <li>We are not a medical provider and do not prescribe or diagnose.</li>
            </ul>
            <DisclaimerBanner variant="strong" />
          </div>

          <aside>
            <div className="rounded-lg border border-line bg-paper-raised p-6 shadow-card">
              <QuizStepper source="match:quiz" />
            </div>
          </aside>
        </div>
      </Container>
    </>
  );
}
