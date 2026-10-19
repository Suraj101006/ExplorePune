# Explore Pune: Audit Summary

## Project Metadata
- **Product**: Explore Pune (Tourism Discovery, Smart Trip Planning & Community Platform)
- **Stack**: Next.js 16.4 (App Router, Turbopack), React 19, TypeScript, Supabase (PostgreSQL, PostGIS, pg_trgm), MapLibre GL JS, Zod, Vitest.
- **Authors**: Suraj Dhok & Sahil Jadhav
- **Date**: October 2026

## Baseline Results (Phase 0)
- **Unit Tests**: 7 passing (`lib/planner.test.ts`) in 283ms
- **Typecheck**: 0 errors (`tsc --noEmit` passes clean)
- **ESLint**: 60 problems (52 errors, 8 warnings) - primarily `@typescript-eslint/no-explicit-any` across routes/components and `react-hooks/set-state-in-effect` in `Reviews.tsx`.
- **Build**: Next.js 16 Turbopack error: `ssr: false` with `next/dynamic` in Server Component `app/places/[slug]/page.tsx:8:18` (scheduled for Phase 5 client component isolation).

## Key Vulnerabilities & Bugs Catalogued
- **S1 (High)**: `reviews_update_own` and `blogs_update_own` check only ownership; moderation state can be reverted by authors.
- **S2 (Med)**: `award_milestones(uuid)` is `SECURITY DEFINER` and publicly executable via RPC.
- **S3 (Med)**: Self-reported visits have no rate limit or date boundary.
- **S4 (Med)**: Place verification executes 6 non-atomic client calls.
- **S6 (Low)**: `/api/v1/health` leaks raw database error message.
- **S8 (Low)**: `CHAT_RATE_LIMIT_OFF=1` can bypass rate limiter.
- **P1**: Every public page is `force-dynamic` with uncached queries.
- **P2**: `useAuth()` hook instantiated in 6 independent places without central provider.
- **P3**: PostgREST silent 1000-row truncation on unbounded selects.
- **U1**: Inline grid styles override responsive media queries on mobile.
- **U2**: Unstyled `.card` and `.chips` classes.
- **U3**: Skip link hidden via `.sr` (`left: -9999px`) without visible `:focus` state.
- **U4**: Native browser `alert()` and `confirm()` dialogs in user workflows.
- **U5**: Chat widget lacks accessible dialog role and Esc key dismissal.
