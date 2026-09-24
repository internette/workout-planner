-- Archived copies of a workout (made when an edit keeps some sessions on the old version) remember which workout
-- they came from. Deleting the workout then also finds its sessions still on those copies, even after a rename.
-- Until this runs, the app matches copies by name instead.
-- Safe to re-run.

-- Same type as workouts.id, whatever the original project made it.
do $$
declare id_type text;
begin
  select format_type(atttypid, atttypmod) into id_type
  from pg_attribute
  where attrelid = 'public.workouts'::regclass and attname = 'id';
  execute format(
    'alter table public.workouts add column if not exists source_workout_id %s references public.workouts(id) on delete set null',
    id_type
  );
end $$;

-- Existing copies: link each to the live workout of the same name (and owner), where there is one.
update public.workouts as copy
set source_workout_id = live.id
from public.workouts as live
where copy.archived
  and copy.source_workout_id is null
  and not live.archived
  and live.name = copy.name
  and live.user_id is not distinct from copy.user_id;

-- Make the API pick up the new column straight away.
notify pgrst, 'reload schema';
