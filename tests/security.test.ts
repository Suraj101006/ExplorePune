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
});
