// Where to begin: the built-in program that best fits what someone said in "Customize your experience".
import { EQUIPMENT } from '@/frontend/shared/constants';
import { kitOfAll } from '@/frontend/shared/equipment';
import type { BuiltinProgram, BuiltinWorkout, Profile } from '@/frontend/data/plannerData';

export interface Suggestion {
  program: BuiltinProgram;
  /** What it needs, in the app's order; empty is no equipment. */
  need: string[];
  /** Training days in its busiest week. */
  days: number;
  /** About how long its workouts are, on average. */
  minutes: number;
  /** Its first week, Sunday first: the workout on each day, or none. */
  week: (BuiltinWorkout | null)[];
}

/**
 * The built-in program to suggest, or null when none fits. Every one so far is lifting, so someone who doesn't lift
 * gets none, and one that needs equipment they don't have is out. Of the rest, the nearest in days a week, then in
 * length, wins.
 */
export function suggestProgram(p: Pick<Profile, 'trains' | 'equipment' | 'days' | 'minutes'>, programs: BuiltinProgram[], catalog: BuiltinWorkout[]): Suggestion | null {
  if (!p.trains.includes('lift')) return null;
  const have = p.equipment;
  const shown = programs.map((program): Suggestion => {
    const names = Array.from(new Set(program.blocks.flatMap((b) => b.days.flat())));
    const workouts = names.map((n) => catalog.find((w) => w.name === n)).filter((w): w is BuiltinWorkout => !!w);
    const { need } = kitOfAll(workouts.flatMap((w) => w.list));
    return {
      program,
      need: EQUIPMENT.filter((x) => need.includes(x)),
      days: Math.max(0, ...program.blocks.map((b) => b.days.filter((d) => d.length).length)),
      minutes: workouts.length ? Math.round(workouts.reduce((s, w) => s + w.minutes, 0) / workouts.length) : 0,
      week: (program.blocks[0]?.days ?? []).map((d) => catalog.find((w) => w.name === d[0]) ?? null),
    };
  });
  const fits = shown.filter((s) => have == null || s.need.every((x) => have.includes(x)));
  const score = (s: Suggestion) => Math.abs(s.days - (p.days.length || s.days)) * 30 + Math.abs(s.minutes - (p.minutes ?? s.minutes));
  return fits.sort((a, b) => score(a) - score(b))[0] ?? null;
}
