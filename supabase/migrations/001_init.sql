-- 001_init.sql: Explore Pune Base Schema
-- Extracted from Project Documentation v2.0 (Free-Tier Edition), Section 4.3

-- Extensions
create extension if not exists postgis;
create extension if not exists pg_trgm;
create extension if not exists unaccent;

-- Enums
do $$ begin
  create type app_role as enum ('member','moderator','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type data_tier as enum ('listed','enriched','verified');
exception when duplicate_object then null; end $$;

do $$ begin
  create type publish_status as enum ('draft','published','archived');
exception when duplicate_object then null; end $$;

do $$ begin
  create type verify_status as enum ('unverified','verified','needs_review');
exception when duplicate_object then null; end $$;

do $$ begin
  create type source_kind as enum ('government','official_operator','osm','wikidata','wikipedia','community','admin');
exception when duplicate_object then null; end $$;

do $$ begin
  create type content_status as enum ('pending','published','rejected','removed');
exception when duplicate_object then null; end $$;

do $$ begin
  create type travel_mode as enum ('walking','cycling','driving');
exception when duplicate_object then null; end $$;

-- Profiles (one row per auth user)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null check (char_length(display_name) between 2 and 50),
  avatar_url text,
  bio text check (char_length(bio) <= 500),
  travel_interests text[] not null default '{}',
  profile_visibility text not null default 'public' check (profile_visibility in ('public','private')),
  role app_role not null default 'member',
  created_at timestamptz not null default now()
);

-- Categories
create table if not exists place_categories (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  sort_order int not null default 0
);

-- Places (main catalogue)
create table if not exists places (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  name_mr text, -- Marathi name
  category_id uuid references place_categories(id),
  zone text not null default 'city' check (zone in ('city','day_trip')),
  description text,
  history text,
  address text,
  latitude double precision not null check (latitude between 17 and 20),
  longitude double precision not null check (longitude between 72.5 and 75.5),
  geog geography(Point,4326) generated always as (st_setsrid(st_makepoint(longitude, latitude),4326)::geography) stored,
  recommended_duration_minutes int check (recommended_duration_minutes > 0),
  best_time_to_visit text,
  transport_notes text,
  parking_notes text,
  accessibility_notes text,
  website_url text,
  wikidata_id text,
  wikipedia_title text,
  osm_id text, -- e.g. 'node/123456'
  data_tier data_tier not null default 'listed',
  status publish_status not null default 'draft',
  locked_fields text[] not null default '{}', -- fields admins edited; imports must not overwrite
  popularity_score int not null default 0,
  avg_rating numeric(3,2),
  review_count int not null default 0,
  search tsvector generated always as (
    to_tsvector('simple', coalesce(name,'') || ' ' || coalesce(name_mr,'') || ' ' || coalesce(description,''))
  ) stored,
  last_verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists places_geog_idx on places using gist (geog);
create index if not exists places_search_idx on places using gin (search);
create index if not exists places_name_trgm on places using gin (name gin_trgm_ops);
create index if not exists places_category_idx on places (category_id, status);
create unique index if not exists places_osm_uidx on places (osm_id) where osm_id is not null;
create unique index if not exists places_wikidata_uidx on places (wikidata_id) where wikidata_id is not null;

-- Weekly opening hours (special closures use special_date)
create table if not exists place_hours (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  day_of_week smallint check (day_of_week between 0 and 6), -- 0 = Sunday
  special_date date, -- holiday / one-off closure
  opens_at time,
  closes_at time,
  is_closed boolean not null default false,
  special_notes text,
  source_url text,
  verified_at timestamptz,
  check (day_of_week is not null or special_date is not null)
);

-- Prices (one row per visitor category; unknown stays NULL)
create table if not exists place_prices (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  visitor_category text not null, -- 'Indian adult', 'Foreign adult', 'Student', 'Camera' ...
  amount numeric(10,2) check (amount >= 0), -- NULL = unknown
  is_free boolean not null default false,
  currency char(3) not null default 'INR',
  description text,
  source_url text,
  verified_at timestamptz
);

-- Images with licence information
create table if not exists place_images (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  image_url text not null,
  thumb_url text,
  alt_text text not null,
  author text,
  license text, -- e.g. 'CC BY-SA 4.0'
  source_url text, -- Commons file page
  is_primary boolean not null default false,
  created_at timestamptz not null default now()
);

-- Per-field provenance
create table if not exists place_sources (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  field_name text not null,
  source_url text,
  source_type source_kind not null,
  verification_status verify_status not null default 'unverified',
  verified_at timestamptz,
  valid_from date,
  valid_until date
);

-- Cached travel times between places (filled by an offline job)
create table if not exists place_travel_times (
  from_place uuid not null references places(id) on delete cascade,
  to_place uuid not null references places(id) on delete cascade,
  mode travel_mode not null,
  duration_seconds int not null,
  distance_meters int not null,
  computed_at timestamptz not null default now(),
  primary key (from_place, to_place, mode),
  check (from_place <> to_place)
);

-- Import pipeline
create table if not exists import_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null, -- 'overpass', 'wikidata', ...
  area_label text,
  started_at timestamptz not null default now(),
  finished_at timestamptz,
  records_fetched int default 0,
  records_new int default 0,
  notes text
);

