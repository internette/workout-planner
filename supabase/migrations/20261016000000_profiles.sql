-- Profiles: what a person told "Customize your experience". The name they go by (in place of the one their sign-in
-- gives), what they train, the equipment they have, the weekdays training fits and about how long. The app suggests a
-- first program from these; the color stays on each device, as in Settings. One row per person, written when they
-- finish customizing; no row is the defaults.
-- Needs 20260921000000_per_user_rls.sql first. Safe to re-run.

create table if not exists public.profiles (
  user_id text primary key default (auth.jwt() ->> 'sub'),
  -- Null: the name from their sign-in.
  name text check (name is null or char_length(name) between 1 and 40),
  trains text[] not null default '{}' check (trains <@ array['lift', 'ride', 'stretch', 'yoga']),
  -- From the app's equipment list; empty is bodyweight only, null is not said.
  equipment text[],
  -- Weekdays, 0 = Sunday.
  days smallint[] not null default '{}' check (days <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]),
  minutes smallint check (minutes is null or minutes between 10 and 240),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Only their owner can read or change it, as with the other planner tables.
alter table public.profiles enable row level security;
drop policy if exists "owner full access" on public.profiles;
create policy "owner full access" on public.profiles for all to authenticated
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

notify pgrst, 'reload schema';
