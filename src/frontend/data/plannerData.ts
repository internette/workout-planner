import { supabase } from './supabase';
import { colors } from '@moonshot/design-system/colors';
import { DEFAULT_ZONE, type PlanDraft, type PlanWorkout } from '@/shared/planDraft';
import { LIFT_MINUTES, RIDE_MINUTES } from '@/frontend/shared/constants';
import { isoMonthDay, isoOf, isoWeekday, minText, splitMinutes } from '@/frontend/shared/helpers';

// ---------- shapes the planner UI works with ----------

export interface Exercise {
  id?: string;
  name: string;
  sets: string; // "4 × 8"
  weight: string; // "135 lb", "body", "—"
  rest: string; // "90 sec"
  i: string; // icon key
  areas: string[]; // body regions this exercise targets
  // What it needs (from EQUIPMENT); empty is bodyweight. Missing until the equipment migration has run, and then left
  // out of every write, so the app keeps working against a database without the column.
  equipment?: string[];
  builtin?: boolean; // from the shared catalog: read-only, copy it to change it
}

export interface Ride {
  dist: string;
  hrs: string;
  mins: string;
  elev: string;
  zone: string;
}

// One workout scheduled on one date (a plan_entries row joined with its workout).
export interface Entry {
  id: string;
  workoutId: string;
  name: string;
  exKey: string; // where this entry's exercises live in Model.EXV
  s: 'c' | 'p' | 't'; // completed / planned / today
  time: string;
  icon: string | null;
  iconColor: string | null;
  areas: string[];
  ride?: Ride;
  series?: string;
  seriesDay?: number; // the weekday (0 = Sunday) its workout's weekly series repeats on
  repeat: boolean;
  actual: { dist: string; elev: string; hrs: string; mins: string } | null;
  notes: string;
  warmup: boolean; // a warm-up: listed before the day's other workouts, and tagged WARM-UP
}

export interface DiaryEntry {
  m: number;
  d: number;
  mood: string;
  rpe: number;
  note: string;
  workout: string;
}

// A saved workout: the template a plan entry is scheduled from. It has no date of its own.
export interface WorkoutSummary {
  id: string;
  name: string;
  kind: 'lift' | 'ride';
  time: string;
  minutes: number;
  areas: string[];
  icon: string | null;
  iconColor: string | null;
  exercises: string[];
  ride?: { dist: string; elev: string; zone: string };
  notes: string;
  warmup: boolean;
}

// A ready-made workout from the shared catalog: read-only, listed with its group. Its exercises are built-in ones.
export interface BuiltinWorkout extends WorkoutSummary {
  builtin: true;
  category: string;
  list: Exercise[];
}

export interface Model {
  EX: Record<string, Exercise[]>; // saved workout name -> exercises
  EXV: Record<string, Exercise[]>; // exercises by version: a saved workout by name, an archived snapshot by name#id
  // month -> day -> that day's entries, in a stable order. Months count on from January of this year: 12 is next
  // January, -1 last December.
  SEED: Record<number, Record<number, Entry[]>>;
  entries: { m: number; d: number; iso: string; av: Entry }[]; // sorted by date
  DIARY: Record<string, DiaryEntry>; // plan entry id -> diary entry
  library: Exercise[]; // arsenal exercises not tied to a workout
  builtins: Exercise[]; // the shared starter catalog every account sees
  workouts: WorkoutSummary[]; // every saved workout, by name
  builtinWorkouts: BuiltinWorkout[]; // the shared catalog of ready-made workouts, in catalog order
  done: Record<string, string[]>; // plan entry id -> ticked exercise names
  rideDone: Record<string, boolean>;
  year: number;
  // Whether workouts can be marked as warm-ups yet (the warm-ups migration has added the column).
  warmupReady: boolean;
}

// ---------- string <-> column conversion ----------

const fmtSets = (sets: number | null, reps: number | null) =>
  sets && reps ? `${sets} × ${reps}` : sets ? `${sets} sets` : '—';

