-- 30 beginner workouts for your Spellbook, built from the built-in exercises (every target area is a main focus of
-- at least five). Run it in the Supabase SQL editor after 20260927000000_gym_equipment_exercises.sql.
--
-- Whose Spellbook: workouts belong to an Auth0 user id (such as 'google-oauth2|1234'). Leave `owner` empty to use the
-- one person who already has workouts or sessions in this database; with more than one, the script stops and lists
-- them, and you paste yours in below.
--
-- Safe to run again: a workout whose name you already have (ignoring case) is skipped, so nothing is duplicated or
-- overwritten. Each exercise is copied from the built-in catalog with its default sets, reps, weight and rest, and a
-- workout's length is estimated the way the app does for a new one: ten minutes an exercise.

do $$
declare
  owner text := '';  -- your Auth0 user id, if the script asks for it
  owners text[];
  w record;
  new_id uuid;
  added int := 0;
  skipped text[] := '{}';
  missing text[];
begin
  if owner = '' then
    select array_agg(distinct user_id) into owners
      from (select user_id from public.workouts union select user_id from public.plan_entries) u
      where user_id is not null;
    if coalesce(array_length(owners, 1), 0) <> 1 then
      raise exception 'Set owner at the top of this script to your Auth0 user id. Found: %', coalesce(owners, '{}');
    end if;
    owner := owners[1];
  end if;

  for w in
    select * from (values
    (1, 'Full Body Basics A', array['Goblet Squat', 'Incline Push-Up', 'Seated Cable Row', 'Dumbbell Shoulder Press', 'Dead Bug']),
    (2, 'Full Body Basics B', array['Leg Press', 'Machine Chest Press', 'Lat Pulldown', 'Dumbbell Lateral Raise', 'Pallof Press']),
    (3, 'Bodyweight Anywhere', array['Bodyweight Squat', 'Knee Push-Up', 'Superman', 'Reverse Lunge', 'Mountain Climber']),
    (4, 'Upper Body Machines', array['Machine Chest Press', 'Lat Pulldown', 'Machine Shoulder Press', 'Seated Cable Row', 'Cable Biceps Curl', 'Triceps Pushdown']),
    (5, 'Upper Body Dumbbells', array['Dumbbell Bench Press', 'One-Arm Dumbbell Row', 'Seated Dumbbell Press', 'Dumbbell Lateral Raise', 'Hammer Curl', 'Overhead Dumbbell Triceps Extension']),
    (6, 'Lower Body Machines', array['Leg Press', 'Leg Extension', 'Seated Leg Curl', 'Standing Calf Raise', 'Cable Hip Abduction']),
    (7, 'Lower Body Free Weights', array['Goblet Squat', 'Dumbbell Romanian Deadlift', 'Reverse Lunge', 'Barbell Hip Thrust', 'Step-Up']),
    (8, 'Push A', array['Machine Chest Press', 'Incline Dumbbell Press', 'Machine Shoulder Press', 'Cable Lateral Raise', 'Triceps Pushdown']),
    (9, 'Push B: Cables', array['Standing Cable Chest Press', 'Low-to-High Cable Fly', 'Cable Front Raise', 'Cable Upright Row', 'Overhead Cable Triceps Extension']),
    (10, 'Pull A', array['Lat Pulldown', 'Seated Cable Row', 'Face Pull', 'Cable Biceps Curl', 'Hammer Curl']),
    (11, 'Pull B: Cables', array['Close-Grip Lat Pulldown', 'Single-Arm Cable Row', 'Straight-Arm Pulldown', 'Cable Rear Delt Fly', 'Rope Hammer Curl', 'Machine Preacher Curl']),
    (12, 'Legs & Core', array['Goblet Squat', 'Glute Bridge', 'Split Squat', 'Dead Bug', 'Forearm Plank (30 sec)']),
    (13, 'Box Day & Core', array['Box Squat', 'Box Jump', 'Step-Up', 'Hanging Knee Raise', 'Russian Twist']),
    (14, 'Chest & Triceps', array['Dumbbell Bench Press', 'Pec Deck', 'Cable Chest Fly', 'Triceps Pushdown', 'Bench Dip']),
    (15, 'Push-Ups & Arms', array['Incline Push-Up', 'Push-Up', 'Close-Grip Push-Up', 'Diamond Push-Up', 'Dumbbell Biceps Curl']),
    (16, 'Back & Shoulders', array['Dumbbell Bent-Over Row', 'Chest-Supported Dumbbell Row', 'Dumbbell Shoulder Press', 'Rear Delt Fly', 'Dumbbell Shrug']),
    (17, 'Posture Fix', array['Face Pull', 'Band Pull-Apart', 'Back Extension', 'Bird Dog', 'Wall Slide', 'Cable Rear Delt Fly']),
    (18, 'Glute Builder', array['Barbell Hip Thrust', 'Cable Pull-Through', 'Cable Glute Kickback', 'Cable Hip Abduction', 'Single-Leg Glute Bridge']),
    (19, 'Lunges & Steps', array['Reverse Lunge', 'Walking Lunge', 'Lateral Lunge', 'Step-Up', 'Wall Sit (30 sec)']),
    (20, 'Chest Day', array['Barbell Bench Press', 'Incline Dumbbell Press', 'Dumbbell Chest Fly', 'Dumbbell Pullover', 'Machine Chest Press']),
    (21, 'Cable Chest', array['Standing Cable Chest Press', 'Cable Chest Fly', 'Low-to-High Cable Fly', 'Wall Push-Up', 'Knee Push-Up']),
    (22, 'Road to a Pull-Up', array['Assisted Pull-Up', 'Inverted Row', 'Lat Pulldown', 'Straight-Arm Pulldown', 'Hollow Body Hold (20 sec)']),
    (23, 'Pull-Up Bar', array['Pull-Up', 'Chin-Up', 'Neutral-Grip Pull-Up', 'Hanging Knee Raise', 'Band Pull-Apart']),
    (24, 'Shoulder Sculpt', array['Dumbbell Shoulder Press', 'Dumbbell Lateral Raise', 'Dumbbell Front Raise', 'Rear Delt Fly', 'Arm Circles (30 sec)']),
    (25, 'Cable Shoulders', array['Cable Upright Row', 'Cable Lateral Raise', 'Cable Front Raise', 'Cable Rear Delt Fly', 'Machine Shoulder Press']),
    (26, 'Cable Arms', array['Cable Biceps Curl', 'Rope Hammer Curl', 'Triceps Pushdown', 'Overhead Cable Triceps Extension', 'Machine Preacher Curl']),
    (27, 'Dumbbell Arms', array['Dumbbell Biceps Curl', 'Concentration Curl', 'Zottman Curl', 'Dumbbell Skull Crusher', 'Triceps Kickback']),
    (28, 'Core Foundations', array['Dead Bug', 'Forearm Plank (30 sec)', 'Glute Bridge March', 'Side Plank (20 sec)', 'Heel Tap']),
    (29, 'Abs Circuit', array['Crunch', 'Bicycle Crunch', 'Reverse Crunch', 'Flutter Kick', 'Russian Twist']),
    (30, 'Cable Core', array['Kneeling Cable Crunch', 'Pallof Press', 'Cable Woodchopper', 'Hanging Knee Raise', 'Suitcase Carry (30 sec)'])
    ) as t(ord, name, exercises)
    order by ord
  loop
    -- Every exercise has to be in the catalog (the gym-equipment migration adds some of them).
    select array_agg(e) into missing
      from unnest(w.exercises) e
      where not exists (select 1 from public.builtin_exercises b where b.name = e);
    if missing is not null then
      raise exception 'Not in the built-in catalog yet: %. Run 20260927000000_gym_equipment_exercises.sql first.', missing;
    end if;

    if exists (
      select 1 from public.workouts
      where user_id = owner and not archived and lower(name) = lower(w.name)
    ) then
      skipped := skipped || w.name;
      continue;
    end if;

    insert into public.workouts (name, kind, duration_minutes, icon, archived, repeat_enabled, user_id)
      values (w.name, 'lift', greatest(20, array_length(w.exercises, 1) * 10), 'h', false, false, owner)
      returning id into new_id;

    insert into public.workout_exercises
      (workout_id, order_index, name, sets, reps, weight_value, weight_unit, rest_seconds, icon, target_areas, user_id)
    select new_id, x.ord - 1, b.name, b.sets, b.reps, b.weight_value, b.weight_unit, b.rest_seconds, b.icon,
           b.target_areas, owner
      from unnest(w.exercises) with ordinality as x(name, ord)
      join public.builtin_exercises b on b.name = x.name;

    added := added + 1;
  end loop;

  raise notice 'Added % workouts for %.', added, owner;
  if array_length(skipped, 1) > 0 then
    raise notice 'Skipped (you already have a workout with that name): %', skipped;
  end if;
end $$;
