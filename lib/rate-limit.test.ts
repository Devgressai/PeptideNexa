import { describe, expect, it, beforeEach, vi } from "vitest";
import { rateLimit, getClientIp } from "./rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useRealTimers();
  });

  it("permits traffic under the limit", () => {
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 3; i += 1) {
      const r = rateLimit(key, { limit: 3, windowMs: 1000 });
      expect(r.success).toBe(true);
    }
  });

  it("blocks once the limit is exceeded", () => {
    const key = `test:${Math.random()}`;
    for (let i = 0; i < 3; i += 1) rateLimit(key, { limit: 3, windowMs: 1000 });
    const r = rateLimit(key, { limit: 3, windowMs: 1000 });
    expect(r.success).toBe(false);
    expect(r.remaining).toBe(0);
  });

  it("resets after the window expires", () => {
    const key = `test:${Math.random()}`;
    vi.useFakeTimers();
    try {
      vi.setSystemTime(new Date("2026-01-01T00:00:00Z"));
      for (let i = 0; i < 3; i += 1) rateLimit(key, { limit: 3, windowMs: 1000 });
      expect(rateLimit(key, { limit: 3, windowMs: 1000 }).success).toBe(false);

      vi.setSystemTime(new Date("2026-01-01T00:00:02Z")); // +2s, past 1s window
      expect(rateLimit(key, { limit: 3, windowMs: 1000 }).success).toBe(true);
    } finally {
      vi.useRealTimers();
    }
  });
});

describe("getClientIp", () => {
  it("prefers the first value of x-forwarded-for", () => {
    const headers = new Headers({ "x-forwarded-for": "203.0.113.10, 10.0.0.1" });
    expect(getClientIp(headers)).toBe("203.0.113.10");
  });

  it("falls back to x-real-ip", () => {
    const headers = new Headers({ "x-real-ip": "203.0.113.11" });
    expect(getClientIp(headers)).toBe("203.0.113.11");
  });

  it("returns 'unknown' when neither header is present", () => {
    expect(getClientIp(new Headers())).toBe("unknown");
  });
});
