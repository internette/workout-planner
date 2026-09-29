-- Stretches: a workout can be marked as a stretch, a third kind beside workouts and warm-ups (chosen in the workout
-- editor). A stretch is listed after the other workouts on its day (a cool-down), is tagged STRETCH wherever it's shown,
-- and has its own filter in the Spellbook. Adds the flag to people's workouts and to the built-in ones, eighteen
-- stretches to the built-in catalog, drawn with the lunge icon, and five built-in stretches made from them (and
-- Cat-Cow, from the warm-ups).
-- Stretches are held, so like the other timed exercises their hold is in the name ("(30 sec each side)") and they
-- have sets but no reps. All bodyweight, except the doorway chest stretch, which needs only a doorway.
-- Built-in workouts can now say their own icon and length: a stretch is about ten minutes. Workouts without them keep
-- the dumbbell and the usual estimate.
-- Needs 20260925000000_builtin_exercises.sql, 20260928000000_builtin_workouts.sql,
-- 20260929000000_exercise_equipment.sql and 20260930000000_warmups.sql first. Safe to re-run: it updates rows by name.

alter table public.workouts add column if not exists is_stretch boolean not null default false;
alter table public.builtin_workouts add column if not exists is_stretch boolean not null default false;
-- One kind at a time: a workout is a warm-up, a stretch, or neither.
alter table public.workouts drop constraint if exists workouts_warmup_or_stretch;
alter table public.workouts add constraint workouts_warmup_or_stretch check (not (is_warmup and is_stretch));
alter table public.builtin_workouts add column if not exists icon text;
alter table public.builtin_workouts add column if not exists minutes integer;

insert into public.builtin_exercises
  (sort_order, name, sets, reps, weight_value, weight_unit, rest_seconds, icon, target_areas, equipment)
values
  -- Legs and hips
  (131, 'Standing Quad Stretch (30 sec each side)', 2, null, null, null, 15, 'lunge', '{Legs}', '{}'),
  (132, 'Seated Hamstring Stretch (30 sec)', 2, null, null, null, 15, 'lunge', '{Legs,Back}', '{}'),
  (133, 'Kneeling Hip Flexor Stretch (30 sec each side)', 2, null, null, null, 15, 'lunge', '{Legs,Core}', '{}'),
  (134, 'Figure-Four Stretch (30 sec each side)', 2, null, null, null, 15, 'lunge', '{Legs}', '{}'),
  (135, 'Pigeon Pose (30 sec each side)', 2, null, null, null, 15, 'lunge', '{Legs,Back}', '{}'),
  (136, 'Butterfly Stretch (30 sec)', 2, null, null, null, 15, 'lunge', '{Legs}', '{}'),
  (137, 'Standing Calf Stretch (30 sec each side)', 2, null, null, null, 15, 'lunge', '{Legs}', '{}'),
  -- Back and core
  (138, 'Child''s Pose (45 sec)', 2, null, null, null, 15, 'lunge', '{Back,Shoulders}', '{}'),
  (139, 'Cobra Stretch (30 sec)', 2, null, null, null, 15, 'lunge', '{Core,Back}', '{}'),
  (140, 'Supine Twist (30 sec each side)', 2, null, null, null, 15, 'lunge', '{Back,Core}', '{}'),
  (141, 'Knees-to-Chest Stretch (30 sec)', 2, null, null, null, 15, 'lunge', '{Back,Legs}', '{}'),
  (142, 'Standing Side Stretch (20 sec each side)', 2, null, null, null, 15, 'lunge', '{Core,Back}', '{}'),
  (143, 'Thread the Needle (30 sec each side)', 2, null, null, null, 15, 'lunge', '{Back,Shoulders}', '{}'),
  -- Upper body
  (144, 'Cross-Body Shoulder Stretch (30 sec each side)', 2, null, null, null, 15, 'lunge', '{Shoulders,Back}', '{}'),
  (145, 'Overhead Triceps Stretch (30 sec each side)', 2, null, null, null, 15, 'lunge', '{Arms,Shoulders}', '{}'),
  (146, 'Doorway Chest Stretch (30 sec)', 2, null, null, null, 15, 'lunge', '{Chest,Shoulders}', '{}'),
  (147, 'Neck Side Stretch (20 sec each side)', 2, null, null, null, 15, 'lunge', '{Shoulders}', '{}'),
  (148, 'Wrist Flexor Stretch (20 sec each side)', 2, null, null, null, 15, 'lunge', '{Arms}', '{}')
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
-- the stretches are written, then checked, and if one lists an exercise that isn't a built-in one, the whole block is
-- undone.
do $$
declare
  missing text[];
begin
  insert into public.builtin_workouts (sort_order, name, category, is_stretch, icon, minutes, exercises)
  values
    (36, 'Full Body Stretch', 'Stretching', true, 'lunge', 12, array['Child''s Pose (45 sec)', 'Cobra Stretch (30 sec)', 'Kneeling Hip Flexor Stretch (30 sec each side)', 'Seated Hamstring Stretch (30 sec)', 'Cross-Body Shoulder Stretch (30 sec each side)', 'Supine Twist (30 sec each side)']),
    (37, 'Lower Body Stretch', 'Stretching', true, 'lunge', 12, array['Standing Quad Stretch (30 sec each side)', 'Kneeling Hip Flexor Stretch (30 sec each side)', 'Seated Hamstring Stretch (30 sec)', 'Figure-Four Stretch (30 sec each side)', 'Butterfly Stretch (30 sec)', 'Standing Calf Stretch (30 sec each side)']),
    (38, 'Upper Body Stretch', 'Stretching', true, 'lunge', 10, array['Neck Side Stretch (20 sec each side)', 'Cross-Body Shoulder Stretch (30 sec each side)', 'Overhead Triceps Stretch (30 sec each side)', 'Doorway Chest Stretch (30 sec)', 'Thread the Needle (30 sec each side)']),
    (39, 'Back & Hips Release', 'Stretching', true, 'lunge', 12, array['Child''s Pose (45 sec)', 'Cat-Cow', 'Knees-to-Chest Stretch (30 sec)', 'Supine Twist (30 sec each side)', 'Pigeon Pose (30 sec each side)', 'Figure-Four Stretch (30 sec each side)']),
    (40, 'Post-Lift Cool-Down', 'Stretching', true, 'lunge', 10, array['Standing Quad Stretch (30 sec each side)', 'Seated Hamstring Stretch (30 sec)', 'Kneeling Hip Flexor Stretch (30 sec each side)', 'Cross-Body Shoulder Stretch (30 sec each side)', 'Doorway Chest Stretch (30 sec)'])
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    category = excluded.category,
    is_stretch = excluded.is_stretch,
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
