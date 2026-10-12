// A shared program: someone's program (its blocks, and which workouts fall on which weekday in each, with their
// exercises) as it was when they shared it. Kept as JSON behind a link (supabase/migrations/20261012000000_shared_programs.sql),
// read by the public page and copied by whoever opens it. Both sides use this file: the planner writes one, the server reads it back.

import { ICON_KEYS } from './icons';
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

export interface SharedBlock {
  name: string;
  weeks: number;
  /** Per weekday, Sunday first: the workouts on it, as places in the program's `workouts`. */
  days: number[][];
}

export interface SharedProgram {
  v: 2;
  /** Who shared it, when they chose to show their name. */
  by: string | null;
  /** Each block's workouts are its own, so one in two blocks is listed twice. */
  workouts: SharedWorkout[];
  /** Run in order. A link shared before programs had blocks reads as one block of one week. */
  blocks: SharedBlock[];
}

export const SHARE_LIMITS = { name: 80, workouts: 84, exercises: 60, text: 80, notes: 1000, blocks: 12, weeks: 52 };

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
const icon = (v: unknown) => (typeof v === 'string' && ICON_KEYS.includes(v) ? v : 'h');

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
  if (!raw || typeof raw !== 'object' || !Array.isArray(raw.workouts)) return null;
  // Before blocks, a link held one week: its days at the top.
  const rawBlocks: any[] = Array.isArray(raw.blocks) ? raw.blocks : Array.isArray(raw.days) ? [{ name: '', weeks: 1, days: raw.days }] : [];
  const read = raw.workouts.slice(0, SHARE_LIMITS.workouts).map(readWorkout);
  // A workout that didn't read is dropped, and the days are renumbered to match.
  const at: number[] = [];
  const workouts: SharedWorkout[] = [];
  read.forEach((w: SharedWorkout | null, ix: number) => {
    at[ix] = w ? workouts.push(w) - 1 : -1;
  });
  const blocks = rawBlocks.slice(0, SHARE_LIMITS.blocks).map((b) => {
    const weeks = Math.round(Number(b?.weeks));
    return {
      name: str(b?.name, 40),
      weeks: weeks >= 1 && weeks <= SHARE_LIMITS.weeks ? weeks : 1,
      days: Array.from({ length: 7 }, (_, d) =>
        (Array.isArray(b?.days?.[d]) ? b.days[d] : [])
          .map((ix: unknown) => (Number.isInteger(ix) && at[ix as number] != null ? at[ix as number] : -1))
          .filter((ix: number, k: number, all: number[]) => ix >= 0 && all.indexOf(ix) === k),
      ),
    };
  });
  if (!workouts.length || !blocks.length) return null;
  return { v: 2, by: str(raw.by) || null, workouts, blocks };
}

/** The weekdays (0 = Sunday) a block's workout falls on. */
export const daysOf = (b: SharedBlock, ix: number) => b.days.flatMap((list, d) => (list.includes(ix) ? [d] : []));

/** The workouts in a block, as places in the program's `workouts`. */
export const blockWorkouts = (b: SharedBlock) => Array.from(new Set(b.days.flat()));

/** All its blocks' weeks. */
export const programWeeks = (p: SharedProgram) => p.blocks.reduce((sum, b) => sum + b.weeks, 0);

/** How many days a week it has a workout on: the most of any block. */
export const trainingDays = (p: SharedProgram) => Math.max(0, ...p.blocks.map((b) => b.days.filter((list) => list.length).length));

/** Everything its exercises need, in the app's order. */
export const programEquipment = (p: SharedProgram) => {
  const need = new Set(p.workouts.flatMap((w) => w.exercises.flatMap((e) => e.equipment || [])));
  return EQUIPMENT.filter((x) => need.has(x));
};
