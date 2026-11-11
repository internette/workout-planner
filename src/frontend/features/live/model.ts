import type { Ctx } from '../planner/store/types';
import type { Entry } from '@/frontend/data/plannerData';

/** A session's clock, as kept in state: seconds banked, plus when it was last started if it's going. */
export type LiveClock = { elapsed: number; runningSince: number | null };

/** The session being done right now (its clock going, or paused today): the screen stays on while there is one. */
export type LiveActivity = { id: string; name: string; clock: LiveClock };

// Which session is in progress.
export function liveVals(ctx: Ctx) {
  const { logic, st, nameOf, isDoneEntry, actualMinutes, TODAY_M, TODAY_D } = ctx;
  const timers = st.workoutTimer || {};
  const found = (id: string) => logic.model.entries.find((x) => x.av.id === id) || null;
  // A session stays in progress while its clock is kept: until Finish records it (which takes the clock away), so
  // ticking the last exercise doesn't end it before its time is recorded. A ride marked done otherwise has ended.
  const ongoing = (id: string) => {
    const at = found(id);
    return !!at && (at.av.ride ? !isDoneEntry(at.av) : !(actualMinutes(at.av) > 0));
  };
  // The one whose clock is going; else one paused today (an old paused clock isn't a workout in progress).
  const ids = Object.keys(timers).filter(ongoing);
  const liveId =
    ids.find((id) => timers[id].runningSince) ||
    ids.find((id) => {
      const x = found(id);
      return x.m === TODAY_M && x.d === TODAY_D;
    }) ||
    null;
  const x = liveId ? found(liveId) : null;
  const av: Entry | null = x ? x.av : null;
  const liveActivity: LiveActivity | null = av
    ? { id: av.id, name: nameOf(av.name), clock: { elapsed: timers[av.id].elapsed, runningSince: timers[av.id].runningSince } }
    : null;
  return { liveActivity };
}
