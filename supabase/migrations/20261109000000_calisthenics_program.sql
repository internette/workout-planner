-- Lifting to calisthenics: a built-in four-week program that follows a beginner lifting block. It keeps the Monday,
-- Wednesday and Friday lifting days (legs, push, pull) and moves them toward bodyweight work: split squats, incline
-- push-ups, pull-up negatives, dead hangs and a hollow body hold. Each lifting day starts with a short mobility
-- warm-up of its own (hips and ankles, shoulders and wrists, upper back), and Tuesday is a longer mobility session.
-- It stays off Sunday, Thursday and Saturday, so it runs alongside the Splits program (which also has Tuesday).
-- Adds five exercises to the built-in catalog (Deep Squat Hold is timed, with hold_seconds in place of reps).
-- Needs 20260928000000_builtin_workouts.sql, 20260930000000_warmups.sql, 20261002000000_stretches.sql,
-- 20261013000000_programs.sql and 20261026000000_timed_holds.sql first. Safe to re-run: it updates rows by name.

do $$
declare
  missing text[];
begin
  insert into public.builtin_exercises
    (sort_order, name, sets, reps, hold_seconds, weight_value, weight_unit, rest_seconds, icon, target_areas, equipment)
  values
    -- Jump or step up to the top of a pull-up, then lower yourself as slowly as you can.
    (231, 'Negative Pull-Up', 3, 3, null, null, null, 90, 'v', '{Back,Arms}', '{Pull-up bar}'),
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
    (64, 'Hips & Ankles Prep', 'Warm-up', true, false, null, null, array[
      'Cat-Cow', '90/90 Hip Switch',
      'Knee-to-Wall Ankle Rock · Left', 'Knee-to-Wall Ankle Rock · Right',
      'Deep Squat Hold', 'Glute Bridge', 'Dead Hang']),
    (65, 'Lower Body Bridge', 'Calisthenics', false, false, null, null, array[
      'Split Squat · Left', 'Split Squat · Right',
      'Seated Leg Curl', 'Cable Pull-Through', 'Superman', 'Hollow Body Hold']),
    (66, 'Shoulders & Wrists Prep', 'Warm-up', true, false, null, null, array[
      'Wrist Circles', 'Wrist Rocks', 'Band Shoulder Pass-Through', 'Scapular Push-Up', 'Wall Slide', 'Dead Hang']),
    (67, 'Push Bridge', 'Calisthenics', false, false, null, null, array[
      'Incline Push-Up', 'Standing Cable Chest Press',
      'Cable Lateral Raise · Left', 'Cable Lateral Raise · Right',
      'Triceps Pushdown', 'Plank Shoulder Tap']),
    (68, 'Upper Back Prep', 'Warm-up', true, false, null, null, array[
      'Arm Circles', 'Open Book Stretch', 'Band Pull-Apart', 'Scapular Pull-Up']),
    (69, 'Pull Bridge', 'Calisthenics', false, false, null, null, array[
      'Lat Pulldown', 'Negative Pull-Up', 'Seated Cable Row', 'Face Pull', 'Band Bicep Curl', 'Dead Hang']),
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
    (5, 'Lifting to calisthenics', 'Four weeks after a beginner lifting block: the same legs, push and pull days moving toward bodyweight work, each with a short mobility warm-up, and a longer mobility session on Tuesday. Weeks 3 and 4: lower the incline on push-ups (floor push-ups once 3 × 8 is easy), make the pull-up negatives 3 × 4 lowering over 5 seconds, hang 30 seconds, and hold the hollow body for 30 seconds with longer legs. Add 5 lb to a machine lift when all 3 sets feel easy. On climbing days keep the dead hangs short and easy.',
     '[{"name": "Bridge", "weeks": 4, "days": [[], ["Hips & Ankles Prep", "Lower Body Bridge"], ["Mobility Session"], ["Shoulders & Wrists Prep", "Push Bridge"], [], ["Upper Back Prep", "Pull Bridge"], []]}]')
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    blocks = excluded.blocks;

  -- A sided name ("Split Squat · Left") is the exercise it's made from.
  select array_agg(distinct e) into missing
    from public.builtin_workouts w, unnest(w.exercises) e
    where w.name in ('Hips & Ankles Prep', 'Lower Body Bridge', 'Shoulders & Wrists Prep', 'Push Bridge', 'Upper Back Prep',
                     'Pull Bridge', 'Mobility Session')
      and not exists (select 1 from public.builtin_exercises b where b.name = regexp_replace(e, ' · (Left|Right)$', ''));
  if missing is not null then
    raise exception 'Not in the built-in exercise catalog: %. Run the earlier migrations first.', missing;
  end if;
end $$;

notify pgrst, 'reload schema';
