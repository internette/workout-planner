import { idOf, isoOf } from '../helpers';
import type { Ctx } from '../types';

// Per-entry helpers (names, exercise counts, done state), the chronicle filter and the mood / effort widgets.
export function entriesStage(ctx: Ctx): Ctx {
  const { logic, st, EX, DIARY, nowDate, Y, TODAY_M, TODAY_D } = ctx;
  const nameOf = (n) => ((st.renames || {})[n] != null && st.renames[n] !== '' ? st.renames[n] : n);
  const instList = (name, key) =>
    (EX[name] || [])
      .concat((st.extra || {})[key] || [])
      .filter((e) => ((st.removed || {})[key] || []).indexOf(e.name) === -1);
  const countAt = (av) => instList(av.name, idOf(av)).length;
  const doneCountAt = (av) => {
    const dn = (st.done || {})[idOf(av)] || [];
    return instList(av.name, idOf(av)).filter((e) => dn.indexOf(e.name) !== -1).length;
  };
  const ENTRIES = {};
  Object.assign(ENTRIES, DIARY);
  const dScope = st.diaryScope || 'all';
  const isoToday = isoOf(nowDate);
  const iso30 = isoOf(new Date(Y, TODAY_M, TODAY_D - 29));
  const rideDoneAt = (av) => !!(st.rideDone || {})[idOf(av)];
  const isDoneEntry = (av) => !!av && (av.ride ? rideDoneAt(av) : countAt(av) > 0 && doneCountAt(av) === countAt(av));
  const metaFor = (av) =>
    !av
      ? ''
      : av.ride
        ? av.ride.dist
          ? av.ride.dist + ' mi · ' + av.time
          : av.time
        : isDoneEntry(av)
          ? countAt(av) + ' exercises · ' + av.time
          : doneCountAt(av) > 0
            ? doneCountAt(av) + ' of ' + countAt(av) + ' done · ' + av.time
            : countAt(av) + ' exercises · ' + av.time;
  const diaryDays = Object.keys(ENTRIES)
    .sort((a, b) => ENTRIES[b].m * 100 + ENTRIES[b].d - (ENTRIES[a].m * 100 + ENTRIES[a].d))
    .filter((id) => {
      const e = ENTRIES[id];
      const iso = isoOf(new Date(Y, e.m, e.d));
      if (st.rFrom && iso < st.rFrom) return false;
      if (st.rTo && iso > st.rTo) return false;
      return true;
    });
  const firstEntry = (name) => {
    const hit = logic.model.entries.find((x) => x.av.name === name);
    return hit ? { m: hit.m, d: hit.d } : null;
  };
  const moodDefs = [
    ['Happy', '#E1699C'],
    ['Neutral', '#5C6684'],
    ['Sad', '#7C8FC9'],
    ['Mad', '#B23A4C'],
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
        (on ? '0 0 0 2px #FBF1F3, 0 0 0 4px ' + bg : 'none'),
      isHappy: name === 'Happy',
      isNeutral: name === 'Neutral',
      isSad: name === 'Sad',
      isMad: name === 'Mad',
      label: 'font-size:12.5px;font-weight:' + (on ? '700' : '500') + ';color:' + (on ? '#232A45' : '#746E88'),
    };
  });
  const RPE_WORDS = ['Easy', 'Steady', 'Solid', 'Hard', 'All out'];
  const stars = [1, 2, 3, 4, 5].map((n) => ({
    glyph: n <= st.rpe ? '★' : '☆',
    pick: () => logic.s({ rpe: n }),
    style:
      'border:none;background:none;padding:0;font-size:26px;line-height:1;cursor:pointer;color:' +
      (n <= st.rpe ? '#232A45' : '#C7C4D0'),
  }));
  return {
    isDoneEntry,
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
    firstEntry,
  };
}
