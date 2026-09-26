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
  const RPE_WORDS = ['Easy', 'Steady', 'Solid', 'Hard', 'All out'];
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
    RPE_WORDS,
  };
}
