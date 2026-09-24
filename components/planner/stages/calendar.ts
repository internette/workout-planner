import { DOW1, DOW3, DOWFULL, MON3, MONTHS, PINK } from '../constants';
import { CAT, mod12, monthPatch } from '../helpers';
import React from 'react';
import type { Ctx } from '../types';

// The selected month, week and day, plus the week list, month grid and its constellation.
export function calendarStage(ctx: Ctx): Ctx {
  const { logic, st, Y, TODAY_M, seedAt, entriesAt, TK, relM, isDoneEntry, TODAY_D, nameOf, metaFor, ACT, doneCountAt, instList, actualMinutes } = ctx;
  // The month on screen, counted from January of this year (so it can run into next year, or back into last).
  const mi = MONTHS.indexOf(st.month) + 12 * (st.yOff || 0);
  const dim = new Date(Y, mi + 1, 0).getDate();
  const selDay = Math.min(st.day, dim);
  const isCurMonth = mi === TODAY_M;
  const actFor = (d) => seedAt(mi, d);
  const actForDate = (d) => seedAt(relM(d), d.getDate());
  const listForDate = (d) => entriesAt(relM(d), d.getDate());
  // A day's marker sums up all of its workouts: done once every one is, missed once it is past and any one isn't.
  const allDone = (list) => list.length > 0 && list.every(isDoneEntry);
  const workoutsWord = (list) => (list.length > 1 ? list.length + ' workouts, ' : '');
  // A past day that isn't all done but where something was — a workout of several, an exercise, a finished session —
  // is "partly done" (a half moon), not "missed". Today keeps its planned marker until it's over.
  const someDone = (av) => isDoneEntry(av) || (!av.ride && doneCountAt(av) > 0) || actualMinutes(av) > 0;
  const partly = (list) => list.length > 0 && !allDone(list) && list.some(someDone);
  const partText = (list) =>
    list.length > 1
      ? list.filter(isDoneEntry).length + ' of ' + list.length + ' workouts done'
      : doneCountAt(list[0]) + ' of ' + instList(list[0].exKey, list[0].id).length + ' exercises done';
  const halfMoon = (color) =>
    'width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 1.5px ' + color + ';background:linear-gradient(90deg,' + color + ' 50%,transparent 50%)';
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
    const list = listForDate(d);
    const past = relM(d) * 100 + d.getDate() < TK;
    const done = allDone(list);
    const part = past && partly(list);
    return [DOW1[d.getDay()], d.getDate(), list.length > 0, relM(d) === mi, relM(d), done, list.length > 0 && !done && past && !part, list, part];
  });
  const days = dayDefs.map(([letter, num, dot, same, cellMonth, done, miss, list, part]) => {
    const on = selDay === num && same;
    return {
      letter,
      num,
      selected: on,
      pick: () => logic.s({ ...monthPatch(cellMonth), day: num, monthOpen: false, entryId: null }),
      mon: spansMonths ? MON3[mod12(cellMonth)].toUpperCase() : '',
      monStyle: spansMonths
        ? 'font-size:var(--text-2xs);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-wide);color:' + (on ? 'rgba(255,255,255,.8)' : 'var(--color-subtle)')
        : 'display:none',
      aria:
        DOWFULL[new Date(Y, cellMonth, num).getDay()] +
        ', ' +
        MONTHS[mod12(cellMonth)] +
        ' ' +
        num +
        ' — ' +
        (!dot ? 'rest day' : workoutsWord(list) + (done ? 'completed' : part ? 'partly done, ' + partText(list) : miss ? 'missed' : 'planned')),
      isToday: cellMonth === TODAY_M && num === TODAY_D ? 'date' : false,
      wrapStyle:
        'flex:1;min-width:0;padding:8px 2px 10px;border:none;border-radius:16px;background:' +
        (on ? PINK : 'none') +
        ';display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer',
      letterStyle:
        "font-family:var(--font-heading);" +
        'font-size:var(--text-sm);font-weight:var(--font-weight-semibold);color:' +
        (on ? 'var(--color-white)' : 'var(--color-muted)'),
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
          : part
            ? halfMoon(on ? 'var(--color-white)' : 'var(--color-slate)')
            : miss
              ? 'width:7px;height:7px;border-radius:50%;background:none;box-shadow:inset 0 0 0 1.5px ' +
                (on ? 'rgba(255,255,255,.85)' : 'var(--color-muted)')
              : 'width:6px;height:6px;border-radius:50%;background:none;box-shadow:inset 0 0 0 1.5px ' +
                (on ? 'var(--color-white)' : 'var(--color-teal)'),
    };
  });
  const shownYOff = Math.floor(mi / 12);
  const months = MONTHS.map((name) => ({
    name,
    current: st.month === name,
    short: MON3[MONTHS.indexOf(name)],
    pick: () => logic.s({ month: name, yOff: shownYOff, monthOpen: false, day: 1 }),
    style:
      "font-family:var(--font-heading);" +
      'padding:11px 6px;border-radius:12px;font-size:var(--text-base);border:none;cursor:pointer;' +
      (st.month === name ? 'background:' + PINK + ';color:var(--color-white);font-weight:var(--font-weight-bold)' : 'color:var(--color-ink);font-weight:var(--font-weight-medium)'),
  }));
  // One row per workout. A day with several shows its date once, above the first.
  const weekRows = cells.flatMap((d) => {
    const list = listForDate(d);
    if (!list.length) {
      const today0 = relM(d) === TODAY_M && d.getDate() === TODAY_D;
      const lab =
        DOW3[d.getDay()] +
        ' ' +
        (relM(d) === mi ? '' : MON3[d.getMonth()].toUpperCase() + ' ') +
        d.getDate() +
        (today0 ? ' · TODAY' : '');
      return [{
        label: lab,
        isRest: true,
        hasRow: false,
        done: false,
        eyebrow:
          'font-size:var(--text-xs);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-wide);margin:14px 0 9px;color:' +
          (today0 ? 'var(--color-pink-deep)' : 'var(--color-muted)'),
      }];
    }
    return list.map((a, ix) => weekRow(d, a, ix));
  });
  function weekRow(d, a, ix) {
    const today = a.s === 't';
    const past = relM(d) * 100 + d.getDate() < TK;
    const part = past && partly([a]);
    const label =
      DOW3[d.getDay()] +
      ' ' +
      (relM(d) === mi ? '' : MON3[d.getMonth()].toUpperCase() + ' ') +
      d.getDate() +
      (today ? ' · TODAY' : '');
    return {
      label,
      hasRow: true,
      isRest: false,
      name: nameOf(a.name),
      done: isDoneEntry(a),
      meta: metaFor(a),
      isPush: !a.ride && CAT(a.name) === 'Push',
      isPull: !a.ride && CAT(a.name) === 'Pull',
      isLegs: !a.ride && CAT(a.name) === 'Legs',
      isCore: !a.ride && CAT(a.name) === 'Core',
      isRideRow: !!a.ride,
      open: () =>
        logic.nav({ screen: 'detail', creating: false, ...monthPatch(relM(d)), day: d.getDate(), entryId: a.id }),
      aria:
        label.replace(' · ', ', ') +
        ': ' +
        a.name +
        ', ' +
        metaFor(a) +
        ', ' +
        (isDoneEntry(a) ? 'completed' : part ? 'partly done' : past ? 'missed' : 'planned'),
      stateDot:
        'flex:none;margin-left:auto;' +
        (isDoneEntry(a)
          ? 'width:8px;height:8px;border-radius:50%;background:var(--color-slate)'
          : part
            ? halfMoon('var(--color-slate)')
            : past
            ? 'width:9px;height:9px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--color-muted)'
            : 'width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 1.5px var(--color-teal)'),
      eyebrow:
        ix > 0
          ? 'display:none'
          : 'font-size:var(--text-xs);font-weight:var(--font-weight-bold);letter-spacing:var(--tracking-wide);margin:14px 0 9px;color:' +
            (label.indexOf('TODAY') > -1 ? 'var(--color-pink-deep)' : 'var(--color-muted)'),
    };
  }
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
    const list = entriesAt(mi, d);
    let a = list.length ? list[0].s : null;
    if (list.length && a !== 't' && allDone(list)) a = 'c';
    const today = a === 't';
    const sel = d === selDay;
    const part = !!a && a !== 'c' && a !== 't' && mi * 100 + d < TK && partly(list);
    const missed = !!a && a !== 'c' && a !== 't' && mi * 100 + d < TK && !part;
    monthCells.push({
      label: String(d),
      day: d,
      // One tab stop for the whole grid: the selected day. Arrow keys move between days.
      tabStop: sel ? 0 : -1,
      selected: sel,
      // A click means "go look at that day" — unlike arrow-key browsing of the grid, which only moves
      // the selection so exploring the month doesn't keep bouncing you over to Day view.
      pick: () => logic.s({ day: d, seg: 'Day', entryId: null }),
      wrap:
        'height:50px;border:none;border-radius:14px;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;' +
        (sel
          ? 'background:var(--color-pink)'
          : missed
            ? 'background:rgba(255,255,255,.5)'
            : a
              ? 'background:var(--color-white);box-shadow:0 1px 3px rgba(35,42,69,.06)'
              : 'background:none') +
        (today && !sel ? ';box-shadow:inset 0 0 0 1.5px rgba(213,49,129,.45)' : ''),
      aria: d
        ? DOWFULL[new Date(Y, mi, d).getDay()] +
          ', ' +
          MONTHS[mod12(mi)] +
          ' ' +
          d +
          ' — ' +
          (a ? workoutsWord(list) : '') +
          (a === 'c' ? 'completed' : part ? 'partly done, ' + partText(list) : missed ? 'missed' : a ? 'planned' : 'rest day') +
          (today ? ', today' : '')
        : '',
      isToday: today ? 'date' : false,
      num:
        "font-family:var(--font-heading);font-size:var(--text-md);font-weight:" +
        (a ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)') +
        ';color:' +
        (sel ? 'var(--color-white)' : missed ? 'var(--color-muted)' : a ? 'var(--color-ink)' : 'var(--color-muted)'),
      dot: part
        ? halfMoon(sel ? 'var(--color-white)' : 'var(--color-slate)')
        : a === 'c' || (sel && a && !missed)
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
    listForDate,
    dayEntries: entriesAt(mi, selDay),
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
    shownYOff,
  };
}
