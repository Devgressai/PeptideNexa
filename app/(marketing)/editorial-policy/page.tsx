import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Editorial policy",
  description: "Standards and governance for PeptideNexa editorial content.",
  path: "/editorial-policy",
});

export default function EditorialPolicyPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Editorial policy" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">Editorial policy</h1>
        </Container>
      </header>
      <Container className="py-12">
        <article className="prose-editorial max-w-prose">
          <h2>Our voice</h2>
          <p>Measured. Specific. Source-attributed. No hype adjectives.</p>
          <h2>What we will not publish</h2>
          <ul>
            <li>Dosing or prescriptive instructions framed as advice.</li>
            <li>Efficacy claims we cannot source.</li>
            <li>Before/after testimonials.</li>
            <li>Sponsored content that is not clearly labeled.</li>
          </ul>
          <h2>Corrections</h2>
          <p>
            If you identify an error, contact our editorial team. Corrections are documented with
            the date of revision.
          </p>
        </article>
      </Container>
    </>
  );
}
