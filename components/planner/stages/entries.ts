import { idOf, isoOf, plural } from '../helpers';
import type { Ctx } from '../types';

// Per-entry helpers (names, exercise counts, done state), the chronicle filter and the mood / effort widgets.
export function entriesStage(ctx: Ctx): Ctx {
  const { logic, st, EXV, DIARY, nowDate, Y, TODAY_M, TODAY_D } = ctx;
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
  const ENTRIES = {};
  Object.assign(ENTRIES, DIARY);
  const dScope = st.diaryScope || 'all';
  const isoToday = isoOf(nowDate);
  const iso30 = isoOf(new Date(Y, TODAY_M, TODAY_D - 29));
  const rideDoneAt = (av) => !!(st.rideDone || {})[idOf(av)];
  const isDoneEntry = (av) => !!av && (av.ride ? rideDoneAt(av) : countAt(av) > 0 && doneCountAt(av) === countAt(av));
  // What a finished session actually took (recorded by Finish), next to what was planned.
  const actualMinutes = (av) =>
    av && av.actual ? Number(av.actual.hrs || 0) * 60 + Number(av.actual.mins || 0) : 0;
  const minText = (m) => (Math.floor(m / 60) ? Math.floor(m / 60) + ' h ' + (m % 60 ? (m % 60) + ' min' : '') : m + ' min').trim();
  // A finished session's time, else the planned one ("~50 min").
  const timeOf = (av) => (actualMinutes(av) ? minText(actualMinutes(av)) : av.time);
  // A ride's distance: what was ridden once it's done and recorded, else the plan.
  const distOf = (av) => (av.ride && isDoneEntry(av) && av.actual && av.actual.dist ? av.actual.dist : av.ride ? av.ride.dist : '');
  const metaFor = (av) =>
    !av
      ? ''
      : av.ride
        ? distOf(av)
          ? distOf(av) + ' mi · ' + timeOf(av)
          : timeOf(av)
        : isDoneEntry(av)
          ? plural(countAt(av), 'exercise') + ' · ' + timeOf(av)
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
  const moods = moodDefs.map(([name, bg]) => {
    const on = st.mood === name;
    return {
      name,
      pick: () => logic.s({ mood: name }),
      wrap: 'border:none;background:none;padding:6px;display:flex;flex-direction:column;align-items:center;gap:9px;cursor:pointer;border-radius:16px',
      face:
        'width:60px;height:60px;border-radius:50%;background:' +
        bg +
        ';display:flex;align-items:center;justify-content:center;box-shadow:' +
        (on ? '0 0 0 2px var(--color-canvas), 0 0 0 4px ' + bg : 'none'),
      isHappy: name === 'Happy',
      isNeutral: name === 'Neutral',
      isSad: name === 'Sad',
      isMad: name === 'Mad',
      label: 'font-size:var(--text-md);font-weight:' + (on ? 'var(--font-weight-bold)' : 'var(--font-weight-medium)') + ';color:' + (on ? 'var(--color-ink)' : 'var(--color-muted)'),
    };
  });
  const RPE_WORDS = ['Easy', 'Steady', 'Solid', 'Hard', 'All out'];
  const stars = [1, 2, 3, 4, 5].map((n) => ({
    glyph: n <= st.rpe ? '★' : '☆',
    pick: () => logic.s({ rpe: n }),
    style:
      'border:none;background:none;padding:0;font-size:var(--text-5xl);line-height:var(--leading-none);cursor:pointer;color:' +
      (n <= st.rpe ? 'var(--color-ink)' : 'var(--color-hairline)'),
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
    isoToday,
    iso30,
    dScope,
    diaryDays,
    moods,
    stars,
    RPE_WORDS,
  };
}
