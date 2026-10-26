// Programs: making and changing them, their blocks and their own workouts, and running them on the calendar.

import { supabase } from '../supabase';
import { inWeek, runPlace, runSessions } from '@/frontend/shared/programs';
import type { BuiltinProgram, BuiltinWorkout, Exercise, Program, RidePlan } from './types';
import type { SharedProgram } from '@/frontend/shared/sharedProgram';
import { freeName, nameKey, rideCols } from './convert';
import { ok, insertExercises, isAhead, untouchedIds, SESSION_COLS } from './db';
import { deletePlanEntries } from './sessions';

/** A workout as a program holds it: everything but where it came from. */
export interface WorkoutCopy {
  name: string;
  isRide: boolean;
  minutes: number;
  ride: RidePlan | null;
  icon: string | null;
  iconColor: string | null;
  notes: string;
  warmup?: boolean;
  stretch?: boolean;
  yoga?: boolean;
  exercises: Exercise[];
}

/** A name none of the person's programs uses: the name itself, else numbered. */
async function freeProgramName(wanted: string) {
  const rows: any[] = await ok(supabase.from('programs').select('name'));
  return freeName(wanted.trim() || 'My program', new Set(rows.map((r) => nameKey(r.name))), 'number');
}

/** Puts a copy of a workout in a block, on these weekdays: in every week, or (a block that goes week by week) one. */
export async function addProgramWorkout(blockId: string, days: number[], w: WorkoutCopy, week: number | null = null) {
  const [row]: any[] = await ok(
    supabase
      .from('workouts')
      .insert({
        name: w.name,
        kind: w.isRide ? 'ride' : 'lift',
        duration_minutes: w.minutes,
        icon: w.icon,
        icon_color: w.iconColor,
        ...(w.ride ? rideCols(w.ride) : { ride_distance_miles: null, ride_elevation_ft: null, ride_zone: null }),
        repeat_enabled: false,
        notes: w.notes || null,
        ...(w.warmup ? { is_warmup: true } : {}),
        ...(w.stretch ? { is_stretch: true } : {}),
        ...(w.yoga ? { is_yoga: true } : {}),
        program_block_id: blockId,
        program_days: [...new Set(days)].sort((a, b) => a - b),
        ...(week != null ? { program_week: week } : {}),
      })
      .select('id'),
  );
  await insertExercises(row.id, w.exercises, 0);
  return row.id as string;
}

/** A new program with one block, for the person to fill. */
export async function createProgram(name: string) {
  const [p]: any[] = await ok(supabase.from('programs').insert({ name: await freeProgramName(name) }).select('id'));
  await ok(supabase.from('program_blocks').insert({ program_id: p.id, position: 0, name: 'Block 1', weeks: 4 }));
  return p.id as string;
}

/**
 * A program made from blocks of workout copies: a built-in one, a shared one, or a week of the calendar. Each block's
 * workouts are listed with the weekdays they fall on, and in a block that goes week by week, the week each is for.
 */
export async function createProgramFrom(
  name: string,
  notes: string,
  blocks: { name: string; weeks: number; byWeek?: boolean; workouts: { days: number[]; week?: number | null; workout: WorkoutCopy }[] }[],
) {
  const [p]: any[] = await ok(
    supabase.from('programs').insert({ name: await freeProgramName(name), notes: notes || '' }).select('id'),
  );
  for (let i = 0; i < blocks.length; i++) {
    const b = blocks[i];
    const [row]: any[] = await ok(
      supabase
        .from('program_blocks')
        .insert({ program_id: p.id, position: i, name: b.name || '', weeks: b.weeks, ...(b.byWeek ? { by_week: true } : {}) })
        .select('id'),
    );
    for (const x of b.workouts) if (x.days.length) await addProgramWorkout(row.id, x.days, x.workout, b.byWeek ? x.week ?? null : null);
  }
  return p.id as string;
}

/** A workout from the built-in catalog, as a copy. */
export const builtinCopy = (w: BuiltinWorkout): WorkoutCopy => ({
  name: w.name,
  isRide: false,
  minutes: w.minutes,
  ride: null,
  icon: w.icon,
  iconColor: null,
  notes: '',
  warmup: w.warmup,
  stretch: w.stretch,
  yoga: w.yoga,
  exercises: w.list,
});

