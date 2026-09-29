-- A warm-up is a switch, not a kind: any workout can be one, whatever its kind (a plain workout, a stretch or yoga), so
-- a warm-up stretch or a short yoga flow before a lift can be saved. A workout is still at most one of a stretch or
-- yoga. This replaces the yoga migration's check, which let a workout be only one of a warm-up, a stretch or yoga.
-- Needs 20261003000000_yoga.sql first. Safe to re-run.

alter table public.workouts drop constraint if exists workouts_one_kind;
alter table public.workouts drop constraint if exists workouts_stretch_or_yoga;
alter table public.workouts add constraint workouts_stretch_or_yoga check (not (is_stretch and is_yoga));
