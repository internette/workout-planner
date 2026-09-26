-- Plans Claude writes for someone ("Summon a plan"). Claude calls Moonshot's connector (app/api/mcp), which saves
-- the plan here as a draft. The person reviews it in the app, then adds it to their calendar (the app creates the
-- workouts and sessions with their own sign-in) or discards it. A draft is never on the calendar by itself.
--
-- The connector writes with the service role key, so row-level security does not apply to it; it sets user_id to the
-- signed-in person it verified itself. The app reads and updates with the person's own token, so the policy below
-- limits it to their own drafts. Needs 20260921000000_per_user_rls.sql first. Safe to run again.

create table if not exists public.plan_drafts (
  id uuid primary key default gen_random_uuid(),
  user_id text not null default (auth.jwt() ->> 'sub'),
  source text not null default 'claude',
  title text not null,
  summary text,
  -- { workouts: [{ date, name, kind, warmup, minutes, notes, exercises: [...], ride: {...} }] }, checked by the
  -- connector before it is saved (lib/mcp/plan.ts).
  plan jsonb not null,
  status text not null default 'draft' check (status in ('draft', 'added', 'discarded')),
  created_at timestamptz not null default now(),
  decided_at timestamptz
);

create index if not exists plan_drafts_user_status_idx on public.plan_drafts (user_id, status, created_at desc);

alter table public.plan_drafts enable row level security;
drop policy if exists "owner full access" on public.plan_drafts;
create policy "owner full access" on public.plan_drafts for all to authenticated
  using (user_id = (auth.jwt() ->> 'sub'))
  with check (user_id = (auth.jwt() ->> 'sub'));
