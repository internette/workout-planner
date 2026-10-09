-- A resistance band's level gets its own column, so an exercise done with a band and something else (dumbbells, say)
-- can have both a level and a weight. band_level is 1 to 4 for Light, Medium, Heavy and Extra heavy; none is null.
-- Until now a level was saved as the weight (weight_unit 'band', weight_value 1 to 4): those move across.
-- Needs 20261008000000_resistance_bands.sql first. Safe to re-run.

alter table public.builtin_exercises add column if not exists band_level smallint check (band_level between 1 and 4);
alter table public.library_exercises add column if not exists band_level smallint check (band_level between 1 and 4);
alter table public.workout_exercises add column if not exists band_level smallint check (band_level between 1 and 4);

update public.builtin_exercises set band_level = weight_value, weight_value = null, weight_unit = null where weight_unit = 'band';
update public.library_exercises set band_level = weight_value, weight_value = null, weight_unit = null where weight_unit = 'band';
update public.workout_exercises set band_level = weight_value, weight_value = null, weight_unit = null where weight_unit = 'band';
