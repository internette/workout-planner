import { DOW3, DOWFULL, MON3, MONTHS, RANKS } from '../constants';
import { displayName } from '@/lib/auth';
import { monthPatch, plural, questSeed } from '../helpers';
import type { Ctx } from '../types';

// Progress and profile: streaks, weekly chart, records, XP and the rank ladder.
export function progressVals(ctx: Ctx) {
  const {
    logic,
    derivedRank,
    st,
    xpTotal,
    rankCeil,
    XP_STEPS,
    rankPct,
    monthDays,
    streak,
    todayLogged,
    plannedByDay,
    todayKey,
    Y,
    TODAY_M,
    TODAY_D,
    relM,
    dayComplete,
    weekBuckets,
    barSel,
    nameOf,
    thisWeekIx,
    completedSessions,
    totalSessions,
    questCounts,
    questDayCount,
    questsClearedCount,
    longest,
    weeklyAvg,
    weeklyAvgSpan,
    moodCounts,
    moodTotal,
    bestByEx,
    longestRide,
    weekAll,
    nextUp,
    todayDate,
    entriesAt,
    isDoneEntry,
  } = ctx;
  // A week by its dates: "Sep 20–26", or "Aug 30 – Sep 5" across a month.
  const weekRange = (b) =>
    b.start.getMonth() === b.end.getMonth()
      ? MON3[b.start.getMonth()] + ' ' + b.start.getDate() + '–' + b.end.getDate()
      : MON3[b.start.getMonth()] + ' ' + b.start.getDate() + ' – ' + MON3[b.end.getMonth()] + ' ' + b.end.getDate();
  const weekName = (ix) => (ix === thisWeekIx ? 'This week' : ix === thisWeekIx - 1 ? 'Last week' : 'Week of ' + weekRange(weekBuckets[ix]));
  const selWeek = weekBuckets[barSel] || { sessions: [], planned: 0, done: 0 };
  // The next rank by its full name, as the ladder writes it ("Novice guardian"); past the top, the next season.
  const nextRankName = RANKS[derivedRank + 1] ? RANKS[derivedRank + 1].name : RANKS[derivedRank].next;
  const xpLeft = Math.max(0, rankCeil - xpTotal);
  const xpToGo = xpLeft ? xpLeft + ' more to reach ' + nextRankName + '.' : 'The top rank.';
  const statusOf = (x) => (x.done ? 'Done' : ctx.sessionStatus(relM(x.date), x.date.getDate(), x.av));
  return {
    // Empty states: say what will show up, instead of "0 of 0" or a bare heading.
    wkEmpty: weekAll.length === 0,
    wkHas: weekAll.length > 0,
    ticksEmpty: !Object.keys(plannedByDay).some((k) => {
      const [m, d] = k.split('|').map(Number);
      return m * 100 + d <= TODAY_M * 100 + TODAY_D;
    }),
    questsNone: questDayCount === 0,
    questsHas: questDayCount > 0,
    moodEmpty: Object.keys(moodCounts).length === 0,
    recordsEmpty: Object.keys(bestByEx).length === 0 && !longestRide,
    monthLabel: MONTHS[TODAY_M].toUpperCase(),
    rankName: RANKS[derivedRank].name,
    // For the rank-up transformation (components/planner/RankUp.tsx).
    rankIndex: derivedRank,
    rankNext: nextRankName,
    rankGemFill: derivedRank === RANKS.length - 1 ? 'var(--gradient-gem)' : RANKS[derivedRank].gem,
    rankStepLabel: 'Rank ' + (derivedRank + 1) + ' of ' + RANKS.length,
    ranksAside: 'Rank ' + (derivedRank + 1) + ' of ' + RANKS.length + ' · ' + xpTotal + ' XP',
    xpInfoOpen: !!st.xpInfo,
    toggleXpInfo: () => logic.s({ xpInfo: !st.xpInfo }),
    // Says how far is left, which matches the bar's "N% to …" (both count from this rank, not from zero).
    xpLine: xpTotal + ' XP so far. ' + xpToGo,
    ranksOpen: !!st.ranksOpen,
    openRanks: () => logic.s({ ranksOpen: true }),
    closeRanks: () => logic.s({ ranksOpen: false }),
    rankLadder: RANKS.map((r, ix) => {
      const cur = ix === derivedRank;
      const reached = ix < derivedRank;
      return {
        label: r.name,
        req: ix === 0 ? 'Start' : XP_STEPS[ix - 1] + ' XP',
        row:
          'display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:var(--radius-md);' +
          (cur
            ? r.pill
            : reached
              ? 'background:var(--color-canvas);color:var(--color-slate)'
              : 'background:none;color:var(--color-muted)'),
        gem:
          'width:11px;height:15px;flex:none;clip-path:polygon(50% 0,100% 35%,50% 100%,0 35%);background:' +
          (ix === RANKS.length - 1
            ? 'var(--gradient-gem)'
            : cur && r.gem === 'var(--color-white)'
              ? 'var(--color-white)'
              : r.gem) +
          (cur || reached ? '' : ';opacity:.45'),
        name:
          'flex:1;min-width:0;font-size:var(--text-base);font-weight:' +
          (cur ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)'),
        // Full strength: faded to 80% it fell under 4.5:1 on both the white and the pink rows.
        xp: 'flex:none;font-family:var(--font-heading);font-size:var(--text-sm);font-weight:var(--font-weight-semibold)',
      };
    }),
    profileName: displayName(logic.auth.account),
    profileInitial: displayName(logic.auth.account).charAt(0).toUpperCase(),
    profilePicture: logic.auth.account?.picture ?? '',
    // The gem on the avatar's badge. The last rank's own gem is white, which the white badge would hide.
    avatarGem: derivedRank === RANKS.length - 1 ? 'var(--gradient-gem)' : RANKS[derivedRank].gem,
    // When their account was created. Empty for a session that predates the claim, and the line then stays out.
    profileSince: (() => {
      const created = new Date(logic.auth.account?.createdAt ?? '');
      return isNaN(created.getTime()) ? '' : 'Training since ' + MONTHS[created.getMonth()] + ' ' + created.getFullYear();
    })(),
    rankPillBtn:
      'display:inline-flex;align-items:center;gap:8px;margin-top:9px;min-height:36px;padding:8px 15px 8px 14px;border:none;border-radius:var(--radius-full);font-family:inherit;font-size:var(--text-md);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-loose);cursor:pointer;' +
      RANKS[derivedRank].pill,
    rankGem:
      'width:10px;height:14px;flex:none;clip-path:polygon(50% 0,100% 35%,50% 100%,0 35%);background:' +
      RANKS[derivedRank].gem,
    rankBarPct: rankPct,
    rankProgress:
      xpTotal === 0
        ? 'Clear your first exercise to start toward ' + nextRankName + '.'
        : rankPct === 0
          ? 'New rank: ' + RANKS[derivedRank].name + '. On to ' + nextRankName + '.'
          : rankPct + '% to ' + nextRankName,
    rankTip:
      xpTotal + ' XP. ' + xpToGo + ' 10 XP per exercise completed, 50 XP per workout finished.',
    monthSummaryLabel: monthDays.filter((x) => x.done).length + ' of ' + monthDays.length + ' done',
    streakCount: streak,
    // "3 day streak", like the calendar's streak pill, whatever the number.
    streakUnit: 'day',
    streakPillLabel: 'day streak',
    streakNote: todayLogged
      ? 'Today is cleared.'
      : streak > 0
        ? plannedByDay[todayKey]
          ? 'Today’s quest is still open. Clear it to reach ' + (streak + 1) + '.'
          : 'Rest day — the streak holds.'
        : 'Clear a full day to start one.',
    // Up to seven, and it says how many when there are fewer.
    ticksLabel: (() => {
      let n = 0;
      for (let back = 0; back <= 90 && n < 7; back++) {
        const dt = new Date(Y, TODAY_M, TODAY_D - back);
        if (plannedByDay[relM(dt) + '|' + dt.getDate()]) n++;
      }
      return n === 1 ? 'LAST TRAINING DAY' : 'LAST ' + (n || 7) + ' TRAINING DAYS';
    })(),
    streakTicks: (() => {
      const out = [];
      for (let back = 0; back <= 90 && out.length < 7; back++) {
        const dt = new Date(Y, TODAY_M, TODAY_D - back);
        const k = relM(dt) + '|' + dt.getDate();
        if (!plannedByDay[k]) continue;
        const pending = back === 0 && !dayComplete[k];
        out.unshift({
          // Two letters, so Tuesday and Thursday (and the weekend days) can be told apart.
          label: ['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'][dt.getDay()] + ' ' + dt.getDate(),
          bar:
            'display:block;height:7px;border-radius:4px;background:' +
            (dayComplete[k]
              ? 'linear-gradient(135deg,var(--color-accent),var(--color-periwinkle))'
              : pending
                ? 'repeating-linear-gradient(135deg,color-mix(in srgb, var(--color-accent) 45%, transparent) 0 3px,color-mix(in srgb, var(--color-accent) 16%, transparent) 3px 6px)'
                : 'color-mix(in srgb, var(--color-ink) 13%, transparent)'),
          cap:
            'display:block;margin-top:6px;font-size:var(--text-2xs);font-weight:var(--font-weight-semibold);letter-spacing:var(--tracking-loose);text-align:center;color:' +
            (pending
              ? 'var(--color-accent-deep)'
              : dayComplete[k]
                ? 'var(--color-ink)'
                : 'var(--color-slate-deep)'),
        });
      }
      return out;
    })(),
    chartRangeLabel: 'Last ' + weekBuckets.length + ' weeks',
    weekEmpty: selWeek.sessions.length === 0,
    weekSessions: selWeek.sessions
      .map((x) => ({
        day: DOW3[x.date.getDay()] + ' ' + x.date.getDate(),
        name: nameOf(x.av.name),
        warmup: !!x.av.warmup,
        // The same words as the calendar's legend: done, partly done, missed, in progress (today), planned.
        statusLabel: statusOf(x),
        // Done stands out in pink; planned is white on the tinted row; anything else grey.
        statusTone: x.done ? 'accent' : statusOf(x) === 'Planned' ? 'quiet' : 'neutral',
        open: () =>
          logic.nav({ screen: 'detail', creating: false, ...monthPatch(relM(x.date)), day: x.date.getDate(), entryId: x.av.id }),
      })),
    chartCaption:
      (barSel >= thisWeekIx - 1 ? weekName(barSel) + ' · ' + weekRange(selWeek) : weekName(barSel)) +
      ' · ' +
      (selWeek.planned ? selWeek.done + ' of ' + plural(selWeek.planned, 'session') + ' done' : 'nothing planned'),
    questsClearedLabel: questsClearedCount + ' of ' + questDayCount,
    questsClearedPct: questDayCount ? Math.round((questsClearedCount / questDayCount) * 100) : 0,
    questStats: Object.keys(questCounts)
      .sort((a, b) => questCounts[b] - questCounts[a])
      .slice(0, 5)
      .map((t, i) => [
        t,
        [
          'var(--color-pink)',
          'var(--color-periwinkle)',
          'var(--color-teal)',
          'var(--color-slate)',
          'var(--color-coral)',
        ][i],
        String(questCounts[t]),
      ])
      .map(([name, color, count], ix, arr) => ({
        name,
        count,
        swatch:
          'width:10px;height:14px;flex:none;clip-path:polygon(50% 0,100% 35%,50% 100%,0 35%);background:' +
          color,
        row:
          'display:flex;align-items:center;gap:12px;padding:10px 0' +
          (ix === arr.length - 1 ? '' : ';border-bottom:1px solid var(--color-line)'),
      })),
    // Each stat says what it covers. Totals and streaks are all time, up to today; the average says which weeks.
    profileStats: [
      {
        label: 'SESSIONS DONE',
        value: String(completedSessions),
        unit: totalSessions ? 'of ' + totalSessions : 'none planned yet',
        span: totalSessions ? 'Up to today' : '',
      },
      { label: 'CURRENT STREAK', value: String(streak), unit: streak === 1 ? 'day' : 'days', span: 'Training days' },
      { label: 'LONGEST STREAK', value: String(longest), unit: longest === 1 ? 'day' : 'days', span: 'All time' },
      {
        label: 'WEEKLY AVERAGE',
        value: completedSessions ? weeklyAvg : '—',
        unit: completedSessions ? 'a week' : 'no sessions yet',
        span: completedSessions ? weeklyAvgSpan : '',
      },
    ],
    allTimeLabel: 'All time',
    weeklyBars: weekBuckets
      .map((b) => b.done)
      .map((n, ix) => ({
        // The week's Sunday under each bar; "Now" for this week. The same words for screen readers.
        week: ix === thisWeekIx ? 'Now' : MON3[weekBuckets[ix].start.getMonth()] + ' ' + weekBuckets[ix].start.getDate(),
        count: n,
        tip: weekName(ix) + ': ' + plural(n, 'session') + ' done',
        pick: () => logic.s({ barSel: ix }),
        on: ix === barSel,
        aria: (ix >= thisWeekIx - 1 ? weekName(ix) + ', ' + weekRange(weekBuckets[ix]) : weekName(ix)) + ': ' + plural(n, 'session') + ' done',
        value:
          'font-family:var(--font-heading);font-size:var(--text-xs);font-weight:var(--font-weight-bold);color:' +
          (ix === barSel ? 'var(--color-accent-deep)' : 'var(--color-muted)'),
        bar:
          'width:100%;border-radius:6px 6px 3px 3px;transition:background .2s;height:' +
          Math.max(
            4,
            Math.round(
              (n / Math.max(1, Math.max.apply(null, weekBuckets.map((b) => b.done).concat([1])))) * 96,
            ),
          ) +
          'px;background:' +
          (ix === barSel
            ? 'linear-gradient(180deg,var(--color-accent) 0%,var(--color-periwinkle) 100%)'
            : 'color-mix(in srgb, var(--color-accent) 30%, transparent)'),
        label:
          'font-size:var(--text-2xs);font-weight:' +
          (ix === barSel
            ? 'var(--font-weight-bold);color:var(--color-accent-deep)'
            : 'var(--font-weight-medium);color:var(--color-muted)'),
      })),
    // No entries yet: no bars at 0%, the card says what will show up instead.
    moodSplit: (Object.keys(moodCounts).length ? [
      ['Happy', 'var(--color-pink)'],
      ['Neutral', 'var(--color-slate)'],
      ['Sad', 'var(--color-periwinkle)'],
      ['Mad', 'var(--color-danger)'],
    ]
      .map(([name, color]) => [name, color, Math.round(((moodCounts[name] || 0) / moodTotal) * 100)])
      .map(([name, color, pct]) => ({
        name,
        pct: pct + '%',
        swatch: 'width:10px;height:10px;flex:none;border-radius:var(--radius-full);background:' + color,
        barPct: pct,
        color,
      })) : []),
    records: Object.keys(bestByEx)
      .sort((a, b) => bestByEx[b] - bestByEx[a])
      .slice(0, 4)
      .map((n) => [n, bestByEx[n] + ' lb', ''])
      .concat(longestRide ? [['Longest ride', longestRide + ' mi', '']] : [])
      .map(([name, value, delta], ix, arr) => ({
        name,
        value,
        delta,
        rowStyle:
          'display:flex;align-items:center;gap:12px;padding:11px 0;' +
          (ix === arr.length - 1 ? '' : 'border-bottom:1px solid var(--color-line)'),
        deltaStyle:
          'flex:none;width:44px;text-align:right;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);color:var(--color-accent-deep)',
      })),
    wkDone: weekAll.filter(isDoneEntry).length,
    wkTotal: weekAll.length,
    wkTotalUnit: weekAll.length === 1 ? 'session' : 'sessions',
    wkBar:
      'width:' +
      (weekAll.length ? Math.round((weekAll.filter(isDoneEntry).length / weekAll.length) * 100) : 0) +
      '%;height:100%;border-radius:4px;background:var(--color-accent)',
    // The cards open what they sum up: the next session, this week and this month on the calendar, the Chronicle.
    openNext: () =>
      nextUp &&
      logic.nav({ screen: 'detail', creating: false, seg: 'Day', monthOpen: false, ...monthPatch(nextUp.m), day: nextUp.d, entryId: nextUp.id }),
    openWeek: () =>
      logic.nav({ screen: 'day', seg: 'Week', monthOpen: false, ...monthPatch(TODAY_M), day: TODAY_D, entryId: null }),
    openMonth: () =>
      logic.nav({ screen: 'day', seg: 'Month', monthOpen: false, ...monthPatch(TODAY_M), day: TODAY_D, entryId: null }),
    openChronicle: () => logic.nav({ screen: 'diaryList' }),
    hasNext: !!nextUp,
    noNext: !nextUp,
    nextName: nextUp && nextUp.name,
    nextMeta: nextUp && nextUp.meta2,
    questsDoneLabel: (function () {
      let t = 0,
        d = 0;
      for (let i = 0; i < 7; i++) {
        const dt = new Date(Y, TODAY_M, TODAY_D - todayDate.getDay() + i);
        // Counted by day, like the list of quests below it.
        const list = entriesAt(relM(dt), dt.getDate());
        if (!list.length) continue;
        t++;
        if (list.every(isDoneEntry)) d++;
      }
      return d + ' of ' + t + ' cleared';
    })(),
    weekQuests: (function () {
      const out = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(Y, TODAY_M, TODAY_D - todayDate.getDay() + i);
        const dm = d.getDate();
        // One quest per day: cleared once every workout that day is done.
        const list = entriesAt(relM(d), dm);
        if (!list.length) continue;
        const isDone = list.every(isDoneEntry);
        const q = questSeed(dm, relM(d));
        out.push({
          day: DOW3[d.getDay()].slice(0, 3),
          // Named by its title, as on Profile; once cleared, its "done" line sits under it.
          name: q.title,
          doneLine: isDone ? q.done : '',
          done: isDone,
          open: () => logic.nav({ screen: 'day', seg: 'Day', monthOpen: false, ...monthPatch(relM(d)), day: dm, entryId: null }),
          aria: DOWFULL[d.getDay()] + ': ' + q.title + (isDone ? ', cleared' : ''),
          row:
            'display:flex;align-items:center;gap:11px;width:100%;min-height:44px;padding:10px 0;border:none;background:none;text-align:left;font-family:inherit;cursor:pointer;border-bottom:1px solid var(--color-line)',
          mark:
            'width:18px;height:18px;flex:none;border-radius:var(--radius-full);display:flex;align-items:center;justify-content:center;' +
            (isDone ? 'background:var(--color-accent)' : 'background:transparent'),
          title:
            'flex:1;min-width:0;font-size:var(--text-base);' +
            (isDone
              ? 'font-weight:var(--font-weight-medium);color:var(--color-accent-deep)'
              : 'font-weight:var(--font-weight-medium);color:var(--color-ink)'),
        });
      }
      // A line between quests, not under the last one (days without a quest are skipped, so it isn't always Saturday).
      if (out.length) out[out.length - 1].row = out[out.length - 1].row.replace(/;border-bottom:[^;]*/, '');
      return out;
    })(),
    summarySub: (() => {
      const b = weekBuckets[thisWeekIx] || { planned: 0, done: 0, sessions: [] };
      // "Left" is what can still be done: today and later. Days already gone by count as missed.
      const left = b.sessions.filter((x) => !x.done && x.date >= todayDate).length;
      // Gone by with something done is partly done, not missed (the same as the calendar says).
      const missed = b.sessions.filter((x) => statusOf(x) === 'Missed').length;
      const partlyN = b.sessions.filter((x) => statusOf(x) === 'Partly done').length;
      const missedNote = (partlyN ? ' ' + partlyN + ' partly done.' : '') + (missed ? ' ' + missed + ' missed.' : '');
      return (
        DOWFULL[todayDate.getDay()] +
        ', ' +
        MONTHS[TODAY_M] +
        ' ' +
        TODAY_D +
        '. ' +
        (b.planned === 0
          ? 'Nothing on the plan this week yet.'
          : left === 0 && !missed && !partlyN
            ? 'Every session this week is done.'
            : left === 0
              ? 'Nothing left this week.' + missedNote
              : left + (left === 1 ? ' session' : ' sessions') + ' left this week.' + missedNote)
      );
    })(),
  };
}
