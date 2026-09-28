// Saving an edit to a saved workout without rewriting the sessions already done with it.

import { supabase } from '../supabase';
import type { WorkoutEdit, TemplateEditResult } from './types';
import { freeName } from './convert';
import { ok, workoutById, isAhead, SESSION_COLS, savedWorkoutOf, takenWorkoutNames } from './db';
import { updateWorkout } from './workouts';

// Applies an edit to a saved workout without rewriting history.
// - mode 'update': the workout is edited in place. Past and completed sessions keep the old version: it is
//   copied to an archived snapshot that they are moved onto. Upcoming sessions follow the edit if
//   `updateUpcoming` is set, and otherwise are moved onto the snapshot too.
// - mode 'new': the workout and all its sessions stay exactly as they are, and the edit is saved as a new workout.
// - mode 'session' (an edit to one session, from the calendar): only that session (edit.entryId) changes. It moves
//   onto its own archived copy of the workout with the edit applied; the saved workout and every other session
//   stay exactly as they are.
// With mode 'update', the session being edited (edit.entryId, if any) always follows the edit, even if it is past.
export async function updateWorkoutTemplate(
  edit: WorkoutEdit,
  opts: { mode: 'update' | 'new' | 'session'; updateUpcoming: boolean; todayIso: string },
): Promise<TemplateEditResult> {
  const old = await workoutById(edit.workoutId);
  const oldExercises: any[] = await ok(
    supabase.from('workout_exercises').select('*').eq('workout_id', edit.workoutId).order('order_index'),
  );
  const { id: _id, created_at: _created, ...rest } = old;
  // Archived copies remember the workout they came from (once the source_workout_id migration has run), so it can
  // still find them after a rename. A "new workout" copy is its own workout.
  const hasSource = 'source_workout_id' in old;
  const lineage = hasSource ? { source_workout_id: old.source_workout_id || old.id } : {};
  const ownLineage = hasSource ? { source_workout_id: null } : {};
  // A copy of the workout (with `cols` over its own), and of its exercises. Returns the copy's id and, for each
  // exercise, the id of its copy.
  const forkWorkout = async (cols: Record<string, unknown>) => {
    const [row]: any[] = await ok(supabase.from('workouts').insert({ ...rest, ...cols }).select('id'));
    const exerciseIds: Record<string, string> = {};
    for (const { id, created_at: _c, workout_id: _w, ...r } of oldExercises) {
      const [ex]: any[] = await ok(supabase.from('workout_exercises').insert({ ...r, workout_id: row.id }).select('id'));
      exerciseIds[id] = ex.id;
    }
    return { id: row.id as string, exerciseIds };
  };

  // The edit, pointed at another workout: its exercise ids swapped by `idOf` (an id it gives nothing for is dropped),
  // with `over` on top.
  const remapEdit = (idOf: (id: string) => string | undefined, over: Partial<WorkoutEdit>): WorkoutEdit => ({
    ...edit,
    ...over,
    exercises: {
      update: edit.exercises.update.map((u) => ({ ...u, id: idOf(u.id) as string })).filter((u) => !!u.id),
      removeIds: edit.exercises.removeIds.map(idOf).filter((id): id is string => !!id),
      add: edit.exercises.add,
      order: edit.exercises.order,
    },
  });
  const copiedIds = (ids: Record<string, string>) => (id: string) => ids[id] || id;

  // A session already saved on its own (its own archived copy of the workout).
  if (old.archived && edit.entryId) {
    const sharers: any[] = await ok(supabase.from('plan_entries').select('id').eq('workout_id', edit.workoutId));
    const alone = sharers.every((r) => r.id === edit.entryId);
    // "Only this session" again: its copy is already its own, so it's edited in place.
    if (opts.mode === 'session' && alone) {
      await updateWorkout(edit);
      return { workoutId: edit.workoutId, created: false };
    }
    // "This session and the saved workout": the session's copy takes the edit, and so does the saved workout it came
    // from (its exercises matched by name), the same way an edit to the saved workout itself is saved.
    const saved = opts.mode === 'update' && alone ? await savedWorkoutOf(old) : null;
    if (saved) {
      await updateWorkout(edit);
      const savedExercises: any[] = await ok(
        supabase.from('workout_exercises').select('id, name').eq('workout_id', saved.id),
      );
      const nameOf = (id: string) => (oldExercises.find((x) => x.id === id) || {}).name;
      const inSaved = (id: string) => (savedExercises.find((x) => x.name === nameOf(id)) || {}).id;
      await updateWorkoutTemplate(
        remapEdit(inSaved, { entryId: '', workoutId: saved.id, moveTo: undefined, actual: null, repeatDates: [] }),
        { mode: 'update', updateUpcoming: opts.updateUpcoming, todayIso: opts.todayIso },
      );
      return { workoutId: edit.workoutId, created: false };
    }
  }

  if (opts.mode === 'session') {
    const fork = await forkWorkout({ ...lineage, archived: true, repeat_enabled: false });
    await ok(supabase.from('plan_entries').update({ workout_id: fork.id }).eq('id', edit.entryId));
    await updateWorkout(remapEdit(copiedIds(fork.exerciseIds), { workoutId: fork.id }));
    return { workoutId: fork.id, created: false };
  }

  if (opts.mode === 'new') {
    // A name for the copy that no current workout uses: the edited name, else "<name> (copy)", "(copy 2)", ...
    const name = freeName((edit.name || '').trim() || old.name, await takenWorkoutNames(), 'copy');
    const copy = await forkWorkout({ ...ownLineage, name, archived: false, repeat_enabled: false });
    await updateWorkout(remapEdit(copiedIds(copy.exerciseIds), { workoutId: copy.id, name }));
    return { workoutId: copy.id, created: true };
  }

  const entries: any[] = await ok(
    supabase.from('plan_entries').select(SESSION_COLS).eq('workout_id', edit.workoutId),
  );
  const isUpcoming = (e: any) => e.id === edit.entryId || isAhead(e, opts.todayIso);
  const past = entries.filter((e) => !isUpcoming(e) || !opts.updateUpcoming);
  if (past.length) {
    const keepsUpcoming = past.some(isUpcoming);
    const snapshot = await forkWorkout({ ...lineage, archived: true, repeat_enabled: keepsUpcoming ? old.repeat_enabled : false });
    await ok(
      supabase
        .from('plan_entries')
        .update({ workout_id: snapshot.id })
        .in(
          'id',
          past.map((e) => e.id),
        ),
    );
  }
  await updateWorkout(edit);
  return { workoutId: edit.workoutId, created: false };
}
