// ── Shared Rate Limiter (sliding window, per-IP) ──
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_WINDOW_MS = 60_000;
const RATE_LIMIT_MAX = 20;

export function isRateLimited(ip: string): boolean {
  const now = Date.now();

  // Evict expired entries to prevent memory leak on long-running processes
  if (rateLimitMap.size > 100) {
    for (const [key, val] of rateLimitMap) {
      if (now > val.resetTime) rateLimitMap.delete(key);
    }
  }

  const entry = rateLimitMap.get(ip);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT_MAX) {
    return true;
  }

  return false;
}

export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_HISTORY_DEPTH = 20;
