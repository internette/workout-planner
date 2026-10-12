// Finding a program in the calendar: workouts repeating weekly that no program put there, read week by week. A workout
// repeats on a weekday when it falls on that weekday in two weeks or more, whether it was put there as a weekly series
// or one week at a time. A week's pattern is which workouts fall on which weekdays; weeks in a row with the same pattern
// are one block, and where the pattern changes a new block starts. Weeks run Sunday to Saturday, as a program's do.

import { isoOf } from './helpers';

export interface ScanSession {
  id: string;
  iso: string;
  name: string; // the workout, by name: an edited one's earlier sessions (on an archived version) are still the same one
  inProgram: boolean; // put there by a program's run, or a program's own workout
}

/** One workout repeating on one weekday, over a stretch of weeks (week numbers count Sundays), and its sessions. */
interface Lane {
  name: string;
  day: number;
  from: number;
  to: number;
  ids: string[];
}

export interface ScanBlock {
  weeks: number;
  workouts: { name: string; days: number[] }[];
}

export interface Scan {
  id: string; // which stretch of the calendar it is, the same whichever workouts are kept
  start: string; // the first week's Sunday
  end: string; // the last week's Saturday
  weeks: number;
  blocks: ScanBlock[];
  names: string[]; // every workout it found, in the order they first fall in a week
  sessions: string[]; // the repeating sessions of the workouts kept, in its weeks: the ones that join the program
  oneOffs: string[]; // sessions in its weeks outside any program that don't repeat: left as they are
  series: string[]; // every repeating session in its stretch, kept or not
}

const DAY = 86400000;
const fromIso = (iso: string) => {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
};
// Weeks since a fixed Sunday (Jan 4 1970), in local dates; rounding absorbs daylight-saving hours.
const SUNDAY0 = new Date(1970, 0, 4).getTime();
const weekOf = (iso: string) => Math.floor(Math.round((fromIso(iso).getTime() - SUNDAY0) / DAY) / 7);
const sundayOf = (week: number) => {
  const d = new Date(1970, 0, 4);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate() + week * 7);
};

/**
 * The weekly lanes in these sessions: a workout on a weekday, split where it skips more than two weeks. A stretch of
 * just one week isn't a repeat: its sessions come back as one-offs.
 */
function lanesOf(sessions: ScanSession[]): { lanes: Lane[]; once: ScanSession[] } {
  const by: Record<string, ScanSession[]> = {};
  sessions.forEach((s) => {
    const key = s.name + '\u0000' + fromIso(s.iso).getDay();
    (by[key] = by[key] || []).push(s);
  });
  const lanes: Lane[] = [];
  const once: ScanSession[] = [];
  Object.entries(by).forEach(([key, list]) => {
    const [name, day] = key.split('\u0000');
    const sorted = [...list].sort((a, b) => weekOf(a.iso) - weekOf(b.iso));
    let run: ScanSession[] = [];
    const close = () => {
      const weeks = new Set(run.map((s) => weekOf(s.iso)));
      if (weeks.size >= 2) lanes.push({ name, day: Number(day), from: Math.min(...weeks), to: Math.max(...weeks), ids: run.map((s) => s.id) });
      else once.push(...run);
      run = [];
    };
    sorted.forEach((s) => {
      if (run.length && weekOf(s.iso) - weekOf(run[run.length - 1].iso) > 2) close();
      run.push(s);
    });
    close();
  });
  return { lanes, once };
}

/**
 * The programs in a calendar: one for each stretch of weeks with weekly repeats in it (two weeks at least). `keep`
 * leaves out the workouts not in it (all kept when null). Newest stretch last.
 */
