import { describe, expect, it } from "vitest";
import { cn, slugify, truncate, formatDate } from "./utils";

describe("cn", () => {
  it("joins and dedupes tailwind classes", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
    expect(cn("text-ink", undefined, "font-bold")).toBe("text-ink font-bold");
    expect(cn(false && "hidden", "block")).toBe("block");
  });
});

describe("slugify", () => {
  it("lowercases and hyphenates", () => {
    expect(slugify("BPC-157 vs TB-500")).toBe("bpc-157-vs-tb-500");
    expect(slugify("  Hello   World  ")).toBe("hello-world");
    expect(slugify("Growth Hormone Secretagogues")).toBe("growth-hormone-secretagogues");
  });

  it("strips punctuation", () => {
    expect(slugify("What's Next?!")).toBe("whats-next");
  });
});

describe("truncate", () => {
  it("does not shorten strings under the limit", () => {
    expect(truncate("hi", 10)).toBe("hi");
  });

  it("adds ellipsis when exceeding the limit", () => {
    const result = truncate("abcdefghij", 6);
    expect(result.endsWith("…")).toBe(true);
    expect(result.length).toBe(6);
  });
});

describe("formatDate", () => {
  it("returns empty string for null/undefined", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate(undefined)).toBe("");
  });

  it("formats an ISO date string", () => {
    // Use a date where US locale formatting is unambiguous across platforms.
    const formatted = formatDate("2024-06-15");
    // "June 15, 2024" or similar — the exact format depends on ICU, so we
    // sanity-check that the year is present rather than matching the full
    // string.
    expect(formatted).toMatch(/2024/);
  });
});
