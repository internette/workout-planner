-- More built-in exercises, for the equipment in the gym's fitness area: the cable trainer (two adjustable pulleys,
-- a multi-grip pull-up bar, rope, D-handle, ankle-strap and bar attachments), the lat pulldown / low row station,
-- the leg extension / leg curl machine, the glute-ham developer and the plyo boxes. What those already covered
-- (Leg Extension, Seated Leg Curl, Lat Pulldown, Seated Cable Row, Straight-Arm Pulldown, Face Pull, Cable Chest
-- Fly, Cable Lateral Raise, Cable Biceps Curl, Triceps Pushdown, Pallof Press, Cable Woodchopper, Back Extension,
-- Step-Up, Box Squat, Assisted Pull-Up) is already in the catalog and isn't added again.
-- Needs 20260925000000_builtin_exercises.sql first. Safe to re-run: it updates rows by name.

insert into public.builtin_exercises
  (sort_order, name, sets, reps, weight_value, weight_unit, rest_seconds, icon, target_areas)
values
  -- Legs
  (101, 'Cable Glute Kickback', 3, 12, 15, 'lb', 60, 'h', '{Legs}'),
  (102, 'Cable Hip Abduction', 3, 12, 10, 'lb', 60, 'h', '{Legs}'),
  (103, 'Cable Pull-Through', 3, 12, 30, 'lb', 60, 'h', '{Legs,Back}'),
  (104, 'Glute-Ham Raise', 3, 6, null, null, 90, 'v', '{Legs}'),
  (105, 'Box Jump', 3, 8, null, null, 60, 'v', '{Legs}'),
  -- Chest
  (106, 'Standing Cable Chest Press', 3, 12, 20, 'lb', 60, 'h', '{Chest,Arms}'),
  (107, 'Low-to-High Cable Fly', 3, 12, 10, 'lb', 60, 'h', '{Chest,Shoulders}'),
  -- Back
  (108, 'Pull-Up', 3, 6, null, null, 90, 'v', '{Back,Arms}'),
  (109, 'Chin-Up', 3, 6, null, null, 90, 'v', '{Back,Arms}'),
  (110, 'Neutral-Grip Pull-Up', 3, 6, null, null, 90, 'v', '{Back,Arms}'),
  (111, 'Close-Grip Lat Pulldown', 3, 12, 50, 'lb', 90, 'h', '{Back,Arms}'),
  (112, 'Single-Arm Cable Row', 3, 12, 25, 'lb', 60, 'h', '{Back,Arms}'),
  -- Shoulders
  (113, 'Cable Rear Delt Fly', 3, 12, 10, 'lb', 60, 'h', '{Shoulders,Back}'),
  (114, 'Cable Upright Row', 3, 12, 20, 'lb', 60, 'h', '{Shoulders,Back}'),
  (115, 'Cable Front Raise', 3, 12, 10, 'lb', 60, 'h', '{Shoulders}'),
  -- Arms
  (116, 'Overhead Cable Triceps Extension', 3, 12, 20, 'lb', 60, 'h', '{Arms}'),
  (117, 'Rope Hammer Curl', 3, 12, 20, 'lb', 60, 'h', '{Arms}'),
  -- Core
  (118, 'Hanging Knee Raise', 3, 10, null, null, 60, 'v', '{Core}'),
  (119, 'Kneeling Cable Crunch', 3, 12, 30, 'lb', 60, 'h', '{Core}'),
  (120, 'GHD Sit-Up', 3, 10, null, null, 60, 'v', '{Core}')
on conflict (name) do update set
  sort_order = excluded.sort_order,
  sets = excluded.sets,
  reps = excluded.reps,
  weight_value = excluded.weight_value,
  weight_unit = excluded.weight_unit,
  rest_seconds = excluded.rest_seconds,
  icon = excluded.icon,
  target_areas = excluded.target_areas;

notify pgrst, 'reload schema';
