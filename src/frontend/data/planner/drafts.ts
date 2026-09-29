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

/**
 * Adds a draft to the calendar. The same workout on several dates (same name and the same content) becomes one
 * workout with a session on each date; anything that differs becomes its own workout, and createWorkout numbers a name
 * that's taken. Exercises Moonshot already knows keep their icon, target areas and equipment.
 */
export async function addPlanDraft(draft: PlanDraft, model: Model) {
  const known = new Map<string, Exercise>();
  for (const e of [...model.builtins, ...Object.values(model.EX).flat(), ...model.library]) known.set(e.name.trim().toLowerCase(), e);

  const groups = new Map<string, { w: PlanWorkout; dates: string[] }>();
  for (const w of draft.plan.workouts) {
    const { date, ...content } = w;
    const key = JSON.stringify(content);
    const g = groups.get(key);
    if (g) g.dates.push(date);
    else groups.set(key, { w, dates: [date] });
  }

  for (const { w, dates } of groups.values()) {
    const exercises: Exercise[] = (w.exercises ?? []).map((e) => {
      const hit = known.get(e.name.trim().toLowerCase());
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
      durationMinutes: w.minutes ?? estimateMinutes(exercises.length, !!w.warmup || !!w.stretch || !!w.yoga),
      ride: isRide
        ? { dist: numStr(w.ride?.miles), elev: numStr(w.ride?.elevation_ft), zone: w.ride?.zone ?? DEFAULT_ZONE }
        : null,
      icon: null,
      iconColor: null,
      exercises,
      dates: dates.sort(),
      repeatDays: [],
      notes: w.notes ?? '',
      warmup: model.warmupReady && !!w.warmup,
      stretch: model.stretchReady && !!w.stretch,
      yoga: model.yogaReady && !!w.yoga,
    });
  }
  await decidePlanDraft(draft.id, 'added');
}
