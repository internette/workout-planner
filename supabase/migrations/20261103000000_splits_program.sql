-- Splits program: a built-in four-week program for the front splits on both legs, four short sessions a week (Sunday,
-- Tuesday, Thursday and Saturday, so it stays off the lifting days). Every session is the same stretch, "Front Splits
-- Workout": squat to pike, a high lunge hold, split slides, a lying hamstring stretch, the couch stretch for the hip
-- flexors, and a front split hold to test your range. Everything but the squat to pike is done on each leg, so the
-- workout lists those as "· Left" and "· Right" pairs, the way the ready-made workouts carry the Pallof press.
-- Adds the six exercises to the built-in catalog (holds are timed, with hold_seconds in place of reps).
-- Needs 20260928000000_builtin_workouts.sql, 20261002000000_stretches.sql, 20261013000000_programs.sql and
-- 20261026000000_timed_holds.sql first. Safe to re-run: it updates rows by name.

do $$
declare
  missing text[];
begin
  insert into public.builtin_exercises
    (sort_order, name, sets, reps, hold_seconds, weight_value, weight_unit, rest_seconds, icon, target_areas, equipment)
  values
    -- From a deep squat, hands on the floor, straighten the legs toward a pike and sink back down.
    (225, 'Squat to Pike', 1, 8, null, null, null, 15, 'lunge', '{Legs,Back}', '{}'),
    (226, 'High Lunge Hold', 1, null, 30, null, null, 15, 'lunge', '{Legs,Core}', '{}'),
    -- Front foot on a slider or towel: slide into the split as far as it goes, then pull back to the lunge.
    (227, 'Split Slide', 1, 8, null, null, null, 15, 'lunge', '{Legs}', '{}'),
    (228, 'Lying Hamstring Stretch', 1, null, 30, null, null, 15, 'lunge', '{Legs}', '{}'),
    -- Back knee down against a wall, shin up the wall, front foot planted: stretches the hip flexor and quad.
    (229, 'Couch Stretch', 1, null, 30, null, null, 15, 'lunge', '{Legs,Core}', '{}'),
    (230, 'Front Split Hold', 1, null, 30, null, null, 15, 'lunge', '{Legs}', '{}')
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    sets = excluded.sets,
    reps = excluded.reps,
    hold_seconds = excluded.hold_seconds,
    weight_value = excluded.weight_value,
    weight_unit = excluded.weight_unit,
    rest_seconds = excluded.rest_seconds,
    icon = excluded.icon,
    target_areas = excluded.target_areas,
    equipment = excluded.equipment;

  insert into public.builtin_workouts (sort_order, name, category, is_stretch, icon, minutes, exercises)
  values
    (61, 'Front Splits Workout', 'Stretching', true, 'lunge', 15, array[
      'Squat to Pike',
      'High Lunge Hold · Left', 'High Lunge Hold · Right',
      'Split Slide · Left', 'Split Slide · Right',
      'Lying Hamstring Stretch · Left', 'Lying Hamstring Stretch · Right',
      'Couch Stretch · Left', 'Couch Stretch · Right',
      'Front Split Hold · Left', 'Front Split Hold · Right'])
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    category = excluded.category,
    is_stretch = excluded.is_stretch,
    icon = excluded.icon,
    minutes = excluded.minutes,
    exercises = excluded.exercises;

  insert into public.builtin_programs (sort_order, name, notes, blocks)
  values
    (4, 'Splits program', 'Four weeks toward the front splits on both legs, four short stretch sessions a week. Bend your knees as much as you need to at first, and go only as deep as you can without pain.',
     '[{"name": "Splits", "weeks": 4, "days": [["Front Splits Workout"], [], ["Front Splits Workout"], [], ["Front Splits Workout"], [], ["Front Splits Workout"]]}]')
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    blocks = excluded.blocks;

  -- A sided name ("Couch Stretch · Left") is the exercise it's made from.
  select array_agg(distinct e) into missing
    from public.builtin_workouts w, unnest(w.exercises) e
    where w.name = 'Front Splits Workout'
      and not exists (select 1 from public.builtin_exercises b where b.name = regexp_replace(e, ' · (Left|Right)$', ''));
  if missing is not null then
    raise exception 'Not in the built-in exercise catalog: %.', missing;
  end if;
end $$;

notify pgrst, 'reload schema';
