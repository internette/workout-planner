import { AUTH_REQUIRED } from './auth';
import { supabase } from './supabase';

// ---------- shapes the planner UI works with ----------

export interface Exercise {
  id?: string;
  name: string;
  sets: string; // "4 × 8"
  weight: string; // "135 lb", "body", "—"
  rest: string; // "90 sec"
  i: string; // icon key
  areas: string[]; // body regions this exercise targets
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
  repeat: boolean;
  actual: { dist: string; elev: string; hrs: string; mins: string } | null;
  notes: string;
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
}

export interface Model {
  EX: Record<string, Exercise[]>; // saved workout name -> exercises
  EXV: Record<string, Exercise[]>; // exercises by version: a saved workout by name, an archived snapshot by name#id
  SEED: Record<number, Record<number, Entry[]>>; // month -> day -> that day's entries, in a stable order
  entries: { m: number; d: number; iso: string; av: Entry }[]; // sorted by date
  DIARY: Record<string, DiaryEntry>; // plan entry id -> diary entry
  library: Exercise[]; // arsenal exercises not tied to a workout
  builtins: Exercise[]; // the shared starter catalog every account sees
  workouts: WorkoutSummary[]; // every saved workout, by name
  done: Record<string, string[]>; // plan entry id -> ticked exercise names
  rideDone: Record<string, boolean>;
  year: number;
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

const rideTime = (minutes: number) => {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h && m ? `${h} h ${m} min` : h ? `${h} h` : `${m} min`;
};

const toExercise = (r: any): Exercise => ({
  id: r.id,
  name: r.name,
  sets: fmtSets(r.sets, r.reps),
  weight: fmtWeight(r.weight_value, r.weight_unit),
  rest: fmtRest(r.rest_seconds),
  i: r.icon || 'h',
  areas: r.target_areas || [],
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
  };
}

// A workout's own target areas aren't set directly any more — they're whatever its exercises target, combined.
const areasOf = (list: Exercise[]) => Array.from(new Set(list.flatMap((e) => e.areas || [])));

const pad = (n: number) => String(n).padStart(2, '0');
export const isoDate = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

async function ok<T>(q: PromiseLike<{ data: T; error: any }>): Promise<T> {
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data;
}

// ---------- read ----------

export async function loadModel(today: Date): Promise<Model> {
  const [workouts, exercises, plan, diary, library, builtins] = await Promise.all([
    ok(supabase.from('workouts').select('*')),
    ok(supabase.from('workout_exercises').select('*').order('order_index')),
    ok(supabase.from('plan_entries').select('*').order('scheduled_date').order('id')),
    ok(supabase.from('diary_entries').select('*')),
    ok(supabase.from('library_exercises').select('*').order('created_at')),
    ok(supabase.from('builtin_exercises').select('*').order('sort_order')),
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

  const todayIso = isoDate(today.getFullYear(), today.getMonth(), today.getDate());
  const SEED: Model['SEED'] = {};
  const entries: Model['entries'] = [];
  const done: Model['done'] = {};
  const rideDone: Model['rideDone'] = {};
  const entryById: Record<string, Entry> = {};

  plan.forEach((p: any) => {
    const w = byId[p.workout_id];
    if (!w) return;
    const [yy, mm, dd] = String(p.scheduled_date).split('-').map(Number);
    if (yy !== today.getFullYear()) return; // the calendar covers the current year
    const m = mm - 1;
    const completed = p.status === 'completed';
    const isRide = w.kind === 'ride';
    const minutes = w.duration_minutes ?? (isRide ? 45 : 50);
    const hasActual =
      p.actual_distance_miles != null || p.actual_elevation_ft != null || p.actual_minutes != null;
    const av: Entry = {
      id: p.id,
      workoutId: w.id,
      name: w.name,
      exKey: keyOf(w),
      s: completed ? 'c' : p.scheduled_date === todayIso ? 't' : 'p',
      time: isRide ? rideTime(minutes) : `~${minutes} min`,
      icon: w.icon,
      iconColor: w.icon_color,
      areas: isRide ? [] : areasOf(EXV[keyOf(w)] || []),
      repeat: !!w.repeat_enabled,
      notes: w.notes || '',
      series: w.repeat_enabled ? w.id : undefined,
      ride: isRide
        ? {
            dist: w.ride_distance_miles != null ? String(w.ride_distance_miles) : '',
            hrs: Math.floor(minutes / 60) ? String(Math.floor(minutes / 60)) : '',
            mins: minutes % 60 ? String(minutes % 60) : '',
            elev: w.ride_elevation_ft != null ? String(w.ride_elevation_ft) : '',
            zone: w.ride_zone || 'Endurance',
          }
        : undefined,
      actual: hasActual
        ? {
            dist: p.actual_distance_miles != null ? String(p.actual_distance_miles) : '',
            elev: p.actual_elevation_ft != null ? String(p.actual_elevation_ft) : '',
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
      note: r.notes || '',
      workout: av.name,
    };
  });

  const saved: WorkoutSummary[] = workouts
    .filter((w: any) => !w.archived)
    .map((w: any) => {
      const isRide = w.kind === 'ride';
      const minutes = w.duration_minutes ?? (isRide ? 45 : 50);
      return {
        id: w.id,
        name: w.name,
        kind: isRide ? 'ride' : 'lift',
        time: isRide ? rideTime(minutes) : `~${minutes} min`,
        minutes,
        areas: isRide ? [] : areasOf(EXV[keyOf(w)] || []),
        icon: w.icon,
        iconColor: w.icon_color,
        exercises: (EX[w.name] || []).map((e) => e.name),
        ride: isRide
          ? {
              dist: w.ride_distance_miles != null ? String(w.ride_distance_miles) : '',
              elev: w.ride_elevation_ft != null ? String(w.ride_elevation_ft) : '',
              zone: w.ride_zone || 'Endurance',
            }
          : undefined,
      } as WorkoutSummary;
    })
    .sort((a, b) => a.name.localeCompare(b.name));

  return {
    EX,
    EXV,
    SEED,
    entries,
    DIARY,
    library: library.map(toExercise),
    builtins: builtins.map((r: any) => ({ ...toExercise(r), builtin: true })),
    workouts: saved,
    done,
    rideDone,
    year: today.getFullYear(),
  };
}

// ---------- write ----------

export async function setExercisesDone(entryId: string, names: string[], completed: boolean) {
  await ok(
    supabase
      .from('plan_entries')
      .update({
        done_exercises: names,
        status: completed ? 'completed' : 'planned',
        completed_at: completed ? new Date().toISOString() : null,
      })
      .eq('id', entryId),
  );
}

export async function setRideDone(entryId: string, completed: boolean) {
  await ok(
    supabase
      .from('plan_entries')
      .update({
        status: completed ? 'completed' : 'planned',
        completed_at: completed ? new Date().toISOString() : null,
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

// Ends a weekly series: removes its later repeats and turns repeating off for the workout.
export async function endSeries(workoutId: string, afterIso: string) {
  const later: { id: string }[] = await ok(
    supabase.from('plan_entries').select('id').eq('workout_id', workoutId).gt('scheduled_date', afterIso),
  );
  await deletePlanEntries(later.map((r) => r.id));
  await ok(supabase.from('workouts').update({ repeat_enabled: false }).eq('id', workoutId));
}

export interface NewWorkout {
  name: string;
  isRide: boolean;
  durationMinutes: number;
  ride: { dist: string; elev: string; zone: string } | null;
  icon: string | null;
  iconColor: string | null;
  exercises: Exercise[];
  dates: string[]; // ISO dates to schedule
  repeat: boolean;
  notes: string;
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
        ride_distance_miles: w.ride && w.ride.dist ? Number(w.ride.dist) : null,
        ride_elevation_ft: w.ride && w.ride.elev ? Number(w.ride.elev) : null,
        ride_zone: w.ride ? w.ride.zone : null,
        repeat_enabled: w.repeat,
        notes: w.notes || null,
      })
      .select('id'),
  );
  const workoutId: string = row.id;

  if (w.exercises.length) {
    let order = 0;
    await ok(
      supabase
        .from('workout_exercises')
        .insert(w.exercises.map((e) => ({ workout_id: workoutId, order_index: order++, ...exerciseRow(e) }))),
    );
  }

  // A workout saved on its own has no dates, and nothing to schedule.
  if (!w.dates.length) return { entryId: null };
  const rows: { id: string; scheduled_date: string }[] = await ok(
    supabase
      .from('plan_entries')
      .insert(w.dates.map((d) => ({ workout_id: workoutId, scheduled_date: d, status: 'planned' })))
      .select('id, scheduled_date'),
  );
  // The session on the first date, so the screen can open on it even when that day has other workouts too.
  return { entryId: rows.find((r) => r.scheduled_date === w.dates[0])?.id ?? null };
}

// Puts an existing workout on the calendar: one session per date. Repeating dates also turn its weekly series on.
export async function scheduleWorkout(workoutId: string, dates: string[], repeat: boolean) {
  if (!dates.length) return { entryId: null };
  if (repeat) await ok(supabase.from('workouts').update({ repeat_enabled: true }).eq('id', workoutId));
  const rows: { id: string; scheduled_date: string }[] = await ok(
    supabase
      .from('plan_entries')
      .insert(dates.map((d) => ({ workout_id: workoutId, scheduled_date: d, status: 'planned' })))
      .select('id, scheduled_date'),
  );
  return { entryId: rows.find((r) => r.scheduled_date === dates[0])?.id ?? null };
}

// A name no current workout uses (ignoring case): the name itself, else "<name> 2", "<name> 3", ...
async function numberedWorkoutName(wanted: string): Promise<string> {
  const rows: any[] = await ok(supabase.from('workouts').select('name').eq('archived', false));
  const taken = new Set(rows.map((r) => String(r.name).trim().toLowerCase()));
  if (!taken.has(wanted.trim().toLowerCase())) return wanted;
  let n = 2;
  while (taken.has((wanted + ' ' + n).trim().toLowerCase())) n++;
  return wanted + ' ' + n;
}

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
  };
  repeatDates: string[]; // extra weekly dates to schedule
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

export async function updateWorkout(e: WorkoutEdit) {
  const patch: Record<string, unknown> = {};
  if (e.name != null && e.name.trim()) patch.name = e.name.trim();
  if (e.icon !== undefined) patch.icon = e.icon;
  if (e.iconColor !== undefined) patch.icon_color = e.iconColor;
  if (e.notes !== undefined) patch.notes = e.notes;
  if (e.ride) {
    patch.ride_distance_miles = e.ride.dist ? Number(e.ride.dist) : null;
    patch.ride_elevation_ft = e.ride.elev ? Number(e.ride.elev) : null;
    patch.ride_zone = e.ride.zone;
    patch.duration_minutes = e.ride.minutes;
  }
  if (e.repeatDates.length) patch.repeat_enabled = true;
  if (Object.keys(patch).length) await ok(supabase.from('workouts').update(patch).eq('id', e.workoutId));

  for (const u of e.exercises.update) {
    const cur: any[] = await ok(supabase.from('workout_exercises').select('*').eq('id', u.id));
    if (!cur.length) continue;
    const merged = { ...toExercise(cur[0]), ...u.patch };
    await ok(supabase.from('workout_exercises').update(exerciseRow(merged)).eq('id', u.id));
    if (merged.name !== cur[0].name) await renameDoneExercise(e.workoutId, cur[0].name, merged.name);
  }
  if (e.exercises.removeIds.length) {
    await ok(supabase.from('workout_exercises').delete().in('id', e.exercises.removeIds));
  }
  if (e.exercises.add.length) {
    const have: any[] = await ok(
      supabase.from('workout_exercises').select('order_index').eq('workout_id', e.workoutId),
    );
    let order = have.reduce((max, r) => Math.max(max, r.order_index ?? 0), -1) + 1;
    await ok(
      supabase
        .from('workout_exercises')
        .insert(
          e.exercises.add.map((x) => ({ workout_id: e.workoutId, order_index: order++, ...exerciseRow(x) })),
        ),
    );
  }

  const entryPatch: Record<string, unknown> = {};
  if (e.moveTo) entryPatch.scheduled_date = e.moveTo;
  if (e.actual) {
    entryPatch.actual_distance_miles = e.actual.dist ? Number(e.actual.dist) : null;
    entryPatch.actual_elevation_ft = e.actual.elev ? Number(e.actual.elev) : null;
    entryPatch.actual_minutes = e.actual.minutes || null;
  }
  if (Object.keys(entryPatch).length)
    await ok(supabase.from('plan_entries').update(entryPatch).eq('id', e.entryId));

  if (e.repeatDates.length) {
    await ok(
      supabase
        .from('plan_entries')
        .insert(
          e.repeatDates.map((d) => ({ workout_id: e.workoutId, scheduled_date: d, status: 'planned' })),
        ),
    );
  }
}

export async function addLibraryExercise(e: Exercise) {
  // With per-user rows a name only has to be unique among one person's exercises.
  const onConflict = AUTH_REQUIRED ? 'user_id,name' : 'name';
  await ok(supabase.from('library_exercises').upsert(exerciseRow(e), { onConflict }));
}

// "Save as a new exercise", or a copy of a built-in: always a new row, never an overwrite. A name already in the
// Arsenal (the person's own or a built-in) becomes "<name> (copy)", "(copy 2)", ... Returns the new row's id and
// the name it ended up with, so the screen can open it.
export async function createLibraryExercise(e: Exercise): Promise<{ id: string; name: string }> {
  const [own, builtin]: any[][] = await Promise.all([
    ok(supabase.from('library_exercises').select('name')),
    ok(supabase.from('builtin_exercises').select('name')),
  ]);
  const taken = new Set([...own, ...builtin].map((r) => r.name));
  let name = e.name;
  if (taken.has(name)) {
    name = e.name + ' (copy)';
    for (let n = 2; taken.has(name); n++) name = e.name + ' (copy ' + n + ')';
  }
  const [row]: any[] = await ok(supabase.from('library_exercises').insert(exerciseRow({ ...e, name })).select('id'));
  return { id: row.id, name };
}

// Edits one exercise row: the copy inside a workout, or an exercise saved on its own in the Arsenal.
export async function updateExerciseRow(
  target: { kind: 'workout' | 'library'; id: string; workoutId?: string },
  patch: Partial<Exercise>,
) {
  const table = target.kind === 'workout' ? 'workout_exercises' : 'library_exercises';
  const cur: any[] = await ok(supabase.from(table).select('*').eq('id', target.id));
  if (!cur.length) return;
  const merged = { ...toExercise(cur[0]), ...patch };
  await ok(supabase.from(table).update(exerciseRow(merged)).eq('id', target.id));
  if (target.kind === 'workout' && target.workoutId && merged.name !== cur[0].name) {
    await renameDoneExercise(target.workoutId, cur[0].name, merged.name);
  }
}

// How many sessions of this workout are still ahead: from today on, and not already completed.
export async function countUpcoming(workoutId: string, todayIso: string): Promise<number> {
  const rows: any[] = await ok(
    supabase
      .from('plan_entries')
      .select('id')
      .eq('workout_id', workoutId)
      .gte('scheduled_date', todayIso)
      .neq('status', 'completed'),
  );
  return rows.length;
}

// For an edit made to one session from the calendar: how many other sessions share its workout, and how many of
// those are still ahead (from today on, not completed).
export async function sessionScope(workoutId: string, entryId: string, todayIso: string) {
  const rows: any[] = await ok(
    supabase.from('plan_entries').select('id, scheduled_date, status').eq('workout_id', workoutId),
  );
  const others = rows.filter((r) => r.id !== entryId);
  return {
    others: others.length,
    upcoming: others.filter((r) => r.scheduled_date >= todayIso && r.status !== 'completed').length,
  };
}

export interface TemplateEditResult {
  workoutId: string; // the workout the edit ended up on: the same one, or the new copy
  created: boolean;
  exerciseIds: Record<string, string>; // exercise row id in the original workout -> its row in the copy
}

// A name for the copy that no current workout uses: the edited name, else "<name> (copy)", "(copy 2)", ...
async function freeWorkoutName(wanted: string): Promise<string> {
  const rows: any[] = await ok(supabase.from('workouts').select('name').eq('archived', false));
  const taken = new Set(rows.map((r) => r.name));
  if (!taken.has(wanted)) return wanted;
  let name = wanted + ' (copy)';
  for (let n = 2; taken.has(name); n++) name = wanted + ' (copy ' + n + ')';
  return name;
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
  const [old]: any[] = await ok(supabase.from('workouts').select('*').eq('id', edit.workoutId));
  const oldExercises: any[] = await ok(
    supabase.from('workout_exercises').select('*').eq('workout_id', edit.workoutId).order('order_index'),
  );
  const { id: _id, created_at: _created, ...rest } = old;
  const copyExercises = async (toId: string) => {
    const ids: Record<string, string> = {};
    for (const { id, created_at: _c, workout_id: _w, ...r } of oldExercises) {
      const [row]: any[] = await ok(
        supabase.from('workout_exercises').insert({ ...r, workout_id: toId }).select('id'),
      );
      ids[id] = row.id;
    }
    return ids;
  };

  const mapped = (edit: WorkoutEdit, exerciseIds: Record<string, string>, workoutId: string): WorkoutEdit => {
    const map = (id: string) => exerciseIds[id] || id;
    return {
      ...edit,
      workoutId,
      exercises: {
        update: edit.exercises.update.map((u) => ({ ...u, id: map(u.id) })),
        removeIds: edit.exercises.removeIds.map(map),
        add: edit.exercises.add,
      },
    };
  };

  if (opts.mode === 'session') {
    const [fork]: any[] = await ok(
      supabase.from('workouts').insert({ ...rest, archived: true, repeat_enabled: false }).select('id'),
    );
    const exerciseIds = await copyExercises(fork.id);
    await ok(supabase.from('plan_entries').update({ workout_id: fork.id }).eq('id', edit.entryId));
    await updateWorkout(mapped(edit, exerciseIds, fork.id));
    return { workoutId: fork.id, created: false, exerciseIds };
  }

  if (opts.mode === 'new') {
    const name = await freeWorkoutName((edit.name || '').trim() || old.name);
    const [copy]: any[] = await ok(
      supabase.from('workouts').insert({ ...rest, name, archived: false, repeat_enabled: false }).select('id'),
    );
    const exerciseIds = await copyExercises(copy.id);
    const map = (id: string) => exerciseIds[id] || id;
    await updateWorkout({
      ...edit,
      workoutId: copy.id,
      name,
      exercises: {
        update: edit.exercises.update.map((u) => ({ ...u, id: map(u.id) })),
        removeIds: edit.exercises.removeIds.map(map),
        add: edit.exercises.add,
      },
    });
    return { workoutId: copy.id, created: true, exerciseIds };
  }

  const entries: any[] = await ok(
    supabase.from('plan_entries').select('id, scheduled_date, status').eq('workout_id', edit.workoutId),
  );
  const isUpcoming = (e: any) =>
    e.id === edit.entryId || (e.scheduled_date >= opts.todayIso && e.status !== 'completed');
  const past = entries.filter((e) => !isUpcoming(e) || !opts.updateUpcoming);
  if (past.length) {
    const keepsUpcoming = past.some(isUpcoming);
    const [snapshot]: any[] = await ok(
      supabase
        .from('workouts')
        .insert({ ...rest, archived: true, repeat_enabled: keepsUpcoming ? old.repeat_enabled : false })
        .select('id'),
    );
    await copyExercises(snapshot.id);
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
  return { workoutId: edit.workoutId, created: false, exerciseIds: {} };
}
