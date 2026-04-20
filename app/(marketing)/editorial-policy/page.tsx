import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Editorial policy",
  description: "Standards and governance for PeptideNexa editorial content.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-paper">
        <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[38%] opacity-70 lg:block"
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
            items={[{ label: "Home", href: "/" }, { label: "Editorial policy" }]}
          />
          <p className="eyebrow mt-6">Editorial policy</p>
          <h1 className="mt-3 max-w-2xl font-serif text-display-xl text-ink-strong text-balance">
            Measured. Specific. Source-attributed.
          </h1>
          <p className="mt-6 max-w-readable text-lg leading-relaxed text-ink-muted">
            The rules we hold ourselves to when we write, review, and publish.
          </p>
        </Container>
      </header>

      <Container className="py-16">
        <div className="grid gap-14 lg:grid-cols-[2fr_1fr] lg:gap-20">
          <Reveal>
            <article className="prose-editorial max-w-prose">
              <h2>Voice</h2>
              <p>
                Measured. Specific. Source-attributed. No hype adjectives, no rhetorical
                flourishes where a plain statement will do. We write like the reader is
                intelligent and short on time.
              </p>

              <h2>What we will not publish</h2>
              <ul>
                <li>Dosing or prescriptive instructions framed as advice.</li>
                <li>Efficacy claims we cannot source back to the primary literature.</li>
                <li>Before/after testimonials.</li>
                <li>Sponsored content that is not clearly labeled at the top of the page.</li>
                <li>Fabricated or AI-only content presented as editorial.</li>
              </ul>

              <h2>What every page must have</h2>
              <ul>
                <li>A named author and a named clinical reviewer.</li>
                <li>A last-reviewed date visible in the header.</li>
                <li>At least two cited sources, with URLs.</li>
                <li>An “educational and informational use only” disclaimer.</li>
              </ul>

              <h2>Commercial disclosures</h2>
              <p>
                Sponsored and affiliate placements are labeled where they appear. Affiliate
                outbound links use{" "}
                <code>rel=&quot;sponsored nofollow noopener&quot;</code>. Featured provider
                placements are visibly badged. Editorial rankings, reviews, and comparisons are
                never moved by advertiser payment.
              </p>

              <h2>Corrections</h2>
              <p>
                Mistakes happen. If you identify an error, contact
                corrections@peptidenexa.com. Material corrections are logged with the date of
                revision and, where appropriate, a visible change-note on the page.
              </p>

              <h2>AI use</h2>
              <p>
                We use AI tools to assist in research, outlining, and fact-finding. We do not
                publish AI-only content. Every page on this site passes through a human
                editor and a clinical reviewer before it is shipped.
              </p>

              <h2>Content re-review</h2>
              <p>
                Top-traffic pages are re-reviewed quarterly. Lower-traffic pages are reviewed at
                least annually, or whenever new primary research meaningfully changes the
                evidence picture.
              </p>
            </article>
          </Reveal>

          <Reveal delay={0.06}>
            <aside className="flex flex-col gap-6 lg:sticky lg:top-24">
              <div className="rounded-md border border-line bg-paper-raised p-6">
                <h3 className="eyebrow">Questions or corrections</h3>
                <dl className="mt-4 space-y-3 text-sm">
                  <div>
                    <dt className="text-ink-subtle">Corrections</dt>
                    <dd className="font-medium text-ink-strong">corrections@peptidenexa.com</dd>
                  </div>
                  <div>
                    <dt className="text-ink-subtle">Editorial</dt>
                    <dd className="font-medium text-ink-strong">editorial@peptidenexa.com</dd>
                  </div>
                  <div>
                    <dt className="text-ink-subtle">Partnerships</dt>
                    <dd className="font-medium text-ink-strong">partners@peptidenexa.com</dd>
                  </div>
                </dl>
              </div>

              <div className="rounded-md border border-line bg-paper-raised p-6">
                <h3 className="eyebrow">See also</h3>
                <ul className="mt-4 space-y-2 text-sm">
                  <li>
                    <Link
                      href="/methodology"
                      className="font-medium text-ink-strong transition-colors duration-sm hover:text-brand"
                    >
                      Methodology →
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/about"
                      className="font-medium text-ink-strong transition-colors duration-sm hover:text-brand"
                    >
                      About →
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/legal/affiliate-disclosure"
                      className="font-medium text-ink-strong transition-colors duration-sm hover:text-brand"
                    >
                      Affiliate disclosure →
                    </Link>
                  </li>
                </ul>
              </div>
            </aside>
          </Reveal>
        </div>
      </Container>
    </>
  );
}
