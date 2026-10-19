// Best-effort per-IP limiter. On serverless hosts memory is per-instance, so this is a speed bump, not a wall.
const hits = new Map<string, { n: number; t: number }>();

export function isLimited(req: Request, bucket: string, max: number, windowMs: number): boolean {
  const ip = (req.headers.get('x-forwarded-for') ?? 'unknown').split(',')[0].trim();
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
