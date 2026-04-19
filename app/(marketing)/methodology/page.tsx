import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Methodology",
  description: "How PeptideNexa researches, sources, and reviews its content.",
  path: "/methodology",
});

export default function MethodologyPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Methodology" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">Methodology</h1>
        </Container>
      </header>
      <Container className="py-12">
        <article className="prose-editorial max-w-prose">
          <h2>Sourcing</h2>
          <p>
            Every peptide page lists the primary sources behind its claims. We prefer peer-reviewed
            literature and primary studies. Secondary sources are labeled as such.
          </p>
          <h2>Review</h2>
          <p>
            Peptide pages are reviewed by a clinically credentialed advisor before publication.
            Top-volume pages are re-reviewed quarterly.
          </p>
          <h2>Editorial independence</h2>
          <p>
            Featured and affiliate placements are clearly labeled. Editorial rankings, comparisons,
            and review language are not influenced by advertiser payment.
          </p>
        </article>
      </Container>
    </>
  );
}
