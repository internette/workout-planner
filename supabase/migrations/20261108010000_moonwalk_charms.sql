-- Moonwalk charms: one-time charms crafted from Finds in the satchel. One row per charm crafted (kind 'charm'), and
-- one per Legendary recipe picked after finishing a Starbook set (kind 'recipe'). A charm is held until it's used,
-- on a day (used_day, one charm a day) or as an ingredient in another charm (used_for 'craft', no day). Everyday and
-- Hidden recipes aren't stored: they're worked out from the Finds picked up, like achievements.
-- Also lets a Find be made by a charm (source 'craft': Mirror Shard and Alchemist Ring).
-- Needs 20261108000000_moonwalk.sql first. Safe to re-run.

create table if not exists public.moonwalk_charms (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default (auth.jwt() ->> 'sub'),
  kind text not null default 'charm' check (kind in ('charm', 'recipe')),
  -- Which charm, by its key in the app's catalog (features/moonwalk/charms.ts).
  charm text not null check (char_length(charm) between 1 and 40),
  created_at timestamptz not null default now(),
  -- Set once it's used.
  used_at timestamptz,
  -- The day it was today's charm. Null for one spent in a recipe.
  used_day date,
  -- The session it was used on, where it applies to one (a Twin Moon).
  used_entry uuid references public.plan_entries (id) on delete set null,
  -- What it was used for: 'craft', or the day a Streak Ward or Second Wind covers (YYYY-MM-DD).
  used_for text check (used_for is null or char_length(used_for) <= 40)
);

create index if not exists moonwalk_charms_user on public.moonwalk_charms (user_id);
-- One charm a day.
create unique index if not exists moonwalk_charms_one_a_day on public.moonwalk_charms (user_id, used_day) where used_day is not null;
-- A Legendary recipe is picked once.
create unique index if not exists moonwalk_charms_recipe_once on public.moonwalk_charms (user_id, charm) where kind = 'recipe';

alter table public.moonwalk_charms enable row level security;
drop policy if exists "owner full access" on public.moonwalk_charms;
create policy "owner full access" on public.moonwalk_charms for all to authenticated
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

-- Finds made by a charm.
alter table public.moonwalk_finds drop constraint if exists moonwalk_finds_source_check;
alter table public.moonwalk_finds add constraint moonwalk_finds_source_check
  check (source in ('pouch', 'glimmer', 'boss', 'wish', 'craft'));

notify pgrst, 'reload schema';