/** A built-in program, copied into the person's own programs. */
export async function copyBuiltinProgram(bp: BuiltinProgram, catalog: BuiltinWorkout[]) {
  return createProgramFrom(
    bp.name,
    bp.notes,
    bp.blocks.map((b) => {
      const names = Array.from(new Set(b.days.flat()));
      return {
        name: b.name,
        weeks: b.weeks,
        workouts: names
          .map((n) => ({ w: catalog.find((x) => x.name === n), days: b.days.flatMap((list, d) => (list.includes(n) ? [d] : [])) }))
          .filter((x): x is { w: BuiltinWorkout; days: number[] } => !!x.w)
          .map((x) => ({ days: x.days, workout: builtinCopy(x.w) })),
      };
    }),
  );
}

export async function updateProgram(id: string, patch: { name?: string; notes?: string }) {
  const fields: Record<string, string> = {};
  if (patch.name != null && patch.name.trim()) fields.name = patch.name.trim().slice(0, 80);
  if (patch.notes != null) fields.notes = patch.notes;
  if (Object.keys(fields).length) await ok(supabase.from('programs').update(fields).eq('id', id));
}

export async function updateBlock(id: string, patch: { name?: string; weeks?: number }) {
  const fields: Record<string, unknown> = {};
  if (patch.name != null) fields.name = patch.name.slice(0, 40);
  if (patch.weeks != null) fields.weeks = Math.min(52, Math.max(1, Math.round(patch.weeks)));
  if (Object.keys(fields).length) await ok(supabase.from('program_blocks').update(fields).eq('id', id));
}

/** A program's workout as a copy: its fields and exercises, to put in another block. */
const copyOf = (w: Program['blocks'][number]['workouts'][number]): WorkoutCopy => ({
  name: w.name,
  isRide: w.kind === 'ride',
  minutes: w.minutes,
  ride: w.ride || null,
  icon: w.icon,
  iconColor: w.iconColor,
  notes: w.notes,
  warmup: w.warmup,
  stretch: w.stretch,
  yoga: w.yoga,
  exercises: w.list,
});

/** Adds a block at the end: empty, or a copy of `from` (its weeks, and copies of its workouts on the same days and weeks). */
export async function addBlock(program: Program, from: Program['blocks'][number] | null) {
  const position = program.blocks.reduce((max, b) => Math.max(max, b.position), -1) + 1;
  const [row]: any[] = await ok(
    supabase
      .from('program_blocks')
      .insert({
        program_id: program.id,
        position,
        name: 'Block ' + (program.blocks.length + 1),
        weeks: from ? from.weeks : 4,
        ...(from?.byWeek ? { by_week: true } : {}),
      })
      .select('id'),
  );
  if (from) for (const w of from.workouts) await addProgramWorkout(row.id, w.days, copyOf(w), w.week);
  return row.id as string;
}

// A program's workout leaves it archived, not deleted: the sessions already done with it keep it.
const archiveWorkouts = async (ids: string[]) => {
  if (ids.length) await ok(supabase.from('workouts').update({ archived: true, program_block_id: null }).in('id', ids));
};

/** Takes a block out of its program. Its workouts' sessions already on the calendar stay. */
export async function deleteBlock(block: Program['blocks'][number]) {
  await archiveWorkouts(block.workouts.map((w) => w.id));
  await ok(supabase.from('program_blocks').delete().eq('id', block.id));
}

/**
 * Puts a workout on a weekday of a block. One already in the block (by name) just takes the day too. A block that goes
 * week by week has the same days every week, so it goes in each week, a copy of its own in each.
 */
export async function addWorkoutToDay(block: Program['blocks'][number], day: number, w: WorkoutCopy) {
  for (const week of block.byWeek ? Array.from({ length: block.weeks }, (_, i) => i + 1) : [null]) {
    const same = block.workouts.find((x) => x.week === week && nameKey(x.name) === nameKey(w.name));
    if (same) {
      if (!same.days.includes(day))
        await ok(supabase.from('workouts').update({ program_days: [...same.days, day].sort((a, b) => a - b) }).eq('id', same.id));
    } else await addProgramWorkout(block.id, [day], w, week);
  }
}

