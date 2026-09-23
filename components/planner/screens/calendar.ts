import { DOW3, DOWFULL, MON3, MONTHS } from '../constants';
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
    TODAY_M,
    metaFor,
  } = ctx;
  const firstRun = logic.model.workouts.length === 0 && logic.model.entries.length === 0;
  return {
    weekRows,
    monthCells,
    constellation,
    // Full width on narrow screens, where the toggle gets its own row
    segLayout: narrow ? { flex: '1 1 100%', width: '100%' } : { flex: 'none' },
    calendarView: st.seg,
    setCalendarView: (seg) => logic.s({ seg }),
    monthBtn:
      'display:inline-flex;align-items:center;gap:7px;margin-left:-10px;padding:8px 10px;border:none;border-radius:14px;background:' +
      (st.monthOpen ? 'rgba(35,42,69,.05)' : 'none') +
      ';cursor:pointer',
    // Nothing planned this month: "— nothing planned yet", like Profile's weekly average, not "0 of 0 done".
    monthDone: monthDays.length ? String(monthDays.filter((x) => x.done).length) : '—',
    monthDoneUnit: monthDays.length ? 'of ' + monthDays.length + ' done' : 'nothing planned yet',
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
        : 'on ' + DOW3[selDate.getDay()].charAt(0) + DOW3[selDate.getDay()].slice(1, 3).toLowerCase() + ', ' + MON3[mi] + ' ' + selDay,
    monthName: st.month,
    monthOpen: st.monthOpen,
    caretStyle:
      'border:none;background:none;cursor:pointer;padding:4px;display:flex;align-items:center;transition:transform .2s;transform:rotate(' +
      (st.monthOpen ? '180' : '0') +
      'deg)',
    toggleMonth: () => logic.s({ monthOpen: !st.monthOpen }),
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
      if (!to || to.getFullYear() !== Y) return; // the planner shows one year
      e.preventDefault();
      logic.s({ month: MONTHS[to.getMonth()], day: to.getDate() });
      requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-month-day="' + to.getDate() + '"]')?.focus());
    },
    prevWeek: () => {
      const d = new Date(Y, mi, selDay - 7);
      logic.s({ month: MONTHS[d.getMonth()], day: d.getDate() });
    },
    nextWeek: () => {
      const d = new Date(Y, mi, selDay + 7);
      logic.s({ month: MONTHS[d.getMonth()], day: d.getDate() });
    },
    prevMonth: () => logic.s({ month: MONTHS[(mi + 11) % 12], day: 1 }),
    nextMonth: () => logic.s({ month: MONTHS[(mi + 1) % 12], day: 1 }),
    months,
    days,
    dayName: DOWFULL[selDate.getDay()],
    shortDate: MON3[mi] + ' ' + selDay,
    weekLabel,
    monthName2: st.month,
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
      meta: metaFor(a),
      open: () =>
        logic.nav({ screen: 'detail', creating: false, month: MONTHS[TODAY_M], day: TODAY_D, entryId: a.id }),
    })),
  };
}
