import { describe, expect, it } from "vitest";
import { newsletterInputSchema } from "./newsletter";

describe("newsletterInputSchema", () => {
  it("accepts a valid payload and defaults source", () => {
    const parsed = newsletterInputSchema.parse({ email: "a@b.com" });
    expect(parsed.email).toBe("a@b.com");
    expect(parsed.source).toBe("unknown");
  });

  it("preserves an explicit source", () => {
    const parsed = newsletterInputSchema.parse({ email: "a@b.com", source: "homepage" });
    expect(parsed.source).toBe("homepage");
  });

  it("rejects invalid emails", () => {
    expect(() => newsletterInputSchema.parse({ email: "not-email" })).toThrow();
  });

  it("rejects non-empty honeypot values", () => {
    expect(() => newsletterInputSchema.parse({ email: "a@b.com", company: "Acme" })).toThrow();
  });
});
