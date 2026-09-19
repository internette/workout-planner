import { DCLogic } from '../dcLogic';
import * as db from '@/lib/plannerData';
import type { Model } from '@/lib/plannerData';
import { MONTHS } from './constants';
import { buildContext } from './context';
import { chromeVals } from './screens/chrome';
import { calendarVals } from './screens/calendar';
import { workoutVals } from './screens/workout';
import { editVals } from './screens/edit';
import { diaryVals } from './screens/diary';
import { arsenalVals } from './screens/arsenal';
import { progressVals } from './screens/progress';

export class PlannerLogic extends DCLogic {
  _r: any;
  _out: any;
  _esc: any;
  _track: any;
  _lastFocus: any;
  _returnTo: any;
  componentDidMount(){
    this.load();
    this._r = () => this.forceUpdate();
    window.addEventListener('resize', this._r);
    this._out = e => {
      const st = this.state;
      if (!st.iconsOpen && !st.dateOpen && !st.monthOpen && !st.xpInfo && st.exOpen == null) return;
      if (e.target.closest && e.target.closest('[data-pop]')) return;
      this.setState({ iconsOpen:false, dateOpen:false, monthOpen:false, xpInfo:false, exOpen:null });
    };
    document.addEventListener('pointerdown', this._out, true);
    this._esc = e => {
      if (e.key !== 'Escape') return;
      const st = this.state;
      if (st.confirm) { this.setState({ confirm:null }); return; }
      if (st.leaveOpen) { this.setState({ leaveOpen:false }); return; }
      if (st.ranksOpen) { this.setState({ ranksOpen:false }); return; }
      if (st.iconsOpen || st.dateOpen || st.monthOpen || st.xpInfo || st.exOpen != null)
        this.setState({ iconsOpen:false, dateOpen:false, monthOpen:false, xpInfo:false, exOpen:null });
    };
    document.addEventListener('keydown', this._esc);
    this._track = e => {
      const b = (e.target.closest && e.target.closest('button')) || e.target;
      if (b && b.tagName === 'BUTTON' && !b.closest('[role="dialog"]')) this._lastFocus = b;
    };
    document.addEventListener('focusin', this._track, true);
    document.addEventListener('pointerdown', this._track, true);
  }
  componentWillUnmount(){
    window.removeEventListener('resize', this._r);
    document.removeEventListener('pointerdown', this._out, true);
    document.removeEventListener('keydown', this._esc);
    document.removeEventListener('focusin', this._track, true);
    document.removeEventListener('pointerdown', this._track, true);
  }
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
  save(write: () => Promise<unknown>, patch: any = {}) {
    this.pending++;
    this.pendingPatch = { ...this.pendingPatch, ...patch };
    this.queue = this.queue
      .then(write)
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
  componentDidUpdate(){
    const dlg = document.querySelector('[role="dialog"]');
    if (dlg && !dlg.contains(document.activeElement)) {
      if (!this._returnTo) this._returnTo = this._lastFocus || null;
      const first = dlg.querySelector('button');
      if (first) first.focus();
    } else if (!dlg && this._returnTo) {
      const el = this._returnTo;
      this._returnTo = null;
      if (el && document.contains(el)) el.focus();
    }
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
