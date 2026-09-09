/**
 * Fixed-window limiter keyed by hashed IP. In-memory, so it resets on redeploy
 * and is per-instance. That is enough to stop casual flooding on a single-node
 * deployment; put a shared store in front of it if you scale horizontally.
 */
type Window = { count: number; resetAt: number };

const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const buckets = new Map<string, Window>();

export type RateLimitResult = {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
};

export function checkRateLimit(key: string, now = Date.now()): RateLimitResult {
  // Opportunistic sweep so the map cannot grow without bound.
  if (buckets.size > 5000) {
    for (const [k, v] of buckets) if (v.resetAt <= now) buckets.delete(k);
  }

  const existing = buckets.get(key);
  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return { allowed: true, remaining: MAX_PER_WINDOW - 1, retryAfterSeconds: 0 };
  }

  if (existing.count >= MAX_PER_WINDOW) {
    return {
      allowed: false,
      remaining: 0,
      retryAfterSeconds: Math.max(1, Math.ceil((existing.resetAt - now) / 1000)),
    };
  }

  existing.count += 1;
  return {
    allowed: true,
    remaining: MAX_PER_WINDOW - existing.count,
    retryAfterSeconds: 0,
  };
}

export function __resetRateLimit() {
  buckets.clear();
}
