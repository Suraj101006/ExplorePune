-- 003_security_fixes.sql
-- Addresses: S1 (content reopening), S2 (RPC exposure), S3 (visit limits), S11 (report de-duplication)
-- Safe to re-run (idempotent).

-- S1: Prevent authors from reopening removed reviews or blogs
-- Allow authors to edit only if current status is pending, published, or rejected.
-- Content marked 'removed' by moderation remains locked.
drop policy if exists reviews_update_own on reviews;
create policy reviews_update_own on reviews
  for update
  using (user_id = auth.uid() and status in ('pending', 'published', 'rejected'))
  with check (user_id = auth.uid() and status = 'pending');

drop policy if exists blogs_update_own on blogs;
create policy blogs_update_own on blogs
  for update
  using (author_id = auth.uid() and status in ('pending', 'published', 'rejected'))
  with check (author_id = auth.uid() and status = 'pending');

-- S2: Revoke direct execution of award_milestones from public RPC callers
-- Trigger functions (visits_award, reviews_award, blogs_award) still execute it internally.
revoke execute on function award_milestones(uuid) from public;
revoke execute on function award_milestones(uuid) from anon;
revoke execute on function award_milestones(uuid) from authenticated;

-- S3: Visit validation & rate limits
-- 1. No future dates
alter table visits drop constraint if exists visits_no_future_dates;
alter table visits add constraint visits_no_future_dates check (visited_at <= current_date);

-- 2. One visit per place per day per user
create unique index if not exists visits_user_place_date_uidx on visits (user_id, place_id, visited_at);

-- 3. Daily visit cap trigger (max 10 visits per day per user)
create or replace function check_visit_daily_cap() returns trigger language plpgsql as $$
declare
  today_count int;
begin
  select count(*) into today_count
  from visits
  where user_id = new.user_id and created_at >= date_trunc('day', now());

  if today_count >= 10 then
    raise exception 'Daily visit limit reached (maximum 10 visits per day)';
  end if;
  return new;
end $$;

drop trigger if exists trg_check_visit_daily_cap on visits;
create trigger trg_check_visit_daily_cap
  before insert on visits
  for each row execute function check_visit_daily_cap();

-- S11: De-duplicate reports (one report per reporter per target)
create unique index if not exists reports_reporter_target_uidx on reports (reporter_id, target_type, target_id);

/*
-- ==============================================================================
-- ROLLBACK NOTE
-- ==============================================================================
-- To roll back these changes in Supabase SQL editor:
--
-- drop policy if exists reviews_update_own on reviews;
-- create policy reviews_update_own on reviews for update using (user_id=auth.uid()) with check (user_id=auth.uid() and status='pending');
--
-- drop policy if exists blogs_update_own on blogs;
-- create policy blogs_update_own on blogs for update using (author_id=auth.uid()) with check (author_id=auth.uid() and status='pending');
--
-- grant execute on function award_milestones(uuid) to authenticated;
--
-- alter table visits drop constraint if exists visits_no_future_dates;
-- drop index if exists visits_user_place_date_uidx;
-- drop trigger if exists trg_check_visit_daily_cap on visits;
-- drop function if exists check_visit_daily_cap();
--
-- drop index if exists reports_reporter_target_uidx;
-- ==============================================================================
*/
