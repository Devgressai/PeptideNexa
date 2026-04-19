import type { Metadata } from "next";
import Link from "next/link";
import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Compare peptides — side-by-side research overviews",
  description: "Independent comparisons of commonly researched peptides, with structured matrices and narrative summaries.",
  path: "/compare",
});

// Comparison index. Individual matrix templates ship under epic E4-T9.
const COMPARISONS: Array<{ slug: string; title: string; summary: string }> = [
  {
    slug: "bpc-157-vs-tb-500",
    title: "BPC-157 vs TB-500",
    summary: "Two healing-and-repair peptides with overlapping but distinct research contexts.",
  },
  {
    slug: "ipamorelin-vs-cjc-1295",
    title: "Ipamorelin vs CJC-1295",
    summary: "Two growth hormone secretagogues often discussed together in the literature.",
  },
  {
    slug: "sermorelin-vs-ipamorelin",
    title: "Sermorelin vs Ipamorelin",
    summary: "Different mechanisms for stimulating endogenous growth hormone.",
  },
];

export default function CompareIndexPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">Peptide comparisons</h1>
          <p className="mt-3 max-w-readable text-ink-muted">
            Side-by-side summaries of peptides that readers frequently research together.
            Independent, sourced, and reviewed.
          </p>
        </Container>
      </header>
      <Container className="py-12">
        <ul className="divide-y divide-line border-y border-line">
          {COMPARISONS.map((item) => (
            <li key={item.slug} className="py-6">
              <div className="group flex items-start justify-between gap-6">
                <div>
                  <Badge variant="muted">Comparison</Badge>
                  <h2 className="mt-2 font-serif text-2xl text-ink">{item.title}</h2>
                  <p className="mt-1 max-w-readable text-ink-muted">{item.summary}</p>
                </div>
                <Link
                  href="/compare"
                  className="self-center text-sm font-medium text-ink-subtle"
                  aria-label={`${item.title} — detail page coming soon`}
                >
                  Coming soon →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
