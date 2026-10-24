import { setupVals } from '@/frontend/features/setup/model';
import { DCLogic } from './dcLogic';
import * as db from '@/frontend/data/plannerData';
import { isSignedOut } from '@/frontend/data/session';
import type { Model } from '@/frontend/data/plannerData';
import { HOME_OF, MONTHS } from '@/frontend/shared/constants';
import { monthPatch, noticePatch } from '@/frontend/shared/helpers';
import type { Viewport } from '../useViewport';
import type { Account } from '@/shared/auth';
import { buildContext } from './context';
import type { HistoryEntry, PlannerState, Screen } from './state';
import { chromeVals } from '../chrome.model';
import { calendarVals } from '@/frontend/features/calendar/model';
import { workoutVals } from '@/frontend/features/session/model';
import { editVals } from '@/frontend/features/editor/model';
import { diaryVals } from '@/frontend/features/chronicle/model';
import { arsenalVals } from '@/frontend/features/spellbook/model';
import { programVals } from '@/frontend/features/programs/model';
import { scanVals } from '@/frontend/features/programs/scan.model';
import { historyVals } from '@/frontend/features/programs/history.model';
import { progressVals } from '@/frontend/features/progress/model';
import { bossVals } from '@/frontend/features/boss/model';
import { liveVals } from '@/frontend/features/live/model';
import { restVals } from '@/frontend/features/session/sets';

import { CALENDAR_KEY, NOTICE_KEY } from '@/frontend/shared/handoff';

export { CALENDAR_KEY };

// A request that didn't reach the server (no signal, or the connection dropped), or went while signed out, as against
// one the server refused.
// Supabase reports a failed fetch as an error message, not a thrown TypeError.
const unreachable = (e: unknown) =>
  isSignedOut() ||
  (typeof navigator !== 'undefined' && navigator.onLine === false) ||
  e instanceof TypeError ||
  /failed to fetch|network|load failed|fetch failed/i.test(e instanceof Error ? e.message : String(e));

// Dialogs that start a save and wait on it: how to save a change, finishing a workout, moving a session or a program,
// starting a program, adding a workout to a program's day.
const SAVE_DIALOGS_CLOSED: Partial<PlannerState> = {
  tplConfirm: null,
  finish: null,
  sessionMove: null,
  programMove: null,
  programStart: null,
  programPick: null,
};

export class PlannerLogic extends DCLogic<PlannerState> {
  /** Which layout the window calls for. The host component keeps it current. */
  viewport: Viewport = 'wide';
  /** Who is signed in (null when nobody is, or sign-in is off), and how to sign out. The host component keeps it current. */
  auth: { account: Account | null; signOut: () => void } = { account: null, signOut: () => undefined };
  model: Model | null = null;
  /** Opened from the "Today" app shortcut: the first load goes to today's next session, or the calendar on today. */
  openToday = false;
  status: 'loading' | 'error' | 'ready' = 'loading';
  loadError = '';
  state: PlannerState = { screen:'day', day: new Date().getDate(), seg:'Day', monthOpen:false, month: MONTHS[new Date().getMonth()], yOff: 0,
    repeat:false, mood:null, rpe:null, done: {}, rideDone: {} };

