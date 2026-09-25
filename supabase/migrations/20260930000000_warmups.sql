-- Warm-ups: a workout can be marked as a warm-up (a switch in the workout editor). A warm-up is listed before the
-- other workouts on its day, is tagged WARM-UP wherever it's shown, and has its own filter in the Spellbook.
-- Adds the flag to people's workouts and to the built-in ones, nine warm-up exercises to the built-in catalog
-- (bodyweight, so no equipment), and five built-in warm-ups made from them and from exercises already there.
-- Needs 20260925000000_builtin_exercises.sql, 20260928000000_builtin_workouts.sql and
-- 20260929000000_exercise_equipment.sql first. Safe to re-run: it updates rows by name.

alter table public.workouts add column if not exists is_warmup boolean not null default false;
alter table public.builtin_workouts add column if not exists is_warmup boolean not null default false;

insert into public.builtin_exercises
  (sort_order, name, sets, reps, weight_value, weight_unit, rest_seconds, icon, target_areas, equipment)
values
  (121, 'Jumping Jacks (30 sec)', 2, null, null, null, 15, 'v', '{Legs,Shoulders}', '{}'),
  (122, 'High Knees (30 sec)', 2, null, null, null, 15, 'v', '{Legs,Core}', '{}'),
  (123, 'Leg Swing', 2, 10, null, null, 15, 'v', '{Legs}', '{}'),
  (124, 'Hip Circle', 2, 10, null, null, 15, 'v', '{Legs,Core}', '{}'),
  (125, 'Cat-Cow', 2, 10, null, null, 15, 'v', '{Back,Core}', '{}'),
  (126, 'World''s Greatest Stretch', 2, 5, null, null, 15, 'v', '{Legs,Back}', '{}'),
  (127, 'Inchworm', 2, 6, null, null, 15, 'v', '{Core,Shoulders,Legs}', '{}'),
  (128, 'Open Book Stretch', 2, 8, null, null, 15, 'v', '{Back,Shoulders}', '{}'),
  (129, 'Scapular Push-Up', 2, 10, null, null, 15, 'v', '{Shoulders,Back,Chest}', '{}')
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
-- the warm-ups are written, then checked, and if one lists an exercise that isn't a built-in one, the whole block is
-- undone.
do $$
declare
  missing text[];
begin
  insert into public.builtin_workouts (sort_order, name, category, is_warmup, exercises)
  values
    (31, 'Full Body Warm-Up', 'Warm-up', true, array['Jumping Jacks (30 sec)', 'Arm Circles (30 sec)', 'Leg Swing', 'Inchworm', 'World''s Greatest Stretch']),
    (32, 'Upper Body Warm-Up', 'Warm-up', true, array['Arm Circles (30 sec)', 'Open Book Stretch', 'Scapular Push-Up', 'Wall Slide', 'Wall Push-Up']),
    (33, 'Lower Body Warm-Up', 'Warm-up', true, array['Leg Swing', 'Hip Circle', 'Glute Bridge', 'Bodyweight Squat', 'Lateral Lunge']),
    (34, 'Mobility Flow', 'Warm-up', true, array['Cat-Cow', 'World''s Greatest Stretch', 'Open Book Stretch', 'Hip Circle', 'Bird Dog']),
    (35, 'Cardio Warm-Up', 'Warm-up', true, array['Jumping Jacks (30 sec)', 'High Knees (30 sec)', 'Mountain Climber', 'Inchworm'])
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    category = excluded.category,
    is_warmup = excluded.is_warmup,
    exercises = excluded.exercises;

  select array_agg(distinct e) into missing
    from public.builtin_workouts w, unnest(w.exercises) e
    where not exists (select 1 from public.builtin_exercises b where b.name = e);
  if missing is not null then
    raise exception 'Not in the built-in exercise catalog: %. Run the earlier exercise migrations first.', missing;
  end if;
end $$;

notify pgrst, 'reload schema';
