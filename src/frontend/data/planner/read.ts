import { splitSide, unlabeledPairs, withSide } from '@/frontend/shared/sides';
// Loading everything the planner shows, in one go.

import { supabase } from '../supabase';
import { isoMonthDay, isoOf, isoWeekday, seriesWeekdays, splitMinutes } from '@/frontend/shared/helpers';
import type { Exercise, Entry, WorkoutSummary, BuiltinWorkout, BuiltinProgram, Model, Program, ProgramRun, ProgramWorkout } from './types';
import { runEnd, runPlace } from '@/frontend/shared/programs';
import { readProgram } from '@/frontend/shared/sharedProgram';
import { toProfile } from './profile';
import { setHoldColumn, toExercise, areasOf, numStr, workoutView, estimateMinutes } from './convert';
import { ok, okOr } from './db';
import type { Mood } from '@moonshot/design-system/icons';

export async function loadModel(today: Date): Promise<Model> {
  const [workouts, exercises, plan, diary, library, builtins, builtinWorkoutRows, repeatDaysProbe, programRows, blockRows, runRows, builtinProgramRows, profileRows] = await Promise.all([
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
    // Programs, until their migration has run: none (and none can be made yet).
    okOr<any[] | null>(supabase.from('programs').select('*').order('name'), null),
    okOr<any[]>(supabase.from('program_blocks').select('*').order('position'), []),
    okOr<any[]>(supabase.from('program_runs').select('*').order('created_at', { ascending: false }), []),
    okOr<any[]>(supabase.from('builtin_programs').select('*').order('sort_order'), []),
    // Their profile, until its migration has run: none (and none can be saved yet).
    okOr<any[] | null>(supabase.from('profiles').select('*').limit(1), null),
  ]);

  // The catalog always has rows, so it says whether the timed-holds migration has run. Before any row is read as an
  // exercise, so each one's sets come out timed.
  const holdReady = builtins.some((r: any) => 'hold_seconds' in r);
  setHoldColumn(holdReady);

  const byId: Record<string, any> = {};
  workouts.forEach((w: any) => (byId[w.id] = w));

  // A workout that was edited leaves its old version behind as an archived snapshot, which the sessions
  // that predate the edit still point at. Snapshots are looked up by name#id so they never mix with the
  // current version, and stay out of the Arsenal.
  // A program's own workouts are kept the same way: they can share a name with one in the Spellbook.
  const inProgram = (w: any) => !!w.program_block_id;
  const keyOf = (w: any) => (w.archived || inProgram(w) ? `${w.name}#${w.id}` : w.name);
  const EXV: Record<string, Exercise[]> = {};
  workouts.forEach((w: any) => (EXV[keyOf(w)] = []));
  exercises.forEach((e: any) => {
    const w = byId[e.workout_id];
    if (w) EXV[keyOf(w)].push(toExercise(e));
  });
  // An exercise done on each side that a workout holds twice under one plain name (saved before sides were labeled)
  // gets its Left and Right back, here and in the database, so the two show their chips and tick on their own. The
  // names it had, by workout, to tick both sides where the plain name was ticked.
  const relabeled: Record<string, Set<string>> = {};
  const renames: PromiseLike<unknown>[] = [];
  Object.keys(EXV).forEach((k) => {
    unlabeledPairs(EXV[k].map((e) => e.name)).forEach((side, i) => {
      const e = EXV[k][i];
      (relabeled[k] = relabeled[k] || new Set()).add(e.name);
      e.name = withSide(e.name, side);
      if (e.id) renames.push(supabase.from('workout_exercises').update({ name: e.name }).eq('id', e.id));
    });
  });
  const withSides = (k: string, names: string[]) =>
    relabeled[k] ? names.flatMap((n) => (relabeled[k].has(n) ? [withSide(n, 'Left'), withSide(n, 'Right')] : [n])) : names;
  const EX: Record<string, Exercise[]> = {};
  workouts.filter((w: any) => !w.archived && !inProgram(w)).forEach((w: any) => (EX[w.name] = EXV[w.name]));

  // Programs: each block's workouts (its own copies, not archived), and the runs that put them on the calendar.
  const programs: Program[] = (programRows || []).map((p: any) => {
    const blocks = blockRows
      .filter((b: any) => b.program_id === p.id)
      .map((b: any) => ({
        id: b.id as string,
        name: (b.name || '') as string,
        weeks: Number(b.weeks) || 1,
        position: Number(b.position) || 0,
        workouts: workouts
          .filter((w: any) => w.program_block_id === b.id && !w.archived)
          .map((w: any): ProgramWorkout => {
            const list = EXV[keyOf(w)] || [];
            const { isRide, ...view } = workoutView(w, list);
            return {
              id: w.id,
              ...view,
              kind: isRide ? 'ride' : 'lift',
              exercises: list.map((e) => e.name),
              exKey: keyOf(w),
              days: (w.program_days || []).map(Number).sort((a: number, c: number) => a - c),
              list,
            };
          })
          .sort((a, c) => (a.days[0] ?? 7) - (c.days[0] ?? 7) || a.name.localeCompare(c.name)),
      }))
      .sort((a, c) => a.position - c.position);
    return { id: p.id, name: p.name, notes: p.notes || '', blocks, weeks: blocks.reduce((s, b) => s + b.weeks, 0) };
  });
  const programById: Record<string, Program> = {};
  programs.forEach((p) => (programById[p.id] = p));
  // Runs, with the program as it was when each started. One from before those were kept, whose program is gone, has
  // nothing left to show and is left out.
  const programRuns: ProgramRun[] = runRows
    .map((r: any): ProgramRun | null => {
      const prog = r.program_id ? programById[r.program_id] : undefined;
      const snapshot = r.snapshot ? readProgram(r.snapshot) : null;
      const blocks = prog ? prog.blocks : snapshot ? snapshot.blocks : null;
      if (!blocks) return null;
      const startBlock = Number(r.start_block) || 0;
      return {
        id: r.id,
        programId: prog ? prog.id : null,
        name: r.program_name || (prog ? prog.name : 'Program'),
        snapshot,
        start: r.start_date,
        startBlock,
        end: runEnd(blocks, r.start_date, startBlock),
        ended: !!r.ended_at,
        endedOn: r.ended_at ? isoOf(new Date(r.ended_at)) : null,
      };
    })
    .filter((r: ProgramRun | null): r is ProgramRun => !!r);
  const runById: Record<string, ProgramRun> = {};
  programRuns.forEach((r) => (runById[r.id] = r));
  // "Build, week 2 of 3": where a run's session falls in its program.
  const programTag = (p: any): Entry['program'] => {
    const run = p.program_run_id ? runById[p.program_run_id] : null;
    if (!run) return undefined;
    const prog = run.programId ? programById[run.programId] : null;
    const blocks = prog ? prog.blocks : run.snapshot ? run.snapshot.blocks : [];
    const at = runPlace(blocks, run.start, run.startBlock, p.scheduled_date);
    // One block: no block's name to give, only the week.
    const block = blocks.length > 1 ? at?.name || '' : '';
    return at ? { runId: run.id, programId: run.programId, name: prog ? prog.name : run.name, block, week: at.week, weeks: at.weeks } : undefined;
  };

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
      program: programTag(p),
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
    else {
      done[p.id] = p.done_exercises ? withSides(keyOf(w), p.done_exercises) : completed ? EXV[keyOf(w)].map((e) => e.name) : [];
      if (p.done_exercises && done[p.id].length !== p.done_exercises.length)
        renames.push(supabase.from('plan_entries').update({ done_exercises: done[p.id] }).eq('id', p.id));
    }
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
    .filter((w: any) => !w.archived && !inProgram(w))
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
    // A name with a side ("Pallof Press · Left") is the exercise it's made from, under that name.
    const list = (r.exercises || [])
      .map((n: string) => (builtinByName[n] ? builtinByName[n] : builtinByName[splitSide(n).base] ? { ...builtinByName[splitSide(n).base], name: n } : null))
      .filter(Boolean) as Exercise[];
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

  // Saved in the background: until they are, the next load labels the same rows again.
  if (renames.length) Promise.all(renames).catch(() => {});

  const builtinPrograms: BuiltinProgram[] = builtinProgramRows.map((r: any) => {
    const blocks = (Array.isArray(r.blocks) ? r.blocks : []).map((b: any) => ({
      name: String(b?.name || ''),
      weeks: Math.max(1, Number(b?.weeks) || 1),
      days: Array.from({ length: 7 }, (_, d) => (Array.isArray(b?.days?.[d]) ? b.days[d].filter((n: unknown) => typeof n === 'string') : [])),
    }));
    return { id: r.id, name: r.name, notes: r.notes || '', blocks, weeks: blocks.reduce((s: number, b: any) => s + b.weeks, 0) };
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
    runReady: [...workouts, ...builtinWorkoutRows].some((r: any) => 'is_run' in r),
    repeatDaysReady: !repeatDaysProbe.error,
    holdReady,
    programs,
    programRuns,
    builtinPrograms,
    programsReady: programRows != null,
    profile: profileRows?.[0] ? toProfile(profileRows[0]) : null,
    profileReady: profileRows != null,
  };
}
