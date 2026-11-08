-- Moonwalk: Finds picked up on Run/Walk and Cycling sessions, for the Starbook. One row per Find picked up. The
-- first row of a Find stamps its page in the Starbook for good, and every row is also a copy in the satchel until a
-- charm spends it (spent_at, for the charms that come later). No route or place is stored: only which Find, how it
-- was found, on which session and when.
-- Until this runs, sessions don't collect and Profile has no Starbook. Needs 20260921000000_per_user_rls.sql first.
-- Safe to re-run.

create table if not exists public.moonwalk_finds (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default (auth.jwt() ->> 'sub'),
  plan_entry_id uuid references public.plan_entries (id) on delete set null,
  -- Which Find: 0–323, in the app's catalog (features/moonwalk/catalog.ts).
  find_id smallint not null check (find_id between 0 and 323),
  -- pouch: opened when the session was finished. glimmer: walked up to on the map. boss: a boss's Lunar.
  -- wish: picked with a Wish Star.
  source text not null check (source in ('pouch', 'glimmer', 'boss', 'wish')),
  -- Its place in the pouch (or the glimmer's number), so a pouch saved twice is only kept once.
  slot smallint not null default 0,
  found_at timestamptz not null default now(),
  spent_at timestamptz
);

create unique index if not exists moonwalk_finds_once on public.moonwalk_finds (plan_entry_id, source, slot);
create index if not exists moonwalk_finds_user on public.moonwalk_finds (user_id);

-- Only their owner can read or change them, as with the other planner tables.
alter table public.moonwalk_finds enable row level security;
drop policy if exists "owner full access" on public.moonwalk_finds;
create policy "owner full access" on public.moonwalk_finds for all to authenticated
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

notify pgrst, 'reload schema';
