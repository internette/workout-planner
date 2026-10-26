// The shapes the planner's screens work with, as the data layer hands them over.

import type { Mood } from '@moonshot/design-system/icons';
import type { SharedProgram } from '@/frontend/shared/sharedProgram';

export interface Exercise {
  id?: string;
  name: string;
  sets: string; // "4 × 8"
  weight: string; // "135 lb", "body", "—"
  // Done with a resistance band: its level, "Medium band" ('' for none). Missing until the band_level migration has
  // run, and then left out of every write.
  band?: string;
  rest: string; // "90 sec"
  i: string; // icon key
  areas: string[]; // body regions this exercise targets
  // What it needs (from EQUIPMENT); empty is bodyweight, null is not set yet. Missing until the equipment migration has
  // run, and then left out of every write, so the app keeps working against a database without the column.
  equipment?: string[] | null;
  builtin?: boolean; // from the shared catalog: read-only, copy it to change it
}

// The plan of a workout done for distance rather than with exercises: a ride, or a run or walk (`run`).
export interface RidePlan {
  dist: string;
  elev: string;
  zone: string;
  run?: boolean;
}

export interface Ride {
  dist: string;
  hrs: string;
  mins: string;
  elev: string;
  zone: string;
  run?: boolean; // a run or walk rather than a ride: the same plan, its own name and icon
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
  seriesDays?: number[]; // the weekdays (0 = Sunday) its workout's weekly series repeats on
  repeat: boolean;
  actual: { dist: string; elev: string; hrs: string; mins: string } | null;
  notes: string;
  warmup: boolean; // a warm-up: listed before the day's other workouts, and tagged WARM-UP
  stretch: boolean; // a stretch: listed after the day's other workouts (a cool-down), and tagged STRETCH
  yoga: boolean; // a yoga flow: tagged YOGA
  // Put on the calendar by a program's run: which program, and where in it ("Build, week 2 of 3").
  program?: { runId: string; programId: string | null; name: string; block: string; week: number; weeks: number };
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
  ride?: RidePlan;
  notes: string;
  warmup: boolean;
  stretch: boolean;
  yoga: boolean;
}

// A program: blocks of weeks run in order, each repeating one week of the program's own workouts.
export interface ProgramWorkout extends WorkoutSummary {
  exKey: string; // where its exercises live in Model.EXV
  days: number[]; // the weekdays it falls on in its block (0 = Sunday)
  list: Exercise[];
}
export interface ProgramBlock {
  id: string;
  name: string;
  weeks: number;
  position: number;
  workouts: ProgramWorkout[];
}
export interface Program {
  id: string;
  name: string;
  notes: string;
  blocks: ProgramBlock[];
  weeks: number; // all its blocks' weeks
}
// A program put on the calendar from `start`, beginning at block `startBlock`. `end` is its last day. It keeps the
// program as it was when it started (`name`, `snapshot`), and outlives it: a deleted program's runs have no programId.
export interface ProgramRun {
  id: string;
  programId: string | null;
  name: string;
  snapshot: SharedProgram | null;
  start: string;
  startBlock: number;
  end: string;
  ended: boolean;
  endedOn: string | null; // the day "End program" was pressed
}
// A ready-made program from the shared catalog: per block, the built-in workouts on each weekday (Sunday first).
export interface BuiltinProgram {
  id: string;
  name: string;
  notes: string;
  blocks: { name: string; weeks: number; days: string[][] }[];
  weeks: number;
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
  // Whether workouts can be marked as stretches yet (the stretches migration has added the column).
  stretchReady: boolean;
  // Whether workouts can be marked as yoga yet (the yoga migration has added the column).
  yogaReady: boolean;
  // Whether a distance workout can be a run or walk yet (the run/walk migration has added the column).
  runReady: boolean;
  // Whether a held exercise's time can be set yet (the timed-holds migration has added hold_seconds). Until then a
  // hold's time is the one in its name.
  holdReady: boolean;
  // Whether a weekly series can repeat on more than one weekday yet (the repeat-days migration has added the column).
  repeatDaysReady: boolean;
  programs: Program[]; // the person's own, by name
  programRuns: ProgramRun[]; // every run, newest first
  builtinPrograms: BuiltinProgram[]; // the shared catalog, in catalog order
  // Whether programs can be made yet (the programs migration has run).
  programsReady: boolean;
  profile: Profile | null; // what they said in "Customize your experience"; null until they have
  // Whether that can be saved yet (the profiles migration has run).
  profileReady: boolean;
}

// What a person said in "Customize your experience".
export interface Profile {
  name: string | null; // null: the name from their sign-in
  trains: ('lift' | 'ride' | 'run' | 'stretch' | 'yoga')[];
  equipment: string[] | null; // from EQUIPMENT; empty is bodyweight only, null is not said
  days: number[]; // weekdays, 0 = Sunday
  minutes: number | null;
}

export interface NewWorkout {
  name: string;
  isRide: boolean;
  durationMinutes: number;
  ride: RidePlan | null;
  icon: string | null;
  iconColor: string | null;
  exercises: Exercise[];
  done?: boolean; // put on a day that has gone by, logged as already done (every exercise ticked)
  dates: string[]; // ISO dates to schedule
  repeatDays: number[]; // the weekdays (0 = Sunday) its weekly series repeats on; none when it doesn't repeat
  notes: string;
  warmup?: boolean;
  stretch?: boolean;
  yoga?: boolean;
}

export interface WorkoutEdit {
  entryId: string;
  workoutId: string;
  name?: string;
  icon?: string | null;
  iconColor?: string | null;
  notes?: string;
  ride?: (RidePlan & { minutes: number }) | null;
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
  repeatDays?: number[]; // the weekdays they repeat on
  warmup?: boolean; // marked as a warm-up, or not, when that changed
  stretch?: boolean; // marked as a stretch, or not, when that changed
  yoga?: boolean; // marked as yoga, or not, when that changed
  durationMinutes?: number; // a lift's new length, when its exercises changed
}

export interface TemplateEditResult {
  workoutId: string; // the workout the edit ended up on: the same one, or the new copy
  created: boolean;
}
