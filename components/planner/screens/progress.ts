import { DOW3, DOWFULL, MON3, MONTHS, PROFILE, RANKS } from '../constants';
import { questSeed } from '../helpers';
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
    dayComplete,
    weekBuckets,
    barSel,
    nameOf,
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
    nextUp,
    todayDate,
    seedAt,
    isDoneEntry,
  } = ctx;
  return {
    rankName: RANKS[derivedRank].name,
    rankStepLabel: 'Rank ' + (derivedRank + 1) + ' of ' + RANKS.length,
    xpInfoOpen: !!st.xpInfo,
    toggleXpInfo: () => logic.s({ xpInfo: !st.xpInfo }),
    xpLine: xpTotal + ' of ' + rankCeil + ' XP toward ' + RANKS[derivedRank].next,
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
          'display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:14px;' +
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
        xp: 'flex:none;font-family:var(--font-heading);font-size:var(--text-sm);font-weight:var(--font-weight-semibold);opacity:.8',
      };
    }),
    profileName: PROFILE.name,
    profileInitial: PROFILE.name.charAt(0),
    profileSince: 'Training since ' + PROFILE.since,
    rankPill:
      'display:inline-flex;align-items:center;gap:8px;margin-top:9px;padding:7px 15px 7px 12px;border-radius:999px;font-size:var(--text-md);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-loose);' +
      RANKS[derivedRank].pill,
    rankPillBtn:
      'display:inline-flex;align-items:center;gap:8px;margin-top:9px;min-height:36px;padding:8px 15px 8px 14px;border:none;border-radius:999px;font-family:inherit;font-size:var(--text-md);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-loose);cursor:pointer;' +
      RANKS[derivedRank].pill,
    rankGem:
      'width:10px;height:14px;flex:none;clip-path:polygon(50% 0,100% 35%,50% 100%,0 35%);background:' +
      RANKS[derivedRank].gem,
    rankBar:
      'width:' +
      rankPct +
      '%;height:100%;border-radius:5px;transition:width .35s ease;background:var(--gradient-gem)',
    rankProgress:
      rankPct === 0
        ? 'Just promoted — 0% to ' + RANKS[derivedRank].next
        : rankPct + '% to ' + RANKS[derivedRank].next,
    rankTip:
      'XP ' + xpTotal + ' of ' + rankCeil + ' · 10 XP per exercise completed, 50 XP per workout finished',
    monthSummaryLabel: monthDays.filter((x) => x.done).length + ' of ' + monthDays.length + ' done',
    streakCount: streak,
    streakUnit: streak === 1 ? 'day' : 'days',
    streakPillLabel: (streak === 1 ? 'day' : 'day') + ' streak',
    streakNote: todayLogged
      ? 'Today is in the books.'
      : streak > 0
        ? plannedByDay[todayKey]
          ? 'Today still pending — finish it to reach ' + (streak + 1) + '.'
          : 'Rest day — the streak holds.'
        : 'Clear a full day to start one.',
    streakTicks: (() => {
      const out = [];
      for (let back = 0; back <= 90 && out.length < 7; back++) {
        const dt = new Date(Y, TODAY_M, TODAY_D - back);
        const k = dt.getMonth() + '-' + dt.getDate();
        if (!plannedByDay[k]) continue;
        const pending = back === 0 && !dayComplete[k];
        out.unshift({
          label: ['S', 'M', 'T', 'W', 'T', 'F', 'S'][dt.getDay()] + ' ' + dt.getDate(),
          bar:
            'display:block;height:7px;border-radius:4px;background:' +
            (dayComplete[k]
              ? 'linear-gradient(135deg,var(--color-pink),var(--color-periwinkle))'
              : pending
                ? 'repeating-linear-gradient(135deg,rgba(225,105,156,.45) 0 3px,rgba(225,105,156,.16) 3px 6px)'
                : 'rgba(35,42,69,.13)'),
          cap:
            'display:block;margin-top:6px;font-size:var(--text-2xs);font-weight:var(--font-weight-semibold);letter-spacing:var(--tracking-loose);text-align:center;color:' +
            (pending
              ? 'var(--color-pink-plum)'
              : dayComplete[k]
                ? 'var(--color-slate)'
                : 'var(--color-muted)'),
        });
      }
      return out;
    })(),
    chartRangeLabel: MON3[TODAY_M] + ' · ' + weekBuckets.length + ' weeks',
    weekEmpty: monthDays.filter((x) => x.d >= 1 + barSel * 7 && x.d <= 1 + barSel * 7 + 6).length === 0,
    weekSessions: monthDays
      .filter((x) => x.d >= 1 + barSel * 7 && x.d <= 1 + barSel * 7 + 6)
      .map((x) => ({
        day: DOW3[new Date(Y, TODAY_M, x.d).getDay()] + ' ' + x.d,
        name: nameOf(x.av.name),
        statusLabel: x.done ? 'Done' : 'Planned',
        status:
          'flex:none;padding:5px 11px;border-radius:999px;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);' +
          (x.done
            ? 'background:var(--color-pink);color:var(--color-white)'
            : 'background:var(--color-white);color:var(--color-muted)'),
        open: () => logic.nav({ screen: 'detail', creating: false, month: MONTHS[TODAY_M], day: x.d }),
      })),
    chartCaption: (() => {
      const b = weekBuckets[barSel] || { planned: 0, done: 0 };
      const from = 1 + barSel * 7;
      const to = Math.min(new Date(Y, TODAY_M + 1, 0).getDate(), from + 6);
      return (
        (barSel === thisWeekIx ? 'This week' : 'Week ' + (barSel + 1)) +
        ' · ' +
        MON3[TODAY_M] +
        ' ' +
        from +
        '–' +
        to +
        ' · ' +
        (b.planned ? b.done + ' of ' + b.planned + ' sessions done' : 'nothing planned')
      );
    })(),
    questsClearedLabel: completedSessions + ' of ' + totalSessions,
    questsClearedBar:
      'width:' +
      (totalSessions ? Math.round((completedSessions / totalSessions) * 100) : 0) +
      '%;height:100%;border-radius:5px;background:var(--gradient-gem)',
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
          (ix === arr.length - 1 ? '' : ';border-bottom:1px solid rgba(35,42,69,.055)'),
      })),
    profileStats: [
      {
        label: 'SESSIONS DONE',
        value: String(completedSessions),
        unit: 'of ' + totalSessions + ' since Aug',
      },
      { label: 'CURRENT STREAK', value: String(streak), unit: streak === 1 ? 'day' : 'days' },
      { label: 'LONGEST STREAK', value: String(longest), unit: longest === 1 ? 'day' : 'days' },
      {
        label: 'WEEKLY AVERAGE',
        value: completedSessions ? weeklyAvg : '—',
        unit: completedSessions ? 'sessions' : 'no sessions yet',
      },
    ],
    weeklyBars: weekBuckets
      .map((b) => b.done)
      .map((n, ix) => ({
        week: ix === thisWeekIx ? 'now' : 'w' + (ix + 1),
        count: n,
        tip: n + (n === 1 ? ' session' : ' sessions') + ' in week ' + (ix + 1),
        pick: () => logic.s({ barSel: ix }),
        on: ix === barSel,
        aria:
          (ix === weekBuckets.length - 1 ? 'This week' : 'Week ' + (ix + 1)) +
          ': ' +
          n +
          (n === 1 ? ' session' : ' sessions'),
        value:
          'font-family:var(--font-heading);font-size:var(--text-xs);font-weight:var(--font-weight-bold);color:' +
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
            : 'rgba(225,105,156,.3)'),
        label:
          'font-size:var(--text-2xs);font-weight:' +
          (ix === barSel
            ? 'var(--font-weight-bold);color:var(--color-pink-deep)'
            : 'var(--font-weight-medium);color:var(--color-muted)'),
      })),
    moodSplit: [
      ['Happy', 'var(--color-pink)'],
      ['Neutral', 'var(--color-slate)'],
      ['Sad', 'var(--color-periwinkle)'],
      ['Mad', 'var(--color-danger)'],
    ]
      .map(([name, color]) => [name, color, Math.round(((moodCounts[name] || 0) / moodTotal) * 100)])
      .map(([name, color, pct]) => ({
        name,
        pct: pct + '%',
        swatch: 'width:10px;height:10px;flex:none;border-radius:50%;background:' + color,
        bar: 'display:block;width:' + pct + '%;height:100%;border-radius:5px;background:' + color,
      })),
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
          (ix === arr.length - 1 ? '' : 'border-bottom:1px solid rgba(35,42,69,.055)'),
        deltaStyle:
          'flex:none;width:44px;text-align:right;font-size:var(--text-sm);font-weight:var(--font-weight-semibold);color:var(--color-pink-deep)',
      })),
    wkDone: weekAll.filter((a) => a.s === 'c').length,
    wkTotal: weekAll.length,
    wkBar:
      'width:' +
      (weekAll.length ? Math.round((weekAll.filter((a) => a.s === 'c').length / weekAll.length) * 100) : 0) +
      '%;height:100%;border-radius:4px;background:var(--color-pink)',
    hasNext: !!nextUp,
    noNext: !nextUp,
    nextName: nextUp && nextUp.name,
    nextMeta: nextUp && nextUp.meta2,
    questsDoneLabel: (function () {
      let t = 0,
        d = 0;
      for (let i = 0; i < 7; i++) {
        const dt = new Date(Y, TODAY_M, TODAY_D - todayDate.getDay() + i);
        const av = seedAt(dt.getMonth(), dt.getDate());
        if (!av) continue;
        t++;
        if (isDoneEntry(av)) d++;
      }
      return d + ' of ' + t + ' cleared';
    })(),
    weekQuests: (function () {
      const out = [];
      for (let i = 0; i < 7; i++) {
        const d = new Date(Y, TODAY_M, TODAY_D - todayDate.getDay() + i);
        const dm = d.getDate();
        const av = seedAt(d.getMonth(), dm);
        if (!av) continue;
        const isDone = isDoneEntry(av);
        const q = questSeed(dm, d.getMonth());
        out.push({
          day: DOW3[d.getDay()].slice(0, 3),
          name: isDone ? q.done : q.title,
          done: isDone,
          row:
            'display:flex;align-items:center;gap:11px;padding:10px 0' +
            (i === 6 ? '' : ';border-bottom:1px solid rgba(35,42,69,.055)'),
          mark:
            'width:18px;height:18px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;' +
            (isDone ? 'background:var(--color-pink)' : 'background:transparent'),
          title:
            'flex:1;min-width:0;font-size:var(--text-base);' +
            (isDone
              ? 'font-weight:var(--font-weight-medium);color:var(--color-pink-deep)'
              : 'font-weight:var(--font-weight-medium);color:var(--color-ink)'),
        });
      }
      return out;
    })(),
    summarySub: (() => {
      const b = weekBuckets[thisWeekIx] || { planned: 0, done: 0 };
      const left = b.planned - b.done;
      return (
        DOWFULL[todayDate.getDay()] +
        ', ' +
        MONTHS[TODAY_M] +
        ' ' +
        TODAY_D +
        '. ' +
        (b.planned === 0
          ? 'Nothing on the plan this week yet.'
          : left === 0
            ? 'Every session this week is done.'
            : left + (left === 1 ? ' session' : ' sessions') + ' left this week.')
      );
    })(),
  };
}
