import { minText, monthPatch, toMinutes } from '@/frontend/shared/helpers';
import { setsFor } from '../session/sets';
import type { Ctx } from '../planner/store/types';
import type { Entry } from '@/frontend/data/plannerData';

/** A session's clock, as kept in state: seconds banked, plus when it was last started if it's going. */
export type LiveClock = { elapsed: number; runningSince: number | null };

/**
 * The session being done right now, for what shows outside the page: the lock-screen player and the notification.
 * Plain data, so it can go to the timer worker and the service worker as it is.
 */
export type LiveActivity = {
  id: string;
  kind: 'lift' | 'ride';
  name: string;
  clock: LiveClock;
  /** Lifting: how many are ticked, of how many, and the first one still to do. */
  done: number;
  total: number;
  now: { name: string; line: string; set: number; of: number } | null;
  /** Resting between sets: until when, out of how long, and what's up next. */
  rest: { endsAt: number; total: number; next: { name: string; line: string } | null } | null;
  /** Riding: the plan. */
  ride: { planned: string; dist: string; climb: string; zone: string } | null;
  /** How long it's planned to take, in seconds (0 if unknown): the length of the lock-screen player's bar. */
  plannedSec: number;
};

/** A session just finished, for the "Quest cleared" notification. */
export type LiveDone = { id: string; name: string; took: string; exercises: string; streak: number; ride: boolean };

// "~50 min", "1 h 15 min" as minutes.
const minutesIn = (text: string) => {
  const h = /(\d+)\s*h/.exec(text || '');
  const m = /(\d+)\s*min/.exec(text || '');
  return (h ? Number(h[1]) * 60 : 0) + (m ? Number(m[1]) : 0);
};

/** Seconds on a clock at a moment (now, by default). */
export const clockSeconds = (c: LiveClock, at = Date.now()) =>
  c.elapsed + (c.runningSince ? Math.max(0, Math.floor((at - c.runningSince) / 1000)) : 0);

// The session outside the page: which one is going, and what the lock screen and notification can do with it.
export function liveVals(ctx: Ctx) {
  const { logic, st, nameOf, isDoneEntry, actualMinutes, distOf, TODAY_M, TODAY_D, streak } = ctx;
  const sets = setsFor(ctx);
  const timers = st.workoutTimer || {};
  const found = (id: string) => logic.model.entries.find((x) => x.av.id === id) || null;
  // The one whose clock is going; else one paused today (an old paused clock isn't a workout in progress).
  const ids = Object.keys(timers).filter((id) => found(id) && !isDoneEntry(found(id).av));
  const liveId =
    ids.find((id) => timers[id].runningSince) ||
    ids.find((id) => {
      const x = found(id);
      return x.m === TODAY_M && x.d === TODAY_D;
    }) ||
    null;
  const x = liveId ? found(liveId) : null;
  const av: Entry | null = x ? x.av : null;
  const exercises = sets.exercisesOf;
  const ticked = (id: string): string[] => (st.done || {})[id] || [];
  let liveActivity: LiveActivity | null = null;
  if (av) {
    const list = av.ride ? [] : exercises(av);
    const dn = ticked(av.id);
    const next = sets.nextSet(av.id);
    const r = sets.restNow && sets.restNow.id === av.id ? sets.restNow : null;
    liveActivity = {
      id: av.id,
      kind: av.ride ? 'ride' : 'lift',
      name: nameOf(av.name),
      clock: { elapsed: timers[av.id].elapsed, runningSince: timers[av.id].runningSince },
      done: list.filter((e) => dn.indexOf(e.name) !== -1).length,
      total: list.length,
      now: next ? { name: next.e.name, line: next.line, set: next.set, of: next.of } : null,
      rest: r
        ? { endsAt: r.endsAt, total: r.total, next: sets.restNext ? { name: sets.restNext.e.name, line: sets.restNext.line } : null }
        : null,
      ride: av.ride
        ? { planned: av.time, dist: av.ride.dist || '', climb: av.ride.elev || '', zone: av.ride.zone || '' }
        : null,
      plannedSec: (av.ride ? toMinutes(av.ride.hrs, av.ride.mins) : minutesIn(av.time)) * 60,
    };
  }
  const setClock = (id: string, clock: LiveClock) =>
    logic.s({ workoutTimer: Object.assign({}, logic.state.workoutTimer, { [id]: clock }) });
  // Opens the session's page, as its card on the calendar does.
  const openLive = (id: string) => {
    const at = found(id);
    if (at) logic.nav({ screen: 'detail', seg: 'Day', creating: false, ...monthPatch(at.m), day: at.d, entryId: id });
  };
  return {
    liveActivity,
    // The same numbers the session's own page would show once Finish has recorded it.
    liveDoneFor: (id: string): LiveDone | null => {
      const at = found(id);
      if (!at || !isDoneEntry(at.av)) return null;
      const a = at.av;
      const list = a.ride ? [] : exercises(a);
      const dn = ticked(a.id);
      return {
        id,
        name: nameOf(a.name),
        took: actualMinutes(a) ? minText(actualMinutes(a)) : a.time,
        exercises: a.ride
          ? distOf(a)
            ? distOf(a) + ' mi'
            : ''
          : list.filter((e) => dn.indexOf(e.name) !== -1).length + ' of ' + list.length,
        streak,
        ride: !!a.ride,
      };
    },
    // The next set done, as "Done set" on the session's page does (the last of an exercise's sets ticks it off).
    liveSet: (id: string) => {
      const n = sets.nextSet(id);
      if (n) sets.completeSet(id, n.e.name);
    },
    liveMoreRest: () => sets.addRest(30),
    liveSkipRest: sets.skipRest,
    livePause: (id: string) => {
      const c = timers[id];
      if (c && c.runningSince) setClock(id, { elapsed: clockSeconds(c), runningSince: null });
    },
    liveResume: (id: string) => {
      const c = timers[id];
      if (c && !c.runningSince) setClock(id, { elapsed: c.elapsed, runningSince: Date.now() });
    },
    openLive,
    // Finish asks what it took, so it opens the session's page with the Finish dialog up.
    liveFinish: (id: string) => {
      openLive(id);
      logic.renderVals().openFinish();
    },
    // Straight to writing about it, from the "Quest cleared" notification.
    liveWrite: (id: string) => {
      openLive(id);
      logic.renderVals().goDiary();
    },
  };
}
