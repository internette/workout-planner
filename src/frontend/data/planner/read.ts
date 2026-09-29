// Loading everything the planner shows, in one go.

import { supabase } from '../supabase';
import { isoMonthDay, isoOf, isoWeekday, seriesWeekdays, splitMinutes } from '@/frontend/shared/helpers';
import type { Exercise, Entry, WorkoutSummary, BuiltinWorkout, Model } from './types';
import { toExercise, areasOf, numStr, workoutView, estimateMinutes } from './convert';
import { ok, okOr } from './db';
import type { Mood } from '@moonshot/design-system/icons';

export async function loadModel(today: Date): Promise<Model> {
  const [workouts, exercises, plan, diary, library, builtins, builtinWorkoutRows, repeatDaysProbe] = await Promise.all([
    ok(supabase.from('workouts').select('*')),
    ok(supabase.from('workout_exercises').select('*').order('order_index')),
    ok(supabase.from('plan_entries').select('*').order('scheduled_date').order('id')),
    ok(supabase.from('diary_entries').select('*')),
    ok(supabase.from('library_exercises').select('*').order('created_at')),
    ok(supabase.from('builtin_exercises').select('*').order('sort_order')),
    // Until the built-in workouts migration has run there is no such table: the Spellbook just has none to show.
    okOr<any[]>(supabase.from('builtin_workouts').select('*').order('sort_order'), []),
    // Whether a weekly series can keep its weekdays yet: asked of the column itself, as an account may have no workouts.
    supabase.from('workouts').select('repeat_days').limit(1),
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

  // A repeating workout's series is on the weekdays stored with it, or (from before those were stored) the one most of
  // its sessions fall on. A session of it on another day (put there on its own) isn't part of the series.
  const seriesDates: Record<string, string[]> = {};
  plan.forEach((p: any) => {
    const w = byId[p.workout_id];
    if (w && w.repeat_enabled) (seriesDates[w.id] = seriesDates[w.id] || []).push(p.scheduled_date);
  });
  const seriesDays: Record<string, number[]> = {};
  Object.keys(seriesDates).forEach((id) => (seriesDays[id] = seriesWeekdays(byId[id].repeat_days, seriesDates[id])));

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
      stretch: view.stretch,
      yoga: view.yoga,
      series: w.repeat_enabled && seriesDays[w.id].includes(isoWeekday(p.scheduled_date)) ? w.id : undefined,
      seriesDays: w.repeat_enabled ? seriesDays[w.id] : undefined,
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

  // A day's warm-ups come before its other workouts, and its stretches after them, however they were added.
  const place = (e: Entry) => (e.warmup ? 0 : e.stretch ? 2 : 1);
  const inDayOrder = (a: Entry, b: Entry) => place(a) - place(b);
  Object.values(SEED).forEach((month) => Object.values(month).forEach((list) => list.sort(inDayOrder)));
  // By date, whatever order the rows came back in: "what's next" and similar take the first match.
  entries.sort((a, b) => (a.iso < b.iso ? -1 : a.iso > b.iso ? 1 : inDayOrder(a.av, b.av)));

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
    // Its own length when it says one (a stretching routine's is short), else estimated the way a new workout is: about
    // ten minutes an exercise, at least twenty (a warm-up's are quicker).
    const minutes = r.minutes || estimateMinutes(list.length, !!r.is_warmup || !!r.is_stretch || !!r.is_yoga);
    return {
      id: r.id,
      name: r.name,
      kind: 'lift',
      time: `~${minutes} min`,
      minutes,
      areas: areasOf(list),
      icon: r.icon || 'h',
      iconColor: null,
      exercises: list.map((e) => e.name),
      notes: '',
      warmup: !!r.is_warmup,
      stretch: !!r.is_stretch,
      yoga: !!r.is_yoga,
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
    stretchReady: [...workouts, ...builtinWorkoutRows].some((r: any) => 'is_stretch' in r),
    yogaReady: [...workouts, ...builtinWorkoutRows].some((r: any) => 'is_yoga' in r),
    repeatDaysReady: !repeatDaysProbe.error,
  };
}
