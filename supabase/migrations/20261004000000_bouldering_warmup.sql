-- Bouldering warm-up: a built-in warm-up for before climbing indoors, from the whole body down to the fingers and then
-- onto the wall. Mostly moving rather than held, since long static stretches just before climbing can take the edge off
-- the muscles for a while. Adds six exercises it needs to the built-in catalog (wrists, fingers and the wall itself)
-- and the warm-up, listed under Warm-ups in the Spellbook.
-- The wall exercises use the gym's holds, so they need no equipment: scapular pull-ups hang from big jugs, and the
-- warm-up problems are three or four easy boulders, each a little harder than the last, well below your limit.
-- Needs 20260925000000_builtin_exercises.sql through 20261003000000_yoga.sql first (it uses Garland Pose from the yoga
-- poses and Wrist Flexor Stretch from the stretches). Safe to re-run: it updates rows by name.

insert into public.builtin_exercises
  (sort_order, name, sets, reps, weight_value, weight_unit, rest_seconds, icon, target_areas, equipment)
values
  -- Wrists and fingers: tendons warm up more slowly than muscles, so they get their own few minutes.
  (201, 'Wrist Circles (30 sec)', 1, null, null, null, null, 'lunge', '{Arms}', '{}'),
  (202, 'Finger Extensor Stretch (20 sec each side)', 1, null, null, null, null, 'lunge', '{Arms}', '{}'),
  (203, 'Tendon Glides', 1, 10, null, null, null, 'lunge', '{Arms}', '{}'),
  -- On the wall
  (204, 'Scapular Pull-Up', 2, 5, null, null, 45, 'v', '{Back,Shoulders}', '{}'),
  (205, 'Easy Traversing (120 sec)', 1, null, null, null, 30, 'v', '{Arms,Back,Legs}', '{}'),
  (206, 'Warm-Up Boulder Problems', 1, 4, null, null, 60, 'v', '{Arms,Back,Legs,Core}', '{}')
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
-- the warm-up is written, then checked, and if it lists an exercise that isn't a built-in one, the whole block is
-- undone.
do $$
declare
  missing text[];
begin
  insert into public.builtin_workouts (sort_order, name, category, is_warmup, minutes, exercises)
  values
    (61, 'Bouldering Warm-Up', 'Warm-up', true, 20, array[
      -- Raise the heart rate
      'Jumping Jacks (30 sec)', 'High Knees (30 sec)',
      -- Shoulders and upper back
      'Arm Circles (30 sec)', 'Wall Slide', 'Scapular Push-Up', 'Open Book Stretch',
      -- Hips and legs: high steps, heel hooks and drop knees
      'Leg Swing', 'Hip Circle', 'World''s Greatest Stretch', 'Garland Pose (45 sec)',
      -- Wrists and fingers
      'Wrist Circles (30 sec)', 'Wrist Flexor Stretch (20 sec each side)', 'Finger Extensor Stretch (20 sec each side)', 'Tendon Glides',
      -- On the wall
      'Scapular Pull-Up', 'Easy Traversing (120 sec)', 'Warm-Up Boulder Problems'])
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    category = excluded.category,
    is_warmup = excluded.is_warmup,
    minutes = excluded.minutes,
    exercises = excluded.exercises;

  select array_agg(distinct e) into missing
    from public.builtin_workouts w, unnest(w.exercises) e
    where not exists (select 1 from public.builtin_exercises b where b.name = e);
  if missing is not null then
    raise exception 'Not in the built-in exercise catalog: %. Run the earlier exercise migrations first.', missing;
  end if;
end $$;
