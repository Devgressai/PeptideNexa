import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { HeroPattern } from "@/components/content/hero-pattern";
import { Reveal } from "@/components/content/reveal";
import { PeptideCard } from "@/components/content/peptide-card";
import { Badge } from "@/components/ui/badge";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getAllCategorySlugs,
  getCategoryBySlug,
} from "@/lib/db/loaders/category";

const CATEGORY_IMAGES: Record<string, string> = {
  "healing-repair": "/generated/cat-healing.png",
  ghs: "/generated/cat-ghs.png",
  metabolic: "/generated/cat-metabolic.png",
  cognitive: "/generated/cat-cognitive.png",
  longevity: "/generated/cat-longevity.png",
};
const DEFAULT_CATEGORY_IMAGE = "/generated/hero-molecular.png";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) {
    return buildMetadata({
      title: "Category not found",
      description: "",
      path: `/peptides/categories/${slug}`,
      noIndex: true,
    });
  }
  return buildMetadata({
    title: `${category.name} — peptide category overview`,
    description: category.description ?? "",
    path: `/peptides/categories/${category.slug}`,
  });
}

export default async function PeptideCategoryPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  const coverImage = CATEGORY_IMAGES[category.slug] ?? DEFAULT_CATEGORY_IMAGE;

  return (
    <>
      <header className="relative overflow-hidden border-b border-line bg-paper">
        <HeroPattern className="pointer-events-none absolute inset-0 h-full w-full" />
        <div
          aria-hidden
          className="pointer-events-none absolute right-0 top-0 hidden h-full w-[42%] opacity-80 lg:block"
        >
          <Image
            src={coverImage}
            alt=""
            fill
            sizes="42vw"
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-paper via-paper/70 to-paper/0" />
        </div>

        <Container className="relative py-14 md:py-20">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Peptides", href: "/peptides" },
              { label: category.name },
            ]}
          />
          <Badge variant="muted" className="mt-6">
            Category
          </Badge>
          <h1 className="mt-5 max-w-2xl font-serif text-display-xl text-ink">{category.name}</h1>
          {category.description ? (
            <p className="mt-6 max-w-readable text-lg text-ink-muted">{category.description}</p>
          ) : null}
          <p className="mt-4 text-sm text-ink-subtle">
            {category.peptides.length}{" "}
            {category.peptides.length === 1 ? "peptide" : "peptides"} in this category
          </p>
        </Container>
      </header>

      <Container className="py-16">
        {category.peptides.length === 0 ? (
          <div className="rounded-lg border border-dashed border-line bg-paper-raised p-10 text-center">
            <p className="font-serif text-xl text-ink">
              No peptides published in {category.name} yet.
            </p>
            <p className="mt-2 text-sm text-ink-muted">
              Editorial is working on it.{" "}
              <Link href="/peptides" className="text-brand underline">
                Browse the full library
              </Link>{" "}
              in the meantime.
            </p>
          </div>
        ) : (
          <Reveal>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {category.peptides.map((peptide) => (
                <PeptideCard key={peptide.slug} peptide={peptide} />
              ))}
            </div>
          </Reveal>
        )}

        <Reveal delay={0.12}>
          <div className="mt-14 border-t border-line pt-10">
            <p className="text-xs uppercase tracking-wider text-ink-subtle">Keep going</p>
            <div className="mt-4 flex flex-wrap gap-x-6 gap-y-2 text-sm">
              <Link href="/peptides" className="font-medium text-ink hover:text-brand">
                All peptides →
              </Link>
              <Link href="/compare" className="font-medium text-ink hover:text-brand">
                Comparisons →
              </Link>
              <Link href="/match" className="font-medium text-ink hover:text-brand">
                Find a provider →
              </Link>
            </div>
          </div>
        </Reveal>
      </Container>
    </>
  );
}
