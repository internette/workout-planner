// The data layer's own building blocks: running a query, and the lookups the other files share. Not exported from
// plannerData.

import { supabase } from '../supabase';
import type { Exercise } from './types';
import { exerciseRow, nameKey, toExercise } from './convert';

export async function ok<T>(q: PromiseLike<{ data: T; error: any }>): Promise<T> {
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data;
}

// The same, for a table a migration adds: until it has run the table isn't there, and `fallback` stands in for it.
// Any other error still throws.
export async function okOr<T>(q: PromiseLike<{ data: T; error: any }>, fallback: T): Promise<T> {
  const { data, error } = await q;
  if (error && (error.code === '42P01' || error.code === 'PGRST205')) return fallback;
  if (error) throw new Error(error.message);
  return data;
}

export const workoutById = async (id: string): Promise<any | undefined> =>
  (await ok<any[]>(supabase.from('workouts').select('*').eq('id', id)))[0];

// A session is finished once it's completed or has a recorded time (sessions finished before Finish marked
// lifts completed have only the time).
export const isFinished = (r: any) => r.status === 'completed' || r.actual_minutes != null;

// Still ahead: from today on, and not finished. What "upcoming" means wherever sessions are counted.
export const isAhead = (r: any, todayIso: string) => r.scheduled_date >= todayIso && !isFinished(r);

// Of these sessions, the ones that can come off the calendar without losing anything: not finished, nothing
// ticked off, and nothing written about them in the Chronicle.
export async function untouchedIds(rows: any[]): Promise<string[]> {
  const open = rows.filter((r) => !isFinished(r) && !(r.done_exercises || []).length);
  if (!open.length) return [];
  const written: any[] = await ok(
    supabase.from('diary_entries').select('plan_entry_id').in('plan_entry_id', open.map((r) => r.id)),
  );
  const has = new Set(written.map((d) => d.plan_entry_id));
  return open.filter((r) => !has.has(r.id)).map((r) => r.id);
}

export const SESSION_COLS = 'id, scheduled_date, status, actual_minutes, done_exercises';

// The saved workout a workout row stands for: itself, or for an archived copy (a session saved "only this session",
// or history kept from before an edit) the saved workout it came from, if that is still in the Spellbook. Null when
// there is none (the saved workout was deleted).
export async function savedWorkoutOf(w: any): Promise<any | null> {
  if (!w) return null;
  if (!w.archived) return w;
  const rows: any[] = w.source_workout_id
    ? await ok(supabase.from('workouts').select('*').eq('id', w.source_workout_id).eq('archived', false))
    : 'source_workout_id' in w
      ? []
      : await ok(supabase.from('workouts').select('*').eq('name', w.name).eq('archived', false));
  return rows[0] || null;
}

// Exercise ticks are stored by name, so renaming an exercise has to rename its ticks too.
export async function renameDoneExercise(workoutId: string, from: string, to: string) {
  const rows: any[] = await ok(
    supabase
      .from('plan_entries')
      .select('id, done_exercises')
      .eq('workout_id', workoutId)
      .not('done_exercises', 'is', null),
  );
  for (const r of rows) {
    if (!r.done_exercises.includes(from)) continue;
    const names = r.done_exercises.map((n: string) => (n === from ? to : n));
    await ok(supabase.from('plan_entries').update({ done_exercises: names }).eq('id', r.id));
  }
}

// Adds exercises to a workout, numbered in order from `startAt`.
export async function insertExercises(workoutId: string, list: Exercise[], startAt: number) {
  if (!list.length) return;
  await ok(
    supabase
      .from('workout_exercises')
      .insert(list.map((x, i) => ({ workout_id: workoutId, order_index: startAt + i, ...exerciseRow(x) }))),
  );
}

// Changes one exercise row (in a workout, or saved on its own): what it was, with `patch` over it. Returns the names
// before and after, or null when the row is gone.
export async function patchExercise(table: 'workout_exercises' | 'library_exercises', id: string, patch: Partial<Exercise>) {
  const [cur]: any[] = await ok(supabase.from(table).select('*').eq('id', id));
  if (!cur) return null;
  const merged = { ...toExercise(cur), ...patch };
  await ok(supabase.from(table).update(exerciseRow(merged)).eq('id', id));
  return { from: cur.name as string, to: merged.name };
}

// The names of the workouts in the Spellbook, as nameKeys.
export async function takenWorkoutNames(): Promise<Set<string>> {
  const rows: any[] = await ok(supabase.from('workouts').select('name').eq('archived', false));
  return new Set(rows.map((r) => nameKey(r.name)));
}
