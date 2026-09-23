import { DOW3, MON3, RANK_STEPS } from '../constants';
import { idOf, questSeed } from '../helpers';
import type { Ctx } from '../types';

// Streaks, weekly buckets, XP and rank, records and quest counts, derived from every entry.
export function statsStage(ctx: Ctx): Ctx {
  const { logic, Y, TODAY_M, TODAY_D, listForDate, TK, entriesAt, isDoneEntry, ENTRIES, st, EX, doneCountAt } = ctx;
  const todayDate = new Date(Y, TODAY_M, TODAY_D);
  const todayWkStart = new Date(Y, TODAY_M, TODAY_D - todayDate.getDay());
  const weekAll = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(todayWkStart.getFullYear(), todayWkStart.getMonth(), todayWkStart.getDate() + i);
    weekAll.push(...listForDate(d));
  }
  let nextUp = null;
  const upcoming = logic.model.entries.find((x) => x.m * 100 + x.d > TK && x.av.s !== 'c');
  if (upcoming) {
    const nd = new Date(Y, upcoming.m, upcoming.d);
    nextUp = {
      name: upcoming.av.name,
      meta2:
        DOW3[nd.getDay()].charAt(0) +
        DOW3[nd.getDay()].slice(1, 3).toLowerCase() +
        ', ' +
        MON3[upcoming.m] +
        ' ' +
        upcoming.d +
        ' · ' +
        upcoming.av.time,
    };
  }
  const spanDays = [];
  (TODAY_M > 0 ? [TODAY_M - 1, TODAY_M] : [TODAY_M]).forEach((m) => {
    const last = new Date(Y, m + 1, 0).getDate();
    for (let d = 1; d <= last; d++) {
      entriesAt(m, d).forEach((av) => spanDays.push({ m, d, av, done: isDoneEntry(av) }));
    }
  });
  const monthDays = spanDays.filter((x) => x.m === TODAY_M);
  const unloggedDays = monthDays
    .filter((x) => !ENTRIES[idOf(x.av)] && x.d <= TODAY_D)
    .slice()
    .sort((a, b) => b.d - a.d);
  const thisWeekIx = Math.floor((TODAY_D - 1) / 7);
  const barSel = st.barSel == null ? thisWeekIx : st.barSel;
  const totalSessions = spanDays.length;
  const completedSessions = spanDays.filter((x) => x.done).length;
  const doneByDay = {};
  spanDays.forEach((x) => {
    if (x.done) doneByDay[x.d] = 1;
  });
  const plannedByDay = {},
    dayComplete = {};
  spanDays.forEach((x) => {
    const k = x.m + '-' + x.d;
    plannedByDay[k] = (plannedByDay[k] || 0) + 1;
    dayComplete[k] = (dayComplete[k] === undefined ? true : dayComplete[k]) && x.done;
  });
  const todayKey = TODAY_M + '-' + TODAY_D;
  const todayLogged = !!plannedByDay[todayKey] && !!dayComplete[todayKey];
  let streak = 0;
  for (let back = 1; back <= 90; back++) {
    const dt = new Date(Y, TODAY_M, TODAY_D - back);
    const k = dt.getMonth() + '-' + dt.getDate();
    if (!plannedByDay[k]) continue;
    if (dayComplete[k]) streak++;
    else break;
  }
  let longest = 0,
    run = 0;
  for (let back = 90; back >= 0; back--) {
    const dt = new Date(Y, TODAY_M, TODAY_D - back);
    const k = dt.getMonth() + '-' + dt.getDate();
    if (!plannedByDay[k]) continue;
    if (dayComplete[k]) {
      run++;
      longest = Math.max(longest, run);
    } else run = 0;
  }
  const weekBuckets = [];
  for (let w = 0; w < 5; w++) {
    const from = 1 + w * 7,
      to = from + 6;
    const inWeek = monthDays.filter((x) => x.d >= from && x.d <= to);
    weekBuckets.push({ planned: inWeek.length, done: inWeek.filter((x) => x.done).length });
  }
  const spanWeeks = (() => {
    const wk = {};
    spanDays.forEach((x) => {
      const dt = new Date(Y, x.m, x.d);
      wk[Math.floor((dt.getTime() - new Date(Y, Math.max(0, TODAY_M - 1), 1).getTime()) / 604800000)] = 1;
    });
    return Object.keys(wk).length || 1;
  })();
  const weeklyAvg = (completedSessions / spanWeeks).toFixed(1);
  const moodCounts = {};
  Object.keys(ENTRIES).forEach((k) => {
    const m = ENTRIES[k].mood;
    moodCounts[m] = (moodCounts[m] || 0) + 1;
  });
  const moodTotal = Object.keys(ENTRIES).length || 1;
  const questCounts = {};
  spanDays
    .filter((x) => x.done)
    .forEach((x) => {
      const t = questSeed(x.d, x.m).title;
      questCounts[t] = (questCounts[t] || 0) + 1;
    });
  const bestByEx = {};
  Object.keys(EX).forEach((k) =>
    EX[k].forEach((e) => {
      const ov = ((st.fields || {})[k + '|' + e.name] || {}).weight;
      const w = parseFloat(String(ov != null ? ov : e.weight).replace(/[^0-9.]/g, ''));
      if (!isNaN(w) && w > (bestByEx[e.name] || 0)) bestByEx[e.name] = w;
    }),
  );
  const longestRide = spanDays.reduce(
    (max, x) => (x.av.ride && x.done ? Math.max(max, parseFloat(x.av.ride.dist) || 0) : max),
    0,
  );
  const xpTotal = spanDays.reduce((sum, x) => sum + (x.av.ride ? 0 : doneCountAt(x.av) * 10) + (x.done ? 50 : 0), 0);
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
    longest,
    weeklyAvg,
    moodCounts,
    moodTotal,
    bestByEx,
    longestRide,
    weekAll,
  };
}
