import { describe, it, expect, beforeEach, vi } from 'vitest';
import { isLimited, resetRateLimits } from '@/lib/rateLimit';
import fs from 'node:fs';
import path from 'node:path';

describe('Phase 1 Security & Correctness Fixes', () => {
  beforeEach(() => {
    resetRateLimits();
  });

  describe('Rate Limiter (lib/rateLimit.ts & S8)', () => {
    it('allows requests within the limit and blocks requests exceeding threshold', () => {
      const mockReq = new Request('http://localhost:3000/api/v1/chat', {
        headers: { 'x-forwarded-for': '192.168.1.100' },
      });

      // Limit: 3 requests per 60 seconds
      expect(isLimited(mockReq, 'chat', 3, 60000)).toBe(false); // Request 1: allowed
      expect(isLimited(mockReq, 'chat', 3, 60000)).toBe(false); // Request 2: allowed
      expect(isLimited(mockReq, 'chat', 3, 60000)).toBe(false); // Request 3: allowed
      expect(isLimited(mockReq, 'chat', 3, 60000)).toBe(true);  // Request 4: blocked
    });

    it('isolates different IP addresses into separate buckets', () => {
      const reqA = new Request('http://localhost:3000/api/v1/chat', {
        headers: { 'x-forwarded-for': '10.0.0.1' },
      });
      const reqB = new Request('http://localhost:3000/api/v1/chat', {
        headers: { 'x-forwarded-for': '10.0.0.2' },
      });

      for (let i = 0; i < 3; i++) {
        isLimited(reqA, 'chat', 3, 60000);
      }
      expect(isLimited(reqA, 'chat', 3, 60000)).toBe(true);
      expect(isLimited(reqB, 'chat', 3, 60000)).toBe(false);
    });

    it('resets counter after window expires', () => {
      const req = new Request('http://localhost:3000/api/v1/chat', {
        headers: { 'x-forwarded-for': '10.0.0.1' },
      });

      expect(isLimited(req, 'chat', 1, 100)).toBe(false);
      expect(isLimited(req, 'chat', 1, 100)).toBe(true);

      // Fast-forward past window
      vi.setSystemTime(Date.now() + 200);
      expect(isLimited(req, 'chat', 1, 100)).toBe(false);
      vi.useRealTimers();
    });
  });

  describe('Migration 003 Security Fixes Verification', () => {
    const migrationPath = path.resolve(__dirname, '../supabase/migrations/003_security_fixes.sql');
    const sql = fs.readFileSync(migrationPath, 'utf8');

    it('implements S1: restricts review updates so authors cannot reopen removed reviews', () => {
      expect(sql).toContain('drop policy if exists reviews_update_own on reviews');
      expect(sql).toMatch(/reviews_update_own[\s\S]*?using\s*\([\s\S]*?status in \('pending', 'published', 'rejected'\)\)/i);
      expect(sql).toMatch(/with check\s*\([\s\S]*?status = 'pending'\)/i);
    });

    it('implements S1: restricts blog updates so authors cannot reopen removed blogs', () => {
      expect(sql).toContain('drop policy if exists blogs_update_own on blogs');
      expect(sql).toMatch(/blogs_update_own[\s\S]*?using\s*\([\s\S]*?status in \('pending', 'published', 'rejected'\)\)/i);
      expect(sql).toMatch(/with check\s*\([\s\S]*?status = 'pending'\)/i);
    });

    it('implements S2: revokes execution privilege on award_milestones from public, anon, and authenticated', () => {
      expect(sql).toMatch(/revoke execute on function award_milestones\(uuid\) from public;/i);
      expect(sql).toMatch(/revoke execute on function award_milestones\(uuid\) from anon;/i);
      expect(sql).toMatch(/revoke execute on function award_milestones\(uuid\) from authenticated;/i);
    });

    it('implements S3: adds constraints preventing future visit dates and duplicate daily visits', () => {
      expect(sql).toMatch(/alter table visits add constraint visits_no_future_dates check \(visited_at <= current_date\);/i);
      expect(sql).toMatch(/create unique index if not exists visits_user_place_date_uidx on visits \(user_id, place_id, visited_at\);/i);
      expect(sql).toMatch(/check_visit_daily_cap/i);
    });

    it('implements S11: adds unique index to deduplicate reports by reporter and target', () => {
      expect(sql).toMatch(/create unique index if not exists reports_reporter_target_uidx on reports \(reporter_id, target_type, target_id\);/i);
    });

    it('includes a rollback note for auditability', () => {
      expect(sql).toContain('ROLLBACK NOTE');
    });
  });

  describe('API S6 & S8 Route Defenses', () => {
    const healthRoutePath = path.resolve(__dirname, '../app/api/v1/health/route.ts');
    const healthCode = fs.readFileSync(healthRoutePath, 'utf8');

    const chatRoutePath = path.resolve(__dirname, '../app/api/v1/chat/route.ts');
    const chatCode = fs.readFileSync(chatRoutePath, 'utf8');

    it('ensures /api/v1/health does not return raw error.message in JSON response (S6)', () => {
      // Must not leak error.message in response JSON
      expect(healthCode).not.toMatch(/error:\s*error\.message/);
      expect(healthCode).toContain("error: 'Database connection check failed.'");
      expect(healthCode).toContain('console.error(');
    });

    it('ensures /api/v1/chat enforces rate limiting in production even if CHAT_RATE_LIMIT_OFF=1 (S8)', () => {
      expect(chatCode).toMatch(/process\.env\.NODE_ENV !== 'production' && process\.env\.CHAT_RATE_LIMIT_OFF === '1'/);
    });
  });

  describe('UpGuard Security Baseline & CSP Hardening', () => {
    const nextConfigPath = path.resolve(__dirname, '../next.config.ts');
    const nextConfigCode = fs.readFileSync(nextConfigPath, 'utf8');

    const middlewarePath = path.resolve(__dirname, '../middleware.ts');
    const middlewareCode = fs.readFileSync(middlewarePath, 'utf8');

    const vercelJsonPath = path.resolve(__dirname, '../vercel.json');
    const vercelJson = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));

    it('eliminates unsafe-eval from Content Security Policy in next.config.ts', () => {
      expect(nextConfigCode).not.toContain("'unsafe-eval'");
    });

    it('eliminates insecure http: sources from img-src in next.config.ts and enforces upgrade-insecure-requests', () => {
      expect(nextConfigCode).not.toContain("http:");
      expect(nextConfigCode).toContain("upgrade-insecure-requests");
      expect(nextConfigCode).toContain("object-src 'none'");
    });

    it('enforces X-Content-Type-Options: nosniff in next.config.ts, middleware.ts, and vercel.json', () => {
      expect(nextConfigCode).toContain('X-Content-Type-Options');
      expect(nextConfigCode).toContain('nosniff');

      expect(middlewareCode).toContain("res.headers.set('X-Content-Type-Options', 'nosniff')");

      const headerEntries = vercelJson.headers[0].headers;
      const nosniffHeader = headerEntries.find((h: { key: string }) => h.key === 'X-Content-Type-Options');
      expect(nosniffHeader).toBeDefined();
      expect(nosniffHeader.value).toBe('nosniff');
    });

    it('ensures middleware attaches security headers to blocked probe scans (404s)', () => {
      expect(middlewareCode).toContain("return applySecurityHeaders(new NextResponse('Not Found', { status: 404 }))");
    });

    it('ensures vercel.json sets HSTS, SAMEORIGIN, and strict-origin-when-cross-origin at the edge', () => {
      const headerEntries = vercelJson.headers[0].headers;
      const hstsHeader = headerEntries.find((h: { key: string }) => h.key === 'Strict-Transport-Security');
      const frameHeader = headerEntries.find((h: { key: string }) => h.key === 'X-Frame-Options');
      const referrerHeader = headerEntries.find((h: { key: string }) => h.key === 'Referrer-Policy');

      expect(hstsHeader.value).toContain('max-age=63072000');
      expect(frameHeader.value).toBe('SAMEORIGIN');
      expect(referrerHeader.value).toBe('strict-origin-when-cross-origin');
    });

    it('enforces industry-standard defense-in-depth headers across all configurations', () => {
      // COOP, CORP, X-Permitted-Cross-Domain-Policies, Origin-Agent-Cluster, X-XSS-Protection
      expect(nextConfigCode).toContain('Cross-Origin-Opener-Policy');
      expect(nextConfigCode).toContain('same-origin-allow-popups');
      expect(nextConfigCode).toContain('Cross-Origin-Resource-Policy');
      expect(nextConfigCode).toContain('X-Permitted-Cross-Domain-Policies');
      expect(nextConfigCode).toContain('Origin-Agent-Cluster');
      expect(nextConfigCode).toContain('X-XSS-Protection');

      expect(middlewareCode).toContain("res.headers.set('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')");
      expect(middlewareCode).toContain("res.headers.set('Cross-Origin-Resource-Policy', 'same-origin')");
      expect(middlewareCode).toContain("res.headers.set('Origin-Agent-Cluster', '?1')");

      const headerEntries = vercelJson.headers[0].headers;
      expect(headerEntries.find((h: { key: string }) => h.key === 'Cross-Origin-Opener-Policy')?.value).toBe('same-origin-allow-popups');
      expect(headerEntries.find((h: { key: string }) => h.key === 'Cross-Origin-Resource-Policy')?.value).toBe('same-origin');
      expect(headerEntries.find((h: { key: string }) => h.key === 'X-Permitted-Cross-Domain-Policies')?.value).toBe('none');
      expect(headerEntries.find((h: { key: string }) => h.key === 'Origin-Agent-Cluster')?.value).toBe('?1');
      expect(headerEntries.find((h: { key: string }) => h.key === 'X-XSS-Protection')?.value).toBe('0');
    });

    it('enforces hardware sensor lockdown in Permissions-Policy', () => {
      const headerEntries = vercelJson.headers[0].headers;
      const permHeader = headerEntries.find((h: { key: string }) => h.key === 'Permissions-Policy')?.value || '';
      expect(permHeader).toContain('payment=()');
      expect(permHeader).toContain('usb=()');
      expect(permHeader).toContain('accelerometer=()');
      expect(permHeader).toContain('gyroscope=()');
      expect(permHeader).toContain('magnetometer=()');
    });

    it('implements RFC 9116 security.txt with required directives and redirect', () => {
      const securityTxtPath = path.resolve(__dirname, '../public/.well-known/security.txt');
      expect(fs.existsSync(securityTxtPath)).toBe(true);
      const securityTxt = fs.readFileSync(securityTxtPath, 'utf8');

      expect(securityTxt).toContain('Contact:');
      expect(securityTxt).toContain('Expires:');
      expect(securityTxt).toContain('Canonical:');
      expect(securityTxt).toContain('Policy:');
      expect(nextConfigCode).toContain('destination: "/.well-known/security.txt"');
    });

    it('verifies /api/v1/places and /api/v1/pmpml enforce rate limiting against scrapers and denial of service', () => {
      const placesRoutePath = path.resolve(__dirname, '../app/api/v1/places/route.ts');
      const placesCode = fs.readFileSync(placesRoutePath, 'utf8');
      expect(placesCode).toContain("isLimited(req, 'places-list'");

      const pmpmlRoutePath = path.resolve(__dirname, '../app/api/v1/pmpml/route.ts');
      const pmpmlCode = fs.readFileSync(pmpmlRoutePath, 'utf8');
      expect(pmpmlCode).toContain("isLimited(req, 'pmpml-api'");
    });
  });
});