function parseSets(text: string): { sets: number | null; reps: number | null } | null {
  const m = text.trim().match(/^(\d+)\s*[×xX*]\s*(\d+)/);
  if (m) return { sets: Number(m[1]), reps: Number(m[2]) };
  const s = text.trim().match(/^(\d+)(\s*sets?)?$/i);
  return s ? { sets: Number(s[1]), reps: null } : null;
}

const fmtWeight = (value: number | null, unit: string | null) =>
  value != null ? `${value} ${unit || 'lb'}` : unit === 'body' ? 'body' : '—';

function parseWeight(text: string): { value: number | null; unit: string | null } {
  const t = text.trim().toLowerCase();
  if (t.startsWith('body')) return { value: null, unit: 'body' };
  const m = t.match(/^(\d+(?:\.\d+)?)\s*(lbs?|kg)?/);
  return m
    ? { value: Number(m[1]), unit: m[2] ? m[2].replace('lbs', 'lb') : 'lb' }
    : { value: null, unit: null };
}

const fmtRest = (sec: number | null) => (sec != null ? `${sec} sec` : '—');
const parseRest = (text: string) => {
  const m = text.match(/\d+/);
  return m ? Number(m[0]) : null;
};


const toExercise = (r: any): Exercise => ({
  id: r.id,
  name: r.name,
  sets: fmtSets(r.sets, r.reps),
  weight: fmtWeight(r.weight_value, r.weight_unit),
  rest: fmtRest(r.rest_seconds),
  i: r.icon || 'h',
  areas: r.target_areas || [],
  equipment: Array.isArray(r.equipment) ? r.equipment : undefined,
});

function exerciseRow(e: Exercise) {
  const sets = parseSets(e.sets);
  const weight = parseWeight(e.weight);
  return {
    name: e.name,
    sets: sets ? sets.sets : null,
    reps: sets ? sets.reps : null,
    weight_value: weight.value,
    weight_unit: weight.unit,
    rest_seconds: parseRest(e.rest),
    icon: e.i || 'h',
    target_areas: e.areas || [],
    ...(e.equipment !== undefined ? { equipment: e.equipment } : {}),
  };
}

// A workout's own target areas aren't set directly any more — they're whatever its exercises target, combined.
// Workout icon colours are saved as hex. The primary pink has changed over time (#E1699C, then #D63479), so a workout
// saved with an earlier one shows today's, and still matches the pink in the colour picker.
const OLD_PINKS = ['#E1699C', '#D63479'];
const iconColorOf = (hex: string | null) => (hex && OLD_PINKS.includes(hex.toUpperCase()) ? colors.pink : hex);

const areasOf = (list: Exercise[]) => Array.from(new Set(list.flatMap((e) => e.areas || [])));

async function ok<T>(q: PromiseLike<{ data: T; error: any }>): Promise<T> {
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data;
}

// The same, for a table a migration adds: until it has run the table isn't there, and `fallback` stands in for it.
// Any other error still throws.
async function okOr<T>(q: PromiseLike<{ data: T; error: any }>, fallback: T): Promise<T> {
  const { data, error } = await q;
  if (error && (error.code === '42P01' || error.code === 'PGRST205')) return fallback;
  if (error) throw new Error(error.message);
  return data;
}

const workoutById = async (id: string): Promise<any | undefined> =>
  (await ok<any[]>(supabase.from('workouts').select('*').eq('id', id)))[0];

// Numbers as the screens hold them (a string, blank for none) and as the database does (a number, or null).
const numStr = (v: number | null | undefined) => (v != null ? String(v) : '');
const numOrNull = (v: string | undefined) => (v ? Number(v) : null);

// A ride's plan as workout columns.
const rideCols = (ride: { dist: string; elev: string; zone: string }) => ({
  ride_distance_miles: numOrNull(ride.dist),
  ride_elevation_ft: numOrNull(ride.elev),
  ride_zone: ride.zone,
});

