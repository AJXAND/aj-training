-- One pending rest-timer alert per user. The app writes it when a rest starts and deletes it on skip or finish.
create table if not exists public.rest_timers (
  user_id    uuid primary key default auth.uid() references auth.users on delete cascade,
  endpoint   text not null,
  due_at     timestamptz not null,
  body       text not null default 'Rest''s over. Next set.',
  created_at timestamptz not null default now()
);
create index if not exists rest_timers_due on public.rest_timers (due_at);
alter table public.rest_timers enable row level security;
drop policy if exists "own timers" on public.rest_timers;
create policy "own timers" on public.rest_timers for all using (auth.uid() = user_id) with check (auth.uid() = user_id);
grant select, insert, update, delete on public.rest_timers to authenticated;
