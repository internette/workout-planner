// Loading everything the planner shows, in one go.

import { supabase } from '../supabase';
import { isoMonthDay, isoOf, isoWeekday, splitMinutes } from '@/frontend/shared/helpers';
import type { Exercise, Entry, WorkoutSummary, BuiltinWorkout, Model } from './types';
import { toExercise, areasOf, numStr, workoutView, estimateMinutes } from './convert';
import { ok, okOr } from './db';
import type { Mood } from '@moonshot/design-system/icons';

export async function loadModel(today: Date): Promise<Model> {
  const [workouts, exercises, plan, diary, library, builtins, builtinWorkoutRows] = await Promise.all([
    ok(supabase.from('workouts').select('*')),
    ok(supabase.from('workout_exercises').select('*').order('order_index')),
    ok(supabase.from('plan_entries').select('*').order('scheduled_date').order('id')),
    ok(supabase.from('diary_entries').select('*')),
    ok(supabase.from('library_exercises').select('*').order('created_at')),
    ok(supabase.from('builtin_exercises').select('*').order('sort_order')),
    // Until the built-in workouts migration has run there is no such table: the Spellbook just has none to show.
    okOr<any[]>(supabase.from('builtin_workouts').select('*').order('sort_order'), []),
  ]);

  const byId: Record<string, any> = {};
  workouts.forEach((w: any) => (byId[w.id] = w));

  // A workout that was edited leaves its old version behind as an archived snapshot, which the sessions
  // that predate the edit still point at. Snapshots are looked up by name#id so they never mix with the
  // current version, and stay out of the Arsenal.
  const keyOf = (w: any) => (w.archived ? `${w.name}#${w.id}` : w.name);
  const EXV: Record<string, Exercise[]> = {};
  workouts.forEach((w: any) => (EXV[keyOf(w)] = []));
  exercises.forEach((e: any) => {
    const w = byId[e.workout_id];
    if (w) EXV[keyOf(w)].push(toExercise(e));
  });
  const EX: Record<string, Exercise[]> = {};
  workouts.filter((w: any) => !w.archived).forEach((w: any) => (EX[w.name] = EXV[w.name]));

  const todayIso = isoOf(today);
  const SEED: Model['SEED'] = {};
  const entries: Model['entries'] = [];
  const done: Model['done'] = {};
  const rideDone: Model['rideDone'] = {};
  const entryById: Record<string, Entry> = {};

  // A repeating workout's series is on one weekday: the one most of its sessions fall on. A session of it on another
  // day (put there on its own) isn't part of the series.
  const seriesDay: Record<string, number> = {};
  const dayCounts: Record<string, number[]> = {};
  plan.forEach((p: any) => {
    const w = byId[p.workout_id];
    if (!w || !w.repeat_enabled) return;
    (dayCounts[w.id] = dayCounts[w.id] || [0, 0, 0, 0, 0, 0, 0])[isoWeekday(p.scheduled_date)]++;
  });
  Object.keys(dayCounts).forEach((id) => {
    const c = dayCounts[id];
    seriesDay[id] = c.indexOf(Math.max(...c));
  });

  plan.forEach((p: any) => {
    const w = byId[p.workout_id];
    if (!w) return;
    const { m, d: dd } = isoMonthDay(p.scheduled_date, today.getFullYear());
    const completed = p.status === 'completed';
    const view = workoutView(w, EXV[keyOf(w)] || []);
    const { isRide } = view;
    const hasActual =
      p.actual_distance_miles != null || p.actual_elevation_ft != null || p.actual_minutes != null;
    const av: Entry = {
      id: p.id,
      workoutId: w.id,
      name: view.name,
      exKey: keyOf(w),
      s: completed ? 'c' : p.scheduled_date === todayIso ? 't' : 'p',
      time: view.time,
      icon: view.icon,
      iconColor: view.iconColor,
      areas: view.areas,
      repeat: !!w.repeat_enabled,
      notes: view.notes,
      warmup: view.warmup,
      series: w.repeat_enabled && seriesDay[w.id] === isoWeekday(p.scheduled_date) ? w.id : undefined,
      seriesDay: w.repeat_enabled ? seriesDay[w.id] : undefined,
      ride: view.ride && { ...view.ride, ...splitMinutes(view.minutes) },
      actual: hasActual
        ? {
            dist: numStr(p.actual_distance_miles),
            elev: numStr(p.actual_elevation_ft),
            hrs: p.actual_minutes ? String(Math.floor(p.actual_minutes / 60)) : '',
            mins: p.actual_minutes ? String(p.actual_minutes % 60) : '',
          }
        : null,
    };
    const month = (SEED[m] = SEED[m] || {});
    (month[dd] = month[dd] || []).push(av);
    entries.push({ m, d: dd, iso: p.scheduled_date, av });
    entryById[p.id] = av;
    if (isRide) rideDone[p.id] = completed;
    else done[p.id] = p.done_exercises ?? (completed ? EXV[keyOf(w)].map((e) => e.name) : []);
  });

  // A day's warm-ups come before its other workouts, however they were added.
  const warmupFirst = (a: Entry, b: Entry) => Number(b.warmup) - Number(a.warmup);
  Object.values(SEED).forEach((month) => Object.values(month).forEach((list) => list.sort(warmupFirst)));
  // By date, whatever order the rows came back in: "what's next" and similar take the first match.
  entries.sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : warmupFirst(a.av, b.av)));

  const DIARY: Model['DIARY'] = {};
  diary.forEach((r: any) => {
    const av = entryById[r.plan_entry_id];
    const hit = av && entries.find((e) => e.av.id === av.id);
    if (!av || !hit) return;
    DIARY[av.id] = {
      m: hit.m,
      d: hit.d,
      mood: (r.mood.charAt(0).toUpperCase() + r.mood.slice(1)) as Mood,
      rpe: r.rpe ?? 3,
      // Entries saved before empty notes were allowed hold this placeholder as their note.
      note: r.notes === 'No notes for this one.' ? '' : r.notes || '',
      workout: av.name,
    };
  });

  const saved: WorkoutSummary[] = workouts
    .filter((w: any) => !w.archived)
    .map((w: any) => {
      const { isRide, ...view } = workoutView(w, EXV[keyOf(w)] || []);
      return {
        id: w.id,
        ...view,
        kind: isRide ? 'ride' : 'lift',
        exercises: (EX[w.name] || []).map((e) => e.name),
      } as WorkoutSummary;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  const builtinList: Exercise[] = builtins.map((r: any) => ({ ...toExercise(r), builtin: true }));
  const builtinByName: Record<string, Exercise> = {};
  builtinList.forEach((e) => (builtinByName[e.name] = e));
  const builtinWorkouts: BuiltinWorkout[] = builtinWorkoutRows.map((r: any) => {
    const list = (r.exercises || []).map((n: string) => builtinByName[n]).filter(Boolean) as Exercise[];
    // Estimated the way a new workout is: about ten minutes an exercise, at least twenty (a warm-up's are quicker).
    const minutes = estimateMinutes(list.length, !!r.is_warmup);
    return {
      id: r.id,
      name: r.name,
      kind: 'lift',
      time: `~${minutes} min`,
      minutes,
      areas: areasOf(list),
      icon: 'h',
      iconColor: null,
      exercises: list.map((e) => e.name),
      notes: '',
      warmup: !!r.is_warmup,
      builtin: true,
      category: r.category,
      list,
    };
  });

  return {
    EX,
    EXV,
    SEED,
    entries,
    DIARY,
    library: library.map(toExercise),
    builtins: builtinList,
    builtinWorkouts,
    workouts: saved,
    done,
    rideDone,
    year: today.getFullYear(),
    warmupReady: [...workouts, ...builtinWorkoutRows].some((r: any) => 'is_warmup' in r),
  };
}