// A session marked complete or not.
const completionCols = (completed: boolean) => ({
  status: completed ? 'completed' : 'planned',
  completed_at: completed ? new Date().toISOString() : null,
});

// A workout's fields as both the calendar's sessions and the Spellbook's list show them.
function workoutView(w: any, exercises: Exercise[]) {
  const isRide = w.kind === 'ride';
  const minutes: number = w.duration_minutes ?? (isRide ? RIDE_MINUTES : LIFT_MINUTES);
  return {
    name: w.name as string,
    isRide,
    minutes,
    time: isRide ? minText(minutes) : `~${minutes} min`,
    icon: w.icon,
    iconColor: iconColorOf(w.icon_color),
    areas: isRide ? [] : areasOf(exercises),
    notes: (w.notes || '') as string,
    warmup: !!w.is_warmup,
    ride: isRide ? { dist: numStr(w.ride_distance_miles), elev: numStr(w.ride_elevation_ft), zone: w.ride_zone || DEFAULT_ZONE } : undefined,
  };
}

// ---------- read ----------

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
      mood: r.mood.charAt(0).toUpperCase() + r.mood.slice(1),
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

// How long a lift of this many exercises is likely to take: about ten minutes each, at least twenty. A warm-up's
// exercises are quick ones, about two minutes each, at least five.
export function estimateMinutes(count: number, warmup: boolean) {
  return warmup ? Math.max(5, count * 2) : Math.max(20, count * 10);
}

// ---------- write ----------

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

// A session is finished once it's completed or has a recorded time (sessions finished before Finish marked
// lifts completed have only the time).
const isFinished = (r: any) => r.status === 'completed' || r.actual_minutes != null;
// Still ahead: from today on, and not finished. What "upcoming" means wherever sessions are counted.
const isAhead = (r: any, todayIso: string) => r.scheduled_date >= todayIso && !isFinished(r);

// Of these sessions, the ones that can come off the calendar without losing anything: not finished, nothing
// ticked off, and nothing written about them in the Chronicle.
async function untouchedIds(rows: any[]): Promise<string[]> {
  const open = rows.filter((r) => !isFinished(r) && !(r.done_exercises || []).length);
  if (!open.length) return [];
  const written: any[] = await ok(
    supabase.from('diary_entries').select('plan_entry_id').in('plan_entry_id', open.map((r) => r.id)),
  );
  const has = new Set(written.map((d) => d.plan_entry_id));
  return open.filter((r) => !has.has(r.id)).map((r) => r.id);
}
const SESSION_COLS = 'id, scheduled_date, status, actual_minutes, done_exercises';

// Ends a weekly series: removes its repeats still ahead (after the chosen day, and from today on) and turns
// repeating off for the workout. Anything finished, started or written about stays.
export async function endSeries(workoutId: string, afterIso: string, todayIso: string) {
  const later: any[] = await ok(
    supabase.from('plan_entries').select(SESSION_COLS).eq('workout_id', workoutId).gt('scheduled_date', afterIso),
  );
  // Only the series' own weekday: a session of the same workout put on another day stays.
  const day = isoWeekday(afterIso);
  await deletePlanEntries(
    await untouchedIds(later.filter((r) => isAhead(r, todayIso) && isoWeekday(r.scheduled_date) === day)),
  );
  await ok(supabase.from('workouts').update({ repeat_enabled: false }).eq('id', workoutId));
}

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

