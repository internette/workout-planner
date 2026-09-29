// Putting a workout on several days: the weekdays picked from a start day, for one week or repeated weekly. Shared by
// the new-workout editor, a session's "Repeat weekly", and the Spellbook's "Add to calendar", so all three add the
// same days and say so the same way.
import { DOWFULL } from './constants';

/** How many weeks a weekly series can run for, the longest first (the default). */
export const REPEAT_WEEKS = [12, 8, 4] as const;
export const DEFAULT_WEEKS = 12;

export interface DayPlan {
  /** The days it goes on, in order. The start comes first when its weekday is picked. */
  dates: Date[];
  /** Days left out because the workout is already on them. */
  skipped: number;
}

const sameDay = (a: Date, b: Date) => a.getTime() === b.getTime();

/**
 * The days from `start` that fall on `days` (weekdays, 0 = Sunday): in the week from it, or when repeating, in each of
 * `weeks` weeks from it. Days already gone by are left out, except the start itself (put on a day that has gone by, it
 * is logged as done), and so are days that already have the workout, except the start (asked for by name; a second one
 * that day is said before adding).
 */
export function planDays(o: {
  start: Date;
  days: number[];
  repeat: boolean;
  weeks: number;
  today: Date;
  has: (d: Date) => boolean;
}): DayPlan {
  const dates: Date[] = [];
  let skipped = 0;
  const span = 7 * (o.repeat ? o.weeks : 1);
  for (let i = 0; i < span; i++) {
    const d = new Date(o.start.getFullYear(), o.start.getMonth(), o.start.getDate() + i);
    if (!o.days.includes(d.getDay())) continue;
    if (sameDay(d, o.start)) dates.push(d);
    else if (d < o.today) continue;
    else if (o.has(d)) skipped++;
    else dates.push(d);
  }
  return { dates, skipped };
}

/** The weekdays picked, or the start's own weekday when none have been. A day gone by only has its own. */
export const pickedDays = (picked: number[] | null | undefined, start: Date, past: boolean) =>
  past || !picked || !picked.length ? [start.getDay()] : [...picked].sort((a, b) => a - b);

/** Turns one weekday on or off. The last one stays on: a workout needs a day. */
export const toggleDay = (days: number[], day: number) =>
  days.includes(day) ? (days.length > 1 ? days.filter((d) => d !== day) : days) : [...days, day].sort((a, b) => a - b);

/** "Tuesday", "Tuesday and Thursday", "Tuesday, Thursday and Saturday". */
export const dayNames = (days: number[]) => {
  const names = [...days].sort((a, b) => a - b).map((d) => DOWFULL[d]);
  return names.length > 1 ? names.slice(0, -1).join(', ') + ' and ' + names[names.length - 1] : names[0] || '';
};
