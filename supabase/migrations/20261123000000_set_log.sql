-- What was actually lifted: each set's weight and reps, per session. One jsonb per plan entry, keyed by exercise name:
--   { "Dumbbell Bench Press": [{ "w": 40, "r": 8 }, { "w": 35, "r": 8 }] }
-- w is pounds (null for bodyweight or a band), r is reps (null when the exercise has none).
-- Until this runs, "Done set" still counts sets as before, and Personal bests use the planned weight.
-- Safe to re-run.

alter table public.plan_entries add column if not exists set_log jsonb;
