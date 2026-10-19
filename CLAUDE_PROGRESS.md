# CLAUDE_PROGRESS.md

Developed by Suraj Dhok & Sahil Jadhav. Keep this file short. Update after every phase.

## Current Project Status
- Phase 0 (Baseline) & Phase 1 (Quick Security & Correctness Fixes) completed.
- Core security vulnerabilities S1, S2, S3, S6, S8, S11 resolved and verified with automated tests.
- 18 automated tests passing in Vitest (2 test suites). Typecheck passing clean with 0 errors.

## Completed Work
- **Phase 0: Baseline and Safety Net**:
  - Committed `001_init.sql` base schema (19 tables, PostGIS, pg_trgm, enums).
  - Configured Vitest, Playwright, CI workflow (`.github/workflows/ci.yml`), and initial planner tests.
  - Established `docs/audit.md`, `docs/implementation-plan.md`, `CLAUDE.md`, and `AGENTS.md`.
- **Phase 1: Quick Security and Correctness Fixes**:
  - **S1 Fixed**: Tightened `reviews_update_own` and `blogs_update_own` policies in `003_security_fixes.sql` so authors cannot reopen removed reviews/blogs.
  - **S2 Fixed**: Revoked execution of `award_milestones(uuid)` from `public`, `anon`, and `authenticated` RPC callers.
  - **S3 Fixed**: Added `visits_no_future_dates` constraint, unique index per place/day, and max 10 daily visits trigger (`check_visit_daily_cap`).
  - **S6 Fixed**: Sanitized `app/api/v1/health/route.ts` error output so internal database error messages are never leaked publicly.
  - **S8 Fixed**: Secured `app/api/v1/chat/route.ts` so `CHAT_RATE_LIMIT_OFF=1` is strictly ignored in production.
  - **S11 Fixed**: Created unique index `reports_reporter_target_uidx` on `reports (reporter_id, target_type, target_id)`.
  - Added test suite `tests/security.test.ts` (11 tests covering rate limiter, migration 003 invariants, S6, and S8).

## Files Changed
- **Created**:
  - `supabase/migrations/003_security_fixes.sql`
  - `tests/security.test.ts`
- **Modified**:
  - `app/api/v1/health/route.ts` (S6 error sanitization)
  - `app/api/v1/chat/route.ts` (S8 production rate limit enforcement)
  - `lib/rateLimit.ts` (added `resetRateLimits()` test helper & defensive parsing)
  - `CLAUDE_PROGRESS.md` (progress update)

## Database Changes
- Created `supabase/migrations/003_security_fixes.sql` with idempotent fixes for S1, S2, S3, and S11 plus documented rollback block.
- Planned future migrations: `004_milestones_admin.sql` (Phase 7), `005_admin_dashboard.sql` (Phase 9), `006_indexes.sql` (Phase 10).

## Tests Performed
- **Vitest**: `npm test` -> 18/18 tests passed across 2 suites (`lib/planner.test.ts`, `tests/security.test.ts`) in 188ms.
- **Typecheck**: `npm run typecheck` (`tsc --noEmit`) -> 0 errors.

## Remaining Known Issues (Scheduled)
- **S4**: Place verification non-atomic (Phase 9c).
- **P1**: All public pages force-dynamic (Phase 10).
- **P2**: Uncached `useAuth()` in 6 locations (Phase 3).
- **P3**: 1000-row silent truncation risk in PostgREST queries (Phase 6).
- **U1**: Inline grid styles beat mobile media query (Phase 2).
- **U2**: Unstyled `.card` and `.chips` classes (Phase 2).
- **U3**: Skip link invisible on focus (Phase 3).
- **U4**: Native browser alerts in review/account flows (Phase 5).
- **U5**: Chat panel lacks dialog accessibility (Phase 3).

## Next Recommended Task
- **Phase 2: Design Tokens and Primitives**
  - Establish CSS token layer in `globals.css` and `app/ui.css`.
  - Build UI primitives in `components/ui/` (`Button`, `Field`, `Card`, `Badge`, `Progress`, `Skeleton`, `EmptyState`, `ErrorState`, `Dialog`, `ConfirmDialog`, `Toast`, `Tabs`, `Table`, `StatCard`).
  - Build SVG chart primitives in `components/charts/` (`Sparkline`, `BarChart`, `Ring`).
  - Fix U1, U2, U3 (CSS), U8; add WCAG contrast check script `scripts/contrast.ts`.
