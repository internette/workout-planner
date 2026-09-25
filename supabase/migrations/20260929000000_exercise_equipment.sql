-- Equipment: what each exercise needs, from a fixed list the app knows (dumbbells, cable machine, leg press, bench, ...).
-- An empty list is a bodyweight exercise. Built-in exercises get theirs here; a person's own exercises, and the copies
-- inside their workouts, take it from the built-in exercise with the same name, and can be changed in the exercise
-- editor. A workout needs whatever its exercises need.
-- Needs 20260925000000_builtin_exercises.sql and 20260927000000_gym_equipment_exercises.sql first. Safe to re-run.

alter table public.builtin_exercises add column if not exists equipment text[] not null default '{}';
alter table public.library_exercises add column if not exists equipment text[] not null default '{}';
alter table public.workout_exercises add column if not exists equipment text[] not null default '{}';

update public.builtin_exercises b
set equipment = e.equipment
from (values
    ('Bodyweight Squat', array[]::text[]),
    ('Goblet Squat', array['Dumbbells']::text[]),
    ('Dumbbell Romanian Deadlift', array['Dumbbells']::text[]),
    ('Glute Bridge', array[]::text[]),
    ('Reverse Lunge', array[]::text[]),
    ('Walking Lunge', array[]::text[]),
    ('Step-Up', array['Plyo box']::text[]),
    ('Split Squat', array[]::text[]),
    ('Wall Sit (30 sec)', array[]::text[]),
    ('Standing Calf Raise', array[]::text[]),
    ('Leg Press', array['Leg press']::text[]),
    ('Leg Extension', array['Leg extension / curl']::text[]),
    ('Seated Leg Curl', array['Leg extension / curl']::text[]),
    ('Barbell Back Squat', array['Barbell', 'Squat rack']::text[]),
    ('Sumo Squat', array['Dumbbells']::text[]),
    ('Lateral Lunge', array[]::text[]),
    ('Single-Leg Glute Bridge', array[]::text[]),
    ('Kettlebell Deadlift', array['Kettlebell']::text[]),
    ('Barbell Hip Thrust', array['Barbell', 'Bench']::text[]),
    ('Box Squat', array['Plyo box']::text[]),
    ('Push-Up', array[]::text[]),
    ('Incline Push-Up', array['Bench']::text[]),
    ('Knee Push-Up', array[]::text[]),
    ('Dumbbell Bench Press', array['Dumbbells', 'Bench']::text[]),
    ('Incline Dumbbell Press', array['Dumbbells', 'Bench']::text[]),
    ('Dumbbell Floor Press', array['Dumbbells']::text[]),
    ('Dumbbell Chest Fly', array['Dumbbells', 'Bench']::text[]),
    ('Barbell Bench Press', array['Barbell', 'Bench']::text[]),
    ('Machine Chest Press', array['Chest press']::text[]),
    ('Cable Chest Fly', array['Cable machine']::text[]),
    ('Pec Deck', array['Pec deck']::text[]),
    ('Wall Push-Up', array[]::text[]),
    ('Dumbbell Pullover', array['Dumbbells', 'Bench']::text[]),
    ('Close-Grip Push-Up', array[]::text[]),
    ('Dumbbell Bent-Over Row', array['Dumbbells']::text[]),
    ('One-Arm Dumbbell Row', array['Dumbbells', 'Bench']::text[]),
    ('Seated Cable Row', array['Lat pulldown / row']::text[]),
    ('Lat Pulldown', array['Lat pulldown / row']::text[]),
    ('Assisted Pull-Up', array['Pull-up bar', 'Resistance band']::text[]),
    ('Inverted Row', array['Barbell', 'Squat rack']::text[]),
    ('Superman', array[]::text[]),
    ('Bird Dog', array[]::text[]),
    ('Back Extension', array['Glute-ham developer']::text[]),
    ('Chest-Supported Dumbbell Row', array['Dumbbells', 'Bench']::text[]),
    ('Straight-Arm Pulldown', array['Cable machine']::text[]),
    ('Band Pull-Apart', array['Resistance band']::text[]),
    ('Face Pull', array['Cable machine']::text[]),
    ('Dumbbell Shrug', array['Dumbbells']::text[]),
    ('Barbell Deadlift', array['Barbell']::text[]),
    ('Bodyweight Good Morning', array[]::text[]),
    ('Dumbbell Shoulder Press', array['Dumbbells']::text[]),
    ('Seated Dumbbell Press', array['Dumbbells', 'Bench']::text[]),
    ('Arnold Press', array['Dumbbells']::text[]),
    ('Dumbbell Lateral Raise', array['Dumbbells']::text[]),
    ('Dumbbell Front Raise', array['Dumbbells']::text[]),
    ('Rear Delt Fly', array['Dumbbells']::text[]),
    ('Machine Shoulder Press', array['Shoulder press']::text[]),
    ('Cable Lateral Raise', array['Cable machine']::text[]),
    ('Pike Push-Up', array[]::text[]),
    ('Dumbbell Upright Row', array['Dumbbells']::text[]),
    ('Barbell Overhead Press', array['Barbell', 'Squat rack']::text[]),
    ('Plate Front Raise', array['Weight plate']::text[]),
    ('Wall Slide', array[]::text[]),
    ('Arm Circles (30 sec)', array[]::text[]),
    ('Dumbbell Biceps Curl', array['Dumbbells']::text[]),
    ('Hammer Curl', array['Dumbbells']::text[]),
    ('Concentration Curl', array['Dumbbells', 'Bench']::text[]),
    ('Cable Biceps Curl', array['Cable machine']::text[]),
    ('EZ-Bar Curl', array['EZ bar']::text[]),
    ('Machine Preacher Curl', array['Preacher curl']::text[]),
    ('Triceps Pushdown', array['Cable machine']::text[]),
    ('Overhead Dumbbell Triceps Extension', array['Dumbbells']::text[]),
    ('Bench Dip', array['Bench']::text[]),
    ('Dumbbell Skull Crusher', array['Dumbbells', 'Bench']::text[]),
    ('Triceps Kickback', array['Dumbbells']::text[]),
    ('Diamond Push-Up', array[]::text[]),
    ('Zottman Curl', array['Dumbbells']::text[]),
    ('Dumbbell Wrist Curl', array['Dumbbells', 'Bench']::text[]),
    ('Reverse Curl', array['Dumbbells']::text[]),
    ('Farmer''s Carry (30 sec)', array['Dumbbells']::text[]),
    ('Forearm Plank (30 sec)', array[]::text[]),
    ('Side Plank (20 sec)', array[]::text[]),
    ('Dead Bug', array[]::text[]),
    ('Crunch', array[]::text[]),
    ('Bicycle Crunch', array[]::text[]),
    ('Reverse Crunch', array[]::text[]),
    ('Lying Leg Raise', array[]::text[]),
    ('Mountain Climber', array[]::text[]),
    ('Russian Twist', array[]::text[]),
    ('Flutter Kick', array[]::text[]),
    ('Hollow Body Hold (20 sec)', array[]::text[]),
    ('Glute Bridge March', array[]::text[]),
    ('Pallof Press', array['Cable machine']::text[]),
    ('Cable Woodchopper', array['Cable machine']::text[]),
    ('Heel Tap', array[]::text[]),
    ('Plank Shoulder Tap', array[]::text[]),
    ('Toe Touch Crunch', array[]::text[]),
    ('Bear Crawl (30 sec)', array[]::text[]),
    ('Stability Ball Crunch', array['Stability ball']::text[]),
    ('Suitcase Carry (30 sec)', array['Dumbbells']::text[]),
    ('Cable Glute Kickback', array['Cable machine']::text[]),
    ('Cable Hip Abduction', array['Cable machine']::text[]),
    ('Cable Pull-Through', array['Cable machine']::text[]),
    ('Glute-Ham Raise', array['Glute-ham developer']::text[]),
    ('Box Jump', array['Plyo box']::text[]),
    ('Standing Cable Chest Press', array['Cable machine']::text[]),
    ('Low-to-High Cable Fly', array['Cable machine']::text[]),
    ('Pull-Up', array['Pull-up bar']::text[]),
    ('Chin-Up', array['Pull-up bar']::text[]),
    ('Neutral-Grip Pull-Up', array['Pull-up bar']::text[]),
    ('Close-Grip Lat Pulldown', array['Lat pulldown / row']::text[]),
    ('Single-Arm Cable Row', array['Cable machine']::text[]),
    ('Cable Rear Delt Fly', array['Cable machine']::text[]),
    ('Cable Upright Row', array['Cable machine']::text[]),
    ('Cable Front Raise', array['Cable machine']::text[]),
    ('Overhead Cable Triceps Extension', array['Cable machine']::text[]),
    ('Rope Hammer Curl', array['Cable machine']::text[]),
    ('Hanging Knee Raise', array['Pull-up bar']::text[]),
    ('Kneeling Cable Crunch', array['Cable machine']::text[]),
    ('GHD Sit-Up', array['Glute-ham developer']::text[])
) as e(name, equipment)
where b.name = e.name;

-- Exercises people already have, copied from a built-in one (by name): the same equipment, where none is set yet.
update public.workout_exercises w
set equipment = b.equipment
from public.builtin_exercises b
where w.name = b.name and w.equipment = '{}' and b.equipment <> '{}';

update public.library_exercises l
set equipment = b.equipment
from public.builtin_exercises b
where l.name = b.name and l.equipment = '{}' and b.equipment <> '{}';

notify pgrst, 'reload schema';
