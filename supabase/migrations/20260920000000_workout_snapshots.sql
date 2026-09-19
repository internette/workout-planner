-- Editing a saved workout must not rewrite the sessions already done. Before an edit is applied, the
-- workout as it was is copied to a hidden "snapshot" row, and the sessions that should keep the old
-- version (past and completed ones, and upcoming ones if you choose) are pointed at that copy.
-- Snapshots are marked archived and are not shown in the Arsenal.
-- Safe to re-run.

alter table public.workouts
  add column if not exists archived boolean not null default false;

-- Make the API pick up the new column straight away.
notify pgrst, 'reload schema';
