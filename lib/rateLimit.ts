// Best-effort per-IP limiter. On serverless hosts memory is per-instance, so this is a speed bump, not a wall.
const hits = new Map<string, { n: number; t: number }>();

export function isLimited(req: Request, bucket: string, max: number, windowMs: number): boolean {
  const forwarded = req.headers.get('x-forwarded-for');
  const ip = (forwarded ? forwarded.split(',')[0].trim() : '') || 'unknown';
  const k = `${bucket}:${ip}`;
  const now = Date.now();
  if (hits.size > 5000) hits.clear();
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
