# Explore Pune: Implementation Plan

**Status**: APPROVED — Executing Phase by Phase  
**Developed by**: Suraj Dhok & Sahil Jadhav  
**Source of Truth**: `explore-pune` codebase, SaaS 15-Layer Playbook, and Explore Pune Project Documentation v2.0.

---

## 0. Principles & Rules of Engagement

1. **Plan first, code second**: Review before implementing.
2. **Small tasks, small diffs**: One phase per session, each concluding with test verification and a checkpoint.
3. **Never edit a test to pass**: Fix bugs in code, not tests.
4. **Server is the source of truth**: RLS is the security boundary; client UI gating is convenience only.
5. **No invented facts**: Hours, ticket fees, and contacts remain verified-only.
6. **No new npm dependencies** without explicit justification and approval.

---

## 1. Resolved Decisions (Section 15)

1. **`001_init.sql`**: Extracted directly from Project Documentation v2.0 Section 4.3 and committed to `supabase/migrations/001_init.sql`.
2. **S3 (Self-reported visits)**: Option (b) approved. Light limits added in `003_security_fixes.sql` (1 visit per place/day, no future dates, daily cap).
3. **S1 (Review/Blog resubmission)**: Authors may resubmit `rejected` items (sets back to `pending`), but `removed` items cannot be reopened.
4. **Planner-runs KPI**: Omitted by default to keep schema clean.
5. **Rate Limiter**: In-memory with production bypass disabled.
6. **Accessibility Tooling**: `@axe-core/playwright` approved for Phase 11.
7. **Theme**: Light-only public site with warm editorial aesthetic (Cream `#F6EFE0`, Dark Green `#1F4D3A`, Terracotta `#B4512F`).

---

## 2. 14-Phase Implementation Roadmap

- **Phase 0: Baseline & Safety Net** (Current)
  - Extracted & committed `supabase/migrations/001_init.sql`.
  - Configured Vitest (`vitest.config.mts`) and Playwright (`playwright.config.ts`).
  - Added CI workflow (`.github/workflows/ci.yml`).
  - Implemented unit tests for greedy planner (`lib/planner.test.ts`).
  - Documented baseline test, typecheck, lint, and build metrics.

- **Phase 1: Quick Security & Correctness Fixes**
  - Close `S1`: Update RLS policies in `003_security_fixes.sql` (`reviews_update_own`, `blogs_update_own`).
  - Close `S2`: Revoke execute on `award_milestones(uuid)` from public/anon/authenticated.
  - Close `S6`: Sanitize `/api/v1/health` to return generic error without internal message leaks.
  - Close `S8`: Ensure `CHAT_RATE_LIMIT_OFF` is strictly ignored in production.
  - Implement visit limits for `S3`.

- **Phase 2: Design Tokens & Primitives**
  - Establish CSS token layer in `globals.css` and `app/ui.css`.
  - Build UI primitives: `Button`, `Field`, `Card`, `Badge`, `Progress`, `Skeleton`, `EmptyState`, `ErrorState`, `Dialog`, `ConfirmDialog`, `Toast`, `Tabs`, `Table`, `StatCard`.
  - Build SVG chart primitives: `Sparkline`, `BarChart`, `Ring`.
  - Resolve `U1`, `U2`, `U3` (CSS), and `U8`.

- **Phase 3: App Shell & Auth Context**
  - Create centralized `AuthProvider` to eliminate 6 redundant `useAuth` instances (`P2`).
  - Accessible `<main>` landmark and skip link (`U3`).
  - Accessible mobile navigation drawer and breadcrumbs.
  - Fix chat widget accessible dialog role and Esc handling (`U5`).

- **Phase 4: Home & Places Directory**
  - Discovery filters, sort, and categories.
  - Lazy MapLibre integration (`view=map`).
  - Trigram name search indexing and URL-driven filter sync.

- **Phase 5: Place Detail, Reviews, Save & Visit**
  - Isolate map in client component to fix Turbopack `ssr: false` Server Component build error.
  - Sticky mobile action bar and accessible modal dialogs (`U4`).
  - Optimistic bookmark toggle with toast feedback.

- **Phase 6: Planner & Chatbot**
  - Refine planner UI with quick duration presets and route map.
  - Grounded chatbot refinement with suggestion chips and mobile offset.

- **Phase 7: Milestones & Badges (User & Admin)**
  - Pure calculation in `lib/milestones.ts` for earned, in-progress, and locked states.
  - Passport-stamp visual motifs and celebratory unlocks.
  - Admin management RPC `admin_milestone_stats()`.

- **Phase 8: Blogs, Account & Profile**
  - Story reading layout with calculated reading time.
  - Visit history, error boundaries, and profile editing.

- **Phase 9: Admin Dashboard**
  - Role-aware sidebar layout.
  - Overview KPI strip, 30-day activity chart, and attention queue.
  - Moderation queue for reviews, blogs, and reports.
  - Atomic verification RPC `admin_verify_place` (`S4`).

- **Phase 10: Performance & Hardening**
  - Cache revalidation strategy and image optimization.
  - Migration `006_indexes.sql` for trigram and geospatial query acceleration.
  - Structured redaction logger (`lib/logger.ts`).

- **Phase 11: Accessibility & Responsive Sweep**
  - Automated `@axe-core/playwright` audits across key breakpoints (360, 768, 1280).
  - WCAG 2.1 AA keyboard navigation and focus rings.

- **Phase 12: RLS & End-to-End Consolidation**
  - Multi-role RLS test matrix (anon, member A, member B, moderator, admin).
  - Playwright end-to-end critical flow automation.

- **Phase 13: Deployment Readiness**
  - Runbooks for deploy, rollback, and automated database backups.
  - Production smoke testing and launch checklist verification.
