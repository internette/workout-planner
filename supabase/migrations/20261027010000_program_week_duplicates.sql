-- Program weeks: tapping "Week by week" more than once while it saved copied a block's workouts into its later weeks
-- more than once, so a week could hold the same workout twice. This keeps the first copy of each workout in each week
-- and takes the others out of the program (archived, as a workout leaving a program always is). Sessions not finished
-- yet that were on a duplicate move onto the copy that stays; finished ones keep theirs.
-- Needs 20261027000000_program_weeks.sql first. Safe to re-run: with no duplicates it changes nothing.

do $$
begin
  create temp table program_week_extra on commit drop as
    select id, keeper
    from (
      select id,
             first_value(id) over (partition by program_block_id, program_week, lower(btrim(name)) order by created_at, id) as keeper
      from public.workouts
      where program_block_id is not null and program_week is not null and not archived
    ) ranked
    where id <> keeper;

  update public.plan_entries p
  set workout_id = e.keeper
  from program_week_extra e
  where p.workout_id = e.id and p.status <> 'completed' and p.actual_minutes is null;

  update public.workouts w
  set archived = true, program_block_id = null
  from program_week_extra e
  where w.id = e.id;
end $$;
