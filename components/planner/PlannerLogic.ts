import { DCLogic } from '../dcLogic';
import * as db from '@/lib/plannerData';
import type { Model } from '@/lib/plannerData';
import { MONTHS } from './constants';
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

export class PlannerLogic extends DCLogic {
  /** Which layout the window calls for. The host component keeps it current. */
  viewport: Viewport = 'wide';
  /** Who is signed in (null when nobody is, or sign-in is off), and how to sign out. The host component keeps it current. */
  auth: { account: Account | null; signOut: () => void } = { account: null, signOut: () => undefined };
  model: Model | null = null;
  status: 'loading' | 'error' | 'ready' = 'loading';
  loadError = '';
  state: any = { screen:'day', day: new Date().getDate(), seg:'Day', monthOpen:false, month: MONTHS[new Date().getMonth()],
    repeat:false, more:false, mood:'Happy', rpe:3, done: {}, rideDone: {} };

  // Fetches everything from Supabase and resets the ticks to what the database says.
  async load(patch: any = {}) {
    try {
      const model = await db.loadModel(new Date());
      this.model = model;
      this.status = 'ready';
      this.setState({ done: model.done, rideDone: model.rideDone, ...patch });
    } catch (e) {
      this.status = 'error';
      this.loadError = e instanceof Error ? e.message : String(e);
      this.forceUpdate();
    }
  }

  private queue: Promise<unknown> = Promise.resolve();
  private pending = 0;
  private pendingPatch: any = {};

  // Queues a database write; when the queue drains the model is reloaded and `patch` applied to the
  // UI state. A failed write shows in the error banner and the reload puts the UI back in sync.
  // `patch` may be a function of what the write returned, for state that depends on rows it created.
  save(write: () => Promise<any>, patch: any = {}) {
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
  }

  s(p){ this.setState(p); }
  nav(p){
    const st = this.state;
    const snap = { screen:st.screen, month:st.month, day:st.day, seg:st.seg,
      diaryFrom:st.diaryFrom, diaryEdit:st.diaryEdit, creating:st.creating };
    this.setState(Object.assign({ hist: (st.hist || []).concat([snap]) }, p));
  }
  back(){
    const st = this.state;
    const h = st.hist || [];
    if (!h.length) return this.setState({ screen:'day', monthOpen:false, seg:'Day', creating:false });
    const prev = h[h.length - 1];
    this.setState(Object.assign({}, prev, { hist: h.slice(0, -1), monthOpen:false }));
  }
  // Like back(), but all the way to the most recent visit to `screen`, skipping whatever was opened on the way
  // (the Arsenal, then an exercise's details, then back to the workout that was being built).
  backTo(screen, patch = {}){
    const h = this.state.hist || [];
    const i = h.map((x) => x.screen).lastIndexOf(screen);
    if (i < 0) return this.back();
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
