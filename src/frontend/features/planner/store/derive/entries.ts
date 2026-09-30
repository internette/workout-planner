import { idOf, isoOf, minText, plural, toMinutes } from '@/frontend/shared/helpers';
import type { BaseCtx } from '../types';
import type { Entry, Exercise } from '@/frontend/data/plannerData';

// Per-entry helpers (names, exercise counts, done state), the chronicle filter and the mood / effort widgets.
export function entriesStage(ctx: BaseCtx) {
  const { st, EXV, DIARY, nowDate, Y, TODAY_M, TODAY_D, TK } = ctx;
  const nameOf = (n: string): string => ((st.renames || {})[n] != null && st.renames[n] !== '' ? st.renames[n] : n);
  // An entry's exercises come from the version of the workout it was scheduled with, not the current one.
  const instList = (exKey: string, key: string): Exercise[] =>
    (EXV[exKey] || [])
      .concat((st.extra || {})[key] || [])
      .filter((e) => ((st.removed || {})[key] || []).indexOf(e.name) === -1);
  // How many exercises a session has, and how many are ticked. Asked for every session in history several times a
  // render (done states, XP, the calendar's markers), so each session's answer is kept for the rest of this render.
  const counts = new WeakMap<Entry, { all: number; done: number }>();
  const countsOf = (av: Entry) => {
    let c = counts.get(av);
    if (!c) {
      const list = instList(av.exKey, idOf(av));
      const dn = (st.done || {})[idOf(av)] || [];
      c = { all: list.length, done: list.filter((e) => dn.indexOf(e.name) !== -1).length };
      counts.set(av, c);
    }
    return c;
  };
  const countAt = (av: Entry) => countsOf(av).all;
  const doneCountAt = (av: Entry) => countsOf(av).done;
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
  const ENTRIES = { ...DIARY };
  // "Today" was a filter once; one still saved with it shows its day as a range.
  const dScope = ((st.diaryScope as string) === 'today' ? 'range' : st.diaryScope) || 'all';
  const isoToday = isoOf(nowDate);
  const iso30 = isoOf(new Date(Y, TODAY_M, TODAY_D - 29));
  const rideDoneAt = (av: Entry) => !!(st.rideDone || {})[idOf(av)];
  // What a finished session actually took (recorded by Finish), next to what was planned.
  const actualMinutes = (av: Entry) =>
    av && av.actual ? toMinutes(av.actual.hrs, av.actual.mins) : 0;
  // Done, everywhere: a ride marked complete; a lift with every exercise ticked, or finished with Finish (which records
  // its time) even with some left unticked.
  const doneMemo = new WeakMap<Entry, boolean>();
  const isDoneEntry = (av: Entry) => {
    if (!av) return false;
    let done = doneMemo.get(av);
    if (done === undefined) {
      done = av.ride ? rideDoneAt(av) : (countAt(av) > 0 && doneCountAt(av) === countAt(av)) || actualMinutes(av) > 0;
      doneMemo.set(av, done);
    }
    return done;
  };
  // A finished session's time, else the planned one ("~50 min").
  const timeOf = (av: Entry) => (actualMinutes(av) ? minText(actualMinutes(av)) : av.time);
  // A ride's distance: what was ridden once it's done and recorded, else the plan.
  const distOf = (av: Entry) => (av.ride && isDoneEntry(av) && av.actual && av.actual.dist ? av.actual.dist : av.ride ? av.ride.dist : '');
  // What a completed session took: its recorded time, or for a lift completed by ticking every exercise (no time
  // recorded) how many it cleared, rather than the planned estimate.
  const doneTimeOf = (av: Entry) =>
    actualMinutes(av) ? minText(actualMinutes(av)) : av.ride ? av.time : plural(countAt(av), 'exercise');
  // Worded as the Day view's cards word it: a finished session says "Completed".
  const metaFor = (av: Entry) =>
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
