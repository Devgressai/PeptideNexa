import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";
import { getPublishedPeptideSlugs } from "@/lib/db/loaders/peptide";
import { getListedProviderSlugs } from "@/lib/db/loaders/provider";
import { getAllCategorySlugs } from "@/lib/db/loaders/category";
import { getPublishedArticleSlugs } from "@/lib/db/loaders/article";

// Single sitemap for MVP scale. Partition into multiple when we cross ~1k URLs.
// The DB loaders catch their own errors and return empty arrays, so a missing
// DB at build time yields a static-only sitemap rather than a build failure.

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const staticEntries: MetadataRoute.Sitemap = [
    { url: absoluteUrl("/"), lastModified: now, changeFrequency: "weekly", priority: 1 },
    { url: absoluteUrl("/peptides"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/providers"), lastModified: now, changeFrequency: "weekly", priority: 0.9 },
    { url: absoluteUrl("/compare"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/guides"), lastModified: now, changeFrequency: "weekly", priority: 0.8 },
    { url: absoluteUrl("/match"), lastModified: now, changeFrequency: "monthly", priority: 0.6 },
    { url: absoluteUrl("/about"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/methodology"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/editorial-policy"), lastModified: now, changeFrequency: "yearly", priority: 0.4 },
    { url: absoluteUrl("/for-providers"), lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: absoluteUrl("/legal/privacy"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/terms"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
    { url: absoluteUrl("/legal/affiliate-disclosure"), lastModified: now, changeFrequency: "yearly", priority: 0.2 },
  ];

  const [peptideSlugs, providerSlugs, categorySlugs, articleSlugs] = await Promise.all([
    getPublishedPeptideSlugs(),
    getListedProviderSlugs(),
    getAllCategorySlugs(),
    getPublishedArticleSlugs(),
  ]);

  const peptides: MetadataRoute.Sitemap = peptideSlugs.map((slug) => ({
    url: absoluteUrl(`/peptides/${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  const providers: MetadataRoute.Sitemap = providerSlugs.map((slug) => ({
    url: absoluteUrl(`/providers/${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  const categories: MetadataRoute.Sitemap = categorySlugs.map((slug) => ({
    url: absoluteUrl(`/peptides/categories/${slug}`),
    lastModified: now,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const articles: MetadataRoute.Sitemap = articleSlugs.map((slug) => ({
    url: absoluteUrl(`/guides/${slug}`),
    lastModified: now,
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [...staticEntries, ...peptides, ...providers, ...categories, ...articles];
}