/**
 * Takes a workout off one weekday of its block (in a block that goes week by week, off that day in every week); off
 * its last day, it leaves the program.
 */
export async function removeWorkoutFromDay(block: Program['blocks'][number], w: { id: string; name: string }, day: number) {
  const all = block.byWeek ? block.workouts.filter((x) => nameKey(x.name) === nameKey(w.name)) : block.workouts.filter((x) => x.id === w.id);
  const gone: string[] = [];
  for (const x of all) {
    const days = x.days.filter((d) => d !== day);
    if (days.length) await ok(supabase.from('workouts').update({ program_days: days }).eq('id', x.id));
    else gone.push(x.id);
  }
  await archiveWorkouts(gone);
}

/** A block as it is saved now (not as the screen last read it): its weeks, whether it goes week by week, its workouts. */
async function blockNow(blockId: string) {
  const [b]: any[] = await ok(supabase.from('program_blocks').select('weeks, by_week').eq('id', blockId));
  const rows: any[] = await ok(
    supabase.from('workouts').select('id, name, program_week').eq('program_block_id', blockId).eq('archived', false),
  );
  return {
    weeks: Number(b?.weeks) || 1,
    byWeek: !!b?.by_week,
    workouts: rows.map((w) => ({ id: w.id as string, name: w.name as string, week: (w.program_week ?? null) as number | null })),
  };
}

/**
 * Copies `from` (workouts as the screen has them, for their exercises) into each of `weeks`, leaving out any a week
 * already has (by name), so doing it twice copies nothing twice. The copies are made side by side.
 */
async function copyIntoWeeks(
  blockId: string,
  from: Program['blocks'][number]['workouts'],
  weeks: number[],
  have: { name: string; week: number | null }[],
) {
  await Promise.all(
    weeks.flatMap((week) =>
      from
        .filter((w) => !have.some((x) => x.week === week && nameKey(x.name) === nameKey(w.name)))
        .map((w) => addProgramWorkout(blockId, w.days, copyOf(w), week)),
    ),
  );
}

/**
 * Turns a block's weeks into their own (`on`), or back into one week repeated. Going week by week, each workout becomes
 * week 1's and is copied into every other week, so they all start out the same. Going back, week 1's stay for every
 * week and the other weeks' copies leave the program. Sessions ahead follow (see refollowRuns). Each step goes by the
 * block as it's saved now, so asking twice does it once.
 */
export async function setBlockByWeek(program: Program, block: Program['blocks'][number], on: boolean, todayIso: string) {
  const now = await blockNow(block.id);
  if (on) {
    const firsts = now.workouts.filter((w) => w.week == null);
    if (firsts.length) await ok(supabase.from('workouts').update({ program_week: 1 }).in('id', firsts.map((w) => w.id)));
    if (!now.byWeek) await ok(supabase.from('program_blocks').update({ by_week: true }).eq('id', block.id));
    const weekOne = block.workouts.filter((w) => w.week == null || w.week === 1);
    await copyIntoWeeks(block.id, weekOne, Array.from({ length: now.weeks - 1 }, (_, i) => i + 2), now.workouts);
  } else {
    if (!now.byWeek) return;
    const firsts = now.workouts.filter((w) => w.week === 1 || w.week == null);
    if (firsts.length) await ok(supabase.from('workouts').update({ program_week: null }).in('id', firsts.map((w) => w.id)));
    await archiveWorkouts(now.workouts.filter((w) => !firsts.includes(w)).map((w) => w.id));
    await ok(supabase.from('program_blocks').update({ by_week: false }).eq('id', block.id));
  }
  await refollowRuns(program.id, todayIso);
}

/**
 * Changes how many weeks a block has. Going week by week, a week added starts as a copy of the week before it, and a
 * week taken off takes its copies with it.
 */
