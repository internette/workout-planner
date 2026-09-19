-- Extends the existing planner tables so the UI can persist everything it shows.
-- Safe to re-run: every change is guarded with "if not exists".

-- Workouts: lift vs ride, duration, presentation and ride plan.
alter table public.workouts
  add column if not exists kind text not null default 'lift' check (kind in ('lift', 'ride')),
  add column if not exists duration_minutes integer,
  add column if not exists icon text,
  add column if not exists icon_color text,
  add column if not exists target_areas text[] not null default '{}',
  add column if not exists ride_distance_miles numeric,
  add column if not exists ride_elevation_ft integer,
  add column if not exists ride_zone text;

-- Plan entries: which exercises are ticked off, and what was actually ridden.
alter table public.plan_entries
  add column if not exists done_exercises text[],
  add column if not exists actual_distance_miles numeric,
  add column if not exists actual_elevation_ft integer,
  add column if not exists actual_minutes integer;

-- Diary: effort rating, and one entry per plan entry so a save can upsert.
alter table public.diary_entries
  add column if not exists rpe smallint check (rpe between 1 and 5);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'diary_entries_plan_entry_id_key') then
    alter table public.diary_entries
      add constraint diary_entries_plan_entry_id_key unique (plan_entry_id);
  end if;
end $$;

-- Arsenal: exercises that aren't attached to a workout yet.
create table if not exists public.library_exercises (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sets integer,
  reps integer,
  weight_value numeric,
  weight_unit text,
  rest_seconds integer,
  icon text not null default 'h',
  created_at timestamptz not null default now()
);

alter table public.library_exercises enable row level security;

-- Matches the other planner tables: the app has no sign-in yet, so the anon key gets full access.
drop policy if exists "anon full access" on public.library_exercises;
create policy "anon full access" on public.library_exercises
  for all to anon using (true) with check (true);
