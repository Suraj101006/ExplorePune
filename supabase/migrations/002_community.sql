-- Run in Supabase SQL editor AFTER 001_init.sql (from the project documentation). Safe to re-run.
create or replace function is_staff() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from profiles where id=auth.uid() and role in ('moderator','admin')) $$;
create or replace function is_admin() returns boolean language sql stable security definer set search_path=public as $$
  select exists(select 1 from profiles where id=auth.uid() and role='admin') $$;

-- profile row for every new auth user
create or replace function handle_new_user() returns trigger language plpgsql security definer set search_path=public as $$
declare n text := coalesce(nullif(new.raw_user_meta_data->>'display_name',''), split_part(new.email,'@',1));
begin
  if char_length(n) < 2 then n := 'Traveler'; end if;
  insert into profiles(id, display_name) values (new.id, left(n,50)) on conflict do nothing;
  return new;
end $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function handle_new_user();
insert into profiles(id, display_name)
  select id, case when char_length(split_part(email,'@',1))<2 then 'Traveler' else left(split_part(email,'@',1),50) end
  from auth.users on conflict do nothing;

-- nobody but an admin (or the SQL editor) can change a role
create or replace function guard_role() returns trigger language plpgsql security definer set search_path=public as $$
begin
  if new.role is distinct from old.role and auth.uid() is not null and not is_admin() then
    raise exception 'role can only be changed by an admin';
  end if;
  return new;
end $$;
drop trigger if exists profiles_guard_role on profiles;
create trigger profiles_guard_role before update on profiles for each row execute function guard_role();

-- ratings: only published reviews count
create or replace function refresh_place_rating() returns trigger language plpgsql security definer set search_path=public as $$
declare pid uuid := coalesce(new.place_id, old.place_id);
begin
  update places p set
    avg_rating = (select round(avg(rating)::numeric,2) from reviews r where r.place_id=pid and r.status='published'),
    review_count = (select count(*) from reviews r where r.place_id=pid and r.status='published')
  where p.id = pid;
  return null;
end $$;
drop trigger if exists reviews_rating on reviews;
create trigger reviews_rating after insert or update or delete on reviews for each row execute function refresh_place_rating();

-- badges
create or replace function award_milestones(p_user uuid) returns void language plpgsql security definer set search_path=public as $$
begin
  insert into user_milestones (user_id, milestone_id)
  select p_user, m.id from milestones m
  where m.is_active
    and not exists (select 1 from user_milestones um where um.user_id=p_user and um.milestone_id=m.id)
    and case m.criteria_type
      when 'distinct_places' then (select count(distinct place_id) from visits where user_id=p_user)
      when 'category_places' then (select count(distinct v.place_id) from visits v join places p on p.id=v.place_id where v.user_id=p_user and p.category_id=m.category_id)
      when 'approved_blogs' then (select count(*) from blogs where author_id=p_user and status='published')
      when 'approved_reviews' then (select count(*) from reviews where user_id=p_user and status='published')
      else 0 end >= m.criteria_value;
end $$;
create or replace function trg_award() returns trigger language plpgsql security definer set search_path=public as $$
begin
  perform award_milestones(coalesce(to_jsonb(new)->>'user_id', to_jsonb(new)->>'author_id')::uuid);
  return null;
end $$;
drop trigger if exists visits_award on visits;   create trigger visits_award  after insert on visits  for each row execute function trg_award();
drop trigger if exists reviews_award on reviews; create trigger reviews_award after insert or update on reviews for each row execute function trg_award();
drop trigger if exists blogs_award on blogs;     create trigger blogs_award   after insert or update on blogs   for each row execute function trg_award();

insert into milestones(name, description, criteria_type, criteria_value) values
  ('First steps','Visited your first place','distinct_places',1),
  ('Pune explorer','Visited 5 different places','distinct_places',5),
  ('Pune local','Visited 15 different places','distinct_places',15),
  ('Critic','3 reviews approved','approved_reviews',3),
  ('Storyteller','Your first travel blog was approved','approved_blogs',1)