export async function setBlockWeeks(program: Program, block: Program['blocks'][number], weeks: number, todayIso: string) {
  weeks = Math.min(52, Math.max(1, Math.round(weeks)));
  const now = await blockNow(block.id);
  await updateBlock(block.id, { weeks });
  if (!now.byWeek) return;
  if (weeks > now.weeks) {
    const last = block.workouts.filter((w) => w.week === Math.min(now.weeks, block.weeks));
    await copyIntoWeeks(block.id, last, Array.from({ length: weeks - now.weeks }, (_, i) => now.weeks + i + 1), now.workouts);
  } else await archiveWorkouts(now.workouts.filter((w) => (w.week ?? 0) > weeks).map((w) => w.id));
  await refollowRuns(program.id, todayIso);
}

/**
 * After a block's weeks change: each running session still ahead, and untouched, moves onto its workout's copy for
 * the week it falls in (matched by name), so week 2 of a run does week 2's workouts.
 */
async function refollowRuns(programId: string, todayIso: string) {
  const runs: any[] = await ok(supabase.from('program_runs').select('id, start_date, start_block').eq('program_id', programId).is('ended_at', null));
  if (!runs.length) return;
  const blockRows: any[] = await ok(supabase.from('program_blocks').select('id, name, weeks, position').eq('program_id', programId));
  blockRows.sort((a, b) => a.position - b.position);
  const copies: any[] = blockRows.length
    ? await ok(supabase.from('workouts').select('*').in('program_block_id', blockRows.map((b) => b.id)).eq('archived', false))
    : [];
  const blocks = blockRows.map((b) => ({
    name: b.name || '',
    weeks: Number(b.weeks) || 1,
    workouts: copies
      .filter((w) => w.program_block_id === b.id)
      .map((w) => ({ id: w.id as string, name: w.name as string, days: (w.program_days || []).map(Number), week: w.program_week ?? null })),
  }));
  for (const run of runs) {
    const rows: any[] = await ok(
      supabase.from('plan_entries').select(SESSION_COLS + ', workout_id').eq('program_run_id', run.id).gte('scheduled_date', todayIso),
    );
    const free = new Set(await untouchedIds(rows.filter((r) => isAhead(r, todayIso))));
    const open = rows.filter((r) => free.has(r.id));
    if (!open.length) continue;
    const names: any[] = await ok(supabase.from('workouts').select('id, name').in('id', [...new Set(open.map((r) => r.workout_id))]));
    const nameOf: Record<string, string> = {};
    names.forEach((w) => (nameOf[w.id] = w.name));
    const onto: Record<string, string[]> = {};
    open.forEach((r) => {
      const at = runPlace(blocks, run.start_date, Number(run.start_block) || 0, r.scheduled_date);
      const copy =
        at && blocks[at.block].workouts.find((w) => inWeek(w, at.week) && nameKey(w.name) === nameKey(nameOf[r.workout_id] || ''));
      if (copy && copy.id !== r.workout_id) (onto[copy.id] = onto[copy.id] || []).push(r.id);
    });
    for (const [workoutId, ids] of Object.entries(onto)) await ok(supabase.from('plan_entries').update({ workout_id: workoutId }).in('id', ids));
  }
}

/** What a run keeps of its program, as it was when it started: its name and a snapshot (see share.ts). */
export type RunKeep = { name: string; snapshot: SharedProgram | null };

/**
 * A new run. What it keeps of its program goes with it once the program history migration has run; before then the
 * columns aren't there, and it's made without them.
 */
async function insertRun(fields: Record<string, unknown>, keep: RunKeep | null): Promise<string> {
  if (keep) {
    const { data, error } = await supabase
      .from('program_runs')
      .insert({ ...fields, program_name: keep.name.slice(0, 80), snapshot: keep.snapshot })
      .select('id');
    if (!error) return (data as any[])[0].id;
    if (error.code !== 'PGRST204' && error.code !== '42703') throw new Error(error.message);
  }
  const [run]: any[] = await ok(supabase.from('program_runs').insert(fields).select('id'));
  return run.id;
}

