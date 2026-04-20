import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
import { buildMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = buildMetadata({
  title: "Compare peptides — side-by-side research overviews",
  description:
    "Independent comparisons of commonly researched peptides, with structured matrices and narrative summaries.",
  path: "/compare",
});

// Comparison index. Individual matrix templates ship under epic E4-T9.
const COMPARISONS: Array<{
  slug: string;
  a: string;
  b: string;
  summary: string;
  tag: string;
}> = [
  {
    slug: "bpc-157-vs-tb-500",
    a: "BPC-157",
    b: "TB-500",
    summary:
      "Two healing-and-repair peptides with overlapping but distinct research contexts. We unpack mechanisms, forms discussed, and how researchers reason about choice.",
    tag: "Healing & repair",
  },
  {
    slug: "ipamorelin-vs-cjc-1295",
    a: "Ipamorelin",
    b: "CJC-1295",
    summary:
      "Two growth hormone secretagogues often discussed together in the literature. Selective release vs. extended half-life, and how that shapes research conversations.",
    tag: "Growth hormone",
  },
  {
    slug: "sermorelin-vs-ipamorelin",
    a: "Sermorelin",
    b: "Ipamorelin",
    summary:
      "Different mechanisms for stimulating endogenous growth hormone. We compare the pulsatile release profiles and how they&rsquo;re approached in the research literature.",
    tag: "Growth hormone",
  },
];

export default function CompareIndexPage() {
  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-paper">
        <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[38%] opacity-70 lg:block"
        >
          <Image
            src="/generated/cat-ghs.png"
            alt=""
            fill
            sizes="38vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-paper/0" />
        </div>

        <Container className="relative py-14 md:py-20">
          <Breadcrumbs items={[{ label: "Home", href: "/" }, { label: "Compare" }]} />
          <p className="eyebrow mt-6">Comparisons</p>
          <h1 className="mt-3 max-w-2xl font-serif text-display-xl text-ink-strong text-balance">
            Side-by-side research, so you can ask better questions.
          </h1>
          <p className="mt-6 max-w-readable text-lg leading-relaxed text-ink-muted">
            Structured comparisons of peptides that readers frequently research together. Matrix
            first, narrative second. Independent and sourced.
          </p>
        </Container>
      </header>

      <Container className="py-16">
        <div className="grid gap-6 md:grid-cols-2">
          {COMPARISONS.map((item, i) => (
            <Reveal key={item.slug} delay={i * 0.04}>
              <Link
                href={`/compare/${item.slug}` as never}
                aria-label={`${item.a} vs ${item.b}`}
                className="group flex h-full flex-col overflow-hidden rounded-md border border-line bg-paper-raised p-6 transition-all duration-sm hover:border-line-strong hover:shadow-e2 focus-ring"
              >
                <div className="flex items-center justify-between">
                  <p className="eyebrow">{item.tag}</p>
                  <span className="inline-flex items-center gap-1 text-[11px] font-medium text-ink-subtle">
                    <Clock aria-hidden className="h-3 w-3" />
                    New
                  </span>
                </div>

                <div className="mt-5 flex items-center gap-3 border-t border-line pt-5">
                  <span className="font-serif text-3xl leading-none text-ink-strong">
                    {item.a}
                  </span>
                  <span
                    aria-hidden
                    className="font-mono text-[11px] uppercase tracking-[0.2em] text-ink-subtle"
                  >
                    vs
                  </span>
                  <span className="font-serif text-3xl leading-none text-ink-strong">
                    {item.b}
                  </span>
                </div>

                <p className="mt-5 text-sm leading-relaxed text-ink-muted">{item.summary}</p>

                <span className="mt-auto inline-flex items-center gap-1 pt-6 text-sm font-medium text-ink-strong transition-colors duration-sm group-hover:text-brand">
                  Read comparison
                  <ArrowRight
                    aria-hidden
                    className="h-3.5 w-3.5 transition-transform duration-sm group-hover:translate-x-0.5"
                  />
                </span>
              </Link>
            </Reveal>
          ))}
        </div>

        <div className="mt-12 rounded-md border border-dashed border-line-strong bg-paper-sunken p-6 text-sm leading-relaxed text-ink-muted">
          <p>
            Looking for a comparison we haven&rsquo;t published? Tell us which two peptides and
            we&rsquo;ll prioritize it for the next editorial cycle.{" "}
            <Link
              href="/match"
              className="font-medium text-brand underline decoration-brand/35 underline-offset-[3px] hover:decoration-brand"
            >
              Or take our matching quiz
            </Link>{" "}
            to reach a provider directly.
          </p>
        </div>
      </Container>
    </>
  );
}
