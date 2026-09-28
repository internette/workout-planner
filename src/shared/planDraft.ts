// The plan Claude writes for someone ("Summon a plan"), as the connector saves it in plan_drafts.plan and the app
// reads it back to review. Shared by the server (backend/mcp) and the page, so both agree on the shape.

export const RIDE_ZONES = ['Recovery', 'Endurance', 'Tempo', 'Intervals'] as const;
export type RideZone = (typeof RIDE_ZONES)[number];

export interface PlanExercise {
  name: string;
  sets: number;
  reps: number;
  /** Pounds. Left out for bodyweight. */
  weight_lb?: number;
  rest_seconds?: number;
}

export interface PlanWorkout {
  /** YYYY-MM-DD */
  date: string;
  name: string;
  kind: 'lift' | 'ride';
  warmup?: boolean;
  /** How long it takes. For a lift it's estimated from the exercises when left out. */
  minutes?: number;
  notes?: string;
  exercises?: PlanExercise[];
  ride?: { miles?: number; elevation_ft?: number; zone?: RideZone };
}

export interface PlanBody {
  workouts: PlanWorkout[];
}

/** A saved draft, as the app reads it. */
export interface PlanDraft {
  id: string;
  /** Which assistant sent it: 'claude', 'chatgpt', or 'assistant' when the connector couldn't tell. */
  source: string;
  title: string;
  summary: string | null;
  plan: PlanBody;
  created_at: string;
}

export const PLAN_LIMITS = { workouts: 120, exercises: 20, name: 60, notes: 500, title: 80, summary: 400, daysAhead: 400 };

const ISO = /^\d{4}-\d{2}-\d{2}$/;
const isInt = (n: unknown, min: number, max: number): n is number => Number.isInteger(n) && (n as number) >= min && (n as number) <= max;
const isNum = (n: unknown, min: number, max: number): n is number => typeof n === 'number' && Number.isFinite(n) && n >= min && n <= max;
const text = (v: unknown, max: number) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const dayDiff = (a: string, b: string) => Math.round((Date.parse(a + 'T00:00:00Z') - Date.parse(b + 'T00:00:00Z')) / 86_400_000);

/**
 * Checks a plan as Claude sent it and returns a clean copy, or the problems, worded for Claude to fix and send again.
 * `today` is YYYY-MM-DD; dates may start a day before it (time zones) and run up to about a year ahead.
 */
export function checkPlan(raw: unknown, today: string): { plan: PlanBody } | { problems: string[] } {
  const problems: string[] = [];
  const list = (raw as { workouts?: unknown })?.workouts;
  if (!Array.isArray(list) || !list.length) return { problems: ['workouts must be a list with at least one workout.'] };
  if (list.length > PLAN_LIMITS.workouts) problems.push(`A plan can have at most ${PLAN_LIMITS.workouts} workouts; this one has ${list.length}.`);

  const workouts: PlanWorkout[] = [];
  list.slice(0, PLAN_LIMITS.workouts).forEach((w: any, i: number) => {
    const at = `workouts[${i}]`;
    const name = text(w?.name, PLAN_LIMITS.name);
    if (!name) problems.push(`${at}.name is missing.`);
    const date = typeof w?.date === 'string' && ISO.test(w.date) && !Number.isNaN(Date.parse(w.date + 'T00:00:00Z')) ? w.date : '';
    if (!date) problems.push(`${at}.date must be a real date written YYYY-MM-DD.`);
    else if (dayDiff(date, today) < -1) problems.push(`${at}.date ${date} has already gone by (today is ${today}).`);
    else if (dayDiff(date, today) > PLAN_LIMITS.daysAhead) problems.push(`${at}.date ${date} is more than a year away.`);
    if (w?.kind !== 'lift' && w?.kind !== 'ride') problems.push(`${at}.kind must be "lift" or "ride".`);
    if (w?.minutes !== undefined && !isInt(w.minutes, 5, 600)) problems.push(`${at}.minutes must be a whole number from 5 to 600.`);

    const out: PlanWorkout = { date, name, kind: w?.kind === 'ride' ? 'ride' : 'lift' };
    if (w?.warmup === true) out.warmup = true;
    if (isInt(w?.minutes, 5, 600)) out.minutes = w.minutes;
    const notes = text(w?.notes, PLAN_LIMITS.notes);
    if (notes) out.notes = notes;

    if (out.kind === 'lift') {
      const ex = w?.exercises;
      if (!Array.isArray(ex) || !ex.length) problems.push(`${at}.exercises must list at least one exercise for a lift.`);
      else {
        if (ex.length > PLAN_LIMITS.exercises) problems.push(`${at} has ${ex.length} exercises; the most is ${PLAN_LIMITS.exercises}.`);
        out.exercises = ex.slice(0, PLAN_LIMITS.exercises).map((e: any, j: number) => {
          const eat = `${at}.exercises[${j}]`;
          const ename = text(e?.name, PLAN_LIMITS.name);
          if (!ename) problems.push(`${eat}.name is missing.`);
          if (!isInt(e?.sets, 1, 20)) problems.push(`${eat}.sets must be a whole number from 1 to 20.`);
          if (!isInt(e?.reps, 1, 200)) problems.push(`${eat}.reps must be a whole number from 1 to 200 (for a timed hold, the seconds).`);
          if (e?.weight_lb !== undefined && e?.weight_lb !== null && !isNum(e.weight_lb, 0, 2000)) problems.push(`${eat}.weight_lb must be a number of pounds, or left out for bodyweight.`);
          if (e?.rest_seconds !== undefined && e?.rest_seconds !== null && !isInt(e.rest_seconds, 0, 900)) problems.push(`${eat}.rest_seconds must be a whole number from 0 to 900.`);
          const pe: PlanExercise = { name: ename, sets: Number(e?.sets) || 0, reps: Number(e?.reps) || 0 };
          if (isNum(e?.weight_lb, 0, 2000) && e.weight_lb > 0) pe.weight_lb = e.weight_lb;
          if (isInt(e?.rest_seconds, 0, 900)) pe.rest_seconds = e.rest_seconds;
          return pe;
        });
      }
    } else {
      const r = w?.ride ?? {};
      if (r.zone !== undefined && !RIDE_ZONES.includes(r.zone)) problems.push(`${at}.ride.zone must be one of ${RIDE_ZONES.join(', ')}.`);
      if (r.miles !== undefined && !isNum(r.miles, 0, 500)) problems.push(`${at}.ride.miles must be a number of miles.`);
      if (r.elevation_ft !== undefined && !isNum(r.elevation_ft, 0, 50000)) problems.push(`${at}.ride.elevation_ft must be a number of feet.`);
      if (out.minutes === undefined) problems.push(`${at}.minutes is needed for a ride.`);
      out.ride = {
        ...(isNum(r.miles, 0, 500) ? { miles: r.miles } : {}),
        ...(isNum(r.elevation_ft, 0, 50000) ? { elevation_ft: r.elevation_ft } : {}),
        zone: RIDE_ZONES.includes(r.zone) ? r.zone : 'Endurance',
      };
    }
    workouts.push(out);
  });

  return problems.length ? { problems } : { plan: { workouts: workouts.sort((a, b) => a.date.localeCompare(b.date)) } };
}

/** "Mon, Sep 28": for dates in the review and in what the connector tells Claude. */
export function shortDate(iso: string): string {
  const d = new Date(iso + 'T12:00:00');
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}
