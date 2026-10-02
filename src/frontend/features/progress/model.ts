import { DOW3, DOWFULL, MON3, MONTHS, RANKS } from '@/frontend/shared/constants';
import { displayName } from '@/shared/auth';
import { plural, questSeed } from '@/frontend/shared/helpers';
import type { Ctx } from '../planner/store/types';
import { MOOD_COLORS, MOODS } from '@moonshot/design-system/icons';
import type { DayStatus } from '@/frontend/components/StatusDot';

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
    monthLabel: MONTHS[TODAY_M],
    rankName: RANKS[derivedRank].name,
    // For the rank-up transformation (RankUp, in @moonshot/design-system/rank-up).
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
        gemFill: ix === RANKS.length - 1 ? 'var(--gradient-gem)' : r.gem,
        gemFaded: !(cur || reached),
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
      'display:inline-flex;align-items:center;gap:8px;margin-top:9px;min-height:36px;padding:8px 15px 8px 14px;border:none;border-radius:var(--radius-full);font-family:inherit;font-size:var(--text-base);font-weight:var(--font-weight-bold);cursor:pointer;' +
      RANKS[derivedRank].pill,
    rankGemColor: RANKS[derivedRank].gem,
    rankBarPct: rankPct,
    rankProgress:
      xpTotal === 0
        ? 'Clear your first exercise to start toward ' + nextRankName + '.'
        : rankPct === 0
          ? 'New rank: ' + RANKS[derivedRank].name + '. On to ' + nextRankName + '.'
          : rankPct + '% to ' + nextRankName,
    streakCount: streak,
    // "3 day streak", like the calendar's streak pill, whatever the number.
    streakUnit: 'day',
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
      return n === 1 ? 'Last training day' : 'Last ' + (n || 7) + ' training days';
    })(),
    // A dot for each recent training day, as the calendar draws them: done, partly done, missed, and today still to do.
    streakTicks: (() => {
      const out: { day: string; num: number; dot: DayStatus; today: boolean; aria: string }[] = [];
      for (let back = 0; back <= 90 && out.length < 7; back++) {
        const dt = new Date(Y, TODAY_M, TODAY_D - back);
        const k = relM(dt) + '|' + dt.getDate();
        if (!plannedByDay[k]) continue;
        const list = entriesAt(relM(dt), dt.getDate());
        const someDone = list.some((av) => ['Done', 'Partly done'].includes(ctx.sessionStatus(relM(dt), dt.getDate(), av)));
        const dot: DayStatus = dayComplete[k] ? 'done' : back === 0 ? 'planned' : someDone ? 'partly' : 'missed';
        out.unshift({
          day: DOW3[dt.getDay()].charAt(0) + DOW3[dt.getDay()].slice(1).toLowerCase(),
          num: dt.getDate(),
          dot,
          today: back === 0,
          aria:
            DOWFULL[dt.getDay()] + ' ' + dt.getDate() + ': ' +
            (dot === 'done' ? 'done' : dot === 'partly' ? 'partly done' : dot === 'missed' ? 'missed' : 'today, still to do'),
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
        stretch: !!x.av.stretch,
        yoga: !!x.av.yoga,
        // The same words as the calendar's legend: done, partly done, missed, in progress (today), planned.
        statusLabel: statusOf(x),
        // Done stands out in pink; planned is white on the tinted row; anything else grey.
        statusTone: (x.done ? 'accent' : statusOf(x) === 'Planned' ? 'quiet' : 'neutral') as 'accent' | 'quiet' | 'neutral',
        open: () =>
          logic.openSession(relM(x.date), x.date.getDate(), x.av.id),
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
          'var(--color-peach)',
        ][i],
        String(questCounts[t]),
      ])
      .map(([name, color, count], ix, arr) => ({
        name,
        count,
        color,
        row:
          'display:flex;align-items:center;gap:12px;padding:10px 0' +
          (ix === arr.length - 1 ? '' : ';border-bottom:1px solid var(--color-line)'),
      })),
    // Each stat says what it covers. Totals and streaks are all time, up to today; the average says which weeks.
    profileStats: [
      {
        label: 'Sessions done',
        value: String(completedSessions),
        unit: totalSessions ? 'of ' + totalSessions : 'none planned yet',
        span: totalSessions ? 'Up to today' : '',
      },
      { label: 'Current streak', value: String(streak), unit: streak === 1 ? 'day' : 'days', span: 'Training days' },
      { label: 'Longest streak', value: String(longest), unit: longest === 1 ? 'day' : 'days', span: 'All time' },
      {
        label: 'Weekly average',
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
        // Month over day, on two lines for every bar, so the bars stay level whatever width the chart has.
        week: ix === thisWeekIx ? 'Now' : MON3[weekBuckets[ix].start.getMonth()] + '\n' + weekBuckets[ix].start.getDate(),
        count: n,
        tip: weekName(ix) + ': ' + plural(n, 'session') + ' done',
        pick: () => logic.s({ barSel: ix }),
        on: ix === barSel,
        aria: (ix >= thisWeekIx - 1 ? weekName(ix) + ', ' + weekRange(weekBuckets[ix]) : weekName(ix)) + ': ' + plural(n, 'session') + ' done',
        value:
          'font-family:var(--font-heading);font-size:var(--text-sm);font-weight:var(--font-weight-bold);color:' +
          (ix === barSel ? 'var(--color-pink-deep)' : 'var(--color-muted)'),
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
            ? 'linear-gradient(180deg,var(--color-pink) 0%,var(--color-periwinkle) 100%)'
            : 'color-mix(in srgb, var(--color-pink) 30%, transparent)'),
        label:
          'white-space:pre-line;text-align:center;line-height:var(--leading-tight);height:2.4em;font-size:var(--text-sm);font-weight:' +
          (ix === barSel
            ? 'var(--font-weight-bold);color:var(--color-pink-deep)'
            : 'var(--font-weight-medium);color:var(--color-muted)'),
      })),
    // No entries yet: no bars at 0%, the card says what will show up instead.
    moodSplit: (Object.keys(moodCounts).length ? MOODS
      .map((name) => ({ name, color: MOOD_COLORS[name], pct: Math.round(((moodCounts[name] || 0) / moodTotal) * 100) }))
      .map(({ name, color, pct }) => ({
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
          'flex:none;width:44px;text-align:right;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);color:var(--color-pink-deep)',
      })),
    // This week in one line: done, partly done and missed (days gone by), and to go (today on), with a bar of the same.
    ...(() => {
      const b = weekBuckets[thisWeekIx] || { planned: 0, done: 0, sessions: [], start: todayDate, end: todayDate };
      const count = (label) => b.sessions.filter((x) => statusOf(x) === label).length;
      const done = b.sessions.filter((x) => x.done).length;
      const partly = count('Partly done');
      const missed = count('Missed');
      const toGo = b.sessions.length - done - partly - missed;
      const pct = (n) => (b.sessions.length ? (n / b.sessions.length) * 100 : 0);
      return {
        // The dates kept together: on a narrow phone it wraps after the dot, not inside the range.
        wkEyebrow: 'This week · ' + weekRange(b).replace(/ /g, '\u00a0').replace(/–/g, '\u2060–\u2060'),
        wkParts: [
          { n: done, label: 'done' },
          ...(partly ? [{ n: partly, label: 'partly' }] : []),
          ...(missed ? [{ n: missed, label: 'missed' }] : []),
          { n: toGo, label: 'to go' },
        ],
        wkSegments: [
          { pct: pct(done), kind: 'done' as const },
          { pct: pct(partly), kind: 'partly' as const },
          { pct: pct(missed), kind: 'missed' as const },
        ].filter((x) => x.pct > 0),
      };
    })(),
    // The cards open what they sum up: the next session, this week and this month on the calendar, the Chronicle.
    openNext: () =>
      nextUp &&
      logic.openSession(nextUp.m, nextUp.d, nextUp.id, { seg: 'Day', monthOpen: false }),
    openWeek: () =>
      logic.openDay(TODAY_M, TODAY_D, 'Week'),
    openMonth: () =>
      logic.openDay(TODAY_M, TODAY_D, 'Month'),
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
      const out: {
        day: string;
        name: string;
        done: boolean;
        open: () => void;
        aria: string;
        row: string;
        mark: string;
        title: string;
      }[] = [];
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
          // Named by its title, as on Profile; once cleared, the tick says so (the row stays one line, like the rest).
          name: q.title,
          done: isDone,
          open: () => logic.openDay(relM(d), dm),
          aria: DOWFULL[d.getDay()] + ': ' + q.title + (isDone ? ', cleared' : ''),
          row:
            'display:flex;align-items:center;gap:11px;width:100%;min-height:44px;padding:10px 0;border:none;background:none;text-align:left;font-family:inherit;cursor:pointer;border-bottom:1px solid var(--color-line)',
          mark:
            'width:18px;height:18px;flex:none;border-radius:var(--radius-full);display:flex;align-items:center;justify-content:center;' +
            (isDone ? 'background:var(--color-pink)' : 'background:transparent'),
          title:
            'flex:1;min-width:0;font-size:var(--text-base);' +
            (isDone
              ? 'font-weight:var(--font-weight-medium);color:var(--color-pink-deep)'
              : 'font-weight:var(--font-weight-medium);color:var(--color-ink)'),
        });
      }
      // A line between quests, not under the last one (days without a quest are skipped, so it isn't always Saturday).
      if (out.length) out[out.length - 1].row = out[out.length - 1].row.replace(/;border-bottom:[^;]*/, '');
      return out;
    })(),
    // The date. The week's own card says how it's going.
    summarySub: DOWFULL[todayDate.getDay()] + ', ' + MONTHS[TODAY_M] + ' ' + TODAY_D,
    // The chart's sessions for a week show once one is picked: this week's are on its own card already.
    barPicked: st.barSel != null,
  };
}
