import { DCLogic } from '../dcLogic';
import * as db from '@/lib/plannerData';
import type { Model } from '@/lib/plannerData';
import { HOME_OF, MONTHS } from './constants';
import { monthPatch } from './helpers';
import type { Viewport } from './useViewport';
import type { Account } from '@/lib/auth';
import { buildContext } from './context';
import { chromeVals } from './screens/chrome';
import { calendarVals } from './screens/calendar';
import { workoutVals } from './screens/workout';
import { editVals } from './screens/edit';
import { diaryVals } from './screens/diary';
import { arsenalVals } from './screens/arsenal';
import { progressVals } from './screens/progress';

export const CALENDAR_KEY = 'moonshot.calendar';

export class PlannerLogic extends DCLogic {
  /** Which layout the window calls for. The host component keeps it current. */
  viewport: Viewport = 'wide';
  /** Who is signed in (null when nobody is, or sign-in is off), and how to sign out. The host component keeps it current. */
  auth: { account: Account | null; signOut: () => void } = { account: null, signOut: () => undefined };
  model: Model | null = null;
  status: 'loading' | 'error' | 'ready' = 'loading';
  loadError = '';
  state: any = { screen:'day', day: new Date().getDate(), seg:'Day', monthOpen:false, month: MONTHS[new Date().getMonth()], yOff: 0,
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
      if (first && this.state.screen === 'day') {
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
      this.setState({ done: model.done, rideDone: model.rideDone, workoutTimer, ...opened, ...patch });
    } catch (e) {
      this.status = 'error';
      this.loadError = e instanceof Error ? e.message : String(e);
      this.forceUpdate();
    }
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
  // UI state. A failed write shows in the error banner and the reload puts the UI back in sync.
  // `patch` may be a function of what the write returned, for state that depends on rows it created.
  save(write: () => Promise<any>, patch: any = {}): Promise<unknown> {
    this.pending++;
    if (typeof patch !== 'function') this.pendingPatch = { ...this.pendingPatch, ...patch };
    this.queue = this.queue
      .then(async () => {
        const result = await write();
        if (typeof patch === 'function') this.pendingPatch = { ...this.pendingPatch, ...patch(result) };
      })
      .catch(e => this.setState({ saveError: e instanceof Error ? e.message : String(e) }))
      .then(() => {
        if (--this.pending > 0) return;
        const p = this.pendingPatch;
        this.pendingPatch = {};
        return this.load(p);
      });
    return this.queue;
  }

  // Saves that make something new (a workout, a session, an exercise) or finish a form. A second press while the
  // first is still on its way — a double tap on Save — is ignored rather than saving a second copy. `busy` is what
  // a screen reads to show its button as working until the save has landed and the screen has moved on.
  private inFlight = new Set<string>();
  busy(key: string) {
    return this.inFlight.has(key);
  }
  saveOnce(key: string, write: () => Promise<any>, patch: any = {}) {
    if (this.inFlight.has(key)) return;
    this.inFlight.add(key);
    this.forceUpdate();
    this.save(write, patch).finally(() => {
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

  s(p){ this.setState(p); }
  nav(p){
    this.openers = this.openers.concat([this.focusedName()]);
    const st = this.state;
    const snap = { screen:st.screen, month:st.month, yOff:st.yOff, day:st.day, seg:st.seg,
      diaryFrom:st.diaryFrom, diaryEdit:st.diaryEdit, creating:st.creating };
    this.setState(Object.assign({ hist: (st.hist || []).concat([snap]), notice: null }, p));
  }
  back(){
    const st = this.state;
    const h = st.hist || [];
    this.focusBack = this.openers.length ? this.openers[this.openers.length - 1] : null;
    this.openers = this.openers.slice(0, -1);
    // Nothing before this screen (it was opened from a link): up to its section's own page.
    if (!h.length) {
      const home = HOME_OF[st.screen];
      if (home) return this.setState({ screen: home, monthOpen:false, creating:false });
      return this.setState({ screen:'day', monthOpen:false, seg:'Day', creating:false });
    }
    const prev = h[h.length - 1];
    this.setState(Object.assign({}, prev, { hist: h.slice(0, -1), monthOpen:false }));
  }
  // Like back(), but all the way to the most recent visit to `screen`, skipping whatever was opened on the way
  // (the Spellbook, then an exercise's details, then back to the workout that was being built).
  backTo(screen, patch = {}){
    const h = this.state.hist || [];
    const i = h.map((x) => x.screen).lastIndexOf(screen);
    if (i < 0) return this.back();
    this.focusBack = this.openers[i] ?? null;
    this.openers = this.openers.slice(0, i);
    this.setState(Object.assign({}, h[i], { hist: h.slice(0, i), monthOpen:false }, patch));
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
      ...progressVals(ctx),
    };
  }
}
