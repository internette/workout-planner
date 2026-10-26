-- Timed holds: a plank, a wall sit, a dead hang or a yoga pose is done for a time, not for reps. Until now that time
-- was part of its name ("Forearm Plank (30 sec)") and couldn't be changed. It now has its own column, hold_seconds, the
-- seconds of each set (in place of reps), which the app shows as "3 × 30 sec", lets you change, and counts down in a
-- session. The time comes out of the names: "Forearm Plank (30 sec)" becomes "Forearm Plank" with 30 seconds, and
-- "Warrior I (30 sec each side)" becomes "Warrior I (each side)". Also adds Dead Hang to the catalog.
-- Until this runs the app reads a hold's time from its name, as before, and its time can't be changed.
-- Needs 20260925000000_builtin_exercises.sql, 20260928000000_builtin_workouts.sql and
-- 20260929000000_exercise_equipment.sql first. Safe to re-run: names already without a time are left alone.

alter table public.builtin_exercises add column if not exists hold_seconds integer check (hold_seconds between 1 and 3600);
alter table public.library_exercises add column if not exists hold_seconds integer check (hold_seconds between 1 and 3600);
alter table public.workout_exercises add column if not exists hold_seconds integer check (hold_seconds between 1 and 3600);

-- A name without its time: "Forearm Plank (30 sec)" → "Forearm Plank", "Warrior I (30 sec each side)" → "Warrior I
-- (each side)". A side after it stays: "Side Plank (20 sec) · Left" → "Side Plank · Left".
create or replace function pg_temp.untimed(name text) returns text language sql immutable as $$
  select regexp_replace(regexp_replace(name, ' \(\d+ sec each side\)', ' (each side)'), ' \(\d+ sec\)', '')
$$;
-- The time in a name, in seconds.
create or replace function pg_temp.time_in(name text) returns integer language sql immutable as $$
  select (regexp_match(name, '\((\d+) sec'))[1]::integer
$$;

-- The catalog.
update public.builtin_exercises
set hold_seconds = pg_temp.time_in(name), reps = null, name = pg_temp.untimed(name)
where name ~ '\(\d+ sec';

update public.builtin_workouts
set exercises = (select array_agg(pg_temp.untimed(x) order by ord) from unnest(exercises) with ordinality as t(x, ord))
where array_to_string(exercises, '|') ~ '\(\d+ sec';

-- Everyone's own exercises and the exercises in their workouts. One of their own keeps its name if another of theirs
-- has or would get the same name (names are unique per person), but still gets its time.
update public.library_exercises l
set hold_seconds = pg_temp.time_in(l.name), reps = null
where l.name ~ '\(\d+ sec' and l.hold_seconds is null;

update public.library_exercises l
set name = pg_temp.untimed(l.name)
where l.name ~ '\(\d+ sec'
  and (select count(*) from public.library_exercises o
       where o.user_id is not distinct from l.user_id and pg_temp.untimed(o.name) = pg_temp.untimed(l.name)) = 1;

update public.workout_exercises
set hold_seconds = coalesce(hold_seconds, pg_temp.time_in(name)), reps = null, name = pg_temp.untimed(name)
where name ~ '\(\d+ sec';

-- Ticks are kept by name, so ticked holds keep their ticks.
update public.plan_entries
set done_exercises = (select array_agg(pg_temp.untimed(x) order by ord) from unnest(done_exercises) with ordinality as t(x, ord))
where array_to_string(done_exercises, '|') ~ '\(\d+ sec';

-- Dead Hang: hang from a pull-up bar with straight arms, for grip, forearms, lats and shoulders.
insert into public.builtin_exercises
  (sort_order, name, sets, reps, hold_seconds, weight_value, weight_unit, rest_seconds, icon, target_areas, equipment)
values
  (224, 'Dead Hang', 3, null, 30, null, null, 90, 'v', '{Back,Arms,Shoulders}', '{Pull-up bar}')
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
