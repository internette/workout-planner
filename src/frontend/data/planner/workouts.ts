// Saved workouts: creating, editing and archiving them.

import { supabase } from '../supabase';
import type { BuiltinWorkout, NewWorkout, WorkoutEdit } from './types';
import { numOrNull, rideCols, nameKey, freeName } from './convert';
import { ok, workoutById, savedWorkoutOf, renameDoneExercise, insertExercises, patchExercise, takenWorkoutNames } from './db';
import { deletePlanEntries, scheduleWorkout, upcomingOfWorkout } from './sessions';

// A built-in workout as one of the person's own, for the calendar or to edit: the saved workout of theirs with its
// name (ignoring case) if there is one, otherwise a new copy of it.
export async function ownCopyOfBuiltin(w: BuiltinWorkout): Promise<{ workoutId: string; created: boolean }> {
  const mine: any[] = await ok(supabase.from('workouts').select('id, name').eq('archived', false));
  const have = mine.find((r) => nameKey(r.name) === nameKey(w.name));
  if (have) return { workoutId: have.id, created: false };
  const { workoutId } = await createWorkout({
    name: w.name,
    isRide: false,
    durationMinutes: w.minutes,
    ride: null,
    icon: w.icon,
    iconColor: null,
    exercises: w.list,
    dates: [],
    repeat: false,
    notes: '',
    warmup: w.warmup,
  });
  return { workoutId, created: true };
}

// Creates a new workout and schedules it on every date. It never joins an existing workout with the same name
// (that used to merge the two); the screen stops a taken name, and a name taken in the meantime gets a number.
export async function createWorkout(w: NewWorkout) {
  const name = await numberedWorkoutName(w.name);
  const [row]: any[] = await ok(
    supabase
      .from('workouts')
      .insert({
        name,
        kind: w.isRide ? 'ride' : 'lift',
        duration_minutes: w.durationMinutes,
        icon: w.icon,
        icon_color: w.iconColor,
        ...(w.ride ? rideCols(w.ride) : { ride_distance_miles: null, ride_elevation_ft: null, ride_zone: null }),
        repeat_enabled: w.repeat,
        notes: w.notes || null,
        // Only when set, so a workout can still be saved before the warm-ups migration has run.
        ...(w.warmup ? { is_warmup: true } : {}),
      })
      .select('id'),
  );
  const workoutId: string = row.id;

  await insertExercises(workoutId, w.exercises, 0);

  // A workout saved on its own has no dates, and nothing to schedule. Otherwise the session on the first date comes
  // back, so the screen can open on it even when that day has other workouts too.
  if (!w.dates.length) return { entryId: null, workoutId, name };
  const { entryId } = await scheduleWorkout(
    workoutId,
    w.dates,
    false,
    w.done ? { exercises: w.exercises.map((e) => e.name) } : undefined,
  );
  return { entryId, workoutId, name };
}

// A name no current workout uses: the name itself, else "<name> 2", "<name> 3", ...
export const numberedWorkoutName = async (wanted: string) => freeName(wanted, await takenWorkoutNames(), 'number');

export async function updateWorkout(e: WorkoutEdit) {
  const patch: Record<string, unknown> = {};
  if (e.name != null && e.name.trim()) patch.name = e.name.trim();
  if (e.icon !== undefined) patch.icon = e.icon;
  if (e.iconColor !== undefined) patch.icon_color = e.iconColor;
  if (e.notes !== undefined) patch.notes = e.notes;
  if (e.ride) Object.assign(patch, rideCols(e.ride), { duration_minutes: e.ride.minutes });
  if (e.durationMinutes != null && !e.ride) patch.duration_minutes = e.durationMinutes;
  if (e.warmup !== undefined) patch.is_warmup = e.warmup;
  if (Object.keys(patch).length) await ok(supabase.from('workouts').update(patch).eq('id', e.workoutId));

  for (const u of e.exercises.update) {
    const names = await patchExercise('workout_exercises', u.id, u.patch);
    if (names && names.to !== names.from) await renameDoneExercise(e.workoutId, names.from, names.to);
  }
  if (e.exercises.removeIds.length) {
    await ok(supabase.from('workout_exercises').delete().in('id', e.exercises.removeIds));
  }
  if (e.exercises.add.length) {
    const have: any[] = await ok(
      supabase.from('workout_exercises').select('order_index').eq('workout_id', e.workoutId),
    );
    await insertExercises(e.workoutId, e.exercises.add, have.reduce((max, r) => Math.max(max, r.order_index ?? 0), -1) + 1);
  }
  if (e.exercises.order?.length) {
    // Numbered by the order given; any exercise it doesn't name keeps its place after those.
    const rows: any[] = await ok(
      supabase.from('workout_exercises').select('id, name, order_index').eq('workout_id', e.workoutId).order('order_index'),
    );
    const rank = (r: any) => {
      const at = e.exercises.order!.indexOf(r.name);
      return at === -1 ? e.exercises.order!.length : at;
    };
    const sorted = rows.map((r, ix) => ({ r, ix })).sort((a, b) => rank(a.r) - rank(b.r) || a.ix - b.ix);
    for (let ix = 0; ix < sorted.length; ix++) {
      const { r } = sorted[ix];
      if (r.order_index !== ix) await ok(supabase.from('workout_exercises').update({ order_index: ix }).eq('id', r.id));
    }
  }

  const entryPatch: Record<string, unknown> = {};
  if (e.moveTo) entryPatch.scheduled_date = e.moveTo;
  if (e.actual) {
    entryPatch.actual_distance_miles = numOrNull(e.actual.dist);
    entryPatch.actual_elevation_ft = numOrNull(e.actual.elev);
    entryPatch.actual_minutes = e.actual.minutes || null;
  }
  if (Object.keys(entryPatch).length)
    await ok(supabase.from('plan_entries').update(entryPatch).eq('id', e.entryId));

  // A weekly series belongs to a saved workout: a session saved on its own repeats the saved workout it came from.
  if (e.repeatDates.length) {
    const w = await workoutById(e.workoutId);
    await scheduleWorkout(((await savedWorkoutOf(w)) || w).id, e.repeatDates, true);
  }
}

// Takes a saved workout out of the Spellbook. Its sessions still ahead (from today on, not completed) come off the
// calendar unless they're kept (`removeUpcoming` false); past and completed ones stay, pointing at it, so history
// keeps its exercises. Archiving rather than deleting is what the edit snapshots already do, and it frees the name.
// Either way a weekly series ends: no more repeats are added.
export async function archiveWorkout(workoutId: string, todayIso: string, removeUpcoming = true) {
  if (removeUpcoming) await deletePlanEntries(await upcomingOfWorkout(workoutId, todayIso));
  await ok(supabase.from('workouts').update({ archived: true, repeat_enabled: false }).eq('id', workoutId));
}
