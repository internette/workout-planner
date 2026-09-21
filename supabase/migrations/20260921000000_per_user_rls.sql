-- Per-user data. Every row belongs to the person who created it, and only that person can read or change it.
--
-- People sign in with Auth0 (Google or Apple). Supabase verifies Auth0's ID token (Authentication > Third-Party
-- Auth) and exposes its claims through auth.jwt(). Auth0 user ids are text such as 'google-oauth2|1234', not
-- UUIDs, so the owner column is text and is compared with the token's "sub" claim.
--
-- RUN THIS ONLY AFTER:
--   1. Auth0 has Google and Apple enabled and the "role" Action from the README, and
--   2. Supabase Third-Party Auth has the Auth0 integration, and
--   3. the app is running with NEXT_PUBLIC_AUTH_REQUIRED=true.
-- It removes the anonymous access that the app has used until now, so the app stops working for anyone who is not
-- signed in. Safe to run again.
--
-- Rows that exist today have no owner, so after this runs nobody can see them: everyone starts fresh.
-- To keep them for one account instead, see the last section.

do $$
declare
  t text;
  p record;
begin
  foreach t in array array['workouts', 'workout_exercises', 'plan_entries', 'diary_entries', 'library_exercises'] loop
    -- The owner defaults to whoever is signed in when the row is inserted, so the app never has to send it.
    execute format(
      'alter table public.%I add column if not exists user_id text default (auth.jwt() ->> ''sub'')',
      t
    );
    execute format('create index if not exists %I on public.%I (user_id)', t || '_user_id_idx', t);
    execute format('alter table public.%I enable row level security', t);

    -- Drop every existing policy, including the "anon full access" ones, then allow only the owner.
    for p in select policyname from pg_policies where schemaname = 'public' and tablename = t loop
      execute format('drop policy %I on public.%I', p.policyname, t);
    end loop;
    execute format(
      'create policy "owner full access" on public.%I for all to authenticated using (user_id = (auth.jwt() ->> ''sub'')) with check (user_id = (auth.jwt() ->> ''sub''))',
      t
    );
  end loop;
end $$;

-- Library exercise names were unique across everyone. Make them unique per person.
alter table public.library_exercises drop constraint if exists library_exercises_name_key;
create unique index if not exists library_exercises_user_name_idx on public.library_exercises (user_id, name);

-- To keep today's data for one account, sign in once, then find your id: it is the "sub" of your ID token, shown
-- in Auth0 under User Management > Users as "user_id" (for example google-oauth2|1234). Run this for each table,
-- replacing the id:
--   update public.workouts           set user_id = 'google-oauth2|0000' where user_id is null;
--   update public.workout_exercises  set user_id = 'google-oauth2|0000' where user_id is null;
--   update public.plan_entries       set user_id = 'google-oauth2|0000' where user_id is null;
--   update public.diary_entries      set user_id = 'google-oauth2|0000' where user_id is null;
--   update public.library_exercises  set user_id = 'google-oauth2|0000' where user_id is null;
