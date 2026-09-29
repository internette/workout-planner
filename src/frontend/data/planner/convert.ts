// Converting between database columns and the strings and shapes the screens use. No database calls here.

import { colors } from '@moonshot/design-system/colors';
import { DEFAULT_ZONE } from '@/shared/planDraft';
import { LIFT_MINUTES, RIDE_MINUTES } from '@/frontend/shared/constants';
import { minText } from '@/frontend/shared/helpers';
import type { Exercise } from './types';

export const fmtSets = (sets: number | null, reps: number | null) =>
  sets && reps ? `${sets} × ${reps}` : sets ? `${sets} sets` : '—';

export function parseSets(text: string): { sets: number | null; reps: number | null } | null {
  const m = text.trim().match(/^(\d+)\s*[×xX*]\s*(\d+)/);
  if (m) return { sets: Number(m[1]), reps: Number(m[2]) };
  const s = text.trim().match(/^(\d+)(\s*sets?)?$/i);
  return s ? { sets: Number(s[1]), reps: null } : null;
}

export const fmtWeight = (value: number | null, unit: string | null) =>
  value != null ? `${value} ${unit || 'lb'}` : unit === 'body' ? 'body' : '—';

export function parseWeight(text: string): { value: number | null; unit: string | null } {
  const t = text.trim().toLowerCase();
  if (t.startsWith('body')) return { value: null, unit: 'body' };
  const m = t.match(/^(\d+(?:\.\d+)?)\s*(lbs?|kg)?/);
  return m
    ? { value: Number(m[1]), unit: m[2] ? m[2].replace('lbs', 'lb') : 'lb' }
    : { value: null, unit: null };
}

export const fmtRest = (sec: number | null) => (sec != null ? `${sec} sec` : '—');

export const parseRest = (text: string) => {
  const m = text.match(/\d+/);
  return m ? Number(m[0]) : null;
};

export const toExercise = (r: any): Exercise => ({
  id: r.id,
  name: r.name,
  sets: fmtSets(r.sets, r.reps),
  weight: fmtWeight(r.weight_value, r.weight_unit),
  rest: fmtRest(r.rest_seconds),
  i: r.icon || 'h',
  areas: r.target_areas || [],
  equipment: Array.isArray(r.equipment) ? r.equipment : undefined,
});

export function exerciseRow(e: Exercise) {
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

// Workout icon colours are saved as hex. The primary pink has changed over time (#E1699C, and for a while #D53181), so
// a workout saved with an earlier one shows today's, and still matches the pink in the colour picker.
export const OLD_PINKS = ['#E1699C', '#D53181'];

export const iconColorOf = (hex: string | null) => (hex && OLD_PINKS.includes(hex.toUpperCase()) ? colors.pink : hex);

// A workout's own target areas aren't set directly any more — they're whatever its exercises target, combined.
export const areasOf = (list: Exercise[]) => Array.from(new Set(list.flatMap((e) => e.areas || [])));

// Numbers as the screens hold them (a string, blank for none) and as the database does (a number, or null).
export const numStr = (v: number | null | undefined) => (v != null ? String(v) : '');

export const numOrNull = (v: string | undefined) => (v ? Number(v) : null);

// A ride's plan as workout columns.
export const rideCols = (ride: { dist: string; elev: string; zone: string }) => ({
  ride_distance_miles: numOrNull(ride.dist),
  ride_elevation_ft: numOrNull(ride.elev),
  ride_zone: ride.zone,
});

// A session marked complete or not.
export const completionCols = (completed: boolean) => ({
  status: completed ? 'completed' : 'planned',
  completed_at: completed ? new Date().toISOString() : null,
});

// A workout's fields as both the calendar's sessions and the Spellbook's list show them.
export function workoutView(w: any, exercises: Exercise[]) {
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
    stretch: !!w.is_stretch,
    ride: isRide ? { dist: numStr(w.ride_distance_miles), elev: numStr(w.ride_elevation_ft), zone: w.ride_zone || DEFAULT_ZONE } : undefined,
  };
}

// How long a lift of this many exercises is likely to take: about ten minutes each, at least twenty. A warm-up's or a
// stretch's exercises are quick ones, about two minutes each, at least five.
export function estimateMinutes(count: number, quick: boolean) {
  return quick ? Math.max(5, count * 2) : Math.max(20, count * 10);
}

// Names are compared ignoring case and the spaces around them, everywhere: "Leg day" is taken when "Leg Day" is.
export const nameKey = (name: string) => String(name).trim().toLowerCase();

// A name that isn't in `taken` (a set of nameKeys): the name itself, else numbered ("<name> 2", "<name> 3", ...)
// or marked as a copy ("<name> (copy)", "<name> (copy 2)", ...).
export function freeName(wanted: string, taken: Set<string>, style: 'number' | 'copy'): string {
  if (!taken.has(nameKey(wanted))) return wanted;
  const nth = (n: number) => (style === 'number' ? `${wanted} ${n}` : n === 1 ? `${wanted} (copy)` : `${wanted} (copy ${n})`);
  let n = style === 'number' ? 2 : 1;
  while (taken.has(nameKey(nth(n)))) n++;
  return nth(n);
}
