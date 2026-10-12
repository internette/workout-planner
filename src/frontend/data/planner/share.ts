// Sharing a week as a program, and copying one someone shared (shared/sharedProgram.ts has what one is).

import { supabase } from '../supabase';
import { isoOf } from '@/frontend/shared/helpers';
import { planDays } from '@/frontend/shared/schedule';
import { newShareId, daysOf, SHARE_LIMITS, type SharedProgram, type SharedWorkout } from '@/frontend/shared/sharedProgram';
import type { Exercise, Model } from './types';
import { freeName, nameKey } from './convert';
import { ok, okOr, takenWorkoutNames } from './db';
import { createWorkout } from './workouts';

export interface MyShare {
  id: string;
  name: string;
  opens: number;
  updatedAt: string;
}

/**
 * The week from `start` (a Sunday) as a program: every workout on its days, once each however often it falls, with its
 * exercises as they are now. Notes only when they're included; the name only when it's shown.
 */
export function weekProgram(model: Model, start: Date, o: { notes: boolean; by: string | null }): SharedProgram {
  const workouts: SharedWorkout[] = [];
  const at: Record<string, number> = {};
  const days: number[][] = Array.from({ length: 7 }, () => []);
  for (let d = 0; d < 7; d++) {
    const iso = isoOf(new Date(start.getFullYear(), start.getMonth(), start.getDate() + d));
    model.entries
      .filter((x) => x.iso === iso)
      .forEach(({ av }) => {
        // The same workout on several days is one workout in the program, on each of them; an edited session (its
        // own version, exKey name#id) is its own.
        const key = av.exKey;
        if (at[key] == null && workouts.length < SHARE_LIMITS.workouts) {
          const saved = model.workouts.find((w) => w.id === av.workoutId);
          at[key] = workouts.length;
          workouts.push({
            name: av.name,
            kind: av.ride ? 'ride' : 'lift',
            minutes: saved?.minutes ?? (av.ride ? Number(av.ride.hrs || 0) * 60 + Number(av.ride.mins || 0) : 45),
            icon: av.icon || (av.ride ? 'bike' : 'h'),
            iconColor: av.iconColor,
            notes: o.notes ? av.notes || '' : '',
            warmup: av.warmup,
            stretch: av.stretch,
            yoga: av.yoga,
            ride: av.ride ? { dist: av.ride.dist, elev: av.ride.elev, zone: av.ride.zone } : null,
            exercises: av.ride ? [] : (model.EXV[key] || []).slice(0, SHARE_LIMITS.exercises).map(plain),
          });
        }
        if (at[key] != null && !days[d].includes(at[key])) days[d].push(at[key]);
      });
  }
  return { v: 1, by: o.by, workouts, days };
}

const plain = (e: Exercise) => ({
  name: e.name,
  sets: e.sets,
  weight: e.weight,
  ...(e.band ? { band: e.band } : {}),
  rest: e.rest,
  i: e.i,
  areas: e.areas || [],
  ...(e.equipment !== undefined ? { equipment: e.equipment } : {}),
});

/** The program this person is sharing, if any. Before the migration has run, none. */
export async function myShare(): Promise<MyShare | null> {
  const rows = await okOr<any[]>(supabase.from('shared_programs').select('id, name, opens, updated_at').limit(1), []);
  const r = rows[0];
  return r ? { id: r.id, name: r.name, opens: r.opens, updatedAt: r.updated_at } : null;
}

/** Shares a program, or replaces the one already shared (same link). */
export async function shareProgram(name: string, program: SharedProgram, existing: string | null): Promise<MyShare> {
  const fields = { name: name.trim().slice(0, SHARE_LIMITS.name), program, updated_at: new Date().toISOString() };
  const [r]: any[] = existing
    ? await ok(supabase.from('shared_programs').update(fields).eq('id', existing).select('id, name, opens, updated_at'))
    : await ok(supabase.from('shared_programs').insert({ id: newShareId(), ...fields }).select('id, name, opens, updated_at'));
  return { id: r.id, name: r.name, opens: r.opens, updatedAt: r.updated_at };
}

/** Turns the link off: the program is deleted. */
export async function stopSharing(id: string) {
  await ok(supabase.from('shared_programs').delete().eq('id', id));
}

/** What each workout will be called once copied: its own name, or numbered when the person already has one by it. */
export async function copyNames(program: SharedProgram): Promise<string[]> {
  const taken = await takenWorkoutNames();
  return program.workouts.map((w) => {
    const name = freeName(w.name, taken, 'number');
    taken.add(nameKey(name));
    return name;
  });
}

/**
 * Copies a program into the person's Spellbook: each workout as a new one of theirs. With `calendar`, each also goes on
 * its weekdays for that many weeks from `start`. Days already gone by are left out.
 */
export async function copyProgram(program: SharedProgram, calendar: { start: Date; weeks: number } | null, today: Date) {
  let first: string | null = null;
  for (let ix = 0; ix < program.workouts.length; ix++) {
    const w = program.workouts[ix];
    const days = daysOf(program, ix);
    const dates =
      calendar && days.length
        ? planDays({ start: calendar.start, days, repeat: true, weeks: calendar.weeks, today, has: () => false })
            .dates.filter((d) => d >= today || isoOf(d) === isoOf(today))
            .map(isoOf)
        : [];
    if (dates.length && (!first || dates[0] < first)) first = dates[0];
    await createWorkout({
      name: w.name,
      isRide: w.kind === 'ride',
      durationMinutes: w.minutes,
      ride: w.ride,
      icon: w.icon,
      iconColor: w.iconColor,
      exercises: w.exercises,
      dates,
      repeatDays: dates.length ? days : [],
      notes: w.notes,
      warmup: w.warmup,
      stretch: w.stretch,
      yoga: w.yoga,
    });
  }
  return { first };
}
