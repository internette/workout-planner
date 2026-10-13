// Sharing a program behind a link, and copying one someone shared (shared/sharedProgram.ts has what one is).

import { supabase } from '../supabase';
import { isoOf } from '@/frontend/shared/helpers';
import { newShareId, daysOf, blockWorkouts, SHARE_LIMITS, type SharedProgram, type SharedWorkout } from '@/frontend/shared/sharedProgram';
import type { Entry, Exercise, Model, Program } from './types';
import { ok, okOr } from './db';
import { createProgramFrom, type WorkoutCopy } from './programs';

export interface MyShare {
  id: string;
  name: string;
  opens: number;
  updatedAt: string;
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

/** A program as it is now, to share: its blocks and their workouts. Notes only when included; the name only when shown. */
export function programSnapshot(program: Program, o: { notes: boolean; by: string | null }): SharedProgram {
  const workouts: SharedWorkout[] = [];
  const blocks = program.blocks.map((b) => {
    const days: number[][] = Array.from({ length: 7 }, () => []);
    b.workouts.forEach((w) => {
      if (workouts.length >= SHARE_LIMITS.workouts) return;
      const ix = workouts.length;
      workouts.push({
        name: w.name,
        kind: w.kind,
        minutes: w.minutes,
        icon: w.icon || (w.kind === 'ride' ? 'bike' : 'h'),
        iconColor: w.iconColor,
        notes: o.notes ? w.notes || '' : '',
        warmup: w.warmup,
        stretch: w.stretch,
        yoga: w.yoga,
        ride: w.ride ? { dist: w.ride.dist, elev: w.ride.elev, zone: w.ride.zone } : null,
        exercises: w.kind === 'ride' ? [] : w.list.slice(0, SHARE_LIMITS.exercises).map(plain),
      });
      w.days.forEach((d) => days[d].push(ix));
    });
    return { name: b.name, weeks: b.weeks, days };
  });
  return { v: 2, by: o.by, workouts, blocks };
}

/** A program made of workout copies (one from the calendar, before it's saved), in the shared format: what a run keeps. */
export function copiesSnapshot(blocks: { name: string; weeks: number; workouts: { days: number[]; workout: WorkoutCopy }[] }[]): SharedProgram {
  const workouts: SharedWorkout[] = [];
  return {
    v: 2,
    by: null,
    workouts,
    blocks: blocks.map((b) => {
      const days: number[][] = Array.from({ length: 7 }, () => []);
      b.workouts.forEach(({ days: on, workout: w }) => {
        if (workouts.length >= SHARE_LIMITS.workouts) return;
        const ix =
          workouts.push({
            name: w.name,
            kind: w.isRide ? 'ride' : 'lift',
            minutes: w.minutes,
            icon: w.icon || (w.isRide ? 'bike' : 'h'),
            iconColor: w.iconColor,
            notes: w.notes || '',
            warmup: !!w.warmup,
            stretch: !!w.stretch,
            yoga: !!w.yoga,
            ride: w.ride,
            exercises: w.isRide ? [] : w.exercises.slice(0, SHARE_LIMITS.exercises).map(plain),
          }) - 1;
        on.forEach((d) => days[d].push(ix));
      });
      return { name: b.name, weeks: b.weeks, days };
    }),
  };
}

/** A session's workout as a copy for a program: its fields, and its exercises as they are now. */
export function entryCopy(model: Model, av: Entry): WorkoutCopy {
  const saved = model.workouts.find((w) => w.id === av.workoutId);
  return {
    name: av.name,
    isRide: !!av.ride,
    minutes: saved?.minutes ?? (av.ride ? Number(av.ride.hrs || 0) * 60 + Number(av.ride.mins || 0) : 45),
    ride: av.ride ? { dist: av.ride.dist, elev: av.ride.elev, zone: av.ride.zone } : null,
    icon: av.icon || (av.ride ? 'bike' : 'h'),
    iconColor: av.iconColor,
    notes: av.notes || '',
    warmup: av.warmup,
    stretch: av.stretch,
    yoga: av.yoga,
    exercises: av.ride ? [] : model.EXV[av.exKey] || [],
  };
}

/** The week from `start` (a Sunday) as one block: every workout on its days, with its exercises as they are now. */
export function weekBlock(model: Model, start: Date) {
  const workouts: { days: number[]; workout: WorkoutCopy }[] = [];
  const at: Record<string, number> = {};
  for (let d = 0; d < 7; d++) {
    const iso = isoOf(new Date(start.getFullYear(), start.getMonth(), start.getDate() + d));
    model.entries
      .filter((x) => x.iso === iso)
      .forEach(({ av }) => {
        // The same workout on several days is one workout in the block, on each of them; an edited session (its own
        // version) is its own.
        const key = av.exKey;
        if (at[key] == null) {
          at[key] = workouts.length;
          workouts.push({ days: [], workout: entryCopy(model, av) });
        }
        if (!workouts[at[key]].days.includes(d)) workouts[at[key]].days.push(d);
      });
  }
  return workouts;
}

/** What a link belongs to: one of the person's programs, or a run of one (the program as it was then). */
export type ShareTarget = { programId: string } | { runId: string };
const targetCol = (t: ShareTarget) => ('runId' in t ? { col: 'run_id', id: t.runId } : { col: 'program_id', id: t.programId });

/** The link a program (or a run) is shared at, if any. Before the migrations have run, none. */
export async function myShare(target: ShareTarget): Promise<MyShare | null> {
  const { col, id } = targetCol(target);
  const rows = await okOr<any[]>(supabase.from('shared_programs').select('id, name, opens, updated_at').eq(col, id).limit(1), []);
  const r = rows[0];
  return r ? { id: r.id, name: r.name, opens: r.opens, updatedAt: r.updated_at } : null;
}

/** Shares a program, or updates its link (the same link) to show it as it is now. */
export async function shareProgram(target: ShareTarget, name: string, program: SharedProgram, existing: string | null): Promise<MyShare> {
  const { col, id } = targetCol(target);
  const fields = { name: name.trim().slice(0, SHARE_LIMITS.name), program, updated_at: new Date().toISOString() };
  const [r]: any[] = existing
    ? await ok(supabase.from('shared_programs').update(fields).eq('id', existing).select('id, name, opens, updated_at'))
    : await ok(
        supabase
          .from('shared_programs')
          .insert({ id: newShareId(), [col]: id, ...fields })
          .select('id, name, opens, updated_at'),
      );
  return { id: r.id, name: r.name, opens: r.opens, updatedAt: r.updated_at };
}

/** Turns a link off. */
export async function stopSharing(id: string) {
  await ok(supabase.from('shared_programs').delete().eq('id', id));
}

/** A shared program, copied into the person's own programs: its blocks, and its workouts as the program's own. */
export async function copySharedProgram(name: string, program: SharedProgram) {
  return createProgramFrom(
    name,
    '',
    program.blocks.map((b) => ({
      name: b.name,
      weeks: b.weeks,
      workouts: blockWorkouts(b).map((ix) => {
        const w = program.workouts[ix];
        return {
          days: daysOf(b, ix),
          workout: {
            name: w.name,
            isRide: w.kind === 'ride',
            minutes: w.minutes,
            ride: w.ride,
            icon: w.icon,
            iconColor: w.iconColor,
            notes: w.notes,
            warmup: w.warmup,
            stretch: w.stretch,
            yoga: w.yoga,
            exercises: w.exercises,
          },
        };
      }),
    })),
  );
}
