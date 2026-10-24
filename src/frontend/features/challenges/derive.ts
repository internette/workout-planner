import { TARGET_AREAS } from '@/frontend/shared/constants';
import { idOf } from '@/frontend/shared/helpers';
import { setsIn } from '@/frontend/features/session/sets';
import type { CalendarCtx } from '@/frontend/features/planner/store/types';
import type { Entry } from '@/frontend/data/plannerData';

// Weekly challenges: three goals each Sunday-to-Saturday week, taken from that week's own plan (the sets of one body
// area it schedules, the miles of its runs or rides, the days it has workouts on...). Doing what's planned clears
// them, each for CHALLENGE_XP, and all three for CHALLENGE_BONUS more. Like XP, they're worked out again from the
// calendar each time, so they follow the plan as it changes.

export const CHALLENGE_XP = 75;
export const CHALLENGE_BONUS = 75;
// The first week with challenges: the week they arrived (Sunday, Oct 18 2026). Weeks before it pay nothing, so no
// account's XP jumps when they ship.
export const CHALLENGES_FROM = Math.round(Date.UTC(2026, 9, 18) / 864e5);

export type ChallengeKind = 'area' | 'run' | 'ride' | 'workouts' | 'days' | 'calm' | 'sets';
export type Challenge = {
  kind: ChallengeKind;
  /** The body area, for an 'area' challenge. */
  area?: string;
  target: number;
  done: number;
  /** The day it was cleared, or null while it's still open. */
  clearedOn: number | null;
};
export type ChallengeWeek = { start: number; list: Challenge[]; cleared: number; full: boolean; xp: number };

/** The Sunday a day number falls in the week of (day 0, Jan 1 1970, was a Thursday). */
export const weekOf = (day: number) => day - ((((day + 4) % 7) + 7) % 7);

// A small hash of the week, so its picks are the same on every device and change from week to week.
const seedOf = (n: number) => {
  let h = (n * 2654435761) >>> 0;
  h ^= h >>> 13;
  return Math.imul(h, 1274126177) >>> 0;
};

const miles = (s: string) => parseFloat(String(s || '').replace(/[^\d.]/g, '')) || 0;
const tenth = (n: number) => Math.round(n * 10) / 10;

