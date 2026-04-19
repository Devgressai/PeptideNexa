import type { Metadata } from "next";
import { publicEnv } from "@/lib/env";
import { absoluteUrl, truncate } from "@/lib/utils";

type BuildMetadataInput = {
  title: string;
  description: string;
  path: string;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  noIndex?: boolean;
};

const DEFAULT_OG_IMAGE = "/og/default.png"; // served by app/og/default.png/route.tsx

export function buildMetadata(input: BuildMetadataInput): Metadata {
  const url = absoluteUrl(input.path);
  const title = truncate(input.title, 60);
  const description = truncate(input.description, 160);
  const image = input.image ?? DEFAULT_OG_IMAGE;

  return {
    metadataBase: new URL(publicEnv.NEXT_PUBLIC_SITE_URL),
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: input.type ?? "website",
      siteName: publicEnv.NEXT_PUBLIC_SITE_NAME,
      title,
      description,
      url,
      images: [{ url: image, width: 1200, height: 630 }],
      publishedTime: input.publishedTime,
      modifiedTime: input.modifiedTime,
      authors: input.authors,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
    robots: input.noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  };
}

export const defaultMetadata: Metadata = buildMetadata({
  title: "PeptideNexa — Research peptides. Compare providers. Decide with confidence.",
  description:
    "An editorial and directory platform for peptide research and provider discovery. Structured, sourced, and independent.",
  path: "/",
});
