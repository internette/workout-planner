-- Program history: each run keeps the program as it was when it started (its name, and a snapshot in the shared
-- program format: its blocks, and their workouts with their exercises), so the Profile can list every program run and
-- show each as it was, even after the program is changed or deleted. A run now outlives its program: deleting the
-- program leaves its runs, with no program_id. A run can be shared from its own link.
-- Needs 20261013000000_programs.sql first. Safe to re-run.

alter table public.program_runs add column if not exists program_name text check (program_name is null or char_length(program_name) <= 80);
alter table public.program_runs add column if not exists snapshot jsonb;

-- Deleting a program keeps its runs.
alter table public.program_runs alter column program_id drop not null;
alter table public.program_runs drop constraint if exists program_runs_program_id_fkey;
alter table public.program_runs
  add constraint program_runs_program_id_fkey foreign key (program_id) references public.programs (id) on delete set null;

-- A run's own share link: one per run, gone with the run.
alter table public.shared_programs add column if not exists run_id uuid references public.program_runs (id) on delete cascade;
create unique index if not exists shared_programs_run_idx on public.shared_programs (run_id);
