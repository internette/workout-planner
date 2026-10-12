// Finding a program in the calendar: the workouts repeating weekly that no program put there, from what's left of them
// (today on, not done). A workout repeats on a weekday when it's a weekly series there, or falls on that weekday in
// two weeks or more. The program runs from this week to the week of the last session left, with every workout on its
// weekdays in every week: one block. Weeks run Sunday to Saturday, as a program's do.

import { isoOf } from './helpers';

export interface ScanSession {
  id: string;
  iso: string;
  name: string; // the workout, by name: an edited one's sessions (on an archived version) are still the same one
  series: boolean; // part of a weekly series
  done: boolean;
  inProgram: boolean; // put there by a program's run, or a program's own workout
}

export interface ScanBlock {
  weeks: number;
  workouts: { name: string; days: number[] }[];
}

export interface Scan {
  start: string; // this week's Sunday
  end: string; // the Saturday of the week with the last session left
  weeks: number;
  blocks: ScanBlock[];
  names: string[]; // every workout it found, in the order they fall in the week
  sessions: string[]; // the sessions left of the workouts kept: the ones that join the program
  oneOffs: string[]; // sessions left that don't repeat: left as they are
  series: string[]; // every repeating session left, kept or not
}

const DAY = 86400000;
const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
// Weeks since a fixed Sunday (Jan 4 1970), in local dates; rounding absorbs daylight-saving hours.
const SUNDAY0 = new Date(1970, 0, 4).getTime();
const weekOf = (iso: string) => Math.floor(Math.round((fromIso(iso).getTime() - SUNDAY0) / DAY) / 7);
const dayOfWeek = (week: number, day: number) => new Date(1970, 0, 4 + week * 7 + day);

/**
 * The program in what's left of the calendar, or null with nothing repeating. `keep` leaves out the workouts not in
 * it (all kept when null); the weeks run to the last session left of those kept.
 */
export function scanCalendar(all: ScanSession[], todayIso: string, keep: Set<string> | null = null): Scan | null {
  const left = all.filter((s) => !s.inProgram && !s.done && s.iso >= todayIso);

  const by: Record<string, ScanSession[]> = {};
  left.forEach((s) => {
    const key = s.name + '\u0000' + fromIso(s.iso).getDay();
    (by[key] = by[key] || []).push(s);
  });
  const lanes: { name: string; day: number; list: ScanSession[] }[] = [];
  const once: ScanSession[] = [];
  Object.entries(by).forEach(([key, list]) => {
    const [name, day] = key.split('\u0000');
    if (list.some((s) => s.series) || new Set(list.map((s) => weekOf(s.iso))).size >= 2) lanes.push({ name, day: Number(day), list });
    else once.push(...list);
  });
  if (!lanes.length) return null;

  const names: string[] = [];
  [...lanes].sort((a, b) => a.day - b.day).forEach((l) => !names.includes(l.name) && names.push(l.name));
  const kept = lanes.filter((l) => !keep || keep.has(l.name)).sort((a, b) => a.day - b.day);
  const from = weekOf(todayIso);
  const to = kept.length ? Math.max(...kept.flatMap((l) => l.list.map((s) => weekOf(s.iso)))) : from - 1;
  const workouts: ScanBlock['workouts'] = [];
  kept.forEach((l) => {
    const x = workouts.find((y) => y.name === l.name);
    if (x) x.days.push(l.day);
    else workouts.push({ name: l.name, days: [l.day] });
  });
  const weeks = Math.max(0, to - from + 1);
  return {
    start: isoOf(dayOfWeek(from, 0)),
    end: isoOf(dayOfWeek(Math.max(from, to), 6)),
    weeks,
    blocks: weeks ? [{ weeks, workouts }] : [],
    names,
    sessions: kept.flatMap((l) => l.list.map((s) => s.id)),
    oneOffs: once.map((s) => s.id),
    series: lanes.flatMap((l) => l.list.map((s) => s.id)),
  };
}

/** A short key for what a scan found, so "Not now" can stay dismissed until the calendar changes. */
export const scanKey = (s: Scan) => s.end + ':' + s.names.join(',');