export interface NewWorkout {
  name: string;
  isRide: boolean;
  durationMinutes: number;
  ride: { dist: string; elev: string; zone: string } | null;
  icon: string | null;
  iconColor: string | null;
  exercises: Exercise[];
  done?: boolean; // put on a day that has gone by, logged as already done (every exercise ticked)
  dates: string[]; // ISO dates to schedule
  repeat: boolean;
  notes: string;
  warmup?: boolean;
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

// Puts an existing workout on the calendar: one session per date. Repeating dates also turn its weekly series on.
// `done` logs the first date as already done (a workout added to a day that has gone by), with these exercises ticked.
export async function scheduleWorkout(
  workoutId: string,
  dates: string[],
  repeat: boolean,
  done?: { exercises: string[] },
) {
  if (!dates.length) return { entryId: null };
  if (repeat) await ok(supabase.from('workouts').update({ repeat_enabled: true }).eq('id', workoutId));
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

// Names are compared ignoring case and the spaces around them, everywhere: "Leg day" is taken when "Leg Day" is.
const nameKey = (name: string) => String(name).trim().toLowerCase();

// A name that isn't in `taken` (a set of nameKeys): the name itself, else numbered ("<name> 2", "<name> 3", ...)
// or marked as a copy ("<name> (copy)", "<name> (copy 2)", ...).
function freeName(wanted: string, taken: Set<string>, style: 'number' | 'copy'): string {
  if (!taken.has(nameKey(wanted))) return wanted;
  const nth = (n: number) => (style === 'number' ? `${wanted} ${n}` : n === 1 ? `${wanted} (copy)` : `${wanted} (copy ${n})`);
  let n = style === 'number' ? 2 : 1;
  while (taken.has(nameKey(nth(n)))) n++;
  return nth(n);
}

// The names of the workouts in the Spellbook, as nameKeys.
async function takenWorkoutNames(): Promise<Set<string>> {
  const rows: any[] = await ok(supabase.from('workouts').select('name').eq('archived', false));
  return new Set(rows.map((r) => nameKey(r.name)));
}

// A name no current workout uses: the name itself, else "<name> 2", "<name> 3", ...
const numberedWorkoutName = async (wanted: string) => freeName(wanted, await takenWorkoutNames(), 'number');

export interface WorkoutEdit {
  entryId: string;
  workoutId: string;
  name?: string;
  icon?: string | null;
  iconColor?: string | null;
  notes?: string;
  ride?: { dist: string; elev: string; zone: string; minutes: number } | null;
  moveTo?: string; // ISO date
  actual?: { dist: string; elev: string; minutes: number } | null;
  exercises: {
    update: { id: string; patch: Partial<Exercise> }[];
    removeIds: string[];
    add: Exercise[];
    // Every exercise's name, in the order it should now run, when it was reordered.
    order?: string[];
  };
  repeatDates: string[]; // extra weekly dates to schedule
  warmup?: boolean; // marked as a warm-up, or not, when that changed
  durationMinutes?: number; // a lift's new length, when its exercises changed
}

// Exercise ticks are stored by name, so renaming an exercise has to rename its ticks too.
async function renameDoneExercise(workoutId: string, from: string, to: string) {
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
async function insertExercises(workoutId: string, list: Exercise[], startAt: number) {
  if (!list.length) return;
  await ok(
    supabase
      .from('workout_exercises')
      .insert(list.map((x, i) => ({ workout_id: workoutId, order_index: startAt + i, ...exerciseRow(x) }))),
  );
}

// Changes one exercise row (in a workout, or saved on its own): what it was, with `patch` over it. Returns the names
// before and after, or null when the row is gone.
async function patchExercise(table: 'workout_exercises' | 'library_exercises', id: string, patch: Partial<Exercise>) {
  const [cur]: any[] = await ok(supabase.from(table).select('*').eq('id', id));
  if (!cur) return null;
  const merged = { ...toExercise(cur), ...patch };
  await ok(supabase.from(table).update(exerciseRow(merged)).eq('id', id));
  return { from: cur.name as string, to: merged.name };
}

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

// Takes a saved workout out of the Spellbook. Its sessions still ahead (from today on, not completed) come off the
// calendar; past and completed ones stay, pointing at it, so history keeps its exercises. Archiving rather than
// deleting is what the edit snapshots already do, and it frees the name.
export async function archiveWorkout(workoutId: string, todayIso: string) {
  await deletePlanEntries(await upcomingOfWorkout(workoutId, todayIso));
  await ok(supabase.from('workouts').update({ archived: true, repeat_enabled: false }).eq('id', workoutId));
}

// An exercise saved on its own. Workouts hold their own copies of exercises, so nothing else changes.
export async function deleteLibraryExercise(id: string) {
  await ok(supabase.from('library_exercises').delete().eq('id', id));
}

// A new exercise saved on its own ("New exercise", "Save as a new exercise", or a copy of a built-in): always a new
// row, never an overwrite. A name already in the Spellbook (the person's own or a built-in, ignoring case) becomes
// "<name> (copy)", "(copy 2)", ... Returns the new row's id and the name it ended up with, so the screen can open it.
export async function createLibraryExercise(e: Exercise): Promise<{ id: string; name: string }> {
  const [own, builtin]: any[][] = await Promise.all([
    ok(supabase.from('library_exercises').select('name')),
    ok(supabase.from('builtin_exercises').select('name')),
  ]);
  const name = freeName(e.name, new Set([...own, ...builtin].map((r) => nameKey(r.name))), 'copy');
  const [row]: any[] = await ok(supabase.from('library_exercises').insert(exerciseRow({ ...e, name })).select('id'));
  return { id: row.id, name };
}

// Edits an exercise saved on its own in the Spellbook.
export async function updateLibraryExercise(id: string, patch: Partial<Exercise>) {
  await patchExercise('library_exercises', id, patch);
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

// The saved workout a workout row stands for: itself, or for an archived copy (a session saved "only this session",
// or history kept from before an edit) the saved workout it came from, if that is still in the Spellbook. Null when
// there is none (the saved workout was deleted).
async function savedWorkoutOf(w: any): Promise<any | null> {
  if (!w) return null;
  if (!w.archived) return w;
  const rows: any[] = w.source_workout_id
    ? await ok(supabase.from('workouts').select('*').eq('id', w.source_workout_id).eq('archived', false))
    : 'source_workout_id' in w
      ? []
      : await ok(supabase.from('workouts').select('*').eq('name', w.name).eq('archived', false));
  return rows[0] || null;
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

export interface TemplateEditResult {
  workoutId: string; // the workout the edit ended up on: the same one, or the new copy
  created: boolean;
}


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

// ---------- plans from an assistant ("Summon a plan") ----------
// Claude or ChatGPT saves a plan through the connector (backend/api/mcp.ts, at /api/mcp) as a draft in plan_drafts. The app reads the newest draft,
// and on the person's say-so turns it into workouts and sessions with their own sign-in, like any other workout.

/** The newest plan still waiting for a decision, or null. `since` (an ISO time) only counts drafts saved after it.
 * Null too when the plan_drafts migration hasn't run. */
export async function latestPlanDraft(since?: string): Promise<PlanDraft | null> {
  let q = supabase.from('plan_drafts').select('id, source, title, summary, plan, created_at').eq('status', 'draft');
  if (since) q = q.gt('created_at', since);
  const rows = await okOr<any[] | null>(q.order('created_at', { ascending: false }).limit(1), []);
  return (rows?.[0] as PlanDraft | undefined) ?? null;
}

// A draft is decided once: added to the calendar, or let go.
const decidePlanDraft = async (id: string, status: 'added' | 'discarded') =>
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
      durationMinutes: w.minutes ?? estimateMinutes(exercises.length, !!w.warmup),
      ride: isRide
        ? { dist: numStr(w.ride?.miles), elev: numStr(w.ride?.elevation_ft), zone: w.ride?.zone ?? DEFAULT_ZONE }
        : null,
      icon: null,
      iconColor: null,
      exercises,
      dates: dates.sort(),
      repeat: false,
      notes: w.notes ?? '',
      warmup: model.warmupReady && !!w.warmup,
    });
  }
  await decidePlanDraft(draft.id, 'added');
}
