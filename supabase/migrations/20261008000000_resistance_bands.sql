-- Resistance bands: built-in band exercises and three band workouts.
-- A band is set by how hard it pulls, not by weight, so these store a level as the weight: weight_unit 'band' with
-- weight_value 1 to 4 for Light, Medium, Heavy and Extra heavy (the app writes it "Medium band"). Each needs a
-- 'Resistance band' (equipment), so the Spellbook's equipment filter and "what I have" find them.
-- Needs 20260925000000_builtin_exercises.sql, 20260928000000_builtin_workouts.sql, 20260929000000_exercise_equipment.sql
-- and 20261002000000_stretches.sql first. Safe to re-run: it updates rows by name.

-- The band exercise already in the catalog gets a level too.
update public.builtin_exercises set weight_value = 1, weight_unit = 'band' where name = 'Band Pull-Apart';

insert into public.builtin_exercises
  (sort_order, name, sets, reps, weight_value, weight_unit, rest_seconds, icon, target_areas, equipment)
values
  -- Legs and hips
  (207, 'Banded Squat', 3, 15, 2, 'band', 60, 'v', '{Legs}', '{Resistance band}'),
  (208, 'Banded Glute Bridge', 3, 15, 2, 'band', 45, 'lunge', '{Legs,Core}', '{Resistance band}'),
  (209, 'Banded Lateral Walk (10 steps each way)', 3, null, 1, 'band', 45, 'lunge', '{Legs}', '{Resistance band}'),
  (210, 'Banded Romanian Deadlift', 3, 12, 3, 'band', 60, 'v', '{Legs,Back}', '{Resistance band}'),
  (211, 'Band Pull-Through', 3, 12, 3, 'band', 60, 'v', '{Legs,Back}', '{Resistance band}'),
  -- Back and chest
  (212, 'Band Row', 3, 12, 2, 'band', 60, 'h', '{Back}', '{Resistance band}'),
  (213, 'Band Lat Pulldown', 3, 12, 2, 'band', 60, 'h', '{Back,Arms}', '{Resistance band}'),
  (214, 'Band Face Pull', 3, 15, 1, 'band', 45, 'h', '{Shoulders,Back}', '{Resistance band}'),
  (215, 'Band Chest Press', 3, 12, 2, 'band', 60, 'h', '{Chest,Arms}', '{Resistance band}'),
  (216, 'Banded Push-Up', 3, 10, 1, 'band', 60, 'h', '{Chest,Arms}', '{Resistance band}'),
  -- Shoulders and arms
  (217, 'Band Overhead Press', 3, 10, 2, 'band', 60, 'v', '{Shoulders,Arms}', '{Resistance band}'),
  (218, 'Band Lateral Raise', 3, 12, 1, 'band', 45, 'd', '{Shoulders}', '{Resistance band}'),
  (219, 'Band Bicep Curl', 3, 12, 2, 'band', 45, 'd', '{Arms}', '{Resistance band}'),
  (220, 'Band Tricep Pushdown', 3, 12, 1, 'band', 45, 'd', '{Arms}', '{Resistance band}'),
  -- Core and mobility
  (221, 'Band Pallof Press', 3, 10, 2, 'band', 45, 'h', '{Core}', '{Resistance band}'),
  (222, 'Band Woodchop', 3, 10, 2, 'band', 45, 'h', '{Core}', '{Resistance band}'),
  (223, 'Band Shoulder Pass-Through', 2, 10, 1, 'band', 30, 'lunge', '{Shoulders}', '{Resistance band}')
on conflict (name) do update set
  sort_order = excluded.sort_order,
  sets = excluded.sets,
  reps = excluded.reps,
  weight_value = excluded.weight_value,
  weight_unit = excluded.weight_unit,
  rest_seconds = excluded.rest_seconds,
  icon = excluded.icon,
  target_areas = excluded.target_areas,
  equipment = excluded.equipment;

-- One statement, so it is all or nothing even where each statement runs on its own (as in the Supabase SQL editor):
-- the workouts are written, then checked, and if one lists an exercise that isn't a built-in one, the whole block is
-- undone.
do $$
declare
  missing text[];
begin
  insert into public.builtin_workouts (sort_order, name, category, icon, exercises)
  values
    (61, 'Band Full Body', 'Resistance bands', 'h', array['Banded Squat', 'Band Row', 'Band Chest Press', 'Band Overhead Press', 'Banded Glute Bridge', 'Band Pallof Press']),
    (62, 'Band Upper Body', 'Resistance bands', 'h', array['Band Row', 'Band Chest Press', 'Band Face Pull', 'Band Lateral Raise', 'Band Bicep Curl', 'Band Tricep Pushdown']),
    (63, 'Band Lower Body', 'Resistance bands', 'v', array['Banded Squat', 'Banded Romanian Deadlift', 'Banded Lateral Walk (10 steps each way)', 'Banded Glute Bridge', 'Band Pull-Through'])
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    category = excluded.category,
    icon = excluded.icon,
    exercises = excluded.exercises;

  select array_agg(distinct e) into missing
    from public.builtin_workouts w, unnest(w.exercises) e
    where not exists (select 1 from public.builtin_exercises b where b.name = e);
  if missing is not null then
    raise exception 'Not in the built-in exercise catalog: %. Run the earlier exercise migrations first.', missing;
  end if;
end $$;
