-- Sharing a program: a copy of someone's week (which workouts fall on which weekday, with their exercises), kept as it
-- was when they shared it, behind a link. One per person: sharing again replaces it, and stopping deletes it.
--
-- Only its owner can read or change the row. Anyone with the link, signed in or not, reads it through
-- shared_program(), which looks up one by its id and counts the visit; the table itself can't be listed, so a link is
-- the only way in. The id is long and random (the app makes 12 letters and digits).
-- Needs 20260921000000_per_user_rls.sql first. Safe to re-run.

create table if not exists public.shared_programs (
  id text primary key check (id ~ '^[A-Za-z0-9]{10,32}$'),
  user_id text default (auth.jwt() ->> 'sub') unique,
  name text not null check (char_length(name) between 1 and 80),
  program jsonb not null,
  opens integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.shared_programs enable row level security;

drop policy if exists "owner full access" on public.shared_programs;
create policy "owner full access" on public.shared_programs
  for all to authenticated
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));

-- One program by its link: its name, its week, and when it was last shared. Counts the visit.
create or replace function public.shared_program(share_id text)
returns jsonb
language sql
security definer
set search_path = public
as $$
  update public.shared_programs
  set opens = opens + 1
  where id = share_id
  returning jsonb_build_object('name', name, 'program', program, 'updated_at', updated_at);
$$;

revoke all on function public.shared_program(text) from public;
grant execute on function public.shared_program(text) to anon, authenticated;
