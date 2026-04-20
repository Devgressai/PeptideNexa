import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Terms of use",
  description: "Terms governing use of PeptideNexa.",
  path: "/legal/terms",
});

// Placeholder — requires counsel review before production.
export default function TermsPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12 md:py-16">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Legal" },
              { label: "Terms of use" },
            ]}
          />
          <p className="eyebrow mt-6">Legal</p>
          <h1 className="mt-3 font-serif text-display-lg text-ink-strong text-balance">
            Terms of use
          </h1>
        </Container>
      </header>
      <Container className="py-12">
        <article className="prose-editorial max-w-prose">
          <p>
            <em>This page is pending counsel review. The version below is a placeholder and is not
            legally binding until finalized.</em>
          </p>
          <h2>Informational use only</h2>
          <p>
            PeptideNexa provides educational and informational content about peptides and the
            providers who work with them. We are not a medical provider. Nothing on this site is
            medical advice, diagnosis, or treatment.
          </p>
          <h2>Provider relationships</h2>
          <p>
            Some provider listings and outbound links are sponsored or compensated. We label
            sponsored placements visibly. Editorial rankings are independent of payment.
          </p>
          <h2>Limitations</h2>
          <p>
            You use the site at your own discretion. We make no warranties as to the accuracy,
            completeness, or fitness-for-purpose of any content.
          </p>
        </article>
      </Container>
    </>
  );
}
