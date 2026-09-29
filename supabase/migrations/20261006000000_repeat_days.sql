-- A weekly series can repeat on more than one weekday: a workout put on Tuesdays, Thursdays and Saturdays. The
-- weekdays it repeats on (0 = Sunday) are kept on the workout. A series from before this has none: its weekday is
-- still the one most of its sessions fall on.
-- Safe to re-run.

alter table public.workouts add column if not exists repeat_days smallint[];
alter table public.workouts drop constraint if exists workouts_repeat_days_weekdays;
alter table public.workouts add constraint workouts_repeat_days_weekdays
  check (repeat_days is null or repeat_days <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]);
