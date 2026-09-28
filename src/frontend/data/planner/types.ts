// The shapes the planner's screens work with, as the data layer hands them over.

import type { Mood } from '@moonshot/design-system/icons';

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
  mood: Mood;
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

export interface TemplateEditResult {
  workoutId: string; // the workout the edit ended up on: the same one, or the new copy
  created: boolean;
}