  // Fetches everything from Supabase and resets the ticks to what the database says.
  async load(patch: any = {}) {
    try {
      const model = await db.loadModel(new Date());
      const first = this.status !== 'ready';
      this.model = model;
      this.status = 'ready';
      const ids = new Set(model.entries.map((x) => x.av.id));
      // Timers only for sessions that still exist: a deleted session's clock doesn't keep ticking somewhere unseen.
      const timers = this.state.workoutTimer || {};
      const workoutTimer = Object.keys(timers).some((k) => !ids.has(k))
        ? Object.fromEntries(Object.entries(timers).filter(([k]) => ids.has(k)))
        : timers;
      // Opened at a session's own address (a reload, or a link): its day, or the calendar if it's gone.
      const opened: any = {};
      if (first && this.state.screen === 'detail' && this.state.entryId) Object.assign(opened, this.placeFor({ screen: 'detail', entryId: this.state.entryId }));
      // A reload on the calendar comes back to the view and day it was on (kept for this tab, for an hour).
      if (first && this.state.screen === 'day' && !this.openToday) {
        try {
          const kept = JSON.parse(window.sessionStorage.getItem(CALENDAR_KEY) || 'null');
          // Only a recent visit: coming back hours later starts on today again.
          const recent = kept && Date.now() - Number(kept.at || 0) < 60 * 60 * 1000;
          if (recent && ['Day', 'Week', 'Month'].includes(kept.seg) && MONTHS.includes(kept.month))
            Object.assign(opened, { seg: kept.seg, month: kept.month, yOff: Number(kept.yOff) || 0, day: Number(kept.day) || 1 });
        } catch {
          // Storage can be off (private windows, blocked site data): start on today, as before.
        }
      }
      // A notice another page left for the planner (a shared program just copied), shown once.
      if (first) {
        try {
          const kept = JSON.parse(window.sessionStorage.getItem(NOTICE_KEY) || 'null');
          window.sessionStorage.removeItem(NOTICE_KEY);
          if (kept && typeof kept.text === 'string' && (kept.screen === 'day' || kept.screen === 'arsenal' || kept.screen === 'program'))
            Object.assign(opened, noticePatch(kept.text.slice(0, 300), kept.screen));
        } catch {
          // No storage: no notice.
        }
      }
      // Sets done only for sessions still on the clock: a finished one's are done with.
      const setsDone = Object.fromEntries(Object.entries(this.state.setsDone || {}).filter(([k]) => workoutTimer[k]));
      // Ticks still waiting to be saved stay ticked: the database doesn't have them yet.
      const done = { ...model.done, ...Object.fromEntries(Object.entries(this.unsaved).map(([k, t]) => [k, t.names])) };
      this.stale = false;
      // Signed in again (in another tab, say): the note that it had ended goes.
      const back = this.state.signedOut && !isSignedOut() ? { signedOut: false, signedOutOpen: false } : {};
      this.setState({ done, rideDone: model.rideDone, workoutTimer, setsDone, ...opened, ...back, ...patch });
      // Ticks kept from a visit that lost its connection: saved now the plan has loaded.
      if (first && this.ticksWaiting) void this.save(() => this.flushTicks(), {}, true);
      // The "Today" shortcut: today's first session not yet done, as its card on the calendar opens it. With none left
      // today, the calendar stays on today.
      if (first && this.openToday) {
        this.openToday = false;
        const up = buildContext(this).nextUp;
        const now = new Date();
        if (up && up.m === now.getMonth() && up.d === now.getDate())
          this.setState({ screen: 'detail', seg: 'Day', creating: false, ...monthPatch(up.m), day: up.d, entryId: up.id });
      }
    } catch (e) {
      // Once the plan is on screen, a reload that fails (a weak signal mid-workout) keeps it there, with a note that it
      // may be out of date, rather than swapping the whole app for the error page. What follows a save that landed
      // still happens. Only the first load, with nothing to show yet, ends on the error page.
      if (this.status === 'ready') {
        this.stale = true;
        this.setState(patch);
        return;
      }
      this.status = 'error';
      this.loadError = e instanceof Error ? e.message : String(e);
      this.forceUpdate();
    }
  }

  /** The last reload didn't go through, so what's on screen may be out of date. */
  stale = false;

