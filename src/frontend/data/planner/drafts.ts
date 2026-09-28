// Plans from an assistant ("Summon a plan").
// Claude or ChatGPT saves a plan through the connector (backend/api/mcp.ts, at /api/mcp) as a draft in plan_drafts.
// The app reads the newest draft, and on the person's say-so turns it into workouts and sessions with their own
// sign-in, like any other workout.

import { supabase } from '../supabase';
import { DEFAULT_ZONE, type PlanDraft, type PlanWorkout } from '@/shared/planDraft';
import type { Exercise, Model } from './types';
import { numStr, estimateMinutes } from './convert';
import { ok, okOr } from './db';
import { createWorkout } from './workouts';
import { scheduleWorkout } from './sessions';

/** The newest plan still waiting for a decision, or null. `since` (an ISO time) only counts drafts saved after it.
 * Null too when the plan_drafts migration hasn't run. */
export async function latestPlanDraft(since?: string): Promise<PlanDraft | null> {
  let q = supabase.from('plan_drafts').select('id, source, title, summary, plan, created_at').eq('status', 'draft');
  if (since) q = q.gt('created_at', since);
  const rows = await okOr<any[] | null>(q.order('created_at', { ascending: false }).limit(1), []);
  return (rows?.[0] as PlanDraft | undefined) ?? null;
}

// A draft is decided once: added to the calendar, or let go.
export const decidePlanDraft = async (id: string, status: 'added' | 'discarded') =>
  ok(supabase.from('plan_drafts').update({ status, decided_at: new Date().toISOString() }).eq('id', id));

export async function discardPlanDraft(id: string) {
  await decidePlanDraft(id, 'discarded');
}

// Names compared loosely: case, spaces and punctuation aside ("Lat Pull-Down" is "Lat Pulldown").
const same = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '');

/**
 * What adding a draft would use that's already there: each group of sessions (the same workout on several dates) with
 * the saved workout of that name and kind in the Spellbook, if there is one, and the dates it's already on the
 * calendar, which are left alone rather than added twice.
 */
export function planMatches(draft: PlanDraft, model: Model) {
  const saved = new Map(model.workouts.map((w) => [same(w.name) + '|' + w.kind, w]));
  const groups = new Map<string, { w: PlanWorkout; dates: string[] }>();
  for (const w of draft.plan.workouts) {
    const { date, ...content } = w;
    const key = JSON.stringify(content);
    const g = groups.get(key);
    if (g) g.dates.push(date);
    else groups.set(key, { w, dates: [date] });
  }
  return [...groups.values()].map(({ w, dates }) => {
    const existing = saved.get(same(w.name) + '|' + w.kind) || null;
    // A session of that workout (by name: an edited workout's earlier sessions keep its name) already on a date.
    const taken = new Set(
      model.entries.filter((x) => same(x.av.name) === same(existing ? existing.name : w.name)).map((x) => x.iso),
    );
    return { w, existing, dates: dates.filter((d) => !taken.has(d)).sort(), skipped: dates.filter((d) => taken.has(d)).length };
  });
}

/** Says what adding a draft does: how many sessions go on, which saved workouts it reuses, and what's already there. */
export function planAddSummary(draft: PlanDraft, model: Model) {
  const m = planMatches(draft, model);
  return {
    added: m.reduce((n, g) => n + g.dates.length, 0),
    skipped: m.reduce((n, g) => n + g.skipped, 0),
    reused: [...new Set(m.filter((g) => g.existing).map((g) => g.existing!.name))],
    created: m.filter((g) => !g.existing && g.dates.length).length,
  };
}

/**
 * Adds a draft to the calendar, using what's already there. A workout with the name of one in the Spellbook schedules
 * that saved workout (as it is) rather than making a copy; a date it's already on is left alone, so adding a plan
 * twice doesn't double it. Otherwise the same workout on several dates (same name and content) becomes one new workout
 * with a session on each date, and createWorkout numbers a name that's taken. Exercises match the person's own and
 * the built-in ones by name, loosely, and keep their name, icon, target areas and equipment.
 */
export async function addPlanDraft(draft: PlanDraft, model: Model) {
  const known = new Map<string, Exercise>();
  // Later ones win: the person's own exercises over built-in ones with the same name.
  for (const e of [...model.builtins, ...Object.values(model.EX).flat(), ...model.library]) known.set(same(e.name), e);

  for (const { w, existing, dates } of planMatches(draft, model)) {
    if (!dates.length) continue;
    // Already in the Spellbook: that saved workout, as it is, goes on the dates.
    if (existing) {
      await scheduleWorkout(existing.id, dates, false);
      continue;
    }
    const exercises: Exercise[] = (w.exercises ?? []).map((e) => {
      const hit = known.get(same(e.name));
      return {
        name: hit?.name ?? e.name,
        sets: `${e.sets} × ${e.reps}`,
        weight: e.weight_lb ? `${e.weight_lb} lb` : hit?.equipment?.length ? '—' : 'body',
        rest: e.rest_seconds != null ? `${e.rest_seconds} sec` : '—',
        i: hit?.i ?? 'h',
        areas: hit?.areas ?? [],
        ...(hit?.equipment !== undefined ? { equipment: hit.equipment } : {}),
      };
    });
    const isRide = w.kind === 'ride';
    await createWorkout({
      name: w.name,
      isRide,
      durationMinutes: w.minutes ?? estimateMinutes(exercises.length, !!w.warmup),
      ride: isRide
        ? { dist: numStr(w.ride?.miles), elev: numStr(w.ride?.elevation_ft), zone: w.ride?.zone ?? DEFAULT_ZONE }
        : null,
      icon: null,
      iconColor: null,
      exercises,
      dates,
      repeat: false,
      notes: w.notes ?? '',
      warmup: model.warmupReady && !!w.warmup,
    });
  }
  await decidePlanDraft(draft.id, 'added');
}