create table if not exists place_import_staging (
  id uuid primary key default gen_random_uuid(),
  run_id uuid references import_runs(id),
  source text not null, -- 'osm' | 'wikidata'
  source_id text not null, -- 'osm:node/123' or 'wd:Q123'
  name text,
  name_mr text,
  latitude double precision,
  longitude double precision,
  suggested_category text,
  raw_tags jsonb not null default '{}',
  status text not null default 'pending' check (status in ('pending','approved','rejected','merged')),
  matched_place_id uuid references places(id),
  reviewed_by uuid references profiles(id),
  unique (source, source_id)
);

-- Reviews (one per user per place)
create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  place_id uuid not null references places(id) on delete cascade,
  user_id uuid not null references profiles(id) on delete cascade,
  rating smallint not null check (rating between 1 and 5),
  review_text text check (char_length(review_text) between 10 and 2000),
  status content_status not null default 'pending',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (place_id, user_id)
);

-- Blogs
create table if not exists blogs (
  id uuid primary key default gen_random_uuid(),
  author_id uuid not null references profiles(id) on delete cascade,
  place_id uuid references places(id) on delete set null,
  title text not null check (char_length(title) between 5 and 150),
  slug text not null unique,
  content text not null,
  cover_image_url text,
  tags text[] not null default '{}',
  status content_status not null default 'pending',
  is_draft boolean not null default true,
  published_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Reports (reviews, blogs, places)
create table if not exists reports (
  id uuid primary key default gen_random_uuid(),
  reporter_id uuid references profiles(id) on delete set null,
  target_type text not null check (target_type in ('review','blog','place')),
  target_id uuid not null,
  reason text not null,
  status text not null default 'open' check (status in ('open','resolved','dismissed')),
  created_at timestamptz not null default now()
);

-- Favorites, visits
create table if not exists favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, place_id)
);

create table if not exists visits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  place_id uuid not null references places(id) on delete cascade,
  visited_at date not null default current_date,
  notes text,
  evidence_url text
);

create index if not exists visits_user_idx on visits (user_id, place_id);

-- Milestones
create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  description text,
  criteria_type text not null check (criteria_type in ('distinct_places','category_places','approved_blogs','approved_reviews')),
  criteria_value int not null check (criteria_value > 0),
  category_id uuid references place_categories(id), -- for category_places
  badge_image_url text,
  is_active boolean not null default true
);

create table if not exists user_milestones (
  user_id uuid not null references profiles(id) on delete cascade,
  milestone_id uuid not null references milestones(id) on delete cascade,
  earned_at timestamptz not null default now(),
  primary key (user_id, milestone_id)
);

-- Itineraries
create table if not exists itineraries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references profiles(id) on delete cascade,
  title text not null,
  start_lat double precision,
  start_lng double precision,
  start_label text,
  duration_minutes int not null check (duration_minutes > 0),
  transport_mode travel_mode not null,
  budget_amount numeric(10,2),
  currency char(3) not null default 'INR',
  warnings jsonb not null default '[]',
  created_at timestamptz not null default now()
);

create table if not exists itinerary_stops (
  id uuid primary key default gen_random_uuid(),
  itinerary_id uuid not null references itineraries(id) on delete cascade,
  place_id uuid not null references places(id),
  stop_order int not null,
  visit_duration_minutes int not null,
  travel_duration_minutes int not null default 0,
  estimated_cost numeric(10,2), -- NULL = unknown
  is_visited boolean not null default false,
  unique (itinerary_id, stop_order)
);
