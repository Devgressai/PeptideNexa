import { describe, expect, it } from "vitest";
import { leadInputSchema } from "./lead";

const valid = {
  email: "a@b.com",
  source: "match:quiz",
  consent: true,
} as const;

describe("leadInputSchema", () => {
  it("accepts a minimal valid payload", () => {
    const parsed = leadInputSchema.parse(valid);
    expect(parsed.email).toBe("a@b.com");
    expect(parsed.consent).toBe(true);
    expect(parsed.onlineOk).toBe(true); // default applied
  });

  it("rejects invalid emails", () => {
    expect(() => leadInputSchema.parse({ ...valid, email: "not-an-email" })).toThrow();
  });

  it("requires consent to be literal true", () => {
    expect(() => leadInputSchema.parse({ ...valid, consent: false })).toThrow();
  });

  it("uppercases and length-checks state codes", () => {
    const parsed = leadInputSchema.parse({ ...valid, locationState: "tx" });
    expect(parsed.locationState).toBe("TX");

    expect(() => leadInputSchema.parse({ ...valid, locationState: "Texas" })).toThrow();
  });

  it("rejects non-empty honeypot (`company`)", () => {
    expect(() => leadInputSchema.parse({ ...valid, company: "Acme" })).toThrow();
  });

  it("allows empty honeypot to pass", () => {
    const parsed = leadInputSchema.parse({ ...valid, company: "" });
    expect(parsed.company).toBe("");
  });

  it("validates phone format when provided", () => {
    expect(() =>
      leadInputSchema.parse({ ...valid, phone: "abc" }),
    ).toThrow();
    const ok = leadInputSchema.parse({ ...valid, phone: "(512) 555-0100" });
    expect(ok.phone).toBe("(512) 555-0100");
  });

  it("allows empty phone string via .or(literal(''))", () => {
    const parsed = leadInputSchema.parse({ ...valid, phone: "" });
    expect(parsed.phone).toBe("");
  });
});
