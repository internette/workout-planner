import { exLine, formatElapsed, idOf, isTimed, splitSetsReps } from '@/frontend/shared/helpers';
import type { Ctx } from '../planner/store/types';
import type { PlannerState } from '../planner/store/state';
import type { Entry, Exercise } from '@/frontend/data/plannerData';

// Sets, and the rest between them. Each "Done set" counts one; the last of an exercise's sets ticks it off, the same
// as its tick does. After a set, that exercise's rest counts down (unless nothing is left to do), with the next set
// up. A timed set (a plank, a dead hang) is started instead, counts down its time, and is done when the time is up or
// at "Done set". Sets done are kept in this browser with the clock; ticked exercises are saved, as before.

/** How many sets an exercise has: the "4" of "4 × 8", or one when it doesn't say. */
export const setsIn = (e: Pick<Exercise, 'sets'>) => Math.max(1, Number(splitSetsReps(e.sets).sets) || 1);

/** An exercise's rest, in seconds: the "90" of "90 sec", or none. */
export const restIn = (e: Pick<Exercise, 'rest'>) => {
  const m = /\d+/.exec(e.rest || '');
  return m ? Number(m[0]) : 0;
};

/** A timed set's seconds: the "45" of "3 × 45 sec", or 0 for sets counted in reps. */
export const timeIn = (e: Pick<Exercise, 'sets'>) => (isTimed(e.sets) ? Number(splitSetsReps(e.sets).time) || 0 : 0);

/** The next set to do: the first exercise not ticked off, and which of its sets. */
export type NextSet = { e: Exercise; set: number; of: number; line: string };

export function setsFor(ctx: Ctx) {
  const { logic, st, instList, actualMinutes, isDoneEntry } = ctx;
  const entry = (id: string) => logic.model.entries.find((x) => x.av.id === id) || null;
  // A session's exercises in the order they were put in, with their edits.
  const exercisesOf = (a: Entry): Exercise[] => {
    const id = idOf(a);
    const order = (st.exOrder || {})[id] || [];
    const rank = (n: string) => (order.indexOf(n) === -1 ? order.length : order.indexOf(n));
    return instList(a.exKey, id)
      .map((e, ix) => ({ e: Object.assign({}, e, (st.fields || {})[id + '|' + e.name] || {}), ix }))
      .sort((p, q) => rank(p.e.name) - rank(q.e.name) || p.ix - q.ix)
      .map(({ e }) => e);
  };
  const setsDoneOf = (id: string, name: string) => ((st.setsDone || {})[id] || {})[name] || 0;
  // The exercise just done carries on until its sets are done, then one already started, before the first still to
  // do in the list.
  const nextIn = (list: Exercise[], done: string[], sets: Record<string, number>, after?: string): NextSet | null => {
    const left = list.filter((x) => done.indexOf(x.name) === -1);
    const e = left.find((x) => x.name === after) || left.find((x) => (sets[x.name] || 0) > 0) || left[0];
    if (!e) return null;
    const of = setsIn(e);
    const set = Math.min(of, (sets[e.name] || 0) + 1);
    const time = timeIn(e);
    return {
      e,
      set,
      of,
      line: [of > 1 ? 'Set ' + set + ' of ' + of : '', time ? time + ' sec' : '', exLine({ weight: e.weight, band: e.band })].filter(Boolean).join(' · '),
    };
  };
  const nextSet = (id: string, after?: string): NextSet | null => {
    const at = entry(id);
    if (!at || at.av.ride) return null;
    return nextIn(exercisesOf(at.av), (st.done || {})[id] || [], (st.setsDone || {})[id] || {}, after);
  };
  // The rest that's counting down, if its session is still being done.
  const restNow = (() => {
    const r = st.rest;
    const at = r ? entry(r.id) : null;
    return r && at && !isDoneEntry(at.av) ? r : null;
  })();

  // The timed set counting down, if its session is still being done.
  const holdNow = (() => {
    const h = st.hold;
    const at = h ? entry(h.id) : null;
    return h && at && !isDoneEntry(at.av) ? h : null;
  })();

  /** Starts a timed set: its time counts down, and it's done when the time is up. Starts the clock if it isn't going. */
  const startSet = (id: string, name: string) => {
    const at = entry(id);
    if (!at || at.av.ride) return;
    const e = exercisesOf(at.av).find((x) => x.name === name);
    const time = e ? timeIn(e) : 0;
    if (!e || !time) return;
    const now = Date.now();
    const clock = (st.workoutTimer || {})[id];
    const of = setsIn(e);
    const set = Math.min(of, setsDoneOf(id, name) + 1);
    logic.s({
      hold: { id, name, endsAt: now + time * 1000, total: time },
      rest: null,
      ...(!clock || !clock.runningSince
        ? { workoutTimer: Object.assign({}, st.workoutTimer, { [id]: { elapsed: clock ? clock.elapsed : 0, runningSince: now } }) }
        : {}),
      announce: (of > 1 ? 'Set ' + set + ' of ' + of + ' started. ' : 'Started. ') + time + ' seconds.',
    });
  };

  /** Counts a set of an exercise done; the last one ticks it off. Starts the clock if it isn't going. */
  const completeSet = (id: string, name: string) => {
    const at = entry(id);
    if (!at || at.av.ride) return;
    const list = exercisesOf(at.av);
    const e = list.find((x) => x.name === name);
    const done = (st.done || {})[id] || [];
    if (!e || done.indexOf(name) !== -1) return;
    const of = setsIn(e);
    const count = Math.min(of, setsDoneOf(id, name) + 1);
    const sets = Object.assign({}, (st.setsDone || {})[id], { [name]: count });
    const patch: Partial<PlannerState> = { setsDone: Object.assign({}, st.setsDone, { [id]: sets }), hold: null };
    const now = Date.now();
    const clock = (st.workoutTimer || {})[id];
    if (!clock || !clock.runningSince)
      patch.workoutTimer = Object.assign({}, st.workoutTimer, {
        [id]: { elapsed: clock ? clock.elapsed : 0, runningSince: now },
      });
    const ticked = count >= of;
    const names = ticked ? done.concat([name]) : done;
    if (ticked) patch.done = Object.assign({}, st.done, { [id]: names });
    const next = nextIn(list, names, sets, name);
    const rest = restIn(e);
    patch.rest = next && rest > 0 ? { id, after: name, endsAt: now + rest * 1000, total: rest } : null;
    patch.announce =
      (ticked ? name + ' done. ' + names.length + ' of ' + list.length + ' exercises done.' : 'Set ' + count + ' of ' + of + ' done.') +
      (patch.rest ? ' Rest ' + rest + ' seconds.' : '');
    logic.s(patch);
    if (ticked)
      logic.saveTicks(id, names, names.length === list.length || actualMinutes(at.av) > 0);
  };

  const restLeft = restNow ? Math.max(0, Math.ceil((restNow.endsAt - Date.now()) / 1000)) : 0;
  const restNext = restNow ? nextSet(restNow.id, restNow.after) : null;
  const holdLeft = holdNow ? Math.max(0, Math.ceil((holdNow.endsAt - Date.now()) / 1000)) : 0;
  return {
    exercisesOf,
    setsDoneOf,
    nextSet,
    completeSet,
    startSet,
    holdNow,
    holdLeft,
    holdLabel: formatElapsed(holdLeft),
    /** A longer timed set. */
    addHold: (sec: number) => {
      const h = logic.state.hold;
      if (h) logic.s({ hold: { ...h, endsAt: h.endsAt + sec * 1000, total: h.total + sec }, announce: sec + ' seconds longer.' });
    },
    /** The timed set's time is up: it's done, as "Done set" would do. */
    holdOver: () => {
      const h = logic.state.hold;
      if (!h || Date.now() < h.endsAt) return;
      // Gone first, in case it was ticked off meanwhile and there's no set left to count.
      logic.s({ hold: null });
      completeSet(h.id, h.name);
    },
    restNow,
    restLeft,
    restNext,
    /** A longer rest. */
    addRest: (sec: number) => {
      const r = logic.state.rest;
      if (r) logic.s({ rest: { ...r, endsAt: r.endsAt + sec * 1000, total: r.total + sec }, announce: 'Rest ' + sec + ' seconds longer.' });
    },
    skipRest: () => logic.s({ rest: null }),
    /** The rest has run out: it goes, and says what's next. */
    restOver: () => {
      const r = logic.state.rest;
      if (!r || Date.now() < r.endsAt) return;
      const n = nextSet(r.id, r.after);
      logic.s({
        rest: null,
        announce: "Rest's over." + (n ? ' Up next: ' + n.e.name + (n.of > 1 ? ', set ' + n.set + ' of ' + n.of : '') + '.' : ''),
      });
    },
    restLabel: formatElapsed(restLeft),
  };
}