/** Every week's challenges from CHALLENGES_FROM up to today's week, oldest first, with what's been done up to today. */
export function challengeStage(ctx: CalendarCtx) {
  const { logic, st, Y, TODAY_M, TODAY_D, instList, isDoneEntry, distOf } = ctx;
  const dayNum = (m: number, d: number) => Math.round(Date.UTC(Y, m, d) / 864e5);
  const today = dayNum(TODAY_M, TODAY_D);
  const byWeek = new Map<number, { day: number; av: Entry }[]>();
  logic.model.entries.forEach((x) => {
    const day = dayNum(x.m, x.d);
    const w = weekOf(day);
    if (w < CHALLENGES_FROM || w > weekOf(today)) return;
    if (!byWeek.has(w)) byWeek.set(w, []);
    byWeek.get(w)!.push({ day, av: x.av });
  });
  // An exercise's sets as the session has them (its own edits included), and whether it's ticked off.
  const exercisesOf = (av: Entry) => {
    const id = idOf(av);
    const ticked = (st.done || {})[id] || [];
    return instList(av.exKey, id).map((e) => ({
      areas: e.areas || [],
      sets: setsIn({ sets: ((st.fields || {})[id + '|' + e.name] || {}).sets ?? e.sets }),
      ticked: ticked.includes(e.name),
    }));
  };
  const weekFor = (start: number, sessions: { day: number; av: Entry }[]): ChallengeWeek => {
    sessions = sessions.slice().sort((a, b) => a.day - b.day);
    // How much of a thing the week plans, and how much of it each day did (only days up to today can count).
    type Tally = { plan: number; byDay: Map<number, number> };
    const tallies = new Map<string, Tally>();
    const add = (key: string, plan: number, day: number, did: number) => {
      if (!tallies.has(key)) tallies.set(key, { plan: 0, byDay: new Map() });
      const t = tallies.get(key)!;
      t.plan += plan;
      if (did > 0 && day <= today) t.byDay.set(day, (t.byDay.get(day) || 0) + did);
    };
    const daysPlanned = new Set<number>();
    const daysDone = new Set<number>();
    sessions.forEach(({ day, av }) => {
      const done = isDoneEntry(av);
      daysPlanned.add(day);
      add('workouts', 1, day, done ? 1 : 0);
      if (done && !daysDone.has(day)) {
        daysDone.add(day);
        add('days', 0, day, 1);
      }
      if (av.yoga || av.stretch) add('calm', 1, day, done ? 1 : 0);
      if (av.ride) {
        add(av.ride.run ? 'run' : 'ride', miles(av.ride.dist), day, done ? miles(distOf(av)) : 0);
        return;
      }
      exercisesOf(av).forEach((e) => {
        add('sets', e.sets, day, e.ticked ? e.sets : 0);
        e.areas.forEach((a) => add('area:' + a, e.sets, day, e.ticked ? e.sets : 0));
      });
    });
    if (tallies.has('days')) tallies.get('days')!.plan = daysPlanned.size;
    else if (daysPlanned.size) tallies.set('days', { plan: daysPlanned.size, byDay: new Map() });
    const seed = seedOf(start);
    const pickOf = <T,>(xs: T[], salt: number) => xs[(seed + salt) % xs.length];
    const has = (key: string, min: number) => (tallies.get(key)?.plan ?? 0) >= min;
    const chosen: string[] = [];
    const take = (key: string | undefined) => {
      if (key && !chosen.includes(key) && chosen.length < 3) chosen.push(key);
    };
    // One for the lifting (a body area the plan works, else its sets), one for the distance (runs or rides), and one
    // for showing up (the days, the yoga and stretching, or the workouts); then whatever else the plan has.
    // The areas it works most (at least half as much as its biggest), so the pick rotates among the main ones.
    const most = Math.max(0, ...TARGET_AREAS.map((a) => tallies.get('area:' + a)?.plan ?? 0));
    const areas = TARGET_AREAS.filter((a) => has('area:' + a, Math.max(6, most / 2)));
    take(areas.length ? 'area:' + pickOf(areas, 0) : has('sets', 6) ? 'sets' : undefined);
    const distance = (['run', 'ride'] as const).filter((k) => has(k, 1));
    take(distance.length ? pickOf(distance, 1) : undefined);
    const showing = (['days', 'calm', 'workouts'] as const).filter((k) => has(k, k === 'calm' ? 1 : 2));
    take(showing.length ? pickOf(showing, 2) : undefined);
    ['sets', ...areas.map((a) => 'area:' + a), 'workouts', 'days', 'calm', 'run', 'ride'].forEach((k) => take(has(k, 1) ? k : undefined));
    const list: Challenge[] = chosen.map((key) => {
      const t = tallies.get(key)!;
      const distance = key === 'run' || key === 'ride';
      const target = distance ? tenth(t.plan) : t.plan;
      let done = 0;
      let clearedOn: number | null = null;
      Array.from(t.byDay.keys())
        .sort((a, b) => a - b)
        .forEach((day) => {
          done += t.byDay.get(day)!;
          if (clearedOn == null && done >= target - 1e-9) clearedOn = day;
        });
      return {
        kind: (key.startsWith('area:') ? 'area' : key) as ChallengeKind,
        area: key.startsWith('area:') ? key.slice(5) : undefined,
        target,
        done: distance ? tenth(done) : done,
        clearedOn,
      };
    });
    const cleared = list.filter((c) => c.clearedOn != null).length;
    const full = list.length === 3 && cleared === 3;
    return { start, list, cleared, full, xp: cleared * CHALLENGE_XP + (full ? CHALLENGE_BONUS : 0) };
  };
  const weeks = Array.from(byWeek.keys())
    .sort((a, b) => a - b)
    .map((w) => weekFor(w, byWeek.get(w)!));
  // The XP each challenge brought, on the day it was cleared (the bonus with the last of the three).
  const awards: { day: number; xp: number }[] = [];
  weeks.forEach((w) => {
    const days = w.list.map((c) => c.clearedOn).filter((d): d is number => d != null);
    days.forEach((day) => awards.push({ day, xp: CHALLENGE_XP }));
    if (w.full) awards.push({ day: Math.max(...days), xp: CHALLENGE_BONUS });
  });
  awards.sort((a, b) => a.day - b.day);
  const thisWeek = weeks.find((w) => w.start === weekOf(today)) ?? null;
  return { challengeWeeks: weeks, challengeWeek: thisWeek, challengeAwards: awards, challengeToday: today };
}
