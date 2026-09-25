import { idOf, isoOf, plural } from '../helpers';
import type { Ctx } from '../types';

// Per-entry helpers (names, exercise counts, done state), the chronicle filter and the mood / effort widgets.
export function entriesStage(ctx: Ctx): Ctx {
  const { logic, st, EXV, DIARY, nowDate, Y, TODAY_M, TODAY_D, TK } = ctx;
  const nameOf = (n) => ((st.renames || {})[n] != null && st.renames[n] !== '' ? st.renames[n] : n);
  // An entry's exercises come from the version of the workout it was scheduled with, not the current one.
  const instList = (exKey, key) =>
    (EXV[exKey] || [])
      .concat((st.extra || {})[key] || [])
      .filter((e) => ((st.removed || {})[key] || []).indexOf(e.name) === -1);
  const countAt = (av) => instList(av.exKey, idOf(av)).length;
  const doneCountAt = (av) => {
    const dn = (st.done || {})[idOf(av)] || [];
    return instList(av.exKey, idOf(av)).filter((e) => dn.indexOf(e.name) !== -1).length;
  };
  // A session's status, in the same words everywhere it's listed (Progress, the Chronicle's picker): done, partly
  // done or missed once its day has gone by, in progress today once started, otherwise planned.
  const sessionStatus = (m, d, av) => {
    if (isDoneEntry(av)) return 'Done';
    const started = !av.ride && doneCountAt(av) > 0;
    const k = m * 100 + d;
    if (k < TK) return started ? 'Partly done' : 'Missed';
    if (k === TK && (started || (st.workoutTimer || {})[idOf(av)])) return 'In progress';
    return 'Planned';
  };
  const ENTRIES = {};
  Object.assign(ENTRIES, DIARY);
  const dScope = st.diaryScope || 'all';
  const isoToday = isoOf(nowDate);
  const iso30 = isoOf(new Date(Y, TODAY_M, TODAY_D - 29));
  const rideDoneAt = (av) => !!(st.rideDone || {})[idOf(av)];
  // What a finished session actually took (recorded by Finish), next to what was planned.
  const actualMinutes = (av) =>
    av && av.actual ? Number(av.actual.hrs || 0) * 60 + Number(av.actual.mins || 0) : 0;
  // Done, everywhere: a ride marked complete; a lift with every exercise ticked, or finished with Finish (which records
  // its time) even with some left unticked.
  const isDoneEntry = (av) =>
    !!av &&
    (av.ride ? rideDoneAt(av) : (countAt(av) > 0 && doneCountAt(av) === countAt(av)) || actualMinutes(av) > 0);
  const minText = (m) => (Math.floor(m / 60) ? Math.floor(m / 60) + ' h ' + (m % 60 ? (m % 60) + ' min' : '') : m + ' min').trim();
  // A finished session's time, else the planned one ("~50 min").
  const timeOf = (av) => (actualMinutes(av) ? minText(actualMinutes(av)) : av.time);
  // A ride's distance: what was ridden once it's done and recorded, else the plan.
  const distOf = (av) => (av.ride && isDoneEntry(av) && av.actual && av.actual.dist ? av.actual.dist : av.ride ? av.ride.dist : '');
  // What a completed session took: its recorded time, or for a lift completed by ticking every exercise (no time
  // recorded) how many it cleared, rather than the planned estimate.
  const doneTimeOf = (av) =>
    actualMinutes(av) ? minText(actualMinutes(av)) : av.ride ? av.time : plural(countAt(av), 'exercise');
  // Worded as the Day view's cards word it: a finished session says "Completed".
  const metaFor = (av) =>
    !av
      ? ''
      : isDoneEntry(av)
        ? 'Completed · ' + (av.ride && distOf(av) ? distOf(av) + ' mi · ' : '') + doneTimeOf(av)
        : av.ride
          ? distOf(av)
            ? distOf(av) + ' mi · ' + timeOf(av)
            : timeOf(av)
          : doneCountAt(av) > 0
            ? doneCountAt(av) + ' of ' + countAt(av) + ' done · ' + av.time
            : plural(countAt(av), 'exercise') + ' · ' + av.time;
  const diaryDays = Object.keys(ENTRIES)
    .sort((a, b) => ENTRIES[b].m * 100 + ENTRIES[b].d - (ENTRIES[a].m * 100 + ENTRIES[a].d))
    .filter((id) => {
      const e = ENTRIES[id];
      const iso = isoOf(new Date(Y, e.m, e.d));
      if (st.rFrom && iso < st.rFrom) return false;
      if (st.rTo && iso > st.rTo) return false;
      return true;
    });
  const moodDefs = [
    ['Happy', 'var(--color-pink)'],
    ['Neutral', 'var(--color-slate)'],
    ['Sad', 'var(--color-periwinkle)'],
    ['Mad', 'var(--color-danger)'],
  ];
  // Mood and effort are each a radio group: one tab stop (the picked one), arrow keys move the pick and the focus.
  const radioKeys = (count, index, pick, attr) => (e) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    const to = step ? (index + step + count) % count : e.key === 'Home' ? 0 : e.key === 'End' ? count - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    pick(to);
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[' + attr + '="' + to + '"]')?.focus());
  };
  const moods = moodDefs.map(([name, bg], ix) => {
    const on = st.mood === name;
    return {
      name,
      checked: on,
      tab: on || (!st.mood && ix === 0) ? 0 : -1,
      index: ix,
      keys: radioKeys(moodDefs.length, ix, (to) => logic.s({ mood: moodDefs[to][0] }), 'data-mood'),
      pick: () => logic.s({ mood: name }),
      wrap: 'border:none;background:none;padding:6px 2px;min-width:0;display:flex;flex-direction:column;align-items:center;gap:9px;cursor:pointer;border-radius:16px',
      // Sized to the screen (48–60px), so all four fit in one row on the narrowest phones. Once one is picked, the
      // others step back (their names stay at full strength), so the choice is plain at a glance.
      face:
        'width:clamp(48px,15vw,60px);height:clamp(48px,15vw,60px);border-radius:50%;background:' +
        bg +
        ';display:flex;align-items:center;justify-content:center;transition:opacity .2s ease;box-shadow:' +
        (on ? '0 0 0 2px var(--color-canvas), 0 0 0 4px ' + bg : 'none') +
        (st.mood && !on ? ';opacity:.4' : ''),
      isHappy: name === 'Happy',
      isNeutral: name === 'Neutral',
      isSad: name === 'Sad',
      isMad: name === 'Mad',
      label: 'font-size:var(--text-md);font-weight:' + (on ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)') + ';color:' + (on ? 'var(--color-ink)' : 'var(--color-muted)'),
    };
  });
  const RPE_WORDS = ['Easy', 'Steady', 'Solid', 'Hard', 'All out'];
  const stars = [1, 2, 3, 4, 5].map((n) => ({
    on: n <= st.rpe,
    label: n + ' of 5, ' + RPE_WORDS[n - 1],
    checked: n === st.rpe,
    tab: n === (st.rpe || 1) ? 0 : -1,
    index: n - 1,
    keys: radioKeys(5, n - 1, (to) => logic.s({ rpe: to + 1 }), 'data-star'),
    pick: () => logic.s({ rpe: n }),
    // 44px square to tap, however big the star draws.
    style:
      'border:none;border-radius:14px;background:none;padding:0;min-width:44px;min-height:44px;display:inline-flex;align-items:center;justify-content:center;cursor:pointer',
  }));
  return {
    isDoneEntry,
    actualMinutes,
    minText,
    timeOf,
    distOf,
    instList,
    nameOf,
    metaFor,
    ENTRIES,
    doneCountAt,
    doneTimeOf,
    sessionStatus,
    isoToday,
    iso30,
    dScope,
    diaryDays,
    moods,
    stars,
    RPE_WORDS,
  };
}
