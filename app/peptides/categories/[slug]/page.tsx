import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { Container } from "@/components/layout/container";
import { Breadcrumbs } from "@/components/content/breadcrumbs";
import { PeptideCard } from "@/components/content/peptide-card";
import { buildMetadata } from "@/lib/seo/metadata";
import {
  getAllCategorySlugs,
  getCategoryBySlug,
} from "@/lib/db/loaders/category";

export const revalidate = 300;

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs();
  return slugs.map((slug) => ({ slug }));
}

type Params = { slug: string };

export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
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

export default async function PeptideCategoryPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const category = await getCategoryBySlug(slug);
  if (!category) notFound();

  return (
    <>
      <header className="border-b border-line bg-paper">
        <Container className="py-12">
          <Breadcrumbs
            items={[
              { label: "Home", href: "/" },
              { label: "Peptides", href: "/peptides" },
              { label: category.name },
            ]}
          />
          <h1 className="mt-4 font-serif text-display-lg text-ink">{category.name}</h1>
          <p className="mt-3 max-w-readable text-ink-muted">{category.description}</p>
        </Container>
      </header>

      <Container className="py-12">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {category.peptides.map((peptide) => (
            <PeptideCard key={peptide.slug} peptide={peptide} />
          ))}
        </div>
      </Container>
    </>
  );
}

