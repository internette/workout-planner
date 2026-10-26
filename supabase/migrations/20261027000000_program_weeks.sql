-- Program weeks: a block can go week by week, so each of its weeks has its own copy of each workout (heavier, or more
-- reps, each week). Until now a block repeated one week, its workouts shared by all its weeks.
--
-- program_blocks.by_week says a block goes week by week. Its workouts then each belong to one of its weeks
-- (workouts.program_week, 1 = the first); the same workout in each week is a copy of its own, on the same weekdays. A
-- workout with no week, as every one was before, is in every week of its block.
-- Until this runs the app shows every block as the same every week, and the switch isn't offered.
-- Needs 20261013000000_programs.sql first. Safe to re-run.

alter table public.program_blocks add column if not exists by_week boolean not null default false;

alter table public.workouts add column if not exists program_week smallint;
alter table public.workouts drop constraint if exists workouts_program_week_range;
alter table public.workouts add constraint workouts_program_week_range check (program_week is null or program_week between 1 and 52);
