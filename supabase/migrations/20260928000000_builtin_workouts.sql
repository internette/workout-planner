-- Built-in workouts: 30 beginner workouts every account sees in its Spellbook, listed under the person's own and
-- grouped by `category`. Like the built-in exercises they are one shared, read-only catalog (a read policy and no write
-- policy). A session on the calendar needs a workout of the person's own, so adding a built-in workout to the calendar
-- (or copying it) saves it to their workouts first. Each lists built-in exercises by name, in order; the app copies
-- their sets, reps, weight and rest from the exercise catalog.
-- Needs 20260925000000_builtin_exercises.sql and 20260927000000_gym_equipment_exercises.sql first.
-- Safe to re-run: it updates rows by name.

create table if not exists public.builtin_workouts (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  category text not null,
  sort_order integer not null default 0,
  exercises text[] not null
);

alter table public.builtin_workouts enable row level security;
drop policy if exists "anyone can read" on public.builtin_workouts;
create policy "anyone can read" on public.builtin_workouts for select to anon, authenticated using (true);

-- The catalog, checked before anything is written: every exercise it lists has to be a built-in one already.
drop table if exists builtin_workouts_new;
create temporary table builtin_workouts_new (sort_order integer, name text, category text, exercises text[]);
insert into builtin_workouts_new (sort_order, name, category, exercises)
values
  (1, 'Full Body Basics A', 'Full body', array['Goblet Squat', 'Incline Push-Up', 'Seated Cable Row', 'Dumbbell Shoulder Press', 'Dead Bug']),
  (2, 'Full Body Basics B', 'Full body', array['Leg Press', 'Machine Chest Press', 'Lat Pulldown', 'Dumbbell Lateral Raise', 'Pallof Press']),
  (3, 'Bodyweight Anywhere', 'Full body', array['Bodyweight Squat', 'Knee Push-Up', 'Superman', 'Reverse Lunge', 'Mountain Climber']),
  (4, 'Upper Body Machines', 'Upper / lower', array['Machine Chest Press', 'Lat Pulldown', 'Machine Shoulder Press', 'Seated Cable Row', 'Cable Biceps Curl', 'Triceps Pushdown']),
  (5, 'Upper Body Dumbbells', 'Upper / lower', array['Dumbbell Bench Press', 'One-Arm Dumbbell Row', 'Seated Dumbbell Press', 'Dumbbell Lateral Raise', 'Hammer Curl', 'Overhead Dumbbell Triceps Extension']),
  (6, 'Lower Body Machines', 'Upper / lower', array['Leg Press', 'Leg Extension', 'Seated Leg Curl', 'Standing Calf Raise', 'Cable Hip Abduction']),
  (7, 'Lower Body Free Weights', 'Upper / lower', array['Goblet Squat', 'Dumbbell Romanian Deadlift', 'Reverse Lunge', 'Barbell Hip Thrust', 'Step-Up']),
  (8, 'Push A', 'Push / pull', array['Machine Chest Press', 'Incline Dumbbell Press', 'Machine Shoulder Press', 'Cable Lateral Raise', 'Triceps Pushdown']),
  (9, 'Push B: Cables', 'Push / pull', array['Standing Cable Chest Press', 'Low-to-High Cable Fly', 'Cable Front Raise', 'Cable Upright Row', 'Overhead Cable Triceps Extension']),
  (10, 'Pull A', 'Push / pull', array['Lat Pulldown', 'Seated Cable Row', 'Face Pull', 'Cable Biceps Curl', 'Hammer Curl']),
  (11, 'Pull B: Cables', 'Push / pull', array['Close-Grip Lat Pulldown', 'Single-Arm Cable Row', 'Straight-Arm Pulldown', 'Cable Rear Delt Fly', 'Rope Hammer Curl', 'Machine Preacher Curl']),
  (12, 'Legs & Core', 'Legs', array['Goblet Squat', 'Glute Bridge', 'Split Squat', 'Dead Bug', 'Forearm Plank (30 sec)']),
  (13, 'Box Day & Core', 'Legs', array['Box Squat', 'Box Jump', 'Step-Up', 'Hanging Knee Raise', 'Russian Twist']),
  (14, 'Chest & Triceps', 'Chest', array['Dumbbell Bench Press', 'Pec Deck', 'Cable Chest Fly', 'Triceps Pushdown', 'Bench Dip']),
  (15, 'Push-Ups & Arms', 'Chest', array['Incline Push-Up', 'Push-Up', 'Close-Grip Push-Up', 'Diamond Push-Up', 'Dumbbell Biceps Curl']),
  (16, 'Back & Shoulders', 'Back', array['Dumbbell Bent-Over Row', 'Chest-Supported Dumbbell Row', 'Dumbbell Shoulder Press', 'Rear Delt Fly', 'Dumbbell Shrug']),
  (17, 'Posture Fix', 'Back', array['Face Pull', 'Band Pull-Apart', 'Back Extension', 'Bird Dog', 'Wall Slide', 'Cable Rear Delt Fly']),
  (18, 'Glute Builder', 'Legs', array['Barbell Hip Thrust', 'Cable Pull-Through', 'Cable Glute Kickback', 'Cable Hip Abduction', 'Single-Leg Glute Bridge']),
  (19, 'Lunges & Steps', 'Legs', array['Reverse Lunge', 'Walking Lunge', 'Lateral Lunge', 'Step-Up', 'Wall Sit (30 sec)']),
  (20, 'Chest Day', 'Chest', array['Barbell Bench Press', 'Incline Dumbbell Press', 'Dumbbell Chest Fly', 'Dumbbell Pullover', 'Machine Chest Press']),
  (21, 'Cable Chest', 'Chest', array['Standing Cable Chest Press', 'Cable Chest Fly', 'Low-to-High Cable Fly', 'Wall Push-Up', 'Knee Push-Up']),
  (22, 'Road to a Pull-Up', 'Back', array['Assisted Pull-Up', 'Inverted Row', 'Lat Pulldown', 'Straight-Arm Pulldown', 'Hollow Body Hold (20 sec)']),
  (23, 'Pull-Up Bar', 'Back', array['Pull-Up', 'Chin-Up', 'Neutral-Grip Pull-Up', 'Hanging Knee Raise', 'Band Pull-Apart']),
  (24, 'Shoulder Sculpt', 'Shoulders', array['Dumbbell Shoulder Press', 'Dumbbell Lateral Raise', 'Dumbbell Front Raise', 'Rear Delt Fly', 'Arm Circles (30 sec)']),
  (25, 'Cable Shoulders', 'Shoulders', array['Cable Upright Row', 'Cable Lateral Raise', 'Cable Front Raise', 'Cable Rear Delt Fly', 'Machine Shoulder Press']),
  (26, 'Cable Arms', 'Arms', array['Cable Biceps Curl', 'Rope Hammer Curl', 'Triceps Pushdown', 'Overhead Cable Triceps Extension', 'Machine Preacher Curl']),
  (27, 'Dumbbell Arms', 'Arms', array['Dumbbell Biceps Curl', 'Concentration Curl', 'Zottman Curl', 'Dumbbell Skull Crusher', 'Triceps Kickback']),
  (28, 'Core Foundations', 'Core', array['Dead Bug', 'Forearm Plank (30 sec)', 'Glute Bridge March', 'Side Plank (20 sec)', 'Heel Tap']),
  (29, 'Abs Circuit', 'Core', array['Crunch', 'Bicycle Crunch', 'Reverse Crunch', 'Flutter Kick', 'Russian Twist']),
  (30, 'Cable Core', 'Core', array['Kneeling Cable Crunch', 'Pallof Press', 'Cable Woodchopper', 'Hanging Knee Raise', 'Suitcase Carry (30 sec)']);

do $$
declare
  missing text[];
begin
  select array_agg(distinct e) into missing
    from builtin_workouts_new w, unnest(w.exercises) e
    where not exists (select 1 from public.builtin_exercises b where b.name = e);
  if missing is not null then
    raise exception 'Not in the built-in exercise catalog: %. Run the earlier exercise migrations first.', missing;
  end if;
end $$;

insert into public.builtin_workouts (sort_order, name, category, exercises)
select sort_order, name, category, exercises from builtin_workouts_new
on conflict (name) do update set
  sort_order = excluded.sort_order,
  category = excluded.category,
  exercises = excluded.exercises;

drop table if exists builtin_workouts_new;

notify pgrst, 'reload schema';
