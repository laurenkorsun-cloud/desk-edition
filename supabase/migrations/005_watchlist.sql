alter table subscribers
  add column if not exists watchlist_symbols text[] default '{}';
