import type { Metadata } from "next";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
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
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "About" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">About PeptideNexa</h1>
        </Container>
      </header>
      <Container className="py-12">
        <article className="prose-editorial max-w-prose">
          <p>
            PeptideNexa is an independent editorial and directory platform for peptide research and
            provider discovery. We exist to be the calm, sourced, structured source in a category
            that is loud and fragmented.
          </p>
          <p>
            We are not a medical provider. We do not prescribe, diagnose, or deliver medical care.
            We summarize publicly available information, cite sources, and help you find credible
            providers — nothing more.
          </p>
        </article>
      </Container>
    </>
  );
}
