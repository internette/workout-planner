-- Dead Hang: hang from a pull-up bar with straight arms, a timed hold for grip, forearms, lats and shoulders. Like the
-- other holds it has no reps and carries its duration in the name. Needs 20260925000000_builtin_exercises.sql and
-- 20260929000000_exercise_equipment.sql first. Safe to re-run: it updates the row by name.

insert into public.builtin_exercises
  (sort_order, name, sets, reps, weight_value, weight_unit, rest_seconds, icon, target_areas, equipment)
values
  (224, 'Dead Hang (30 sec)', 3, null, null, null, 90, 'v', '{Back,Arms,Shoulders}', '{Pull-up bar}')
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