// The rest card on a session's page.
export function restVals(ctx: Ctx) {
  const s = setsFor(ctx);
  const r = s.restNow;
  const shown = !!r && ctx.st.screen === 'detail' && r.id === ctx.listKey;
  return {
    restShown: shown,
    restLabel: s.restLabel,
    // How much of the rest is left, as the bar drains.
    restPct: r ? Math.round((s.restLeft / Math.max(1, r.total)) * 100) : 0,
    restNextName: s.restNext ? s.restNext.e.name : '',
    restNextLine: s.restNext ? s.restNext.line : '',
    restMore: () => s.addRest(30),
    // A timed set counting down on its session's page: its time left, which set of which exercise, and its rest after.
    holdShown: !!s.holdNow && ctx.st.screen === 'detail' && s.holdNow.id === ctx.listKey,
    holdLabel: s.holdLabel,
    holdPct: s.holdNow ? Math.round((s.holdLeft / Math.max(1, s.holdNow.total)) * 100) : 0,
    holdSet: (() => {
      const n = s.holdNow ? s.nextSet(s.holdNow.id, s.holdNow.name) : null;
      return n && n.of > 1 ? 'Set ' + n.set + ' of ' + n.of : 'One set';
    })(),
    holdName: s.holdNow ? s.holdNow.name : '',
    holdLine: (() => {
      const n = s.holdNow ? s.nextSet(s.holdNow.id, s.holdNow.name) : null;
      return n ? [timeIn(n.e) + ' sec', restIn(n.e) ? restIn(n.e) + ' sec rest' : ''].filter(Boolean).join(' · ') : '';
    })(),
    holdMore: () => s.addHold(30),
    holdDone: () => s.holdNow && s.completeSet(s.holdNow.id, s.holdNow.name),
    holdOver: s.holdOver,
    /** When the timed set counting down ends, for the page to notice (0 when none). */
    holdEndsAt: s.holdNow ? s.holdNow.endsAt : 0,
    restSkip: s.skipRest,
    restOver: s.restOver,
    /** When the rest counting down ends, for the page to notice (0 when none). */
    restEndsAt: r ? r.endsAt : 0,
  };
}
