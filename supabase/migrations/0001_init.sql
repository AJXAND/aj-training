-- AJ Training: data model. One generic document table mirrors the app's document store,
-- so the app works offline and syncs whole records.

create table if not exists public.docs (
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  path       text not null,                 -- e.g. "sessions/s123", "foodlog/2026-10-20"
  col        text not null,                 -- e.g. "sessions"
  data       jsonb,
  deleted    boolean not null default false,
  updated_at timestamptz not null default now(),
  primary key (user_id, path)
);
create index if not exists docs_pull on public.docs (user_id, updated_at);

create or replace function public.touch_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = clock_timestamp(); return new; end $$;
drop trigger if exists docs_touch on public.docs;
create trigger docs_touch before insert or update on public.docs for each row execute function public.touch_updated_at();

alter table public.docs enable row level security;
drop policy if exists "own docs" on public.docs;
create policy "own docs" on public.docs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Push notification subscriptions (one per device).
create table if not exists public.push_subs (
  user_id   uuid not null default auth.uid() references auth.users on delete cascade,
  endpoint  text not null,
  sub       jsonb not null,
  remind_at text not null default '07:00',
  tz        text not null default 'Europe/London',
  last_sent date,
  created_at timestamptz not null default now(),
  primary key (user_id, endpoint)
);
alter table public.push_subs enable row level security;
drop policy if exists "own subs" on public.push_subs;
create policy "own subs" on public.push_subs for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Personal key the iPhone Shortcut uses to post Apple Health steps.
create table if not exists public.health_tokens (
  token      text primary key,
  user_id    uuid not null default auth.uid() references auth.users on delete cascade,
  created_at timestamptz not null default now()
);
alter table public.health_tokens enable row level security;
drop policy if exists "own tokens" on public.health_tokens;
create policy "own tokens" on public.health_tokens for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- Private photo storage: each user can only touch files under their own folder.
insert into storage.buckets (id, name, public) values ('photos', 'photos', false) on conflict (id) do nothing;
drop policy if exists "own photos read" on storage.objects;
drop policy if exists "own photos write" on storage.objects;
drop policy if exists "own photos update" on storage.objects;
drop policy if exists "own photos delete" on storage.objects;
create policy "own photos read"   on storage.objects for select using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos write"  on storage.objects for insert with check (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos update" on storage.objects for update using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);
create policy "own photos delete" on storage.objects for delete using (bucket_id = 'photos' and (storage.foldername(name))[1] = auth.uid()::text);

-- Explicit API access for signed-in users (works whether or not "expose new tables" is on). Row Level Security above still limits each user to their own rows.
grant usage on schema public to authenticated;
grant select, insert, update, delete on public.docs, public.push_subs, public.health_tokens to authenticated;