export function scanCalendar(all: ScanSession[], keep: Set<string> | null = null): Scan[] {
  const outside = all.filter((s) => !s.inProgram);
  const { lanes, once } = lanesOf(outside);
  if (!lanes.length) return [];
  const byId: Record<string, ScanSession> = {};
  outside.forEach((s) => (byId[s.id] = s));

  // Stretches: lanes whose weeks touch or overlap, joined.
  const sorted = [...lanes].sort((a, b) => a.from - b.from);
  const stretches: { from: number; to: number; lanes: Lane[] }[] = [];
  sorted.forEach((l) => {
    const last = stretches[stretches.length - 1];
    if (last && l.from <= last.to + 1) {
      last.to = Math.max(last.to, l.to);
      last.lanes.push(l);
    } else stretches.push({ from: l.from, to: l.to, lanes: [l] });
  });

  return stretches
    .map((st) => {
      // A series that starts partway through the first week (or stops partway through the last) didn't skip the days
      // before (or after): its lane counts from the stretch's first week (to its last) when its day there is outside
      // the dates the calendar has.
      const inIt = st.lanes.flatMap((l) => l.ids.map((id) => byId[id]));
      const first = inIt.reduce((m, s) => (s.iso < m ? s.iso : m), inIt[0].iso);
      const last = inIt.reduce((m, s) => (s.iso > m ? s.iso : m), inIt[0].iso);
      const firstDay = fromIso(first).getDay();
      const lastDay = fromIso(last).getDay();
      const kept = st.lanes
        .filter((l) => !keep || keep.has(l.name))
        .map((l) => ({
          ...l,
          from: l.from === st.from + 1 && l.day < firstDay ? st.from : l.from,
          to: l.to === st.to - 1 && l.day > lastDay ? st.to : l.to,
        }));
      const names: string[] = [];
      [...st.lanes]
        .sort((a, b) => a.from - b.from || a.day - b.day)
        .forEach((l) => !names.includes(l.name) && names.push(l.name));

      // Each week's pattern, then the blocks: weeks in a row with the same one. Weeks at either end with nothing kept
      // in them are left out.
      const pattern = (w: number) =>
        kept
          .filter((l) => l.from <= w && w <= l.to)
          .map((l) => l.name + '@' + l.day)
          .sort()
          .join('|');
      let from = st.from;
      let to = st.to;
      while (from <= to && !pattern(from)) from++;
      while (to >= from && !pattern(to)) to--;
      // A lone first week with only some of the next week's workouts is a series starting partway in, not a block of
      // its own: those workouts fill it too. The same for a lone last week with only some of the week before's.
      const at = (w: number) => kept.filter((l) => l.from <= w && w <= l.to);
      const within = (a: number, b: number) => {
        const pb = pattern(b);
        return pattern(a) !== pb && at(a).every((l) => l.from <= b && b <= l.to);
      };
      if (to > from && within(from, from + 1)) at(from + 1).forEach((l) => (l.from = Math.min(l.from, from)));
      if (to > from && within(to, to - 1)) at(to - 1).forEach((l) => (l.to = Math.max(l.to, to)));
      const blocks: ScanBlock[] = [];
      let prev: string | null = null;
      for (let w = from; w <= to; w++) {
        const p = pattern(w);
        if (p === prev) {
          blocks[blocks.length - 1].weeks++;
          continue;
        }
        prev = p;
        const workouts: ScanBlock['workouts'] = [];
        kept
          .filter((l) => l.from <= w && w <= l.to)
          .sort((a, b) => a.day - b.day)
          .forEach((l) => {
            const x = workouts.find((y) => y.name === l.name);
            if (x) x.days.push(l.day);
            else workouts.push({ name: l.name, days: [l.day] });
          });
        blocks.push({ weeks: 1, workouts });
      }

      const inWeeks = (s: ScanSession) => weekOf(s.iso) >= from && weekOf(s.iso) <= to;
      return {
        id: String(st.from),
        start: isoOf(sundayOf(from)),
        end: isoOf(new Date(sundayOf(to).getTime() + 6.5 * DAY)),
        weeks: Math.max(0, to - from + 1),
        blocks,
        names,
        sessions: inIt.filter((s) => inWeeks(s) && (!keep || keep.has(s.name))).map((s) => s.id),
        oneOffs: once.filter(inWeeks).map((s) => s.id),
        series: inIt.map((s) => s.id),
        length: st.to - st.from + 1,
      };
    })
    .filter((s) => s.length >= 2)
    .map(({ length, ...s }) => s);
}

/** The stretch to offer: the one with this session in it, else the one going on now (or next), else the latest. */
export function pickScan(scans: Scan[], todayIso: string, sessionId?: string | null): Scan | null {
  if (!scans.length) return null;
  if (sessionId) return scans.find((s) => s.series.includes(sessionId)) || null;
  return scans.find((s) => s.end >= todayIso) || scans[scans.length - 1];
}

/** A short key for what a scan found, so "Not now" can stay dismissed until the calendar changes. */
export const scanKey = (s: Scan) => s.start + ':' + s.weeks + ':' + s.names.join(',');
