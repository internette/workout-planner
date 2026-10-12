// A shared program: someone's week (which workouts fall on which weekday, with their exercises) as it was when they
// shared it. Kept as JSON behind a link (supabase/migrations/20261012000000_shared_programs.sql), read by the public
// page and copied by whoever opens it. Both sides use this file: the planner writes one, the server reads it back.

import { EXERCISE_ICON_NAMES } from '@moonshot/design-system/icons';
import { EQUIPMENT, TARGET_AREAS } from './constants';
import { DEFAULT_ZONE, RIDE_ZONES } from '@/shared/planDraft';

export interface SharedExercise {
  name: string;
  sets: string; // "3 × 12"
  weight: string; // "20 lb", "body", "—"
  band?: string; // "Medium band"
  rest: string; // "60 sec"
  i: string; // icon
  areas: string[];
  equipment?: string[];
}

export interface SharedWorkout {
  name: string;
  kind: 'lift' | 'ride';
  minutes: number;
  icon: string;
  iconColor: string | null;
  notes: string;
  warmup: boolean;
  stretch: boolean;
  yoga: boolean;
  ride: { dist: string; elev: string; zone: string } | null;
  exercises: SharedExercise[];
}

export interface SharedProgram {
  v: 1;
  /** Who shared it, when they chose to show their name. */
  by: string | null;
  workouts: SharedWorkout[];
  /** Per weekday, Sunday first: the workouts on it, as places in `workouts`. */
  days: number[][];
}

export const SHARE_LIMITS = { name: 80, workouts: 21, exercises: 60, text: 80, notes: 1000 };

// A link's id: 12 letters and digits, from the browser's random numbers.
const ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789';
export function newShareId() {
  const bytes = crypto.getRandomValues(new Uint8Array(12));
  return Array.from(bytes, (b) => ALPHABET[b % ALPHABET.length]).join('');
}
export const isShareId = (id: string) => /^[A-Za-z0-9]{10,32}$/.test(id);

// What's stored is whatever its owner's browser wrote, so it's read back as untrusted: each field is checked and cut
// to size, and anything that isn't one of the app's own values (icons, target areas, equipment) is left out.
const str = (v: unknown, max = SHARE_LIMITS.text) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const list = (v: unknown, known: readonly string[]) => (Array.isArray(v) ? v.filter((x) => known.includes(x)) : []);
const icon = (v: unknown) => (typeof v === 'string' && (EXERCISE_ICON_NAMES as string[]).includes(v) ? v : 'h');

function readExercise(raw: any): SharedExercise | null {
  const name = str(raw?.name);
  if (!name) return null;
  return {
    name,
    sets: str(raw.sets) || '—',
    weight: str(raw.weight) || '—',
    ...(str(raw.band) ? { band: str(raw.band) } : {}),
    rest: str(raw.rest) || '—',
    i: icon(raw.i),
    areas: list(raw.areas, TARGET_AREAS),
    ...(Array.isArray(raw.equipment) ? { equipment: list(raw.equipment, EQUIPMENT) } : {}),
  };
}

function readWorkout(raw: any): SharedWorkout | null {
  const name = str(raw?.name);
  if (!name) return null;
  const ride = raw.kind === 'ride';
  const minutes = Math.round(Number(raw.minutes));
  return {
    name,
    kind: ride ? 'ride' : 'lift',
    minutes: minutes > 0 && minutes <= 600 ? minutes : 45,
    icon: ride ? 'bike' : icon(raw.icon),
    iconColor: typeof raw.iconColor === 'string' && /^#[0-9a-f]{6}$/i.test(raw.iconColor) ? raw.iconColor : null,
    notes: str(raw.notes, SHARE_LIMITS.notes),
    warmup: raw.warmup === true,
    stretch: raw.stretch === true,
    yoga: raw.yoga === true,
    ride: ride
      ? {
          dist: str(raw.ride?.dist, 8),
          elev: str(raw.ride?.elev, 8),
          zone: (RIDE_ZONES as readonly string[]).includes(raw.ride?.zone) ? raw.ride.zone : DEFAULT_ZONE,
        }
      : null,
    exercises: ride
      ? []
      : (Array.isArray(raw.exercises) ? raw.exercises : [])
          .slice(0, SHARE_LIMITS.exercises)
          .map(readExercise)
          .filter((e: SharedExercise | null): e is SharedExercise => !!e),
  };
}

/** A program as stored, checked; null when it isn't one. */
export function readProgram(raw: any): SharedProgram | null {
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.workouts) || !Array.isArray(raw.days)) return null;
  const read = raw.workouts.slice(0, SHARE_LIMITS.workouts).map(readWorkout);
  // A workout that didn't read is dropped, and the days are renumbered to match.
  const at: number[] = [];
  const workouts: SharedWorkout[] = [];
  read.forEach((w: SharedWorkout | null, ix: number) => {
    at[ix] = w ? workouts.push(w) - 1 : -1;
  });
  const days = Array.from({ length: 7 }, (_, d) =>
    (Array.isArray(raw.days[d]) ? raw.days[d] : [])
      .map((ix: unknown) => (Number.isInteger(ix) && at[ix as number] != null ? at[ix as number] : -1))
      .filter((ix: number) => ix >= 0),
  );
  if (!workouts.length) return null;
  return { v: 1, by: str(raw.by) || null, workouts, days };
}

/** The weekdays (0 = Sunday) a program's workout falls on. */
export const daysOf = (p: SharedProgram, ix: number) => p.days.flatMap((list, d) => (list.includes(ix) ? [d] : []));

/** How many days a week it has a workout on. */
export const trainingDays = (p: SharedProgram) => p.days.filter((list) => list.length).length;

/** Its whole week's time, in minutes: each workout as often as it falls. */
export const weekMinutes = (p: SharedProgram) => p.days.flat().reduce((sum, ix) => sum + (p.workouts[ix]?.minutes || 0), 0);

/** Everything its exercises need, in the app's order. */
export const programEquipment = (p: SharedProgram) => {
  const need = new Set(p.workouts.flatMap((w) => w.exercises.flatMap((e) => e.equipment || [])));
  return EQUIPMENT.filter((x) => need.has(x));
};
