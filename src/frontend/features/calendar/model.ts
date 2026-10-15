import { STATUS_NAMES, type DayStatus } from '@/frontend/components/StatusDot';
import { DOW1, DOW3, DOWFULL, MON3, MONTHS } from '@/frontend/shared/constants';
import { isoMonthDay, mod12, monDay, monthPatch, noticePatch, plural, shortDay, longDay } from '@/frontend/shared/helpers';
import * as db from '@/frontend/data/plannerData';
import { shortDate, type PlanDraft } from '@/shared/planDraft';
import type { Ctx } from '../planner/store/types';

// Calendar screen: month picker, day strip, week list and month grid.
/** A week's range as its heading says it, for the week holding `d`: "Oct 4 – 10", or "Sep 28 – Oct 4" across months. */
const weekOf = (d: Date) => {
  const start = new Date(d.getFullYear(), d.getMonth(), d.getDate() - d.getDay());
  const end = new Date(start.getFullYear(), start.getMonth(), start.getDate() + 6);
  const stamp = (x: Date) => MON3[x.getMonth()] + ' ' + x.getDate();
  return start.getMonth() === end.getMonth() ? stamp(start) + ' – ' + end.getDate() : stamp(start) + ' – ' + stamp(end);
};

export function calendarVals(ctx: Ctx) {
  const {
    logic,
    weekRows,
    monthCells,
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
    weekStart,
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
    // A week with nothing planned shows its empty state alone, without a line of rest days above it.
    weekRows: weekRows.some((r) => r.hasRow) ? weekRows : [],
    monthCells,
    // Full width on narrow screens, where the toggle gets its own row
    segLayout: narrow ? { flex: '1 1 100%', width: '100%' } : { flex: 'none' },
    calendarView: st.seg,
    setCalendarView: (seg) => logic.s({ seg }),
    // Nothing planned this month: "— nothing planned yet", like Profile's weekly average, not "0 of 0 done".
    monthDone: monthDays.length ? String(monthDays.filter((x) => x.done).length) : '—',
    monthDoneUnit: monthDays.length ? 'of ' + monthDays.length + ' done' : 'nothing planned yet',
    // The Month view's tile counts the month on screen (the values above are always this month, for Progress).
    shownMonthDone: shownMonth.length ? String(shownMonth.filter(isDoneEntry).length) : '—',
    shownMonthDoneUnit: shownMonth.length ? 'of ' + shownMonth.length + ' done in ' + MONTHS[mod12(mi)] : 'nothing planned yet',
    dowLabels: DOW1,
    // A new account can start from a built-in program instead of building a first workout.
    goPrograms: () => logic.nav({ screen: 'arsenal', arsenalView: 'programs', monthOpen: false }),
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
        : 'on ' + shortDay(selDate) + (shownYOff ? ', ' + shownYear : ''),
    monthName: monthTitle,
    yearLabel: String(Y + pickYOff),
    monthYear: MONTHS[mod12(mi)] + ' ' + shownYear,
    prevYear: () => logic.s({ pickYOff: pickYOff - 1 }),
    nextYear: () => logic.s({ pickYOff: pickYOff + 1 }),
    // Back to today, from any month, year or day.
    awayFromToday: !(mi === TODAY_M && selDay === TODAY_D),
    goToday: () => logic.s({ ...monthPatch(TODAY_M), day: TODAY_D, monthOpen: false, pickYOff: null }),
    // A plan from Claude, added once the person has looked it over. The calendar then opens on its first day.
    addPlanDraft: (draft: PlanDraft) => {
      const w = draft.plan.workouts;
      const first = w[0].date;
      const at = isoMonthDay(first, Y);
      logic.saveOnce('plan-draft', () => db.addPlanDraft(draft, logic.model!), {
        ...monthPatch(at.m),
        day: at.d,
        ...noticePatch(`Your new arc is on the calendar: ${plural(w.length, 'workout')}, starting ${shortDate(first)}.`, 'day'),
      });
    },
    addingPlan: logic.busy('plan-draft'),
    monthOpen: st.monthOpen,
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
    // A step says where it landed, since the whole view changes under a screen reader: the day on the Day view, the
    // week on the Week view.
    prevWeek: () => {
      const d = new Date(Y, mi, selDay - 7);
      logic.s({ ...monthPatch(relM(d)), day: d.getDate(), announce: st.seg === 'Week' ? 'Week of ' + weekOf(d) : longDay(d) });
    },
    nextWeek: () => {
      const d = new Date(Y, mi, selDay + 7);
      logic.s({ ...monthPatch(relM(d)), day: d.getDate(), announce: st.seg === 'Week' ? 'Week of ' + weekOf(d) : longDay(d) });
    },
    // The key under the week's heading names only the dots on its rows.
    weekRowsKey: (['done', 'partly', 'missed', 'planned'] as DayStatus[])
      .filter((s) => weekRows.some((r) => r.hasRow && r.dot === s))
      .map((s) => STATUS_NAMES.find(([x]) => x === s)!),
    // The key under the week strip names only the dots in it, in the order a day goes.
    weekKey: (['done', 'partly', 'missed', 'planned'] as DayStatus[])
      .filter((s) => days.some((d) => d.dot === s))
      .map((s) => STATUS_NAMES.find(([x]) => x === s)!),
    // Month view's arrows are named for where they go ("Aug", "Oct"), with the year when it changes.
    prevMonthShort: MON3[mod12(mi - 1)] + (Math.floor((mi - 1) / 12) !== shownYOff ? ' ' + (Y + Math.floor((mi - 1) / 12)) : ''),
    nextMonthShort: MON3[mod12(mi + 1)] + (Math.floor((mi + 1) / 12) !== shownYOff ? ' ' + (Y + Math.floor((mi + 1) / 12)) : ''),
    prevMonthName: MONTHS[mod12(mi - 1)] + ' ' + (Y + Math.floor((mi - 1) / 12)),
    nextMonthName: MONTHS[mod12(mi + 1)] + ' ' + (Y + Math.floor((mi + 1) / 12)),
    // A month's arrows say the month they landed on: the heading is only for screen readers and isn't focused.
    prevMonth: () => logic.s({ ...monthPatch(mi - 1), day: 1, announce: MONTHS[mod12(mi - 1)] + ' ' + (Y + Math.floor((mi - 1) / 12)) }),
    nextMonth: () => logic.s({ ...monthPatch(mi + 1), day: 1, announce: MONTHS[mod12(mi + 1)] + ' ' + (Y + Math.floor((mi + 1) / 12)) }),
    months,
    days,
    dayName: DOWFULL[selDate.getDay()],
    shortDate: monDay(selDate),
    weekLabel,
    // The week on screen as a new program: one block of 4 weeks with its workouts on their days, opened to edit.
    saveWeek: logic.model.programsReady
      ? () =>
          logic.saveOnce(
            'program',
            () => db.createProgramFrom('Week of ' + weekLabel, '', [{ name: 'Block 1', weeks: 4, workouts: db.weekBlock(logic.model, weekStart) }]),
            (id: string) => ({ screen: 'programEdit', programId: id, ...noticePatch('Saved as a program. Name it, set its weeks, and start it from its page.', 'programEdit') }),
          )
      : null,
    savingWeek: logic.busy('program'),
    hasRows: weekRows.some((r) => r.hasRow),
    noRows: !weekRows.some((r) => r.hasRow),
    // Only what's true: a day with a session gets a quest.
    emptyWeekNote: 'No sessions scheduled this week. Add one and that day gets a quest. The editor lets you pick any day.',
    weekAllDone: weekRows.some((r) => r.hasRow) && weekRows.filter((r) => r.hasRow).every((r) => r.done),
    weekDoneNote: (weekRows.filter((r) => r.hasRow).length === 1 ? 'Its one session done.' : 'All ' + weekRows.filter((r) => r.hasRow).length + ' sessions done.') + ' Every quest this week is cleared.',
    todayLabel: 'TODAY · ' + DOW3[todayDate.getDay()] + ' ' + TODAY_D,
    hasToday: isCurMonth && todayActs.length > 0,
    todayCards: todayActs.map((a) => ({
      name: nameOf(a.name),
      // Its name with pauses, where the tag, title and detail would run together.
      aria: [nameOf(a.name), a.warmup ? 'warm-up' : a.stretch ? 'stretch' : a.yoga ? 'yoga' : '', metaFor(a)].filter(Boolean).join(', '),
      warmup: !!a.warmup,
      stretch: !!a.stretch,
      yoga: !!a.yoga,
      meta: metaFor(a),
      open: () =>
        logic.openSession(TODAY_M, TODAY_D, a.id),
    })),
  };
}
