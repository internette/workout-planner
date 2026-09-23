-- Target areas move from the workout down to each exercise: a workout's own target areas are now computed
-- (the union of what its exercises target) instead of set by hand. Safe to re-run.

alter table public.workout_exercises
  add column if not exists target_areas text[] not null default '{}';

alter table public.library_exercises
  add column if not exists target_areas text[] not null default '{}';

-- Make the API pick up the new columns straight away.
notify pgrst, 'reload schema';
