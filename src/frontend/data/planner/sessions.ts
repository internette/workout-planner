// Sessions on the calendar: ticking off, finishing, scheduling and counting them, and their Chronicle entries.

import { supabase } from '../supabase';
import { isoWeekday, seriesWeekdays } from '@/frontend/shared/helpers';
import { numOrNull, completionCols } from './convert';
import { ok, workoutById, isAhead, untouchedIds, SESSION_COLS, savedWorkoutOf } from './db';

export async function setExercisesDone(entryId: string, names: string[], completed: boolean) {
  await ok(supabase.from('plan_entries').update({ done_exercises: names, ...completionCols(completed) }).eq('id', entryId));
}

export async function setRideDone(entryId: string, completed: boolean) {
  await ok(supabase.from('plan_entries').update(completionCols(completed)).eq('id', entryId));
}

// Finishing a session: what it actually took. A ride is also marked complete here; a lifting session is complete
// when every exercise is ticked, so finishing one only records its time.
export async function finishSession(
  entryId: string,
  f: { ride: boolean; minutes: number; dist?: string; elev?: string },
) {
  // Finished is completed, for a lift as for a ride, so nothing later treats it as still to come.
  const patch: Record<string, unknown> = {
    actual_minutes: f.minutes || null,
    ...completionCols(true),
    ...(f.ride ? { actual_distance_miles: numOrNull(f.dist), actual_elevation_ft: numOrNull(f.elev) } : {}),
  };
  await ok(supabase.from('plan_entries').update(patch).eq('id', entryId));
}

// Undoes Finish: the session goes back to not done, and what it actually took is cleared.
export async function reopenSession(entryId: string) {
  await ok(
    supabase
      .from('plan_entries')
      .update({
        ...completionCols(false),
        actual_minutes: null,
        actual_distance_miles: null,
        actual_elevation_ft: null,
      })
      .eq('id', entryId),
  );
}

export async function saveDiary(entryId: string, e: { mood: string; rpe: number; note: string }) {
  await ok(
    supabase
      .from('diary_entries')
      .upsert(
        { plan_entry_id: entryId, mood: e.mood.toLowerCase(), rpe: e.rpe, notes: e.note },
        { onConflict: 'plan_entry_id' },
      ),
  );
}

export async function deleteDiary(entryId: string) {
  await ok(supabase.from('diary_entries').delete().eq('plan_entry_id', entryId));
}

export async function deletePlanEntries(entryIds: string[]) {
  if (!entryIds.length) return;
  await ok(supabase.from('diary_entries').delete().in('plan_entry_id', entryIds));
  await ok(supabase.from('plan_entries').delete().in('id', entryIds));
}

// Ends a weekly series: removes its repeats still ahead (after the chosen day, and from today on) and turns
// repeating off for the workout. Anything finished, started or written about stays.
export async function endSeries(workoutId: string, afterIso: string, todayIso: string, days: number[]) {
  const later: any[] = await ok(
    supabase.from('plan_entries').select(SESSION_COLS).eq('workout_id', workoutId).gt('scheduled_date', afterIso),
  );
  // Only the series' own weekdays: a session of the same workout put on another day stays.
  const on = days.length ? days : [isoWeekday(afterIso)];
  await deletePlanEntries(
    await untouchedIds(later.filter((r) => isAhead(r, todayIso) && on.includes(isoWeekday(r.scheduled_date)))),
  );
  await ok(supabase.from('workouts').update({ repeat_enabled: false }).eq('id', workoutId));
}

// Puts an existing workout on the calendar: one session per date. Weekdays to repeat on also turn its weekly series on,
// on those days as well as any it already repeats on.
// `done` logs the first date as already done (a workout added to a day that has gone by), with these exercises ticked.
export async function scheduleWorkout(
  workoutId: string,
  dates: string[],
  repeatDays: number[],
  done?: { exercises: string[] },
) {
  if (!dates.length) return { entryId: null };
  if (repeatDays.length) {
    const w = await workoutById(workoutId);
    const days = new Set<number>(repeatDays);
    if (w && w.repeat_enabled) {
      const had: any[] = await ok(supabase.from('plan_entries').select('scheduled_date').eq('workout_id', workoutId));
      seriesWeekdays(w.repeat_days, had.map((r) => r.scheduled_date)).forEach((d) => days.add(d));
    }
    await ok(
      supabase
        .from('workouts')
        // The weekdays only once the repeat-days migration has run; before it, a series has just one.
        .update({ repeat_enabled: true, ...(w && 'repeat_days' in w ? { repeat_days: [...days].sort((a, b) => a - b) } : {}) })
        .eq('id', workoutId),
    );
  }
  const rows: { id: string; scheduled_date: string }[] = await ok(
    supabase
      .from('plan_entries')
      .insert(
        dates.map((d, i) =>
          i === 0 && done
            ? { workout_id: workoutId, scheduled_date: d, ...completionCols(true), done_exercises: done.exercises }
            : { workout_id: workoutId, scheduled_date: d, status: 'planned' },
        ),
      )
      .select('id, scheduled_date'),
  );
  return { entryId: rows.find((r) => r.scheduled_date === dates[0])?.id ?? null };
}

// How many sessions of this workout are still ahead: from today on, and not already completed.
export async function countUpcoming(workoutId: string, todayIso: string): Promise<number> {
  const rows: any[] = await ok(
    supabase
      .from('plan_entries')
      .select(SESSION_COLS)
      .eq('workout_id', workoutId)
      .gte('scheduled_date', todayIso),
  );
  return rows.filter((r) => isAhead(r, todayIso)).length;
}

// The sessions still ahead (from today on, not completed) of a saved workout, including those an edit left on an
// archived copy of it ("keep the upcoming sessions as they were", or "only this session"). Those copies carry the
// workout's name; the saved workout itself is the one not archived.
export async function upcomingOfWorkout(workoutId: string, todayIso: string): Promise<string[]> {
  const w = await workoutById(workoutId);
  // Its archived copies: linked by id once the source_workout_id migration has run (a rename doesn't break that),
  // by name before then.
  const copies: any[] = !w
    ? []
    : 'source_workout_id' in w
      ? await ok(supabase.from('workouts').select('id').eq('archived', true).eq('source_workout_id', workoutId))
      : await ok(supabase.from('workouts').select('id').eq('archived', true).eq('name', w.name));
  const ids = [workoutId].concat(copies.map((c) => c.id));
  const rows: any[] = await ok(
    supabase.from('plan_entries').select(SESSION_COLS).in('workout_id', ids).gte('scheduled_date', todayIso),
  );
  // Only those that can go without losing anything: today's session, once started or written about, stays.
  return untouchedIds(rows);
}

// For an edit made to one session from the calendar: how many other sessions share its workout, and how many of
// those are still ahead (from today on, not completed). A session already saved on its own counts the sessions of
// the saved workout it came from.
export async function sessionScope(workoutId: string, entryId: string, todayIso: string) {
  const saved = await savedWorkoutOf(await workoutById(workoutId));
  const rows: any[] = await ok(
    supabase.from('plan_entries').select(SESSION_COLS).eq('workout_id', saved ? saved.id : workoutId),
  );
  const others = rows.filter((r) => r.id !== entryId);
  return {
    others: others.length,
    upcoming: others.filter((r) => isAhead(r, todayIso)).length,
  };
}
