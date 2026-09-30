import { MON3, RANK_STEPS } from '@/frontend/shared/constants';
import { idOf, numericOnly, questSeed, shortDay } from '@/frontend/shared/helpers';
import type { CalendarCtx } from '../types';
import type { Entry } from '@/frontend/data/plannerData';

// Streaks, weekly buckets, XP and rank, records and quest counts, derived from every entry.
/** One session in a week of the Progress chart. */
type WeekSession = { date: Date; av: Entry; done: boolean };

export function statsStage(ctx: CalendarCtx) {
  const { logic, Y, TODAY_M, TODAY_D, listForDate, TK, relM, entriesAt, isDoneEntry, ENTRIES, st, EXV, doneCountAt, distOf } = ctx;
  const todayDate = new Date(Y, TODAY_M, TODAY_D);
  const todayWkStart = new Date(Y, TODAY_M, TODAY_D - todayDate.getDay());
  const weekAll: Entry[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(todayWkStart.getFullYear(), todayWkStart.getMonth(), todayWkStart.getDate() + i);
    weekAll.push(...listForDate(d));
  }
  let nextUp: { name: string; m: number; d: number; id: string; meta2: string } | null = null;
  // The next session not yet done, today's included.
  const upcoming = logic.model.entries.find((x) => x.m * 100 + x.d >= TK && !isDoneEntry(x.av));
  if (upcoming) {
    const nd = new Date(Y, upcoming.m, upcoming.d);
    nextUp = {
      name: upcoming.av.name,
      m: upcoming.m,
      d: upcoming.d,
      id: upcoming.av.id,
      meta2: upcoming.m * 100 + upcoming.d === TK ? 'Today · ' + upcoming.av.time :
        shortDay(nd) + ' · ' + upcoming.av.time,
    };
  }
  // Every session up to and including today, whatever its month or year. The all-time stats (totals, streaks,
  // quests, bests) count these; sessions still ahead don't count toward anything yet.
  const allDays = logic.model.entries.map((x) => ({ m: x.m, d: x.d, av: x.av, done: isDoneEntry(x.av) }));
  const pastDays = allDays.filter((x) => x.m * 100 + x.d <= TK);
  // This month's, for the month tiles and the Chronicle's list of sessions still to write about.
  const monthDays = allDays.filter((x) => x.m === TODAY_M);
  // Sessions still to write about: the last 60 days up to today, newest first, so the start of a month can still
  // reach the end of the one before.
  const since = new Date(Y, TODAY_M, TODAY_D - 60);
  const sinceK = relM(since) * 100 + since.getDate();
  const unloggedDays = pastDays
    .filter((x) => !ENTRIES[idOf(x.av)] && x.m * 100 + x.d >= sinceK)
    .sort((a, b) => b.m * 100 + b.d - (a.m * 100 + a.d));
  const totalSessions = pastDays.length;
  const completedSessions = pastDays.filter((x) => x.done).length;
  // Keyed "month|day". Not "-": last December is month -1.
  const plannedByDay = {},
    dayComplete = {};
  pastDays.forEach((x) => {
    const k = x.m + '|' + x.d;
    plannedByDay[k] = (plannedByDay[k] || 0) + 1;
    dayComplete[k] = (dayComplete[k] === undefined ? true : dayComplete[k]) && x.done;
  });
  const todayKey = TODAY_M + '|' + TODAY_D;
  const todayLogged = !!plannedByDay[todayKey] && !!dayComplete[todayKey];
  // Streaks run back as far as the first session.
  const first = pastDays.length ? new Date(Y, pastDays[0].m, pastDays[0].d) : todayDate;
  // Only days with something planned count toward a streak, so walk those, oldest first, rather than every day since.
  const firstK = relM(first) * 100 + first.getDate();
  const streakDays = Object.keys(plannedByDay)
    .map((k) => {
      const [m, d] = k.split('|').map(Number);
      return { k, at: m * 100 + d };
    })
    .filter((x) => x.at >= firstK)
    .sort((a, b) => a.at - b.at);
  let streak = 0;
  for (let i = streakDays.length - 1; i >= 0; i--) {
    const { k, at } = streakDays[i];
    if (at === TK) continue;
    if (dayComplete[k]) streak++;
    else break;
  }
  let longest = 0,
    run = 0;
  streakDays.forEach(({ k }) => {
    if (dayComplete[k]) {
      run++;
      longest = Math.max(longest, run);
    } else run = 0;
  });
  // "This week" is one thing everywhere: the Sunday-to-Saturday week today is in. The chart shows the last few of
  // those real weeks, this one last.
  const WEEKS = 8;
  const weekBuckets: { start: Date; end: Date; sessions: WeekSession[]; planned: number; done: number }[] = [];
  for (let w = WEEKS - 1; w >= 0; w--) {
    const start = new Date(Y, TODAY_M, TODAY_D - todayDate.getDay() - w * 7);
    const sessions: WeekSession[] = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(start.getFullYear(), start.getMonth(), start.getDate() + i);
      listForDate(date).forEach((av) => sessions.push({ date, av, done: isDoneEntry(av) }));
    }
    weekBuckets.push({
      start,
      end: new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6),
      sessions,
      planned: sessions.length,
      done: sessions.filter((x) => x.done).length,
    });
  }
  const thisWeekIx = WEEKS - 1;
  const barSel = st.barSel == null || st.barSel >= WEEKS ? thisWeekIx : st.barSel;
  // Sessions done per week over the chart's weeks (fewer, for an account younger than that).
  const firstWkStart = new Date(first.getFullYear(), first.getMonth(), first.getDate() - first.getDay());
  const weeksKnown = Math.min(WEEKS, Math.round((todayWkStart.getTime() - firstWkStart.getTime()) / 604800000) + 1);
  const weeklyAvg = (weekBuckets.reduce((n, b) => n + b.done, 0) / weeksKnown).toFixed(1);
  // Says which weeks it's over: the chart's six, or, for a newer account, since its first week.
  const weeklyAvgSpan =
    weeksKnown < WEEKS ? 'Since ' + MON3[firstWkStart.getMonth()] + ' ' + firstWkStart.getDate() : 'Last ' + WEEKS + ' weeks';
  const moodCounts = {};
  Object.keys(ENTRIES).forEach((k) => {
    const m = ENTRIES[k].mood;
    moodCounts[m] = (moodCounts[m] || 0) + 1;
  });
  const moodTotal = Object.keys(ENTRIES).length || 1;
  // A quest belongs to a day, and is cleared when every session that day is done. So these count days, not sessions.
  const questCounts = {};
  const questDays = Object.keys(plannedByDay);
  const questsCleared = questDays.filter((k) => dayComplete[k]);
  questsCleared.forEach((k) => {
    const [m, d] = k.split('|').map(Number);
    const t = questSeed(d, m).title;
    questCounts[t] = (questCounts[t] || 0) + 1;
  });
  // Personal bests come from what was actually done: an exercise ticked off in a session up to today, at the weight
  // that session had (its own version of the workout), not whatever a plan says now.
  const bestByEx = {};
  pastDays.forEach((x) => {
    if (x.av.ride) return;
    const ticked = (st.done || {})[idOf(x.av)] || [];
    (EXV[x.av.exKey] || []).forEach((e) => {
      if (!ticked.includes(e.name)) return;
      const w = parseFloat(numericOnly(String(e.weight)));
      if (!isNaN(w) && w > (bestByEx[e.name] || 0)) bestByEx[e.name] = w;
    });
  });
  // The longest ride done, by what was ridden when that was recorded.
  const longestRide = pastDays.reduce(
    (max, x) => (x.av.ride && x.done ? Math.max(max, parseFloat(distOf(x.av)) || 0) : max),
    0,
  );
  // XP counts everything ever done, so a rank never slips as old months pass.
  const xpTotal = logic.model.entries.reduce(
    (sum, x) => sum + (x.av.ride ? 0 : doneCountAt(x.av) * 10) + (isDoneEntry(x.av) ? 50 : 0),
    0,
  );
  const XP_STEPS = RANK_STEPS.map((s) => s * 100);
  let derivedRank = 0;
  while (derivedRank < XP_STEPS.length - 1 && xpTotal >= XP_STEPS[derivedRank]) derivedRank++;
  const rankFloor = derivedRank === 0 ? 0 : XP_STEPS[derivedRank - 1];
  const rankCeil = XP_STEPS[derivedRank];
  const todayActs = entriesAt(TODAY_M, TODAY_D);
  const rankPct = Math.min(100, Math.round(((xpTotal - rankFloor) / Math.max(1, rankCeil - rankFloor)) * 100));
  return {
    monthDays,
    todayDate,
    todayActs,
    nextUp,
    unloggedDays,
    todayWkStart,
    derivedRank,
    xpTotal,
    rankCeil,
    XP_STEPS,
    rankPct,
    streak,
    todayLogged,
    plannedByDay,
    todayKey,
    dayComplete,
    weekBuckets,
    barSel,
    thisWeekIx,
    completedSessions,
    totalSessions,
    questCounts,
    questDayCount: questDays.length,
    questsClearedCount: questsCleared.length,
    longest,
    weeklyAvg,
    weeklyAvgSpan,
    moodCounts,
    moodTotal,
    bestByEx,
    longestRide,
    weekAll,
  };
}
