-- Beginner Lifting 2: a built-in four-week program that continues Beginner Lifting, with the front splits work and
-- mobility added. The Monday, Wednesday and Friday lifting days (legs, push, pull) stay, and move toward bodyweight
-- work: incline push-ups in place of cable flys, a hollow body hold, cable hip abduction for the side glutes, and
-- dead hangs. Monday and Wednesday start with the Climbing Warmup. Monday adds a short hips and ankles warm-up, and Friday
-- an upper back one. Tuesday is a longer mobility session, and Sunday, Tuesday, Thursday and Saturday have the Front
-- Splits Workout from the Splits program.
-- Adds five exercises to the built-in catalog (Deep Squat Hold is timed, with hold_seconds in place of reps).
-- Needs 20260928000000_builtin_workouts.sql, 20260930000000_warmups.sql, 20261002000000_stretches.sql,
-- 20261004000000_bouldering_exercises.sql, 20261008000000_resistance_bands.sql, 20261013000000_programs.sql,
-- 20261026000000_timed_holds.sql and 20261103000000_splits_program.sql first. Safe to re-run: it updates rows by name.

do $$
declare
  missing text[];
begin
  insert into public.builtin_exercises
    (sort_order, name, sets, reps, hold_seconds, weight_value, weight_unit, rest_seconds, icon, target_areas, equipment)
  values
    -- Hold the cable's handle (or a rope) at your chest, low pulley behind your feet, and squat.
    (231, 'Cable Goblet Squat', 3, 10, null, 30, 'lb', 60, 'h', '{Legs,Core}', '{Cable machine}'),
    -- Seated with both knees bent at 90°, one in front and one to the side: turn both knees over to the other side.
    (232, '90/90 Hip Switch', 2, 6, null, null, null, 15, 'lunge', '{Legs}', '{}'),
    -- Half kneeling facing a wall, front toes a few inches away: push the knee toward the wall, heel down.
    (233, 'Knee-to-Wall Ankle Rock', 1, 10, null, null, null, 15, 'lunge', '{Legs}', '{}'),
    (234, 'Deep Squat Hold', 2, null, 30, null, null, 15, 'lunge', '{Legs,Back}', '{}'),
    -- On hands and knees, rock forward and back over the hands, then again with the fingers turned toward the knees.
    (235, 'Wrist Rocks', 2, 10, null, null, null, 15, 'lunge', '{Arms}', '{}')
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

  insert into public.builtin_workouts (sort_order, name, category, is_warmup, is_stretch, icon, minutes, exercises)
  values
    (64, 'Climbing Warmup', 'Warm-up', true, true, 'lunge', 16, array[
      'Arm Circles', 'Wrist Circles', 'Finger Extensor Stretch (each side)', 'Tendon Glides',
      'Cat-Cow', 'Open Book Stretch', 'World''s Greatest Stretch', 'Scapular Pull-Up']),
    (65, 'Hips & Ankles Prep', 'Warm-up', true, false, null, null, array[
      '90/90 Hip Switch', 'Knee-to-Wall Ankle Rock · Left', 'Knee-to-Wall Ankle Rock · Right', 'Deep Squat Hold', 'Dead Hang']),
    (66, 'Legs and Glutes', 'Calisthenics', false, false, null, null, array[
      'Leg Extension',
      'Seated Leg Curl', 'Cable Pull-Through', 'Cable Goblet Squat', 'Banded Glute Bridge',
      'Cable Hip Abduction · Left', 'Cable Hip Abduction · Right', 'Hollow Body Hold']),
    (67, 'Push Bridge', 'Calisthenics', false, false, null, null, array[
      'Incline Push-Up', 'Standing Cable Chest Press',
      'Cable Lateral Raise · Left', 'Cable Lateral Raise · Right',
      'Triceps Pushdown', 'Pallof Press · Left', 'Pallof Press · Right', 'Dead Hang']),
    (68, 'Upper Back Prep', 'Warm-up', true, false, null, null, array[
      'Arm Circles', 'Open Book Stretch', 'Band Pull-Apart', 'Scapular Pull-Up']),
    (69, 'Pull Bridge', 'Calisthenics', false, false, null, null, array[
      'Lat Pulldown', 'Straight-Arm Pulldown', 'Seated Cable Row', 'Face Pull', 'Band Bicep Curl', 'Dead Hang']),
    (70, 'Mobility Session', 'Stretching', false, true, 'lunge', 16, array[
      'Cat-Cow', 'World''s Greatest Stretch', '90/90 Hip Switch', 'Deep Squat Hold',
      'Thread the Needle (each side)', 'Band Shoulder Pass-Through', 'Puppy Pose',
      'Wrist Rocks', 'Wrist Flexor Stretch (each side)', 'Dead Hang'])
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    category = excluded.category,
    is_warmup = excluded.is_warmup,
    is_stretch = excluded.is_stretch,
    icon = excluded.icon,
    minutes = excluded.minutes,
    exercises = excluded.exercises;

  insert into public.builtin_programs (sort_order, name, notes, blocks)
  values
    (5, 'Beginner Lifting 2', 'Four more weeks of Beginner Lifting, moving toward bodyweight work, with front splits four days a week and mobility on Tuesday. Weeks 3 and 4: lower the incline on push-ups (floor push-ups once 3 × 8 is easy), hang 30 seconds or more, and hold the hollow body for 30 seconds with longer legs. Add 5 lb to a cable or machine lift when all 3 sets feel easy. On climbing days keep the dead hangs short and easy. For the splits, bend your knees as much as you need to and go only as deep as you can without pain.',
     '[{"name": "Bridge", "weeks": 4, "days": [["Front Splits Workout"], ["Climbing Warmup", "Hips & Ankles Prep", "Legs and Glutes"], ["Mobility Session", "Front Splits Workout"], ["Climbing Warmup", "Push Bridge"], ["Front Splits Workout"], ["Upper Back Prep", "Pull Bridge"], ["Front Splits Workout"]]}]')
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    blocks = excluded.blocks;

  -- An earlier draft of this migration: its program name and the rows it no longer has.
  delete from public.builtin_programs where name = 'Lifting to calisthenics';
  delete from public.builtin_workouts where name in ('Shoulders & Wrists Prep', 'Lower Body Bridge');
  delete from public.builtin_exercises where name = 'Negative Pull-Up';

  -- A sided name ("Cable Hip Abduction · Left") is the exercise it's made from.
  select array_agg(distinct e) into missing
    from public.builtin_workouts w, unnest(w.exercises) e
    where w.name in ('Climbing Warmup', 'Hips & Ankles Prep', 'Legs and Glutes', 'Push Bridge', 'Upper Back Prep',
                     'Pull Bridge', 'Mobility Session')
      and not exists (select 1 from public.builtin_exercises b where b.name = regexp_replace(e, ' · (Left|Right)$', ''));
  if missing is not null then
    raise exception 'Not in the built-in exercise catalog: %. Run the earlier migrations first.', missing;
  end if;

  select array_agg(distinct w) into missing
    from public.builtin_programs p,
         jsonb_array_elements(p.blocks) b,
         jsonb_array_elements(b -> 'days') d,
         jsonb_array_elements_text(d) w
    where p.name = 'Beginner Lifting 2'
      and not exists (select 1 from public.builtin_workouts bw where bw.name = w);
  if missing is not null then
    raise exception 'Not in the built-in workouts: %. Run the Splits program migration first.', missing;
  end if;
end $$;

notify pgrst, 'reload schema';
