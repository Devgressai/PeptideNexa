// Public-facing content shapes. These are narrower than Prisma models —
// pages should consume these rather than raw DB records, giving us a
// stable boundary between persistence and presentation.

export type Money = { amount: number; currency: "USD" };

export type Author = {
  slug: string;
  name: string;
  credentials: string | null;
  photoUrl: string | null;
};

export type PeptideSummary = {
  slug: string;
  name: string;
  aliases: string[];
  category: { slug: string; name: string };
  summary: string;
  researchLevel: number;
  commonForms: string[];
};

export type PeptideDetail = PeptideSummary & {
  bodyMdx: string;
  goals: Array<{ slug: string; name: string }>;
  author: Author | null;
  reviewer: Author | null;
  lastReviewedAt: string | null;
  publishedAt: string | null;
  faqs: Array<{ question: string; answer: string }>;
  sources: Array<{ title: string; url: string; publisher: string | null; year: number | null }>;
  relatedPeptideSlugs: string[];
  comparisonSlugs: string[];
  providerSlugs: string[];
};

export type ProviderSummary = {
  slug: string;
  name: string;
  type: "ONLINE" | "CLINIC" | "COMPOUNDING";
  verified: boolean;
  featured: boolean;
  city: string | null;
  state: string | null;
  servesStates: string[];
  shortDescription: string;
  priceTier: "ECONOMY" | "STANDARD" | "PREMIUM" | null;
  peptideSlugs: string[];
  lastVerifiedAt: string | null;
};

export type ProviderDetail = ProviderSummary & {
  websiteUrl: string;
  affiliateUrl: string | null;
  bodyMdx: string | null;
  licensing: string | null;
  editorialNote: string | null;
};

export type DirectoryFilter = {
  type?: ProviderSummary["type"];
  state?: string;
  peptide?: string;
  priceTier?: ProviderSummary["priceTier"];
  featuredOnly?: boolean;
};

export type ComparisonRow = { label: string; a: string; b: string };
export type ComparisonDetail = {
  slug: string;
  peptideA: { slug: string; name: string };
  peptideB: { slug: string; name: string };
  bodyMdx: string;
  matrix: ComparisonRow[];
  faqs: Array<{ question: string; answer: string }>;
};
