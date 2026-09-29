-- Yoga: fifty yoga poses in the built-in catalog, drawn with the lotus flower, and twenty built-in yoga flows made from
-- them (and from five stretches and warm-ups already there: Cat-Cow, Child's Pose, Pigeon Pose, Cobra Stretch, Supine Twist
-- and Thread the Needle), grouped under "Yoga" in the Spellbook.
-- Poses are held, so like the stretches their hold is in the name ("(30 sec each side)") and they have sets but no reps:
-- one set each (a sun salutation's set is a round), and no rest between, so a flow runs from one pose to the next.
-- A flow's length is its holds plus about fifteen seconds to move between poses (and sides), rounded up to five
-- minutes: from ten to forty. All bodyweight, on a mat.
-- Needs 20260925000000_builtin_exercises.sql through 20261002000000_stretches.sql first. Safe to re-run: it updates rows
-- by name.

insert into public.builtin_exercises
  (sort_order, name, sets, reps, weight_value, weight_unit, rest_seconds, icon, target_areas, equipment)
values
  -- Standing
  (151, 'Mountain Pose (30 sec)', 1, null, null, null, null, 'flower', '{Legs,Core}', '{}'),
  (152, 'Downward-Facing Dog (45 sec)', 1, null, null, null, null, 'flower', '{Shoulders,Legs,Back}', '{}'),
  (153, 'Upward-Facing Dog (20 sec)', 1, null, null, null, null, 'flower', '{Back,Chest,Core}', '{}'),
  (154, 'Chaturanga (10 sec)', 1, null, null, null, null, 'flower', '{Arms,Chest,Core}', '{}'),
  (155, 'Standing Forward Fold (30 sec)', 1, null, null, null, null, 'flower', '{Legs,Back}', '{}'),
  (156, 'Halfway Lift (15 sec)', 1, null, null, null, null, 'flower', '{Back,Legs}', '{}'),
  (157, 'Chair Pose (30 sec)', 1, null, null, null, null, 'flower', '{Legs,Core}', '{}'),
  (158, 'Warrior I (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Shoulders}', '{}'),
  (159, 'Warrior II (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Shoulders}', '{}'),
  (160, 'Warrior III (20 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Core}', '{}'),
  (161, 'Reverse Warrior (20 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Core}', '{}'),
  (162, 'Extended Side Angle (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Core}', '{}'),
  (163, 'Triangle Pose (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Core}', '{}'),
  (164, 'Revolved Triangle (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Back}', '{}'),
  (165, 'Half Moon Pose (20 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Core}', '{}'),
  (166, 'High Lunge (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Core}', '{}'),
  (167, 'Low Lunge (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs}', '{}'),
  (168, 'Crescent Twist (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Core,Back}', '{}'),
  (169, 'Wide-Legged Forward Fold (45 sec)', 1, null, null, null, null, 'flower', '{Legs,Back}', '{}'),
  (170, 'Pyramid Pose (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs}', '{}'),
  (171, 'Goddess Pose (30 sec)', 1, null, null, null, null, 'flower', '{Legs}', '{}'),
  (172, 'Garland Pose (45 sec)', 1, null, null, null, null, 'flower', '{Legs,Back}', '{}'),
  (173, 'Tree Pose (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Core}', '{}'),
  (174, 'Eagle Pose (20 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Shoulders}', '{}'),
  (175, 'Dancer Pose (20 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Shoulders}', '{}'),
  -- Core and arms
  (176, 'Plank Pose (30 sec)', 1, null, null, null, null, 'flower', '{Core,Shoulders}', '{}'),
  (177, 'Dolphin Pose (30 sec)', 1, null, null, null, null, 'flower', '{Shoulders,Core}', '{}'),
  (178, 'Boat Pose (20 sec)', 2, null, null, null, null, 'flower', '{Core}', '{}'),
  (179, 'Crow Pose (15 sec)', 2, null, null, null, null, 'flower', '{Arms,Core}', '{}'),
  (180, 'Three-Legged Dog (15 sec each side)', 1, null, null, null, null, 'flower', '{Shoulders,Legs}', '{}'),
  -- Backbends
  (181, 'Sphinx Pose (45 sec)', 1, null, null, null, null, 'flower', '{Back}', '{}'),
  (182, 'Locust Pose (20 sec)', 2, null, null, null, null, 'flower', '{Back}', '{}'),
  (183, 'Bow Pose (20 sec)', 1, null, null, null, null, 'flower', '{Back,Chest}', '{}'),
  (184, 'Camel Pose (20 sec)', 1, null, null, null, null, 'flower', '{Back,Chest}', '{}'),
  (185, 'Bridge Pose (30 sec)', 2, null, null, null, null, 'flower', '{Legs,Back}', '{}'),
  (186, 'Puppy Pose (45 sec)', 1, null, null, null, null, 'flower', '{Shoulders,Back}', '{}'),
  -- Seated and lying
  (187, 'Easy Seat Breathing (60 sec)', 1, null, null, null, null, 'flower', '{Core}', '{}'),
  (188, 'Seated Forward Fold (45 sec)', 1, null, null, null, null, 'flower', '{Legs,Back}', '{}'),
  (189, 'Head-to-Knee Pose (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs,Back}', '{}'),
  (190, 'Seated Twist (30 sec each side)', 1, null, null, null, null, 'flower', '{Back,Core}', '{}'),
  (191, 'Cow Face Pose (30 sec each side)', 1, null, null, null, null, 'flower', '{Shoulders,Arms,Legs}', '{}'),
  (192, 'Lizard Pose (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs}', '{}'),
  (193, 'Half Splits (30 sec each side)', 1, null, null, null, null, 'flower', '{Legs}', '{}'),
  (194, 'Frog Pose (45 sec)', 1, null, null, null, null, 'flower', '{Legs}', '{}'),
  (195, 'Reclined Bound Angle (60 sec)', 1, null, null, null, null, 'flower', '{Legs}', '{}'),
  (196, 'Happy Baby (45 sec)', 1, null, null, null, null, 'flower', '{Legs,Back}', '{}'),
  (197, 'Legs Up the Wall (90 sec)', 1, null, null, null, null, 'flower', '{Legs}', '{}'),
  (198, 'Savasana (180 sec)', 1, null, null, null, null, 'flower', '{Core}', '{}'),
  -- Sequences: a set is a round
  (199, 'Sun Salutation A (60 sec)', 3, null, null, null, null, 'flower', '{Legs,Shoulders,Core}', '{}'),
  (200, 'Sun Salutation B (90 sec)', 2, null, null, null, null, 'flower', '{Legs,Shoulders,Core}', '{}')
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
-- the flows are written, then checked, and if one lists an exercise that isn't a built-in one, the whole block is
-- undone.
do $$
declare
  missing text[];
begin
  insert into public.builtin_workouts (sort_order, name, category, icon, minutes, exercises)
  values
    (41, 'Morning Sun Flow', 'Yoga', 'flower', 20, array['Easy Seat Breathing (60 sec)', 'Cat-Cow', 'Downward-Facing Dog (45 sec)', 'Sun Salutation A (60 sec)', 'Warrior I (30 sec each side)', 'Warrior II (30 sec each side)', 'Triangle Pose (30 sec each side)', 'Tree Pose (30 sec each side)', 'Seated Forward Fold (45 sec)', 'Savasana (180 sec)']),
    (42, 'Gentle Beginner Flow', 'Yoga', 'flower', 20, array['Easy Seat Breathing (60 sec)', 'Cat-Cow', 'Child''s Pose (45 sec)', 'Downward-Facing Dog (45 sec)', 'Low Lunge (30 sec each side)', 'Standing Forward Fold (30 sec)', 'Mountain Pose (30 sec)', 'Warrior II (30 sec each side)', 'Bridge Pose (30 sec)', 'Supine Twist (30 sec each side)', 'Savasana (180 sec)']),
    (43, 'Hip Opening Flow', 'Yoga', 'flower', 20, array['Cat-Cow', 'Low Lunge (30 sec each side)', 'Lizard Pose (30 sec each side)', 'Goddess Pose (30 sec)', 'Garland Pose (45 sec)', 'Pigeon Pose (30 sec each side)', 'Frog Pose (45 sec)', 'Cow Face Pose (30 sec each side)', 'Reclined Bound Angle (60 sec)', 'Happy Baby (45 sec)', 'Savasana (180 sec)']),
    (44, 'Hamstring Release', 'Yoga', 'flower', 15, array['Downward-Facing Dog (45 sec)', 'Standing Forward Fold (30 sec)', 'Halfway Lift (15 sec)', 'Pyramid Pose (30 sec each side)', 'Wide-Legged Forward Fold (45 sec)', 'Half Splits (30 sec each side)', 'Head-to-Knee Pose (30 sec each side)', 'Seated Forward Fold (45 sec)', 'Legs Up the Wall (90 sec)', 'Savasana (180 sec)']),
    (45, 'Core Strength Flow', 'Yoga', 'flower', 20, array['Cat-Cow', 'Plank Pose (30 sec)', 'Dolphin Pose (30 sec)', 'Boat Pose (20 sec)', 'Three-Legged Dog (15 sec each side)', 'Chaturanga (10 sec)', 'Upward-Facing Dog (20 sec)', 'Downward-Facing Dog (45 sec)', 'Crescent Twist (30 sec each side)', 'Locust Pose (20 sec)', 'Child''s Pose (45 sec)', 'Savasana (180 sec)']),
    (46, 'Balance & Focus', 'Yoga', 'flower', 15, array['Mountain Pose (30 sec)', 'Tree Pose (30 sec each side)', 'Eagle Pose (20 sec each side)', 'Warrior III (20 sec each side)', 'Half Moon Pose (20 sec each side)', 'Dancer Pose (20 sec each side)', 'Chair Pose (30 sec)', 'Standing Forward Fold (30 sec)', 'Easy Seat Breathing (60 sec)', 'Savasana (180 sec)']),
    (47, 'Warrior Flow', 'Yoga', 'flower', 20, array['Sun Salutation A (60 sec)', 'Warrior I (30 sec each side)', 'Warrior II (30 sec each side)', 'Reverse Warrior (20 sec each side)', 'Extended Side Angle (30 sec each side)', 'Triangle Pose (30 sec each side)', 'Warrior III (20 sec each side)', 'High Lunge (30 sec each side)', 'Wide-Legged Forward Fold (45 sec)', 'Child''s Pose (45 sec)', 'Savasana (180 sec)']),
    (48, 'Heart Opener', 'Yoga', 'flower', 20, array['Cat-Cow', 'Puppy Pose (45 sec)', 'Sphinx Pose (45 sec)', 'Cobra Stretch (30 sec)', 'Locust Pose (20 sec)', 'Bow Pose (20 sec)', 'Low Lunge (30 sec each side)', 'Camel Pose (20 sec)', 'Bridge Pose (30 sec)', 'Supine Twist (30 sec each side)', 'Savasana (180 sec)']),
    (49, 'Bedtime Wind-Down', 'Yoga', 'flower', 20, array['Child''s Pose (45 sec)', 'Cat-Cow', 'Seated Forward Fold (45 sec)', 'Seated Twist (30 sec each side)', 'Reclined Bound Angle (60 sec)', 'Happy Baby (45 sec)', 'Supine Twist (30 sec each side)', 'Legs Up the Wall (90 sec)', 'Savasana (180 sec)']),
    (50, 'Lower Back Relief', 'Yoga', 'flower', 20, array['Cat-Cow', 'Child''s Pose (45 sec)', 'Sphinx Pose (45 sec)', 'Thread the Needle (30 sec each side)', 'Bridge Pose (30 sec)', 'Happy Baby (45 sec)', 'Supine Twist (30 sec each side)', 'Legs Up the Wall (90 sec)', 'Savasana (180 sec)']),
    (51, 'Shoulder & Neck Release', 'Yoga', 'flower', 20, array['Easy Seat Breathing (60 sec)', 'Cat-Cow', 'Thread the Needle (30 sec each side)', 'Puppy Pose (45 sec)', 'Cow Face Pose (30 sec each side)', 'Eagle Pose (20 sec each side)', 'Dolphin Pose (30 sec)', 'Downward-Facing Dog (45 sec)', 'Child''s Pose (45 sec)', 'Savasana (180 sec)']),
    (52, 'Post-Run Yoga', 'Yoga', 'flower', 20, array['Downward-Facing Dog (45 sec)', 'Low Lunge (30 sec each side)', 'Half Splits (30 sec each side)', 'Lizard Pose (30 sec each side)', 'Pigeon Pose (30 sec each side)', 'Wide-Legged Forward Fold (45 sec)', 'Garland Pose (45 sec)', 'Reclined Bound Angle (60 sec)', 'Legs Up the Wall (90 sec)', 'Savasana (180 sec)']),
    (53, 'Power Flow', 'Yoga', 'flower', 25, array['Sun Salutation A (60 sec)', 'Sun Salutation B (90 sec)', 'Chair Pose (30 sec)', 'Crescent Twist (30 sec each side)', 'Warrior III (20 sec each side)', 'Half Moon Pose (20 sec each side)', 'Plank Pose (30 sec)', 'Crow Pose (15 sec)', 'Boat Pose (20 sec)', 'Camel Pose (20 sec)', 'Pigeon Pose (30 sec each side)', 'Savasana (180 sec)']),
    (54, 'Twist & Reset', 'Yoga', 'flower', 20, array['Easy Seat Breathing (60 sec)', 'Seated Twist (30 sec each side)', 'Cat-Cow', 'Thread the Needle (30 sec each side)', 'Crescent Twist (30 sec each side)', 'Revolved Triangle (30 sec each side)', 'Chair Pose (30 sec)', 'Supine Twist (30 sec each side)', 'Savasana (180 sec)']),
    (55, 'Desk Reset', 'Yoga', 'flower', 15, array['Mountain Pose (30 sec)', 'Standing Forward Fold (30 sec)', 'Halfway Lift (15 sec)', 'Eagle Pose (20 sec each side)', 'Low Lunge (30 sec each side)', 'Puppy Pose (45 sec)', 'Cat-Cow', 'Seated Twist (30 sec each side)', 'Cow Face Pose (30 sec each side)']),
    (56, 'Slow Flow', 'Yoga', 'flower', 20, array['Easy Seat Breathing (60 sec)', 'Cat-Cow', 'Downward-Facing Dog (45 sec)', 'Low Lunge (30 sec each side)', 'Warrior II (30 sec each side)', 'Triangle Pose (30 sec each side)', 'Tree Pose (30 sec each side)', 'Sphinx Pose (45 sec)', 'Bridge Pose (30 sec)', 'Reclined Bound Angle (60 sec)', 'Savasana (180 sec)']),
    (57, 'Strength & Stability', 'Yoga', 'flower', 15, array['Mountain Pose (30 sec)', 'Chair Pose (30 sec)', 'Warrior II (30 sec each side)', 'Warrior III (20 sec each side)', 'Goddess Pose (30 sec)', 'Plank Pose (30 sec)', 'Three-Legged Dog (15 sec each side)', 'Boat Pose (20 sec)', 'Locust Pose (20 sec)', 'Bridge Pose (30 sec)', 'Savasana (180 sec)']),
    (58, 'Deep Hips (Yin Style)', 'Yoga', 'flower', 20, array['Child''s Pose (45 sec)', 'Frog Pose (45 sec)', 'Lizard Pose (30 sec each side)', 'Pigeon Pose (30 sec each side)', 'Garland Pose (45 sec)', 'Reclined Bound Angle (60 sec)', 'Happy Baby (45 sec)', 'Legs Up the Wall (90 sec)', 'Savasana (180 sec)']),
    (59, 'Full Body Flow', 'Yoga', 'flower', 25, array['Easy Seat Breathing (60 sec)', 'Cat-Cow', 'Sun Salutation A (60 sec)', 'Warrior I (30 sec each side)', 'Warrior II (30 sec each side)', 'Reverse Warrior (20 sec each side)', 'Triangle Pose (30 sec each side)', 'Half Moon Pose (20 sec each side)', 'Plank Pose (30 sec)', 'Cobra Stretch (30 sec)', 'Bridge Pose (30 sec)', 'Seated Forward Fold (45 sec)', 'Supine Twist (30 sec each side)', 'Savasana (180 sec)']),
    (60, 'Quick Energizer', 'Yoga', 'flower', 10, array['Mountain Pose (30 sec)', 'Sun Salutation A (60 sec)', 'Chair Pose (30 sec)', 'High Lunge (30 sec each side)', 'Warrior II (30 sec each side)', 'Downward-Facing Dog (45 sec)', 'Standing Forward Fold (30 sec)'])
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    category = excluded.category,
    icon = excluded.icon,
    minutes = excluded.minutes,
    exercises = excluded.exercises;

  select array_agg(distinct e) into missing
    from public.builtin_workouts w, unnest(w.exercises) e
    where not exists (select 1 from public.builtin_exercises b where b.name = e);
  if missing is not null then
    raise exception 'Not in the built-in exercise catalog: %. Run the earlier exercise migrations first.', missing;
  end if;
end $$;
