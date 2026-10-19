# Explore Pune

Next.js 16 + Supabase + MapLibre, built to run on free tiers (see Project Documentation v2.0).

Features: place directory with search and filters, place pages with maps, trip planner, chatbot, sign-in (email and Google), saved places, visit log and badges, reviews, travel blogs, moderation and admin dashboard.

## 1. Set up Supabase (once)
1. Run `001_init.sql` from the project documentation (Section 4.3), then `supabase/migrations/002_community.sql` in the SQL editor. 002 adds the profile trigger, badges, rating updates and every Row Level Security policy. It is safe to re-run.
2. **Authentication > URL Configuration**: set Site URL to your live address and add `https://YOUR-SITE/account` and `http://localhost:3000/account` as redirect URLs.
3. Optional Google sign-in: Authentication > Providers > Google.
4. Sign up on the site, then make yourself the first admin in the SQL editor:
   `update profiles set role='admin' where id=(select id from auth.users where email='you@example.com');`
   Moderators (set `role='moderator'` the same way) can approve reviews and blogs and handle reports. Only admins see the other admin tabs.

## 2. Host it (Vercel Hobby, free)
1. Unzip, run `npx vercel` in the folder (or push to GitHub and import at vercel.com/new).
2. Add environment variables: `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `NEXT_PUBLIC_MAP_STYLE_URL` (`https://tiles.openfreemap.org/styles/liberty`). Optional: `LLM_API_KEY`, `LLM_MODEL` for AI-phrased chat answers. Optional: `SUPABASE_SERVICE_ROLE_KEY`, which is used only by the "Delete my account" button; without it that button shows a "not enabled" message.
3. Redeploy. Optional: add a `SITE_URL` GitHub secret so `.github/workflows/keep-alive.yml` pings `/api/v1/health` twice a week and the free database doesn't pause.

Vercel Hobby is for non-commercial use; move to Cloudflare Pages or a paid plan if the site earns money.

## 3. Load places
`data/raw/osm-pune-core.json` is the saved Overpass export (571 elements). Run `npm run import:osm` to stage places, then publish them in **Admin > Import queue** (or `npm run promote` for bulk). Verify hours and fees in **Admin > Places and verification**, which needs an official source URL.

## 4. Check the chatbot
```
CHAT_RATE_LIMIT_OFF=1 npm run dev          # terminal 1
npm run eval:chat -- http://localhost:3000   # terminal 2
```
Runs the 40 questions in `data/chatbot-eval.json` (price, hours, about, nearby, unknown places, prompt injection) and prints PASS, FAIL or REVIEW for each. Re-run after any prompt or data change.

## Run locally
`cp .env.example .env.local`, fill it in, then `npm install && npm run dev`. Also: `npm run typecheck`, `npm run build`.

## How security works
Member and admin pages talk to Supabase directly with the signed-in user's session, so **Row Level Security in `002_community.sql` is the real gatekeeper**: people can only change their own rows, can't publish their own reviews or blogs, and can't change their own role. The admin screens are only convenience. If something looks open, check the policies first.
