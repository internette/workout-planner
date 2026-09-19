import { DOW3, DOWFULL, MON3, MONTHS } from '../constants';
import { tokenFor } from '../helpers';
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
    seg,
    Y,
    mi,
    months,
    days,
    selDate,
    weekLabel,
    wkStart,
    todayDate,
    TODAY_D,
    isCurMonth,
    todayAct,
    nameOf,
    TODAY_M,
    metaFor,
  } = ctx;
  return {
    weekRows,
    monthCells,
    constellation,
    segRowStyle:
      'display:flex;gap:4px;padding:5px;background:#fff;border-radius:16px;box-shadow:0 4px 14px rgba(35,42,69,.07);' +
      (narrow ? 'flex:1 1 100%;width:100%' : 'flex:none'),
    monthBtn:
      'display:inline-flex;align-items:center;gap:7px;margin-left:-10px;padding:8px 10px;border:none;border-radius:14px;background:' +
      (st.monthOpen ? 'rgba(35,42,69,.05)' : 'none') +
      ';cursor:pointer',
    monthDone: monthDays.filter((x) => x.done).length,
    monthDoneUnit: 'of ' + monthDays.length + ' done',
    dowLabels: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    showDay: st.seg === 'Day',
    showWeek: st.seg === 'Week',
    showMonth: st.seg === 'Month',
    isRest: st.seg === 'Day' && !actFor(selDay),
    hasWorkout: st.seg === 'Day' && !!actFor(selDay),
    segDayStyle: seg(st.seg === 'Day'),
    segWeekStyle: seg(st.seg === 'Week'),
    segMonthStyle: seg(st.seg === 'Month'),
    segDayOn: st.seg === 'Day',
    segWeekOn: st.seg === 'Week',
    segMonthOn: st.seg === 'Month',
    segDay: () => logic.s({ seg: 'Day' }),
    segWeek: () => logic.s({ seg: 'Week' }),
    segMonth: () => logic.s({ seg: 'Month' }),
    monthName: st.month,
    monthOpen: st.monthOpen,
    caretStyle:
      'border:none;background:none;cursor:pointer;padding:4px;display:flex;align-items:center;transition:transform .2s;transform:rotate(' +
      (st.monthOpen ? '180' : '0') +
      'deg)',
    toggleMonth: () => logic.s({ monthOpen: !st.monthOpen }),
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
    emptyWeekNote:
      "No sessions scheduled this week. Add one and there's a " +
      tokenFor(wkStart.getDate() + 5) +
      ' waiting — three a week keeps the streak alive.',
    weekAllDone: weekRows.some((r) => r.hasRow) && weekRows.filter((r) => r.hasRow).every((r) => r.done),
    weekDoneNote:
      'All ' +
      weekRows.filter((r) => r.hasRow).length +
      ' sessions logged. Every ' +
      tokenFor(wkStart.getDate() + mi * 3) +
      ' claimed this week.',
    todayLabel: 'TODAY · ' + DOW3[todayDate.getDay()] + ' ' + TODAY_D,
    hasToday: isCurMonth && !!todayAct,
    todayName: todayAct ? nameOf(todayAct.name) : '',
    openToday: () => logic.nav({ screen: 'detail', creating: false, month: MONTHS[TODAY_M], day: TODAY_D }),
    todayMeta: todayAct ? metaFor(todayAct) : '',
  };
}
