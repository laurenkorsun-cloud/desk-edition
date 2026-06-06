-- Desk Edition schema

create extension if not exists "uuid-ossp";

create table subscribers (
  id uuid primary key default uuid_generate_v4(),
  email text not null unique,
  status text not null default 'pending' check (status in ('pending', 'active', 'unsubscribed')),
  timezone text default 'America/New_York',
  unsubscribe_token uuid not null default uuid_generate_v4(),
  confirm_token uuid default uuid_generate_v4(),
  created_at timestamptz not null default now(),
  confirmed_at timestamptz
);

create index subscribers_status_idx on subscribers (status);
create index subscribers_confirm_token_idx on subscribers (confirm_token);

create table editions (
  id uuid primary key default uuid_generate_v4(),
  slug text not null unique,
  title text not null,
  lede text not null,
  content_json jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'published')),
  edition_number int,
  published_at timestamptz,
  created_at timestamptz not null default now()
);

create index editions_slug_idx on editions (slug);
create index editions_status_idx on editions (status);
create index editions_published_at_idx on editions (published_at desc);

create table delivery_log (
  id uuid primary key default uuid_generate_v4(),
  edition_id uuid not null references editions (id) on delete cascade,
  email text not null,
  sent_at timestamptz not null default now(),
  provider_id text,
  unique (edition_id, email)
);

create index delivery_log_edition_id_idx on delivery_log (edition_id);
