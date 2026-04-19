import { describe, expect, it } from "vitest";
import { ProviderStatus } from "@prisma/client";
import { compareProviderRanking, type RankableProvider } from "./ranking";

function rank(input: Omit<RankableProvider, "status"> & { status?: ProviderStatus }): RankableProvider {
  return {
    status: input.status ?? ProviderStatus.LISTED,
    verified: input.verified,
    lastVerifiedAt: input.lastVerifiedAt,
    name: input.name,
  };
}

describe("compareProviderRanking", () => {
  it("puts FEATURED above LISTED", () => {
    const featured = rank({ name: "A", verified: true, lastVerifiedAt: new Date(), status: ProviderStatus.FEATURED });
    const listed = rank({ name: "Z", verified: true, lastVerifiedAt: new Date(), status: ProviderStatus.LISTED });
    expect(compareProviderRanking(featured, listed)).toBeLessThan(0);
  });

  it("prefers verified when status ties", () => {
    const verified = rank({ name: "X", verified: true, lastVerifiedAt: new Date() });
    const unverified = rank({ name: "A", verified: false, lastVerifiedAt: new Date() });
    expect(compareProviderRanking(verified, unverified)).toBeLessThan(0);
  });

  it("prefers more recent verification when status and verified flag tie", () => {
    const recent = rank({ name: "Z", verified: true, lastVerifiedAt: new Date("2026-01-01") });
    const older = rank({ name: "A", verified: true, lastVerifiedAt: new Date("2024-01-01") });
    expect(compareProviderRanking(recent, older)).toBeLessThan(0);
  });

  it("sorts never-verified rows last when recency is the deciding factor", () => {
    const verifiedOnce = rank({ name: "Z", verified: true, lastVerifiedAt: new Date("2024-01-01") });
    const neverVerified = rank({ name: "A", verified: true, lastVerifiedAt: null });
    expect(compareProviderRanking(verifiedOnce, neverVerified)).toBeLessThan(0);
  });

  it("falls back to alphabetical name when all else ties", () => {
    const a = rank({ name: "Austin Clinic", verified: true, lastVerifiedAt: new Date("2026-01-01") });
    const b = rank({ name: "Zephyr Clinic", verified: true, lastVerifiedAt: new Date("2026-01-01") });
    expect(compareProviderRanking(a, b)).toBeLessThan(0);
  });

  it("returns a stable ordering when sorting arrays", () => {
    const input = [
      rank({ name: "Listed verified old", verified: true, lastVerifiedAt: new Date("2024-01-01") }),
      rank({ name: "Featured verified", verified: true, lastVerifiedAt: new Date("2025-01-01"), status: ProviderStatus.FEATURED }),
      rank({ name: "Listed unverified", verified: false, lastVerifiedAt: null }),
      rank({ name: "Featured unverified", verified: false, lastVerifiedAt: null, status: ProviderStatus.FEATURED }),
    ];
    const sorted = [...input].sort(compareProviderRanking).map((p) => p.name);
    expect(sorted).toEqual([
      "Featured verified",
      "Featured unverified",
      "Listed verified old",
      "Listed unverified",
    ]);
  });
});
