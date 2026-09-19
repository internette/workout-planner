import { supabase } from './supabase';

// ---------- shapes the planner UI works with ----------

export interface Exercise {
  id?: string;
  name: string;
  sets: string; // "4 × 8"
  weight: string; // "135 lb", "body", "—"
  rest: string; // "90 sec"
  i: string; // icon key
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
  s: 'c' | 'p' | 't'; // completed / planned / today
  time: string;
  icon: string | null;
  iconColor: string | null;
  areas: string[];
  ride?: Ride;
  series?: string;
  repeat: boolean;
  actual: { dist: string; elev: string; hrs: string; mins: string } | null;
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
  areas: string[];
  icon: string | null;
  iconColor: string | null;
  exercises: string[];
  ride?: { dist: string; elev: string; zone: string };
}

export interface Model {
  EX: Record<string, Exercise[]>; // workout name -> exercises
  SEED: Record<number, Record<number, Entry>>; // month -> day -> entry
  entries: { m: number; d: number; iso: string; av: Entry }[]; // sorted by date
  DIARY: Record<string, DiaryEntry>; // plan entry id -> diary entry
  library: Exercise[]; // arsenal exercises not tied to a workout
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
  };
}

const pad = (n: number) => String(n).padStart(2, '0');
export const isoDate = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

async function ok<T>(q: PromiseLike<{ data: T; error: any }>): Promise<T> {
  const { data, error } = await q;
  if (error) throw new Error(error.message);
  return data;
}

// ---------- read ----------

export async function loadModel(today: Date): Promise<Model> {
  const [workouts, exercises, plan, diary, library] = await Promise.all([
    ok(supabase.from('workouts').select('*')),
    ok(supabase.from('workout_exercises').select('*').order('order_index')),
    ok(supabase.from('plan_entries').select('*').order('scheduled_date')),
    ok(supabase.from('diary_entries').select('*')),
    ok(supabase.from('library_exercises').select('*').order('created_at')),
  ]);

  const byId: Record<string, any> = {};
  workouts.forEach((w: any) => (byId[w.id] = w));

  const EX: Record<string, Exercise[]> = {};
  workouts.forEach((w: any) => (EX[w.name] = []));
  exercises.forEach((e: any) => {
    const w = byId[e.workout_id];
    if (w) EX[w.name].push(toExercise(e));
  });

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
    if (SEED[m]?.[dd]) return; // the UI shows one workout per day
    const completed = p.status === 'completed';
    const isRide = w.kind === 'ride';
    const minutes = w.duration_minutes ?? (isRide ? 45 : 50);
    const hasActual =
      p.actual_distance_miles != null || p.actual_elevation_ft != null || p.actual_minutes != null;
    const av: Entry = {
      id: p.id,
      workoutId: w.id,
      name: w.name,
      s: completed ? 'c' : p.scheduled_date === todayIso ? 't' : 'p',
      time: isRide ? rideTime(minutes) : `~${minutes} min`,
      icon: w.icon,
      iconColor: w.icon_color,
      areas: w.target_areas || [],
      repeat: !!w.repeat_enabled,
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
    (SEED[m] = SEED[m] || {})[dd] = av;
    entries.push({ m, d: dd, iso: p.scheduled_date, av });
    entryById[p.id] = av;
    if (isRide) rideDone[p.id] = completed;
    else done[p.id] = p.done_exercises ?? (completed ? EX[w.name].map((e) => e.name) : []);
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
    .map((w: any) => {
      const isRide = w.kind === 'ride';
      const minutes = w.duration_minutes ?? (isRide ? 45 : 50);
      return {
        id: w.id,
        name: w.name,
        kind: isRide ? 'ride' : 'lift',
        time: isRide ? rideTime(minutes) : `~${minutes} min`,
        areas: w.target_areas || [],
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
    SEED,
    entries,
    DIARY,
    library: library.map(toExercise),
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
  areas: string[];
  exercises: Exercise[];
  dates: string[]; // ISO dates to schedule
  repeat: boolean;
}

// Creates the workout (or reuses one with the same name) and schedules it on every date.
export async function createWorkout(w: NewWorkout) {
  const existing: any[] = await ok(supabase.from('workouts').select('id').eq('name', w.name).limit(1));
  let workoutId: string;
  if (existing.length) {
    workoutId = existing[0].id;
    if (w.repeat) await ok(supabase.from('workouts').update({ repeat_enabled: true }).eq('id', workoutId));
  } else {
    const row: any[] = await ok(
      supabase
        .from('workouts')
        .insert({
          name: w.name,
          kind: w.isRide ? 'ride' : 'lift',
          duration_minutes: w.durationMinutes,
          icon: w.icon,
          icon_color: w.iconColor,
          target_areas: w.areas,
          ride_distance_miles: w.ride && w.ride.dist ? Number(w.ride.dist) : null,
          ride_elevation_ft: w.ride && w.ride.elev ? Number(w.ride.elev) : null,
          ride_zone: w.ride ? w.ride.zone : null,
          repeat_enabled: w.repeat,
        })
        .select('id'),
    );
    workoutId = row[0].id;
  }

  if (w.exercises.length) {
    const have: any[] = await ok(
      supabase.from('workout_exercises').select('name, order_index').eq('workout_id', workoutId),
    );
    const names = new Set(have.map((r) => r.name));
    let order = have.reduce((max, r) => Math.max(max, r.order_index ?? 0), have.length ? 0 : -1) + 1;
    const fresh = w.exercises.filter((e) => !names.has(e.name));
    if (fresh.length) {
      await ok(
        supabase
          .from('workout_exercises')
          .insert(fresh.map((e) => ({ workout_id: workoutId, order_index: order++, ...exerciseRow(e) }))),
      );
    }
  }

  await ok(
    supabase
      .from('plan_entries')
      .insert(w.dates.map((d) => ({ workout_id: workoutId, scheduled_date: d, status: 'planned' }))),
  );
}

export interface WorkoutEdit {
  entryId: string;
  workoutId: string;
  name?: string;
  icon?: string | null;
  iconColor?: string | null;
  areas?: string[];
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

export async function updateWorkout(e: WorkoutEdit) {
  const patch: Record<string, unknown> = {};
  if (e.name != null && e.name.trim()) patch.name = e.name.trim();
  if (e.icon !== undefined) patch.icon = e.icon;
  if (e.iconColor !== undefined) patch.icon_color = e.iconColor;
  if (e.areas) patch.target_areas = e.areas;
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
  await ok(supabase.from('library_exercises').upsert(exerciseRow(e), { onConflict: 'name' }));
}
