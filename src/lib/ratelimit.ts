/**
 * Simple in-memory rate limiter.
 *
 * ⚠️ Works for single-instance deployments only. For Vercel multi-region or
 * any horizontally-scaled deployment, replace with @upstash/ratelimit + Redis:
 * https://github.com/upstash/ratelimit
 */

interface Entry {
  count: number;
  resetAt: number;
}

const store = new Map<string, Entry>();

/**
 * Checks whether a request identified by `key` is within the allowed rate.
 * @param key - Unique identifier (e.g. `"auth:127.0.0.1"`)
 * @param limit - Max requests allowed within the window
 * @param windowMs - Window duration in milliseconds
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): { allowed: boolean; remaining: number } {
  const now = Date.now();
  const entry = store.get(key);

  if (!entry || now > entry.resetAt) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1 };
  }

  if (entry.count >= limit) {
    return { allowed: false, remaining: 0 };
  }

  entry.count++;
  return { allowed: true, remaining: limit - entry.count };
}