  // Ticks not saved yet, per session: the whole list of exercises done, and whether that completes it. They're kept in
  // this browser, per account (`ticksKey`, set by the host component), so a tick made with no signal survives a
  // reload, and they're saved again when the connection is back. A session's done list is written whole, so saving
  // the latest one again is always right.
  ticksKey = '';
  private unsaved: Record<string, { names: string[]; completed: boolean }> = {};
  /** Some ticks haven't been saved yet. */
  get ticksWaiting() {
    return Object.keys(this.unsaved).length > 0;
  }
  // A save of them didn't reach the database. Until then a tick that's simply on its way isn't "waiting": every tick
  // is unsaved for the moment its save takes, and that's no reason to say the connection is gone.
  private ticksStuck = false;
  /** Ticks are waiting because a save of them couldn't get through, so say so. */
  get ticksOffline() {
    return this.ticksStuck && this.ticksWaiting;
  }
  restoreTicks(key: string) {
    this.ticksKey = key;
    try {
      const kept = JSON.parse(window.localStorage.getItem(key) || 'null');
      if (kept && typeof kept === 'object') this.unsaved = kept;
    } catch {
      // No storage: nothing was kept.
    }
  }
  private keepTicks() {
    try {
      if (this.ticksWaiting) window.localStorage.setItem(this.ticksKey, JSON.stringify(this.unsaved));
      else window.localStorage.removeItem(this.ticksKey);
    } catch {
      // No storage: they're kept for this visit only.
    }
  }
  private async flushTicks() {
    for (const [id, t] of Object.entries(this.unsaved)) {
      try {
        await db.setExercisesDone(id, t.names, t.completed);
      } catch (e) {
        // Refused by the database rather than lost on the way: saving it again won't help. It stops waiting, the error
        // shows, and the reload puts that session's ticks back to what was saved.
        if (!unreachable(e)) {
          const { [id]: _refused, ...rest } = this.unsaved;
          this.unsaved = rest;
          this.keepTicks();
          this.fail(e);
        } else this.ticksStuck = true;
        throw e;
      }
      // A newer tick on the same session while this one was saving goes on waiting.
      if (this.unsaved[id] === t) {
        const { [id]: _saved, ...rest } = this.unsaved;
        this.unsaved = rest;
        this.keepTicks();
      }
    }
    this.ticksStuck = false;
  }
  /** Saves a session's ticks: `names` done, and whether that completes it. One that doesn't go through is kept and
   * shown as waiting, not as an error, and saved again with the next tick or when the connection is back. */
  saveTicks(entryId: string, names: string[], completed: boolean) {
    this.unsaved = { ...this.unsaved, [entryId]: { names, completed } };
    this.keepTicks();
    return this.save(() => this.flushTicks(), {}, true);
  }
  /** Back online, or back to the app: saves the ticks still waiting, and reloads a plan that may be out of date (or
   * one signed out of, in case the person has signed in again elsewhere). */
  resync() {
    if (this.ticksWaiting) return this.save(() => this.flushTicks(), {}, true);
    if (this.stale || this.state.signedOut) return this.load();
  }

  /** A session's address opens that session on its own day (month and day with it), or the calendar if it's gone.
   * Anything else opens as the address says. */
  placeFor(opens: any): any {
    if (opens.screen !== 'detail' || !opens.entryId || !this.model) return opens;
    const hit = this.model.entries.find((x) => x.av.id === opens.entryId);
    return hit ? { ...opens, ...monthPatch(hit.m), day: hit.d } : { ...opens, screen: 'day', entryId: null };
  }

  private queue: Promise<unknown> = Promise.resolve();
  private pending = 0;
  private pendingPatch: any = {};

  // Queues a database write; when the queue drains the model is reloaded and `patch` applied to the
  // UI state. `patch` is what follows a save that landed (the next screen, a notice, a form cleared), so it applies
  // only when the write succeeds: a failed one leaves the person where they were, with what they typed, and shows the
  // error banner, and the reload puts the UI back in sync with what was saved.
  // `patch` may be a function of what the write returned, for state that depends on rows it created.
  // Resolves, once the reload is done, to whether this write landed.
  // `quiet`: a failure isn't shown as an error (ticks, which say they're waiting instead).
  save(write: () => Promise<any>, patch: any = {}, quiet = false): Promise<boolean> {
    this.pending++;
    let ok = false;
    this.queue = this.queue
      .then(async () => {
        const result = await write();
        ok = true;
        this.pendingPatch = { ...this.pendingPatch, ...(typeof patch === 'function' ? patch(result) : patch) };
      })
      .catch((e) => (quiet ? this.forceUpdate() : this.fail(e)))
      .then(() => {
        if (--this.pending > 0) return;
        const p = this.pendingPatch;
        this.pendingPatch = {};
        return this.load(p);
      });
    return this.queue.then(() => ok);
  }

  // Saves that make something new (a workout, a session, an exercise) or finish a form. A second press while the
  // first is still on its way — a double tap on Save — is ignored rather than saving a second copy. `busy` is what
  // a screen reads to show its button as working until the save has landed and the screen has moved on.
  private inFlight = new Set<string>();
  busy(key: string) {
    return this.inFlight.has(key);
  }
  saveOnce(key: string, write: () => Promise<any>, patch: any = {}): Promise<boolean> | undefined {
    if (this.inFlight.has(key)) return;
    this.inFlight.add(key);
    this.forceUpdate();
    return this.save(write, patch).finally(() => {
      this.inFlight.delete(key);
      this.forceUpdate();
    });
  }

