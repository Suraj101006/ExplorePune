# Project: Explore Pune (v2.0 Free-Tier Edition)

Developed by Suraj Dhok & Sahil Jadhav.

## Stack
- Frontend: Next.js 16 (App Router), TypeScript, Tailwind CSS, MapLibre GL JS
- Backend: Next.js Route Handlers
- Database: PostgreSQL on Supabase (PostGIS, pg_trgm, unaccent)
- Auth & Storage: Supabase Auth, Supabase Storage
- Testing: Vitest (unit), Playwright (E2E)

## Playbook Rules (SaaS 15-Layer Standard)
- Zero Secrets in Client: Never use NEXT_PUBLIC_ for server keys. Document all variables in .env.example.
- RLS Everywhere: Row Level Security is the true security boundary. Client UI gating is for convenience only.
- Provenance: Always track source_url and verified_at for attractions. Never invent hours or ticket prices.
- Boundaries: Validate all API payloads using Zod schemas.
- Plan Before Code: Every phase starts with an agreed scope and finishes with verification.
- Never Edit Tests to Pass: Fix bugs in application code.
- Small Diffs: Keep edits focused on the active phase.

## Commands
- Dev: `npm run dev`
- Test: `npm test`
- Test Watch: `npm run test:watch`
- Typecheck: `npm run typecheck`
- Lint: `npm run lint`
- Build: `npm run build`
- OSM Import: `npm run import:osm`
- Staging Promote: `npm run promote`
- Chat Evaluation: `npm run eval:chat`

## Architecture & Progress
- Progress Tracker: See `CLAUDE_PROGRESS.md`
- Implementation Plan: See `docs/implementation-plan.md`
- Audit Findings: See `docs/audit.md`
