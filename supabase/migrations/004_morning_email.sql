alter table subscribers
  add column if not exists morning_email_enabled boolean not null default false;