  // Where keyboard focus was when each screen in the history was opened, so Back can put it back there (the host
  // component does the focusing once the screen is drawn). Matched by accessible name, since the element itself is
  // redrawn in between.
  private openers: (string | null)[] = [];
  focusBack: string | null = null;
  private focusedName() {
    if (typeof document === 'undefined') return null;
    const el = document.activeElement as HTMLElement | null;
    if (!el || el === document.body) return null;
    return el.getAttribute('aria-label') || (el.textContent || '').trim().slice(0, 80) || null;
  }

  /** Shows what went wrong with a save in the error banner. */
  fail(e: unknown) {
    // The dialog the save was started from closes, so the banner isn't hidden behind it. What it was saving stays:
    // the editor's draft, the session's clock.
    this.setState({ saveError: e instanceof Error ? e.message : String(e), ...SAVE_DIALOGS_CLOSED });
  }

  s(p: Partial<PlannerState>) {
    this.setState(p);
  }
  nav(p: Partial<PlannerState>) {
    this.openers = this.openers.concat([this.focusedName()]);
    const st = this.state;
    const snap: HistoryEntry = { screen:st.screen, month:st.month, yOff:st.yOff, day:st.day, seg:st.seg,
      diaryFrom:st.diaryFrom, diaryEdit:st.diaryEdit, creating:st.creating };
    this.setState(Object.assign({ hist: (st.hist || []).concat([snap]), notice: null, seriesOpen: false }, p));
  }
  /** Opens a session's page: the session `entryId` on month `m` (counted from this January), day `d`. */
  openSession(m: number, d: number, entryId: string, extra: any = {}) {
    this.nav({ screen: 'detail', creating: false, ...monthPatch(m), day: d, entryId, ...extra });
  }
  /** Opens the calendar on month `m`, day `d`, in the Day, Week or Month view. */
  openDay(m: number, d: number, seg: 'Day' | 'Week' | 'Month' = 'Day') {
    this.nav({ screen: 'day', seg, monthOpen: false, ...monthPatch(m), day: d, entryId: null });
  }
  back(){
    const st = this.state;
    const h = st.hist || [];
    this.focusBack = this.openers.length ? this.openers[this.openers.length - 1] : null;
    this.openers = this.openers.slice(0, -1);
    // Nothing before this screen (it was opened from a link): up to its section's own page.
    if (!h.length) {
      const home = HOME_OF[st.screen];
      if (home) return this.setState({ screen: home, monthOpen:false, seriesOpen:false, creating:false });
      return this.setState({ screen:'day', monthOpen:false, seriesOpen:false, seg:'Day', creating:false });
    }
    const prev = h[h.length - 1];
    this.setState(Object.assign({}, prev, { hist: h.slice(0, -1), monthOpen:false, seriesOpen:false }));
  }
  /** History without its last screen, for a screen that replaces the one it was opened from (a new Chronicle entry,
   * once saved, stands in for the picker it was started from). */
  histWithoutLast(){
    this.openers = this.openers.slice(0, -1);
    return (this.state.hist || []).slice(0, -1);
  }
  // Like back(), but all the way to the most recent visit to `screen`, skipping whatever was opened on the way
  // (the Spellbook, then an exercise's details, then back to the workout that was being built).
  backTo(screen: Screen, patch: Partial<PlannerState> = {}) {
    const h = this.state.hist || [];
    const i = h.map((x) => x.screen).lastIndexOf(screen);
    if (i < 0) return this.back();
    this.focusBack = this.openers[i] ?? null;
    this.openers = this.openers.slice(0, i);
    this.setState(Object.assign({}, h[i], { hist: h.slice(0, i), monthOpen:false, seriesOpen:false }, patch));
  }
  renderVals() {
    const ctx = buildContext(this);
    return {
      ...chromeVals(ctx),
      ...calendarVals(ctx),
      ...workoutVals(ctx),
      ...editVals(ctx),
      ...diaryVals(ctx),
      ...arsenalVals(ctx),
      ...programVals(ctx),
      ...scanVals(ctx),
      ...historyVals(ctx),
      ...progressVals(ctx),
      ...bossVals(ctx),
      ...liveVals(ctx),
      ...restVals(ctx),
      ...setupVals(ctx),
    };
  }
}
