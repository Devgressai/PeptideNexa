// JSON-LD structured data generators. Kept pure and typed.

import { absoluteUrl } from "@/lib/utils";

type Jsonld = Record<string, unknown>;

export function organizationSchema(): Jsonld {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "PeptideNexa",
    url: absoluteUrl("/"),
    logo: absoluteUrl("/brand/logo.png"),
    sameAs: [],
  };
}

export function websiteSchema(): Jsonld {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "PeptideNexa",
    url: absoluteUrl("/"),
    potentialAction: {
      "@type": "SearchAction",
      target: `${absoluteUrl("/search")}?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

type BreadcrumbItem = { name: string; path: string };
export function breadcrumbSchema(items: BreadcrumbItem[]): Jsonld {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}

type FaqItem = { question: string; answer: string };
export function faqSchema(items: FaqItem[]): Jsonld {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: { "@type": "Answer", text: item.answer },
    })),
  };
}

type MedicalPageInput = {
  headline: string;
  description: string;
  path: string;
  datePublished?: string;
  dateModified?: string;
  author?: { name: string; credentials?: string };
  reviewer?: { name: string; credentials?: string };
};

export function medicalWebPageSchema(input: MedicalPageInput): Jsonld {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    url: absoluteUrl(input.path),
    headline: input.headline,
    description: input.description,
    datePublished: input.datePublished,
    dateModified: input.dateModified,
    author: input.author
      ? { "@type": "Person", name: input.author.name, jobTitle: input.author.credentials }
      : undefined,
    reviewedBy: input.reviewer
      ? { "@type": "Person", name: input.reviewer.name, jobTitle: input.reviewer.credentials }
      : undefined,
    inLanguage: "en-US",
    isFamilyFriendly: true,
  };
}

type ProviderSchemaInput = {
  name: string;
  path: string;
  description: string;
  websiteUrl: string;
  city?: string | null;
  state?: string | null;
  country?: string | null;
};

type ItemListEntry = { name: string; path: string };
export function itemListSchema(name: string, items: ItemListEntry[]): Jsonld {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name,
    numberOfItems: items.length,
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      url: absoluteUrl(item.path),
    })),
  };
}

export function providerSchema(input: ProviderSchemaInput): Jsonld {
  return {
    "@context": "https://schema.org",
    "@type": "MedicalBusiness",
    name: input.name,
    url: absoluteUrl(input.path),
    sameAs: [input.websiteUrl],
    description: input.description,
    address: input.city
      ? {
          "@type": "PostalAddress",
          addressLocality: input.city ?? undefined,
          addressRegion: input.state ?? undefined,
          addressCountry: input.country ?? "US",
        }
      : undefined,
  };
}
