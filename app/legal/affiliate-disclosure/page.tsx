import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Affiliate disclosure",
  description: "How PeptideNexa discloses affiliate relationships and sponsored content.",
  path: "/legal/affiliate-disclosure",
});

// Placeholder — requires counsel review before production.
export default function AffiliateDisclosurePage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12 md:py-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Legal" },
              { label: "Affiliate disclosure" },
            ]}
          />
          <p className="eyebrow mt-6">Legal</p>
          <h1 className="mt-3 font-serif text-display-lg text-ink-strong text-balance">
            Affiliate disclosure
          </h1>
        </Container>
      </header>
      <Container className="py-12">
        <article className="prose-editorial max-w-prose">
          <p>
            <em>This page is pending counsel review. The version below is a placeholder and is not
            legally binding until finalized.</em>
          </p>
          <p>
            PeptideNexa participates in affiliate and partnership programs with select providers.
            When you click an outbound link labeled as sponsored or affiliate and complete a
            qualifying action on the destination site, we may receive a referral fee. These
            relationships help fund independent editorial work.
          </p>
          <h2>How it affects what you see</h2>
          <p>
            Sponsored and affiliate placements are visibly labeled. Editorial rankings, reviews,
            and comparisons are not influenced by advertiser payment.
          </p>
          <h2>Contact</h2>
          <p>
            Questions about our commercial relationships? Email partnerships@peptidenexa.com.
          </p>
        </article>
      </Container>
    </>
  );
}
