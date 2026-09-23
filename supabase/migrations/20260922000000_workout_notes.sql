-- Free-text notes on a saved workout (cues, targets, anything to remember), edited on the create/edit screen.
-- Safe to re-run.

alter table public.workouts
  add column if not exists notes text;

-- Make the API pick up the new column straight away.
notify pgrst, 'reload schema';