/** A program's blocks as starting it needs them: their weeks, and their workouts' weekdays. */
type Runnable = { id: string; blocks: { name: string; weeks: number; workouts: { id: string; days: number[]; week?: number | null }[] }[] };

/** Starts a program: every block from `startBlock` on the calendar from `startIso`, leaving out days gone by. */
export async function startProgram(program: Runnable, startIso: string, startBlock: number, todayIso: string, keep: RunKeep | null = null) {
  const run = { id: await insertRun({ program_id: program.id, start_date: startIso, start_block: startBlock }, keep) };
  const sessions = runSessions(
    program.blocks.map((b) => ({ name: b.name, weeks: b.weeks, workouts: b.workouts.map((w) => ({ id: w.id, days: w.days, week: w.week })) })),
    startIso,
    startBlock,
  ).filter((s) => s.date >= todayIso);
  if (sessions.length)
    await ok(
      supabase.from('plan_entries').insert(
        sessions.map((s) => ({ workout_id: s.workoutId, scheduled_date: s.date, status: 'planned', program_run_id: run.id })),
      ),
    );
  return { runId: run.id as string, first: sessions[0]?.date ?? null, count: sessions.length };
}

/**
 * Moves a run to start on another day: its sessions still ahead come off and go back on from the new start, leaving
 * out days gone by and any day it already has a session it keeps (done, started or written about), which stay put.
 */
export async function moveRun(program: Runnable, run: { id: string; startBlock: number }, startIso: string, todayIso: string) {
  const rows: any[] = await ok(
    supabase.from('plan_entries').select(SESSION_COLS + ', workout_id').eq('program_run_id', run.id).gte('scheduled_date', todayIso),
  );
  const free = new Set(await untouchedIds(rows.filter((r) => isAhead(r, todayIso))));
  await deletePlanEntries([...free]);
  const kept = new Set(rows.filter((r) => !free.has(r.id)).map((r) => r.workout_id + '|' + r.scheduled_date));
  await ok(supabase.from('program_runs').update({ start_date: startIso }).eq('id', run.id));
  const sessions = runSessions(
    program.blocks.map((b) => ({ name: b.name, weeks: b.weeks, workouts: b.workouts.map((w) => ({ id: w.id, days: w.days, week: w.week })) })),
    startIso,
    run.startBlock,
  ).filter((s) => s.date >= todayIso && !kept.has(s.workoutId + '|' + s.date));
  if (sessions.length)
    await ok(
      supabase
        .from('plan_entries')
        .insert(sessions.map((s) => ({ workout_id: s.workoutId, scheduled_date: s.date, status: 'planned', program_run_id: run.id }))),
    );
  return { first: sessions[0]?.date ?? null, count: sessions.length };
}

/** Ends a run: its sessions still ahead come off the calendar; anything done, started or written about stays. */
export async function endRun(runId: string, todayIso: string) {
  const rows: any[] = await ok(
    supabase.from('plan_entries').select(SESSION_COLS).eq('program_run_id', runId).gte('scheduled_date', todayIso),
  );
  await deletePlanEntries(await untouchedIds(rows.filter((r) => isAhead(r, todayIso))));
  await ok(supabase.from('program_runs').update({ ended_at: new Date().toISOString() }).eq('id', runId));
}

/**
 * Deletes a program: its runs end, its workouts are archived (history keeps them), and its link stops working. Runs
 * that kept the program as it was stay, for the Profile's history (the database lets go of their program); one from
 * before runs kept it has nothing to show without it, and goes.
 */
export async function deleteProgram(program: Program, runIds: string[], todayIso: string) {
  for (const id of runIds) await endRun(id, todayIso);
  await archiveWorkouts(program.blocks.flatMap((b) => b.workouts.map((w) => w.id)));
  await ok(supabase.from('shared_programs').delete().eq('program_id', program.id));
  const runs: any[] = await ok(supabase.from('program_runs').select('*').eq('program_id', program.id));
  const bare = runs.filter((r) => !r.snapshot).map((r) => r.id);
  if (bare.length) await ok(supabase.from('program_runs').delete().in('id', bare));
  await ok(supabase.from('program_blocks').delete().eq('program_id', program.id));
  await ok(supabase.from('programs').delete().eq('id', program.id));
}

