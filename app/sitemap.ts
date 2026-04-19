import type { MetadataRoute } from "next";
import { absoluteUrl } from "@/lib/utils";

// Keep lightweight in MVP. Partition into multiple sitemaps once we have >1000 URLs.
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPaths = [
    "/",
    "/peptides",
    "/providers",
    "/guides",
    "/match",
    "/about",
    "/methodology",
    "/editorial-policy",
    "/for-providers",
    "/legal/privacy",
    "/legal/terms",
    "/legal/affiliate-disclosure",
  ];

  return staticPaths.map((path) => ({
    url: absoluteUrl(path),
    lastModified: now,
    changeFrequency: "weekly",
    priority: path === "/" ? 1 : 0.7,
  }));
}
