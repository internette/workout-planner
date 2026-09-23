import { DOW1, DOW3, DOWFULL, MON3, MONTHS, PINK } from '../constants';
import { CAT } from '../helpers';
import React from 'react';
import type { Ctx } from '../types';

// The selected month, week and day, plus the week list, month grid and its constellation.
export function calendarStage(ctx: Ctx): Ctx {
  const { logic, st, Y, TODAY_M, seedAt, TK, isDoneEntry, TODAY_D, nameOf, metaFor, ACT } = ctx;
  const mi = MONTHS.indexOf(st.month);
  const dim = new Date(Y, mi + 1, 0).getDate();
  const selDay = Math.min(st.day, dim);
  const isCurMonth = mi === TODAY_M;
  const actFor = (d) => seedAt(mi, d);
  const actForDate = (d) => seedAt(d.getMonth(), d.getDate());
  const selDate = new Date(Y, mi, selDay);
  const wkStart = new Date(Y, mi, selDay - selDate.getDay());
  const cells = [];
  for (let i = 0; i < 7; i++) cells.push(new Date(wkStart.getFullYear(), wkStart.getMonth(), wkStart.getDate() + i));
  const wkEnd = cells[6];
  const stamp = (d) => MON3[d.getMonth()] + ' ' + d.getDate();
  const weekLabel =
    wkStart.getMonth() === wkEnd.getMonth()
      ? MON3[wkStart.getMonth()] + ' ' + wkStart.getDate() + ' – ' + wkEnd.getDate()
      : stamp(wkStart) + ' – ' + stamp(wkEnd);
  const spansMonths = cells[0].getMonth() !== cells[6].getMonth();
  const dayDefs = cells.map((d) => {
    const av = actForDate(d);
    const past = d.getMonth() * 100 + d.getDate() < TK;
    const done = !!av && isDoneEntry(av);
    return [DOW1[d.getDay()], d.getDate(), !!av, d.getMonth() === mi, d.getMonth(), done, !!av && !done && past];
  });
  const days = dayDefs.map(([letter, num, dot, same, cellMonth, done, miss]) => {
    const on = selDay === num && same;
    return {
      letter,
      num,
      pick: () => logic.s({ month: MONTHS[cellMonth], day: num, monthOpen: false }),
      mon: spansMonths ? MON3[cellMonth].toUpperCase() : '',
      monStyle: spansMonths
        ? 'font-size:var(--text-2xs);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-wide);color:' + (on ? 'rgba(255,255,255,.8)' : 'var(--color-subtle)')
        : 'display:none',
      aria:
        DOWFULL[new Date(Y, cellMonth, num).getDay()] +
        ', ' +
        MONTHS[cellMonth] +
        ' ' +
        num +
        ' — ' +
        (!dot ? 'rest day' : done ? 'completed' : miss ? 'missed' : 'planned'),
      isToday: cellMonth === TODAY_M && num === TODAY_D ? 'date' : false,
      wrapStyle:
        'flex:1;min-width:0;padding:8px 2px 10px;border:none;border-radius:16px;background:' +
        (on ? PINK : 'none') +
        ';display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer',
      letterStyle:
        "font-family:var(--font-heading);" +
        'font-size:var(--text-sm);font-weight:var(--font-weight-semibold);color:' +
        (on ? 'rgba(255,255,255,.85)' : 'var(--color-muted)'),
      numStyle:
        "font-family:var(--font-heading);" +
        'font-size:var(--text-xl);font-weight:' +
        (on ? 'var(--font-weight-bold)' : 'var(--font-weight-semibold)') +
        ';color:' +
        (on ? 'var(--color-white)' : same ? 'var(--color-ink)' : 'var(--color-hairline)'),
      dotStyle: !dot
        ? 'width:10px;height:2px;border-radius:1px;background:' + (on ? 'rgba(255,255,255,.6)' : 'var(--color-divider)')
        : done
          ? 'width:6px;height:6px;border-radius:50%;background:' + (on ? 'var(--color-white)' : 'var(--color-slate)')
          : miss
            ? 'width:7px;height:7px;border-radius:50%;background:none;box-shadow:inset 0 0 0 1.5px ' +
              (on ? 'rgba(255,255,255,.85)' : 'var(--color-muted)')
            : 'width:6px;height:6px;border-radius:50%;background:none;box-shadow:inset 0 0 0 1.5px ' +
              (on ? 'var(--color-white)' : 'var(--color-teal)'),
    };
  });
  const months = MONTHS.map((name) => ({
    name,
    short: MON3[MONTHS.indexOf(name)],
    pick: () => logic.s({ month: name, monthOpen: false, day: 1 }),
    style:
      "font-family:var(--font-heading);" +
      'padding:11px 6px;border-radius:12px;font-size:var(--text-base);border:none;cursor:pointer;' +
      (st.month === name ? 'background:' + PINK + ';color:var(--color-white);font-weight:var(--font-weight-bold)' : 'color:var(--color-ink);font-weight:var(--font-weight-medium)'),
  }));
  const weekRows = cells.map((d) => {
    const a = actForDate(d);
    if (!a) {
      const today0 = d.getMonth() === TODAY_M && d.getDate() === TODAY_D;
      const lab =
        DOW3[d.getDay()] +
        ' ' +
        (d.getMonth() === mi ? '' : MON3[d.getMonth()].toUpperCase() + ' ') +
        d.getDate() +
        (today0 ? ' · TODAY' : '');
      return {
        label: lab,
        isRest: true,
        hasRow: false,
        done: false,
        eyebrow:
          'font-size:var(--text-xs);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-wide);margin:14px 0 9px;color:' +
          (today0 ? 'var(--color-pink-deep)' : 'var(--color-muted)'),
      };
    }
    const today = a.s === 't';
    const label =
      DOW3[d.getDay()] +
      ' ' +
      (d.getMonth() === mi ? '' : MON3[d.getMonth()].toUpperCase() + ' ') +
      d.getDate() +
      (today ? ' · TODAY' : '');
    return {
      label,
      hasRow: true,
      isRest: false,
      name: nameOf(a.name),
      done: isDoneEntry(a),
      meta: metaFor(a),
      isPush: CAT(a.name) === 'Push',
      isPull: CAT(a.name) === 'Pull',
      isLegs: CAT(a.name) === 'Legs',
      isCore: CAT(a.name) === 'Core',
      isRideRow: !!a.ride,
      open: () => logic.nav({ screen: 'detail', creating: false, month: MONTHS[d.getMonth()], day: d.getDate() }),
      aria:
        label.replace(' · ', ', ') +
        ': ' +
        a.name +
        ', ' +
        metaFor(a) +
        ', ' +
        (isDoneEntry(a) ? 'completed' : d.getMonth() * 100 + d.getDate() < TK ? 'missed' : 'planned'),
      stateDot:
        'flex:none;margin-left:auto;' +
        (isDoneEntry(a)
          ? 'width:8px;height:8px;border-radius:50%;background:var(--color-slate)'
          : d.getMonth() * 100 + d.getDate() < TK
            ? 'width:9px;height:9px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--color-muted)'
            : 'width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--color-teal)'),
      eyebrow:
        'font-size:var(--text-xs);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-wide);margin:14px 0 9px;color:' +
        (label.indexOf('TODAY') > -1 ? 'var(--color-pink-deep)' : 'var(--color-muted)'),
    };
  });
  const lead = new Date(Y, mi, 1).getDay();
  const rows = Math.ceil((lead + dim) / 7);
  const monthCells = [];
  for (let i = 0; i < rows * 7; i++) {
    const d = i - lead + 1;
    if (d < 1 || d > dim) {
      // Padding before the 1st and after the last day: shown as empty space, not as a control.
      monthCells.push({ blank: true, label: '', wrap: 'height:50px', num: 'display:none', dot: 'display:none' });
      continue;
    }
    const av = actFor(d);
    let a = av && av.s;
    if (av && a !== 't' && isDoneEntry(av)) a = 'c';
    const today = a === 't';
    const sel = d === selDay;
    const missed = !!a && a !== 'c' && a !== 't' && isCurMonth && d < TODAY_D;
    monthCells.push({
      label: String(d),
      day: d,
      // One tab stop for the whole grid: the selected day. Arrow keys move between days.
      tabStop: sel ? 0 : -1,
      selected: sel,
      // A click means "go look at that day" — unlike arrow-key browsing of the grid, which only moves
      // the selection so exploring the month doesn't keep bouncing you over to Day view.
      pick: () => logic.s({ day: d, seg: 'Day' }),
      wrap:
        'height:50px;border:none;border-radius:14px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;' +
        (sel
          ? 'background:var(--color-pink)'
          : missed
            ? 'background:rgba(255,255,255,.5)'
            : a
              ? 'background:var(--color-white);box-shadow:0 1px 3px rgba(35,42,69,.06)'
              : 'background:none') +
        (today && !sel ? ';box-shadow:inset 0 0 0 1.5px rgba(225,105,156,.45)' : ''),
      aria: d
        ? DOWFULL[new Date(Y, mi, d).getDay()] +
          ', ' +
          st.month +
          ' ' +
          d +
          ' — ' +
          (a === 'c' ? 'completed' : missed ? 'missed' : a ? 'planned' : 'rest day') +
          (today ? ', today' : '')
        : '',
      isToday: today ? 'date' : false,
      num:
        "font-family:var(--font-heading);font-size:var(--text-md);font-weight:" +
        (a ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)') +
        ';color:' +
        (sel ? 'var(--color-white)' : missed ? 'var(--color-muted)' : a ? 'var(--color-ink)' : 'var(--color-muted)'),
      dot:
        a === 'c' || (sel && a && !missed)
          ? 'width:6px;height:6px;border-radius:50%;background:' + (sel ? 'var(--color-white)' : 'var(--color-slate)')
          : missed
            ? 'width:7px;height:7px;border-radius:50%;background:none;position:relative;box-shadow:inset 0 0 0 1.5px ' +
              (sel ? 'rgba(255,255,255,.85)' : 'var(--color-muted)')
            : a
              ? 'width:6px;height:6px;border-radius:50%;background:none;box-shadow:inset 0 0 0 1.5px ' +
                (sel ? 'var(--color-white)' : 'var(--color-teal)')
              : 'width:7px;height:1.5px;border-radius:1px;background:' + (sel ? 'rgba(255,255,255,.6)' : 'var(--color-divider)'),
    });
  }
  const activeDays = isCurMonth
    ? Object.keys(ACT)
        .map(Number)
        .sort((a, b) => a - b)
    : [];
  const pts = activeDays
    .map((d) => {
      const i = d + lead - 1;
      return (i % 7) + 0.5 + ',' + (Math.floor(i / 7) + 0.5);
    })
    .join(' ');
  const constellation = React.createElement(
    'svg',
    {
      'aria-hidden': 'true',
      viewBox: '0 0 7 ' + rows,
      preserveAspectRatio: 'none',
      style: { width: '100%', height: '100%', display: 'block' },
    },
    React.createElement('polyline', {
      points: pts,
      fill: 'none',
      stroke: 'var(--color-periwinkle)',
      strokeWidth: 0.015,
      strokeDasharray: '0.06 0.05',
      strokeLinejoin: 'round',
    }),
  );
  return {
    actForDate,
    mi,
    dim,
    selDay,
    actFor,
    weekRows,
    monthCells,
    constellation,
    months,
    days,
    selDate,
    weekLabel,
    wkStart,
    isCurMonth,
  };
}
