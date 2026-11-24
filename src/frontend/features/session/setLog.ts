import { numericOnly, splitSetsReps } from '@/frontend/shared/helpers';
import type { Exercise, LoggedSet } from '@/frontend/data/plannerData';

// What each set actually was: its weight and reps, as done rather than as planned. A set starts from the one before it
// in the same session (so a lighter first set carries on), else from the plan. Pounds are null for bodyweight or a
// band, and reps null for an exercise without any (a timed hold isn't logged at all).

const num = (text: string) => {
  const n = parseFloat(text);
  return isNaN(n) ? null : Math.round(n * 100) / 100;
};

/** A set as the plan has it: "40 lb" and "3 × 8" are 40 lb for 8 reps. */
export const planSet = (e: Pick<Exercise, 'sets' | 'weight'>): LoggedSet => ({
  w: /\d/.test(e.weight || '') ? num(numericOnly(e.weight)) : null,
  r: num(splitSetsReps(e.sets).reps),
});

/** Where the next set starts: the last one done in this session, else the plan. */
export const startSet = (e: Pick<Exercise, 'sets' | 'weight'>, done: LoggedSet[]): LoggedSet => {
  const plan = planSet(e);
  const last = done[done.length - 1];
  return last ? { w: plan.w == null ? null : last.w, r: plan.r == null ? null : last.r } : plan;
};

/** The two boxes as typed, over where the set started: an emptied box is no weight (or no reps). */
export const typedSet = (start: LoggedSet, w: string, r: string): LoggedSet => ({
  w: start.w == null && !w ? null : num(numericOnly(w)),
  r: start.r == null && !r ? null : num(r.replace(/[^0-9]/g, '')),
});

/** One set in a few characters: "40 lb × 8", "8 reps", "40 lb". */
export const setLabel = (s: LoggedSet) =>
  s.w != null && s.r != null ? s.w + ' lb × ' + s.r : s.w != null ? s.w + ' lb' : s.r != null ? s.r + ' reps' : '';

/** The sets done, for an exercise's line: "did 40 × 8, 35 × 8", "did 8, 8, 6 reps", "did 40, 40 lb". */
export const doneLine = (sets: LoggedSet[] | undefined) => {
  if (!sets || !sets.length) return '';
  const both = sets.every((s) => s.w != null && s.r != null);
  if (both) return 'did ' + sets.map((s) => s.w + ' × ' + s.r).join(', ');
  if (sets.every((s) => s.r != null)) return 'did ' + sets.map((s) => s.r).join(', ') + ' reps';
  if (sets.every((s) => s.w != null)) return 'did ' + sets.map((s) => s.w).join(', ') + ' lb';
  return '';
};

/** The heaviest weight among the sets done, or null with none. */
export const heaviest = (sets: LoggedSet[] | undefined) =>
  (sets || []).reduce<number | null>((max, s) => (s.w != null && (max == null || s.w > max) ? s.w : max), null);

/**
 * A weight far off the plan, as a likely typo: more than double it, or under half. Says by how much ("400 lb is 10
 * times the plan's 40 lb"), or '' when it's near the plan, or there's no weight to compare.
 */
export const offPlan = (s: LoggedSet, plan: LoggedSet) => {
  if (s.w == null || plan.w == null || plan.w <= 0) return '';
  const ratio = s.w / plan.w;
  if (ratio > 2) return s.w + ' lb is ' + (ratio >= 3 ? Math.round(ratio) + ' times' : 'more than double') + ' the plan’s ' + plan.w + ' lb.';
  if (ratio < 0.5) return s.w + ' lb is under half the plan’s ' + plan.w + ' lb.';
  return '';
};
