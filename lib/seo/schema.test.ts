import { describe, expect, it } from "vitest";
import {
  organizationSchema,
  websiteSchema,
  breadcrumbSchema,
  faqSchema,
  itemListSchema,
  medicalWebPageSchema,
  providerSchema,
} from "./schema";

describe("organizationSchema", () => {
  it("returns a valid Organization JSON-LD", () => {
    const s = organizationSchema();
    expect(s["@type"]).toBe("Organization");
    expect(s["@context"]).toBe("https://schema.org");
    expect(s.name).toBe("PeptideNexa");
  });
});

describe("websiteSchema", () => {
  it("includes a SearchAction pointing at /search", () => {
    const s = websiteSchema() as Record<string, unknown>;
    const action = s.potentialAction as Record<string, unknown>;
    expect(action["@type"]).toBe("SearchAction");
    expect(String(action.target)).toMatch(/search\?q=\{search_term_string\}/);
  });
});

describe("breadcrumbSchema", () => {
  it("positions crumbs 1-indexed in order", () => {
    const s = breadcrumbSchema([
      { name: "Home", path: "/" },
      { name: "Peptides", path: "/peptides" },
      { name: "BPC-157", path: "/peptides/bpc-157" },
    ]) as Record<string, unknown>;
    const items = s.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(3);
    expect(items[0]?.position).toBe(1);
    expect(items[2]?.position).toBe(3);
    expect(items[2]?.name).toBe("BPC-157");
  });
});

describe("faqSchema", () => {
  it("wraps each Q/A in Question + Answer nodes", () => {
    const s = faqSchema([{ question: "Is it approved?", answer: "No." }]) as Record<string, unknown>;
    const entities = s.mainEntity as Array<Record<string, unknown>>;
    expect(entities[0]?.["@type"]).toBe("Question");
    const answer = entities[0]?.acceptedAnswer as Record<string, unknown>;
    expect(answer["@type"]).toBe("Answer");
    expect(answer.text).toBe("No.");
  });
});

describe("itemListSchema", () => {
  it("emits ItemList with numberOfItems and positions", () => {
    const s = itemListSchema("peptides", [
      { name: "BPC-157", path: "/peptides/bpc-157" },
      { name: "TB-500", path: "/peptides/tb-500" },
    ]) as Record<string, unknown>;
    expect(s["@type"]).toBe("ItemList");
    expect(s.numberOfItems).toBe(2);
    const items = s.itemListElement as Array<Record<string, unknown>>;
    expect(items[0]?.position).toBe(1);
    expect(items[1]?.position).toBe(2);
  });
});

describe("medicalWebPageSchema", () => {
  it("omits author/reviewer when not provided", () => {
    const s = medicalWebPageSchema({
      headline: "BPC-157",
      description: "Summary.",
      path: "/peptides/bpc-157",
    }) as Record<string, unknown>;
    expect(s.author).toBeUndefined();
    expect(s.reviewedBy).toBeUndefined();
  });

  it("includes author and reviewer when provided", () => {
    const s = medicalWebPageSchema({
      headline: "BPC-157",
      description: "Summary.",
      path: "/peptides/bpc-157",
      author: { name: "Editor", credentials: "Staff" },
      reviewer: { name: "Reviewer, MD", credentials: "MD" },
    }) as Record<string, unknown>;
    const author = s.author as Record<string, unknown>;
    const reviewer = s.reviewedBy as Record<string, unknown>;
    expect(author?.name).toBe("Editor");
    expect(reviewer?.name).toBe("Reviewer, MD");
  });
});

describe("providerSchema", () => {
  it("omits address when city is missing", () => {
    const s = providerSchema({
      name: "Example",
      path: "/providers/example",
      description: "Telehealth.",
      websiteUrl: "https://example.com",
      city: null,
      state: null,
      country: "US",
    }) as Record<string, unknown>;
    expect(s.address).toBeUndefined();
  });

  it("includes a PostalAddress when city is set", () => {
    const s = providerSchema({
      name: "Austin Clinic",
      path: "/providers/austin-clinic",
      description: "A clinic.",
      websiteUrl: "https://austin.example.com",
      city: "Austin",
      state: "TX",
      country: "US",
    }) as Record<string, unknown>;
    const addr = s.address as Record<string, unknown>;
    expect(addr["@type"]).toBe("PostalAddress");
    expect(addr.addressLocality).toBe("Austin");
    expect(addr.addressRegion).toBe("TX");
  });
});
