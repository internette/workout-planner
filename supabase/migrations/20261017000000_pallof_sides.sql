-- The Pallof press is done a side at a time, so the ready-made workouts that have one carry it as a pair, "Pallof
-- Press · Left" and "Pallof Press · Right", the way a person's own workouts hold a one-sided exercise. The catalog
-- resolves a sided name to the exercise it's made from. Needs 20260928000000_builtin_workouts.sql and
-- 20261008000000_resistance_bands.sql.

update public.builtin_workouts w
set exercises = (
  select array_agg(u.y order by t.ord, u.k)
  from unnest(w.exercises) with ordinality as t(x, ord)
  cross join lateral unnest(
    case when t.x in ('Pallof Press', 'Band Pallof Press') then array[t.x || ' · Left', t.x || ' · Right'] else array[t.x] end
  ) with ordinality as u(y, k)
)
where 'Pallof Press' = any(w.exercises) or 'Band Pallof Press' = any(w.exercises);
