-- Equipment can be not set yet (null), apart from none at all ('{}', bodyweight). When the equipment list came in,
-- every exercise started with none, and only those named like a built-in one got theirs, so an exercise done with
-- pounds (Bench Press at 95 lb) read as bodyweight. Those are now not set, to fill in from the exercise editor, and a row
-- written without equipment is not set rather than bodyweight. Built-in exercises all have theirs, so they keep none as
-- bodyweight.
-- Needs 20260929000000_exercise_equipment.sql and 20261009000000_band_level.sql first. Safe to re-run.

alter table public.library_exercises alter column equipment drop not null;
alter table public.library_exercises alter column equipment set default null;
alter table public.workout_exercises alter column equipment drop not null;
alter table public.workout_exercises alter column equipment set default null;

update public.library_exercises set equipment = null where equipment = '{}' and weight_value > 0;
update public.workout_exercises set equipment = null where equipment = '{}' and weight_value > 0;

notify pgrst, 'reload schema';
