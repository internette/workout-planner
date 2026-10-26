// A program's weeks on the calendar: a run starts on a date and goes through its blocks in order, from the block it
// started at. Its week 1 is the seven days from the start; each workout falls on its weekdays within each week.

import { isoOf } from './helpers';

// A workout with a week is that week's own copy (in a block that goes week by week); one without is in every week.
type Blocks = { name: string; weeks: number; workouts?: { id: string; days: number[]; week?: number | null }[] }[];

const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
const addDays = (d: Date, n: number) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);

/** How many weeks a run lasts: its blocks from `startBlock` on. */
export const runWeeks = (blocks: Blocks, startBlock: number) =>
  blocks.slice(startBlock).reduce((sum, b) => sum + b.weeks, 0);

/** A run's last day. */
export const runEnd = (blocks: Blocks, startIso: string, startBlock: number) =>
  isoOf(addDays(fromIso(startIso), Math.max(1, runWeeks(blocks, startBlock)) * 7 - 1));

/** Where a date falls in a run: its block, and the week within it (1 = the first). Null outside the run. */
export function runPlace(blocks: Blocks, startIso: string, startBlock: number, iso: string) {
  const days = Math.round((fromIso(iso).getTime() - fromIso(startIso).getTime()) / 86400000);
  if (days < 0) return null;
  let week = Math.floor(days / 7);
  for (let b = startBlock; b < blocks.length; b++) {
    if (week < blocks[b].weeks) return { block: b, name: blocks[b].name, week: week + 1, weeks: blocks[b].weeks };
    week -= blocks[b].weeks;
  }
  return null;
}

/** Each block's dates in a run: when it starts and ends. */
export function runBlockDates(blocks: Blocks, startIso: string, startBlock: number) {
  let at = fromIso(startIso);
  return blocks.slice(startBlock).map((b) => {
    const from = at;
    at = addDays(at, b.weeks * 7);
    return { name: b.name, from, to: addDays(at, -1) };
  });
}

/** Whether a block's workout is in its week `week` (1 = the first). */
export const inWeek = (w: { week?: number | null }, week: number) => w.week == null || w.week === week;

/** How many sessions a block puts on the calendar: each workout on each of its weekdays, in each week it's in. */
export const blockSessions = (b: { weeks: number; workouts: { days: number[]; week?: number | null }[] }) =>
  b.workouts.reduce((n, w) => n + w.days.length * (w.week == null ? b.weeks : 1), 0);

/** Every session a run puts on the calendar: each workout on each of its weekdays, week by week. */
export function runSessions(blocks: Blocks, startIso: string, startBlock: number) {
  const out: { workoutId: string; date: string }[] = [];
  let week0 = fromIso(startIso);
  for (let b = startBlock; b < blocks.length; b++) {
    for (let w = 0; w < blocks[b].weeks; w++) {
      for (let i = 0; i < 7; i++) {
        const day = addDays(week0, w * 7 + i);
        (blocks[b].workouts || []).forEach((x) => {
          if (inWeek(x, w + 1) && x.days.includes(day.getDay())) out.push({ workoutId: x.id, date: isoOf(day) });
        });
      }
    }
    week0 = addDays(week0, blocks[b].weeks * 7);
  }
  return out.sort((a, b) => (a.date < b.date ? -1 : a.date > b.date ? 1 : 0));
}

/** How many days a week a block has a workout on. */
export const blockDays = (b: { workouts: { days: number[] }[] }) => new Set(b.workouts.flatMap((w) => w.days)).size;

type ModelLike = {
  workouts: { id: string }[];
  programs: { id: string; blocks: { id: string; workouts: { id: string }[] }[] }[];
};

/** The program, block and workout a program's workout id belongs to, or null for any other workout. */
export function programOfWorkout<M extends ModelLike>(model: M, id: string) {
  for (const program of model.programs || [])
    for (const block of program.blocks) {
      const workout = block.workouts.find((w) => w.id === id);
      if (workout)
        return { program, block, workout } as {
          program: M['programs'][number];
          block: M['programs'][number]['blocks'][number];
          workout: M['programs'][number]['blocks'][number]['workouts'][number];
        };
    }
  return null;
}

/** Where a program's session is: "Build, week 2 of 3", or in a program of one block "Week 2 of 8". */
export const programPlace = (p: { block: string; week: number; weeks: number }) =>
  p.block ? p.block + ', week ' + p.week + ' of ' + p.weeks : 'Week ' + p.week + ' of ' + p.weeks;
