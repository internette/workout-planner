-- Run/Walk: a fifth workout type beside lifting, cycling, stretching and yoga. Like a ride it has a plan instead of
-- exercises (distance, duration, effort, and elevation if you like), so it is stored as one: a workout of kind 'ride'
-- marked is_run. It is called Run/Walk and drawn with the runner wherever it's shown. Also lets "Customize your
-- experience" say someone runs or walks.
-- Until this runs, the app doesn't offer Run/Walk. Needs 20261003000000_yoga.sql and 20261016000000_profiles.sql
-- first. Safe to re-run.

alter table public.workouts add column if not exists is_run boolean not null default false;
-- The built-in workouts are all lifts, stretches and yoga; the column is there so the app can tell this has run.
alter table public.builtin_workouts add column if not exists is_run boolean not null default false;
-- Only a workout with a ride's plan can be a run.
alter table public.workouts drop constraint if exists workouts_run_is_ride;
alter table public.workouts add constraint workouts_run_is_ride check (not is_run or kind = 'ride');

alter table public.profiles drop constraint if exists profiles_trains_check;
alter table public.profiles add constraint profiles_trains_check
  check (trains <@ array['lift', 'ride', 'run', 'stretch', 'yoga']);
