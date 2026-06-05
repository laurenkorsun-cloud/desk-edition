-- Config-driven lenses & modules (founder edits in admin)
-- Personal profiles, toggles, per-user editions

alter table subscribers add column if not exists primary_lens_slug text;
alter table subscribers add column if not exists secondary_lens_slug text;
alter table subscribers add column if not exists delivery_time text not null default '09:30';
alter table subscribers add column if not exists city text;
alter table subscribers add column if not exists manual_calendar_notes text;
alter table subscribers add column if not exists spotify_playlist_url text;
alter table subscribers add column if not exists onboarding_completed boolean not null default false;
alter table subscribers add column if not exists last_sent_on date;

create table lenses (
  slug text primary key,
  name text not null,
  rss_feeds jsonb not null default '[]',
  prompt_addon text not null default '',
  is_active boolean not null default true,
  sort_order int not null default 0,
  updated_at timestamptz not null default now()
);

create table modules (
  slug text primary key,
  name text not null,
  description text not null default '',
  requires_integration text,
  default_on boolean not null default false,
  is_active boolean not null default true,
  sort_order int not null default 0,
  admin_body text not null default '',
  updated_at timestamptz not null default now()
);

create table subscriber_module_toggles (
  subscriber_id uuid not null references subscribers (id) on delete cascade,
  module_slug text not null references modules (slug) on delete cascade,
  enabled boolean not null default true,
  primary key (subscriber_id, module_slug)
);

create table personal_editions (
  id uuid primary key default uuid_generate_v4(),
  subscriber_id uuid not null references subscribers (id) on delete cascade,
  slug text not null,
  title text not null,
  lede text not null,
  content_json jsonb not null,
  published_at timestamptz not null default now(),
  unique (subscriber_id, slug)
);

create index personal_editions_subscriber_slug_idx on personal_editions (subscriber_id, slug desc);

alter table delivery_log alter column edition_id drop not null;
alter table delivery_log add column if not exists subscriber_id uuid references subscribers (id) on delete set null;
alter table delivery_log add column if not exists personal_edition_id uuid references personal_editions (id) on delete set null;
