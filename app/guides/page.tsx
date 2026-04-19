import type { Metadata } from "next";
import Link from "next/link";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Guides — editorial research and explainers",
  description: "Research explainers, how-to guides, and category context from the PeptideNexa editorial team.",
  path: "/guides",
});

const guides = [
  {
    slug: "calm-guide-to-peptide-research",
    title: "A calm guide to peptide research",
    excerpt:
      "How to read public peptide research without getting hype-pilled — and what to look for when evaluating a provider.",
  },
];

export default function GuidesIndexPage() {
  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Guides" }]} />
          <h1 className="mt-4 font-serif text-display-lg text-ink">Guides</h1>
          <p className="mt-3 max-w-readable text-ink-muted">
            Editorial explainers and research summaries. Independent, sourced, and reviewed.
          </p>
        </Container>
      </header>
      <Container className="py-12">
        <ul className="divide-y divide-line border-y border-line">
          {guides.map((guide) => (
            <li key={guide.slug} className="py-6">
              <Link href={`/guides/${guide.slug}`} className="group block">
                <h2 className="font-serif text-2xl text-ink group-hover:text-brand">{guide.title}</h2>
                <p className="mt-2 max-w-readable text-ink-muted">{guide.excerpt}</p>
              </Link>
            </li>
          ))}
        </ul>
      </Container>
    </>
  );
}
