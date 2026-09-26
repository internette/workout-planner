import { DOW3, DOWFULL, MON3, MONTHS } from '../constants';
import { mod12, monthPatch } from '../helpers';
import type { Ctx } from '../types';

// Calendar screen: month picker, day strip, week list and month grid.
export function calendarVals(ctx: Ctx) {
  const {
    logic,
    weekRows,
    monthCells,
    constellation,
    narrow,
    st,
    monthDays,
    actFor,
    selDay,
    Y,
    mi,
    months,
    days,
    selDate,
    weekLabel,
    todayDate,
    TODAY_D,
    isCurMonth,
    todayActs,
    nameOf,
    isDoneEntry,
    TODAY_M,
    metaFor,
    relM,
    shownYOff,
    pickYOff,
  } = ctx;
  // Another year than this one says which, wherever the month is named.
  const shownYear = Y + shownYOff;
  const monthTitle = MONTHS[mod12(mi)] + (shownYOff ? ' ' + shownYear : '');
  const firstRun = logic.model.workouts.length === 0 && logic.model.entries.length === 0;
  const shownMonth = logic.model.entries.filter((x) => x.m === mi).map((x) => x.av);
  return {
    weekRows,
    monthCells,
    constellation,
    // Full width on narrow screens, where the toggle gets its own row
    segLayout: narrow ? { flex: '1 1 100%', width: '100%' } : { flex: 'none' },
    calendarView: st.seg,
    setCalendarView: (seg) => logic.s({ seg }),
    monthBtn:
      'display:inline-flex;align-items:center;gap:7px;margin-left:-10px;min-height:44px;padding:8px 10px;border:none;border-radius:var(--radius-md);background:' +
      (st.monthOpen ? 'var(--hover-neutral)' : 'none') +
      ';cursor:pointer',
    // Nothing planned this month: "— nothing planned yet", like Profile's weekly average, not "0 of 0 done".
    monthDone: monthDays.length ? String(monthDays.filter((x) => x.done).length) : '—',
    monthDoneUnit: monthDays.length ? 'of ' + monthDays.length + ' done' : 'nothing planned yet',
    // The Month view's tile counts the month on screen (the values above are always this month, for Progress).
    shownMonthDone: shownMonth.length ? String(shownMonth.filter(isDoneEntry).length) : '—',
    shownMonthDoneUnit: shownMonth.length ? 'of ' + shownMonth.length + ' done' : 'nothing planned yet',
    dowLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    showDay: st.seg === 'Day',
    showWeek: st.seg === 'Week',
    showMonth: st.seg === 'Month',
    isRest: st.seg === 'Day' && !actFor(selDay) && !firstRun,
    // A brand-new account (no saved workouts, nothing planned) gets a welcome on the Day view, not a rest day.
    firstRun: st.seg === 'Day' && firstRun,
    hasWorkout: st.seg === 'Day' && !!actFor(selDay),
    // "No quest today" is only true when today is actually the day on screen — otherwise it needs to say which day.
    restDayPhrase:
      mi === TODAY_M && selDay === TODAY_D
        ? 'today'
        : 'on ' + DOW3[selDate.getDay()].charAt(0) + DOW3[selDate.getDay()].slice(1, 3).toLowerCase() + ', ' + MON3[mod12(mi)] + ' ' + selDay + (shownYOff ? ', ' + shownYear : ''),
    monthName: monthTitle,
    yearLabel: String(Y + pickYOff),
    monthYear: MONTHS[mod12(mi)] + ' ' + shownYear,
    prevYear: () => logic.s({ pickYOff: pickYOff - 1 }),
    nextYear: () => logic.s({ pickYOff: pickYOff + 1 }),
    // Back to today, from any month, year or day.
    awayFromToday: !(mi === TODAY_M && selDay === TODAY_D),
    goToday: () => logic.s({ ...monthPatch(TODAY_M), day: TODAY_D, monthOpen: false, pickYOff: null }),
    monthOpen: st.monthOpen,
    caretStyle:
      'border:none;background:none;cursor:pointer;padding:4px;display:flex;align-items:center;transition:transform .2s;transform:rotate(' +
      (st.monthOpen ? '180' : '0') +
      'deg)',
    toggleMonth: () => logic.s({ monthOpen: !st.monthOpen, pickYOff: null }),
    // Keyboard movement in the month grid: arrows by day and week, Home and End to the ends of the week,
    // PageUp and PageDown by month. The selected day is the grid's only tab stop, so focus follows it.
    monthKeyDown: (e) => {
      const cur = new Date(Y, mi, selDay);
      let to: Date | null = null;
      const step = { ArrowLeft: -1, ArrowRight: 1, ArrowUp: -7, ArrowDown: 7 }[e.key];
      if (step) to = new Date(Y, mi, selDay + step);
      else if (e.key === 'Home') to = new Date(Y, mi, selDay - cur.getDay());
      else if (e.key === 'End') to = new Date(Y, mi, selDay + (6 - cur.getDay()));
      else if (e.key === 'PageUp' || e.key === 'PageDown') {
        const m = mi + (e.key === 'PageUp' ? -1 : 1);
        to = new Date(Y, m, Math.min(selDay, new Date(Y, m + 1, 0).getDate()));
      }
      if (!to) return;
      e.preventDefault();
      logic.s({ ...monthPatch(relM(to)), day: to.getDate() });
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-month-day="' + to.getDate() + '"]')?.focus());
    },
    prevWeek: () => {
      const d = new Date(Y, mi, selDay - 7);
      logic.s({ ...monthPatch(relM(d)), day: d.getDate() });
    },
    nextWeek: () => {
      const d = new Date(Y, mi, selDay + 7);
      logic.s({ ...monthPatch(relM(d)), day: d.getDate() });
    },
    // Month view's arrows are named for where they go ("Aug", "Oct"), with the year when it changes.
    prevMonthShort: MON3[mod12(mi - 1)] + (Math.floor((mi - 1) / 12) !== shownYOff ? ' ' + (Y + Math.floor((mi - 1) / 12)) : ''),
    nextMonthShort: MON3[mod12(mi + 1)] + (Math.floor((mi + 1) / 12) !== shownYOff ? ' ' + (Y + Math.floor((mi + 1) / 12)) : ''),
    prevMonthName: MONTHS[mod12(mi - 1)] + ' ' + (Y + Math.floor((mi - 1) / 12)),
    nextMonthName: MONTHS[mod12(mi + 1)] + ' ' + (Y + Math.floor((mi + 1) / 12)),
    prevMonth: () => logic.s({ ...monthPatch(mi - 1), day: 1 }),
    nextMonth: () => logic.s({ ...monthPatch(mi + 1), day: 1 }),
    months,
    days,
    dayName: DOWFULL[selDate.getDay()],
    shortDate: MON3[mod12(mi)] + ' ' + selDay,
    weekLabel,
    monthName2: monthTitle,
    hasRows: weekRows.some((r) => r.hasRow),
    noRows: !weekRows.some((r) => r.hasRow),
    // Only what's true: a day with a session gets a quest.
    emptyWeekNote: 'No sessions scheduled this week. Add one and that day gets a quest.',
    weekAllDone: weekRows.some((r) => r.hasRow) && weekRows.filter((r) => r.hasRow).every((r) => r.done),
    weekDoneNote:
      'All ' +
      weekRows.filter((r) => r.hasRow).length +
      ' sessions done. Every quest this week is cleared.',
    todayLabel: 'TODAY · ' + DOW3[todayDate.getDay()] + ' ' + TODAY_D,
    hasToday: isCurMonth && todayActs.length > 0,
    todayCards: todayActs.map((a) => ({
      name: nameOf(a.name),
      warmup: !!a.warmup,
      meta: metaFor(a),
      open: () =>
        logic.nav({ screen: 'detail', creating: false, ...monthPatch(TODAY_M), day: TODAY_D, entryId: a.id }),
    })),
  };
}
