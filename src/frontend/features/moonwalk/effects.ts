// What the charms used so far do, for the stages that work out XP, boss fights and streaks. A charm is used on a day
// (one a day), and does its part on that day's sessions, or covers a missed day for the streak.
import type { CharmRow, Model } from '@/frontend/data/plannerData';
import { charmByKey, type Effect } from './charms';

export type Use = { row: CharmRow; effect: Effect };

/** "2026-11-08" for a day number (days since 1970, as the derive stages count them). */
export const isoOfDayNum = (n: number) => new Date(n * 864e5).toISOString().slice(0, 10);
export const dayNumOfIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return Math.round(Date.UTC(y, m - 1, d) / 864e5);
};

/** Each day's charm, by its day number. */
export function usesByDay(model: Model | null): Map<number, Use> {
  const out = new Map<number, Use>();
  ((model && model.charms) || []).forEach((row) => {
    const c = row.kind === 'charm' && row.usedDay ? charmByKey(row.charm) : null;
    if (c && row.usedDay) out.set(dayNumOfIso(row.usedDay), { row, effect: c.effect });
  });
  return out;
}

/**
 * The days charms cover for the streak, by day number: a Streak Ward's or Second Wind's day, a Moon Shift's day once
 * a workout is finished on the day it was used, and the 7 days a Bookmark Ribbon starts.
 */
export function coveredDays(uses: Map<number, Use>, finishedOn: (day: number) => boolean): Set<number> {
  const out = new Set<number>();
  uses.forEach((u, day) => {
    if ((u.effect === 'ward' || u.effect === 'wind') && u.row.usedFor) out.add(dayNumOfIso(u.row.usedFor));
    if (u.effect === 'shift' && u.row.usedFor && finishedOn(day)) out.add(dayNumOfIso(u.row.usedFor));
    if (u.effect === 'ribbon') for (let i = 0; i < 7; i++) out.add(day + i);
  });
  return out;
}

/** Today's day number, as the derive stages count days. */
export const todayNum = (d = new Date()) => Math.round(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()) / 864e5);
/** What today's charm does, if one is in use today. */
export const todayEffect = (model: Model | null): Effect | null => usesByDay(model).get(todayNum())?.effect || null;
