-- Bouldering warm-up exercises: six exercises for warming up before climbing indoors, added to the built-in catalog so
-- a warm-up can be built from them (with the warm-ups, stretches and yoga poses already there). Wrists and fingers first,
-- since tendons warm up more slowly than muscles, then the wall itself.
-- The wall exercises use the gym's holds, so they need no equipment: scapular pull-ups hang from big jugs, and the
-- warm-up problems are three or four easy boulders, each a little harder than the last, well below your limit.
-- Needs 20260925000000_builtin_exercises.sql and 20260929000000_exercise_equipment.sql first. Safe to re-run: it updates
-- rows by name.

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
