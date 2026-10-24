import { idOf, numericOnly, toMinutes } from '@/frontend/shared/helpers';
import { splitSide } from '@/frontend/shared/sides';
import { setsIn } from '@/frontend/features/session/sets';
import type { CalendarCtx } from '@/frontend/features/planner/store/types';
import type { BossWin } from '@/frontend/features/boss/derive';
import type { Entry } from '@/frontend/data/plannerData';
import { ACHIEVEMENTS, FAMILIES } from './catalog';

/** An achievement earned: which one (its index in ACHIEVEMENTS), and the day it was reached (null: from the start). */
export type Unlock = { ix: number; day: number | null };

/**
 * Every achievement's count, and the day each tier was reached, replayed from every session up to today in date order.
 * Nothing is stored: like XP and the bosses, it's worked out again from the ticks, so it's the same on every device.
 */
export function achievementStage(
  ctx: CalendarCtx,
  boss: { bossWins: BossWin[]; xpLog: { day: number; xp: number; rank: number }[] },
) {
  const { logic, st, Y, TODAY_M, TODAY_D, instList, isDoneEntry, distOf, actualMinutes, ENTRIES, nameOf } = ctx;
  const dayNum = (m: number, d: number) => Math.round(Date.UTC(Y, m, d) / 864e5);
  const dayOfIso = (iso: string) => Math.round(Date.parse(iso + 'T00:00:00Z') / 864e5);
  const today = dayNum(TODAY_M, TODAY_D);

  // What happened on each day, oldest first: its sessions, Chronicle entries, boss wins, XP and programs finished.
  type Day = { entries: Entry[]; moods: string[]; rpes: number[]; wins: BossWin[]; xp?: number; rank?: number; programs: number };
  const days = new Map<number, Day>();
  const at = (day: number) => {
    let x = days.get(day);
    if (!x) days.set(day, (x = { entries: [], moods: [], rpes: [], wins: [], programs: 0 }));
    return x;
  };
  logic.model.entries.forEach((x) => {
    const day = dayNum(x.m, x.d);
    if (day <= today) at(day).entries.push(x.av);
  });
  Object.keys(ENTRIES).forEach((k) => {
    const e = ENTRIES[k];
    const day = dayNum(e.m, e.d);
    if (day > today) return;
    at(day).moods.push(e.mood);
    if (e.rpe) at(day).rpes.push(e.rpe);
  });
  boss.bossWins.forEach((w) => at(w.day).wins.push(w));
  boss.xpLog.forEach((l) => {
    const x = at(l.day);
    x.xp = l.xp;
    x.rank = l.rank;
  });
  // A program seen through: its last day has passed, and it wasn't ended early.
  (logic.model.programRuns || []).forEach((r) => {
    if (r.ended || !r.end) return;
    const day = dayOfIso(r.end);
    if (day <= today) at(day).programs++;
  });

  const c: Record<string, number> = { rank: 1 };
  const add = (k: string, n = 1) => (c[k] = (c[k] || 0) + n);
  const max = (k: string, n: number) => (c[k] = Math.max(c[k] || 0, n));
  const seen = new Set<string>();
  const weekDone = new Map<number, number>();
  const monthDone = new Map<string, number>();
  let streak = 0;
  let lastDone: number | null = null;
  // The week being walked through: whether everything planned in it so far is done.
  let week: { start: number; planned: number; done: number } | null = null;
  const closeWeek = () => {
    if (week && week.planned && week.done === week.planned) add('perfectWeeks');
  };

  // Each family's next tier, and what's been unlocked so far, in the order it happened.
  const next = FAMILIES.map(() => 0);
  const firstIx: number[] = [];
  let ix = 0;
  FAMILIES.forEach((f) => {
    firstIx.push(ix);
    ix += f.ladder.length;
  });
  const unlocks: Unlock[] = [];
  const check = (day: number | null) =>
    FAMILIES.forEach((f, fi) => {
      const v = c[f.stat] || 0;
      while (next[fi] < f.ladder.length && v >= f.ladder[next[fi]]) unlocks.push({ ix: firstIx[fi] + next[fi]++, day });
    });
  // Rank 1 is everyone's from the start.
  check(null);

  const order = [...days.keys()].sort((a, b) => a - b);
  for (const day of order) {
    const x = days.get(day)!;
    const date = new Date(day * 864e5);
    const wkStart = day - date.getUTCDay();
    // A week counts as perfect once it's over, or once today is its last day.
    if (week && week.start !== wkStart) closeWeek();
    if (!week || week.start !== wkStart) week = { start: wkStart, planned: 0, done: 0 };
    let doneToday = 0;
    for (const av of x.entries) {
      const id = idOf(av);
      const ticked = (st.done || {})[id] || [];
      if (!av.ride) {
        const list = instList(av.exKey, id).filter((e) => ticked.includes(e.name));
        let sets = 0;
        list.forEach((e) => {
          sets += setsIn({ sets: ((st.fields || {})[id + '|' + e.name] || {}).sets ?? e.sets });
          seen.add(nameOf(splitSide(e.name).base).toLowerCase());
          const w = parseFloat(numericOnly(String(e.weight ?? '')));
          if (!isNaN(w)) max('heaviest', w);
        });
        add('sets', sets);
        add('ticks', list.length);
        max('maxSets', sets);
        max('maxTicks', list.length);
      }
      week.planned++;
      if (!isDoneEntry(av)) continue;
      week.done++;
      doneToday++;
      add('done');
      add(av.ride ? (av.ride.run ? 'run' : 'ride') : av.yoga ? 'yoga' : av.stretch ? 'stretch' : 'lift');
      add('wd' + date.getUTCDay());
      add('mo' + date.getUTCMonth());
      const mk = date.getUTCFullYear() + '-' + date.getUTCMonth();
      if (!monthDone.has(mk)) add('activeMonths');
      monthDone.set(mk, (monthDone.get(mk) || 0) + 1);
      max('bestMonth', monthDone.get(mk)!);
      weekDone.set(wkStart, (weekDone.get(wkStart) || 0) + 1);
      max('bestWeek', weekDone.get(wkStart)!);
      if (lastDone != null && day - lastDone >= 7) add('comebacks');
      lastDone = day;
      // Its time as recorded, else as planned ("~50 min", or a ride's hours and minutes).
      const mins =
        actualMinutes(av) ||
        (av.ride ? toMinutes(av.ride.hrs, av.ride.mins) : Number((/\d+/.exec(av.time || '') || ['0'])[0]));
      add('minutes', mins);
      max('longestMin', mins);
      if (av.ride) {
        const mi = parseFloat(distOf(av)) || 0;
        add(av.ride.run ? 'runMi' : 'rideMi', mi);
        max(av.ride.run ? 'runLong' : 'rideLong', mi);
        add('elev', parseFloat(numericOnly((av.actual && av.actual.elev) || av.ride.elev)) || 0);
      }
    }
    c.distinct = seen.size;
    if (x.entries.length) {
      // A day with something planned: cleared when it's all done. Today, not done yet, doesn't break the streak.
      if (doneToday === x.entries.length) {
        add('quests');
        streak++;
        max('streak', streak);
      } else if (day !== today) streak = 0;
      if (doneToday >= 2) add('doubles');
    }
    x.moods.forEach((m) => {
      add('notes');
      add('mood' + m);
    });
    x.rpes.forEach((r) => add('rpe' + r));
    x.wins.forEach((w) => {
      add('bosses');
      if (!w.escapes) add('clean');
      if (w.days <= 3) add('swift');
    });
    if (x.xp != null) c.xp = x.xp;
    if (x.rank != null) c.rank = x.rank + 1;
    add('programs', x.programs);
    if (wkStart + 6 === today) {
      closeWeek();
      week = null;
    }
    check(day);
  }
  // The last week walked through, if it's over by now.
  if (week && week.start + 6 < today) {
    closeWeek();
    check(today);
  }
  const total = ACHIEVEMENTS.length;
  return { unlocks, counts: c, total };
}
