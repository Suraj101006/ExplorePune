# CLAUDE_PROGRESS.md

Developed by Suraj Dhok & Sahil Jadhav. Keep this file short. Update after every phase.

## Current Project Status
- Baseline established (Phase 0 complete).
- Initial schema `001_init.sql` extracted from Project Documentation v2.0 and committed to repository.
- Testing infrastructure active: Vitest configured with 7 passing tests for `lib/planner.ts`.
- Next.js 16 + Turbopack baseline recorded.

## Completed Work
- **Phase 0: Baseline and Safety Net**:
  - Extracted and committed `supabase/migrations/001_init.sql` (19 tables, PostGIS, pg_trgm, enums).
  - Created test harness: `package.json` test scripts, `vitest.config.mts`, `playwright.config.ts`.
  - Added CI workflow: `.github/workflows/ci.yml`.
  - Authored comprehensive unit test suite: `lib/planner.test.ts` (7 tests, all passing).
  - Created documentation: `docs/audit.md`, `docs/implementation-plan.md`, `CLAUDE_PROGRESS.md`.
  - Updated `CLAUDE.md` and `AGENTS.md` with playbook rules and test commands.

## Files Changed
- **Created**:
  - `supabase/migrations/001_init.sql`
  - `vitest.config.mts`
  - `playwright.config.ts`
  - `.github/workflows/ci.yml`
  - `lib/planner.test.ts`
  - `docs/audit.md`
  - `docs/implementation-plan.md`
  - `CLAUDE_PROGRESS.md`
- **Modified**:
  - `package.json` (added `test` and `test:watch` scripts)
  - `CLAUDE.md` (playbook rules, credit line, test commands)
  - `AGENTS.md` (synchronized with CLAUDE.md)

## Database Changes
- Committed `001_init.sql` to repository. No live database migrations executed in this phase.
- Planned migrations: `003_security_fixes.sql` (Phase 1), `004_milestones_admin.sql` (Phase 7), `005_admin_dashboard.sql` (Phase 9), `006_indexes.sql` (Phase 10).

## Tests Performed
- **Vitest**: `npm test` -> 7/7 tests passed in 283ms (`lib/planner.test.ts`).
- **Typecheck**: `npm run typecheck` (`tsc --noEmit`) -> 0 errors.
- **ESLint**: `npm run lint` -> 60 baseline issues recorded (52 `@typescript-eslint/no-explicit-any`, 8 warnings).
- **Build**: `npm run build` -> recorded Turbopack `ssr: false` in Server Component `app/places/[slug]/page.tsx` (addressed in Phase 5).

## Known Issues (Tracked for Target Phases)
- **S1**: Authors can reopen removed reviews/blogs (Phase 1).
- **S2**: `award_milestones` exposed as public RPC (Phase 1).
- **S3**: Visits self-reported without rate caps (Phase 1).
- **S4**: Place verification non-atomic (Phase 9c).
- **S6**: `/api/v1/health` leaks internal error messages (Phase 1).
- **S8**: Rate limit bypass outside production (Phase 1).
- **P1**: All public pages force-dynamic (Phase 10).
- **P2**: Uncached `useAuth()` in 6 locations (Phase 3).
- **P3**: 1000-row silent truncation risk in PostgREST queries (Phase 6).
- **U1**: Inline grid styles beat mobile media query (Phase 2).
- **U2**: Unstyled `.card` and `.chips` classes (Phase 2).
- **U3**: Skip link invisible on focus (Phase 3).
- **U4**: Native browser alerts in review/account flows (Phase 5).
- **U5**: Chat panel lacks dialog accessibility (Phase 3).

## Next Recommended Task
- **Phase 1: Quick Security and Correctness Fixes**
  - Create `supabase/migrations/003_security_fixes.sql` (close S1, S2, apply S3 visit limits).
  - Update `app/api/v1/health/route.ts` (close S6).
  - Update `app/api/v1/chat/route.ts` (close S8).
  - Add RLS policy tests for updated security policies.