/**
 * A program made from what's left of the workouts repeating on the calendar. Its blocks hold copies of them. Then either
 * the sessions left become its run from `start` (`keep`: tagged with it, following its copies from now on, and the days
 * a workout ending sooner misses are added, unless `taken` has that workout on that day already), or they come off and
 * it starts afresh from `freshStart`. `endSeries` turns off the weekly repeats of the workouts it was made from.
 */
export async function programFromCalendar(o: {
  name: string;
  blocks: { name: string; weeks: number; workouts: { days: number[]; workout: WorkoutCopy }[] }[];
  start: string;
  sessions: { id: string; iso: string; name: string }[];
  taken: string[];
  seriesWorkouts: string[];
  keep: boolean;
  freshStart: string;
  endSeries: boolean;
  todayIso: string;
  snapshot: SharedProgram | null;
}) {
  const programId = await createProgramFrom(o.name, '', o.blocks);
  const blockRows: any[] = await ok(supabase.from('program_blocks').select('id, name, weeks, position').eq('program_id', programId));
  blockRows.sort((a, b) => a.position - b.position);
  const copies: any[] = blockRows.length
    ? await ok(supabase.from('workouts').select('id, name, program_block_id, program_days').in('program_block_id', blockRows.map((b) => b.id)))
    : [];
  const blocks = blockRows.map((b) => ({
    name: b.name || '',
    weeks: Number(b.weeks) || 1,
    workouts: copies.filter((w) => w.program_block_id === b.id).map((w) => ({ id: w.id as string, name: w.name as string, days: (w.program_days || []).map(Number) })),
  }));

  if (o.endSeries && o.seriesWorkouts.length) await ok(supabase.from('workouts').update({ repeat_enabled: false }).in('id', o.seriesWorkouts));

  const rows: any[] = o.sessions.length ? await ok(supabase.from('plan_entries').select(SESSION_COLS).in('id', o.sessions.map((s) => s.id))) : [];
  const free = new Set(await untouchedIds(rows.filter((r) => isAhead(r, o.todayIso))));

  if (!o.keep) {
    await deletePlanEntries([...free]);
    const r = await startProgram({ id: programId, blocks }, o.freshStart, 0, o.todayIso, { name: o.name, snapshot: o.snapshot });
    return { programId, count: r.count, first: r.first };
  }

  const run = { id: await insertRun({ program_id: programId, start_date: o.start, start_block: 0 }, { name: o.name, snapshot: o.snapshot }) };
  // Those still ahead move onto the program's copy for their block; the rest are only tagged.
  const onto: Record<string, string[]> = {};
  const tagOnly: string[] = [];
  o.sessions.forEach((s) => {
    const at = runPlace(blocks, o.start, 0, s.iso);
    const copy = at && blocks[at.block].workouts.find((w) => w.name === s.name);
    if (copy && free.has(s.id)) (onto[copy.id] = onto[copy.id] || []).push(s.id);
    else tagOnly.push(s.id);
  });
  for (const [workoutId, ids] of Object.entries(onto))
    await ok(supabase.from('plan_entries').update({ workout_id: workoutId, program_run_id: run.id }).in('id', ids));
  if (tagOnly.length) await ok(supabase.from('plan_entries').update({ program_run_id: run.id }).in('id', tagOnly));
  // Every workout runs to the end: the days it has nothing on yet, from today on, are added.
  const taken = new Set(o.taken);
  const names: Record<string, string> = {};
  copies.forEach((w) => (names[w.id] = w.name));
  const missing = runSessions(blocks, o.start, 0).filter((s) => s.date >= o.todayIso && !taken.has(names[s.workoutId] + '|' + s.date));
  if (missing.length)
    await ok(
      supabase
        .from('plan_entries')
        .insert(missing.map((s) => ({ workout_id: s.workoutId, scheduled_date: s.date, status: 'planned', program_run_id: run.id }))),
    );
  return { programId, count: o.sessions.length + missing.length, first: null as string | null };
}
