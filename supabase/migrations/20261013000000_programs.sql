-- Programs: a plan of workouts in blocks. Each block repeats one week for a number of weeks (Build 3 weeks, Deload 1,
-- Peak 4), and a program runs its blocks in order. A program owns its own copies of its workouts, one per block, so
-- editing one changes only that program; they are ordinary workouts, marked with the block they belong to and the
-- weekdays they fall on, and kept out of the Spellbook's list of workouts.
--
-- Starting a program is a run: it puts every block on the calendar from a start date, and the sessions it adds remember
-- the run, so the calendar can say "Build, week 2 of 3" and ending it can take off the sessions still ahead. Several
-- programs can run at once.
--
-- Built-in programs are a shared read-only catalog, listing built-in workouts by name; using one copies it into the
-- person's own programs first. A shared link can now be one program's (shared_programs.program_id).
-- Needs 20260921000000_per_user_rls.sql, 20260928000000_builtin_workouts.sql, 20261008000000_resistance_bands.sql and
-- 20261012000000_shared_programs.sql first. Safe to re-run.

create table if not exists public.programs (
  id uuid primary key default gen_random_uuid(),
  user_id text default (auth.jwt() ->> 'sub'),
  name text not null check (char_length(name) between 1 and 80),
  notes text not null default '',
  created_at timestamptz not null default now()
);

create table if not exists public.program_blocks (
  id uuid primary key default gen_random_uuid(),
  user_id text default (auth.jwt() ->> 'sub'),
  program_id uuid not null references public.programs (id) on delete cascade,
  position integer not null default 0,
  name text not null default '' check (char_length(name) <= 40),
  weeks smallint not null default 1 check (weeks between 1 and 52)
);
create index if not exists program_blocks_program_idx on public.program_blocks (program_id, position);

create table if not exists public.program_runs (
  id uuid primary key default gen_random_uuid(),
  user_id text default (auth.jwt() ->> 'sub'),
  program_id uuid not null references public.programs (id) on delete cascade,
  start_date date not null,
  -- The block it started at (0 = the first), for someone who did the earlier ones on their own.
  start_block integer not null default 0 check (start_block >= 0),
  ended_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists program_runs_program_idx on public.program_runs (program_id);

-- A program's workouts: the block each belongs to and the weekdays it falls on (0 = Sunday). A deleted program's
-- workouts are archived by the app first, so the sessions already done keep them.
alter table public.workouts add column if not exists program_block_id uuid references public.program_blocks (id) on delete set null;
alter table public.workouts add column if not exists program_days smallint[];
alter table public.workouts drop constraint if exists workouts_program_days_weekdays;
alter table public.workouts add constraint workouts_program_days_weekdays
  check (program_days is null or program_days <@ array[0, 1, 2, 3, 4, 5, 6]::smallint[]);
create index if not exists workouts_program_block_idx on public.workouts (program_block_id);

-- The run a session was put on the calendar by, if any.
alter table public.plan_entries add column if not exists program_run_id uuid references public.program_runs (id) on delete set null;
create index if not exists plan_entries_program_run_idx on public.plan_entries (program_run_id);

-- Only their owner can read or change them, as with the other planner tables.
do $$
declare
  t text;
begin
  foreach t in array array['programs', 'program_blocks', 'program_runs'] loop
    execute format('create index if not exists %I on public.%I (user_id)', t || '_user_id_idx', t);
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "owner full access" on public.%I', t);
    execute format(
      'create policy "owner full access" on public.%I for all to authenticated using (user_id = (auth.jwt() ->> ''sub'')) with check (user_id = (auth.jwt() ->> ''sub''))',
      t
    );
  end loop;
end $$;

-- A shared link can belong to a program: one link per program, and sharing it again updates the same link. The old
-- one-per-person rule goes, so each program can have its own.
alter table public.shared_programs add column if not exists program_id uuid references public.programs (id) on delete cascade;
alter table public.shared_programs drop constraint if exists shared_programs_user_id_key;
create unique index if not exists shared_programs_program_idx on public.shared_programs (program_id);

-- Built-in programs: each block names its weeks and, per weekday (Sunday first), the built-in workouts on it.
create table if not exists public.builtin_programs (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  sort_order integer not null default 0,
  notes text not null default '',
  blocks jsonb not null
);

alter table public.builtin_programs enable row level security;
drop policy if exists "anyone can read" on public.builtin_programs;
create policy "anyone can read" on public.builtin_programs for select to anon, authenticated using (true);

-- One statement, so it is all or nothing even where each statement runs on its own (as in the Supabase SQL editor): the
-- programs are written, then checked, and if one names a workout that isn't a built-in one, the whole block is undone.
do $$
declare
  missing text[];
begin
  insert into public.builtin_programs (sort_order, name, notes, blocks)
  values
    (1, 'Resistance band starter', 'Three band workouts a week: full body to learn the moves, then split into upper and lower.',
     '[{"name": "Base", "weeks": 3, "days": [[], ["Band Full Body"], [], ["Band Full Body"], [], ["Band Full Body"], []]},
       {"name": "Build", "weeks": 3, "days": [[], ["Band Upper Body"], [], ["Band Lower Body"], [], ["Band Full Body"], []]}]'),
    (2, 'Full body foundations', 'Two full body workouts, alternated three days a week, then an easier week.',
     '[{"name": "Foundation", "weeks": 4, "days": [[], ["Full Body Basics A"], [], ["Full Body Basics B"], [], ["Full Body Basics A"], []]},
       {"name": "Deload", "weeks": 1, "days": [[], ["Full Body Basics A"], [], [], ["Full Body Basics B"], [], []]}]'),
    (3, 'Upper / lower, 4 days', 'Upper and lower body twice a week each: machines first, then free weights.',
     '[{"name": "Machines", "weeks": 4, "days": [[], ["Upper Body Machines"], ["Lower Body Machines"], [], ["Upper Body Machines"], ["Lower Body Machines"], []]},
       {"name": "Free weights", "weeks": 4, "days": [[], ["Upper Body Dumbbells"], ["Lower Body Free Weights"], [], ["Upper Body Dumbbells"], ["Lower Body Free Weights"], []]}]')
  on conflict (name) do update set
    sort_order = excluded.sort_order,
    notes = excluded.notes,
    blocks = excluded.blocks;

  select array_agg(distinct w) into missing
    from public.builtin_programs p,
         jsonb_array_elements(p.blocks) b,
         jsonb_array_elements(b -> 'days') d,
         jsonb_array_elements_text(d) w
    where not exists (select 1 from public.builtin_workouts bw where bw.name = w);
  if missing is not null then
    raise exception 'Not in the built-in workouts: %. Run the earlier workout migrations first.', missing;
  end if;
end $$;
