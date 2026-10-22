// Production-grade in-memory rate limiter with sliding expiration and automatic cleanup.

interface RateBucket {
  n: number; // Hit count
  t: number; // Window start timestamp
}

const hits = new Map<string, RateBucket>();
const MAX_MAP_SIZE = 10000;

/**
 * Extracts a dependable client IP from proxy and direct request headers.
 */
export function getClientIp(req: Request): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    const ips = forwarded.split(',').map((s) => s.trim());
    if (ips.length > 0 && ips[0]) return ips[0];
  }
  const realIp = req.headers.get('x-real-ip');
  if (realIp) return realIp.trim();
  const cfIp = req.headers.get('cf-connecting-ip');
  if (cfIp) return cfIp.trim();
  return '127.0.0.1';
}

/**
 * Prunes expired entries instead of blindly clearing active limits.
 */
function pruneExpired(now: number, windowMs: number): void {
  if (hits.size > MAX_MAP_SIZE / 2) {
    for (const [k, v] of hits.entries()) {
      if (now - v.t > windowMs) {
        hits.delete(k);
      }
    }
  }
}

/**
 * Checks rate limit for a given bucket and client IP.
 * Returns true if the client has exceeded the maximum allowed requests in the time window.
 */
export function isLimited(req: Request, bucket: string, max: number, windowMs: number): boolean {
  const ip = getClientIp(req);
  const k = `${bucket}:${ip}`;
  const now = Date.now();

  pruneExpired(now, windowMs);

  const h = hits.get(k);
  if (!h || now - h.t > windowMs) {
    hits.set(k, { n: 1, t: now });
    return false;
  }

  h.n++;
  return h.n > max;
}

export function resetRateLimits(): void {
  hits.clear();
}
