alter table subscribers add column if not exists hobbies text[] default '{}';
alter table subscribers add column if not exists morning_goals text[] default '{}';
alter table subscribers add column if not exists content_tone text default 'balanced';