on conflict (name) do nothing;
insert into milestones(name, description, criteria_type, criteria_value, category_id)
  select 'Fort hunter','Visited 3 different forts','category_places',3,id from place_categories where slug='forts'
on conflict (name) do nothing;

-- Row Level Security
do $$ declare r record; begin
  for r in select policyname, tablename from pg_policies where schemaname='public' and tablename = any(array['places','place_categories','place_hours','place_prices','place_images','place_sources','place_import_staging','import_runs','place_travel_times','profiles','reviews','blogs','reports','favorites','visits','milestones','user_milestones','itineraries','itinerary_stops'])
  loop execute format('drop policy %I on %I', r.policyname, r.tablename); end loop;
end $$;
do $$ declare t text; begin
  foreach t in array array['places','place_categories','place_hours','place_prices','place_images','place_sources','place_import_staging','import_runs','place_travel_times','profiles','reviews','blogs','reports','favorites','visits','milestones','user_milestones','itineraries','itinerary_stops']
  loop execute format('alter table %I enable row level security', t); end loop;
  foreach t in array array['places','place_categories','place_hours','place_prices','place_images','place_sources','place_import_staging','import_runs','milestones']
  loop execute format('create policy %I on %I for all using (is_admin()) with check (is_admin())', t||'_admin_all', t); end loop;
  foreach t in array array['place_hours','place_prices','place_images','place_sources']
  loop execute format('create policy %I on %I for select using (exists (select 1 from places p where p.id = place_id and (p.status=''published'' or is_staff())))', t||'_read', t); end loop;
end $$;
create policy places_read on places for select using (status='published' or is_staff());
create policy categories_read on place_categories for select using (true);
create policy milestones_read on milestones for select using (true);
create policy profiles_read on profiles for select using (profile_visibility='public' or id=auth.uid() or is_staff());
create policy profiles_update_own on profiles for update using (id=auth.uid()) with check (id=auth.uid());
create policy profiles_admin_update on profiles for update using (is_admin()) with check (is_admin());
create policy reviews_read on reviews for select using (status='published' or user_id=auth.uid() or is_staff());
create policy reviews_insert on reviews for insert with check (user_id=auth.uid() and status='pending');
create policy reviews_update_own on reviews for update using (user_id=auth.uid()) with check (user_id=auth.uid() and status='pending');
create policy reviews_staff_update on reviews for update using (is_staff()) with check (is_staff());
create policy reviews_delete on reviews for delete using (user_id=auth.uid() or is_staff());
create policy blogs_read on blogs for select using ((status='published' and is_draft=false) or author_id=auth.uid() or is_staff());
create policy blogs_insert on blogs for insert with check (author_id=auth.uid() and status='pending');
create policy blogs_update_own on blogs for update using (author_id=auth.uid()) with check (author_id=auth.uid() and status='pending');
create policy blogs_staff_update on blogs for update using (is_staff()) with check (is_staff());
create policy blogs_delete on blogs for delete using (author_id=auth.uid() or is_staff());
create policy reports_insert on reports for insert with check (reporter_id=auth.uid());
create policy reports_staff_read on reports for select using (is_staff());
create policy reports_staff_update on reports for update using (is_staff()) with check (is_staff());
create policy favorites_own on favorites for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy visits_own on visits for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy itineraries_own on itineraries for all using (user_id=auth.uid()) with check (user_id=auth.uid());
create policy stops_own on itinerary_stops for all using (exists (select 1 from itineraries i where i.id=itinerary_id and i.user_id=auth.uid())) with check (exists (select 1 from itineraries i where i.id=itinerary_id and i.user_id=auth.uid()));
create policy user_milestones_own on user_milestones for select using (user_id=auth.uid());
-- place_travel_times and import tables: no public policy = service role only.

-- FIRST ADMIN: after signing up on the site, run (with your email):
--   update profiles set role='admin' where id = (select id from auth.users where email='you@example.com');
