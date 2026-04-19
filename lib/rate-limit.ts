// Minimal in-memory rate limiter. Swap for Upstash/Redis in production.
// Keyed per arbitrary string (typically IP + route).

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();

export type RateLimitResult = {
  success: boolean;
  remaining: number;
  resetAt: number;
};

export function rateLimit(
  key: string,
  options: { limit: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    const fresh: Bucket = { count: 1, resetAt: now + options.windowMs };
    buckets.set(key, fresh);
    return { success: true, remaining: options.limit - 1, resetAt: fresh.resetAt };
  }

  if (existing.count >= options.limit) {
    return { success: false, remaining: 0, resetAt: existing.resetAt };
  }

  existing.count += 1;
  return {
    success: true,
    remaining: options.limit - existing.count,
    resetAt: existing.resetAt,
  };
}

export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",").at(0)?.trim();
  if (forwarded) return forwarded;
  return headers.get("x-real-ip") ?? "unknown";
}
