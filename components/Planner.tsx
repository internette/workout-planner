'use client';

import React from 'react';
import { DCLogic } from './dcLogic';
import { PlannerView } from './PlannerView';
import * as db from '@/lib/plannerData';
import type { Model } from '@/lib/plannerData';

const PINK = '#E1699C';
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const MON3 = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DOW1 = ['S','M','T','W','T','F','S'];
const DOW3 = ['SUN','MON','TUE','WED','THU','FRI','SAT'];
const DOWFULL = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const QUESTS = [
  { title:'Hold the barrier', note:'Finish today\'s session and nothing gets through.',
    done:'The barrier held. Nothing got through.' },
  { title:'Drive back the shadow', note:'Every set you finish pushes it further out of the city.',
    done:'The shadow is out of the city.' },
  { title:'Reach the next gate', note:'Three sessions this week opens the way forward.',
    done:'You reached the gate. The way is open.' },
  { title:'Answer the call', note:'Someone out there is counting on you showing up today.',
    done:'You answered. They\'re safe because you showed up.' },
  { title:'Restore the broken sigil', note:'Log this workout to mend one more piece of it.',
    done:'Another piece of the sigil is whole again.' },
  { title:'Escort the light home', note:'Keep the streak alive and it arrives safely.',
    done:'The light made it home.' },
  { title:'Break the illusion', note:'The hard set is the one telling you it\'s impossible.',
    done:'The illusion broke. It was never impossible.' },
  { title:'Wake the sleeping ally', note:'Consistency this week brings them back to your side.',
    done:'Your ally is awake and back at your side.' },
  { title:'Climb toward the palace', note:'Each finished session is another floor cleared.',
    done:'Another floor cleared. The palace is closer.' },
  { title:'Seal the rift', note:'Two more sessions and it closes for good.',
    done:'The rift is sealed.' },
];
const questFor = seed => QUESTS[Math.abs(Math.round(seed)) % QUESTS.length];
const questSeed = (day, month) => questFor(day * 3 + month);
const PROFILE = { name:'Mika', since:'March 2026' };
const ICON_COLORS = ['#E1699C','#7C8FC9','#5EC4D6','#5C6684','#F0A385'];
const TOKENS = ['star shard','moon sigil','prism','wand charge','sun ember','comet fragment','dawn ribbon','tide pearl'];
const tokenFor = seed => TOKENS[Math.abs(Math.round(seed)) % TOKENS.length];
const RANK_STEPS = [3,6,10,15,21,28,36,45,55,66,78,91,105,120,136,153,171,190,210,240];
const RANKS = [
  { name:'First spark', next:'Novice', pill:'background:#FCE8F1;color:#c4548a', gem:'#E1699C' },
  { name:'Novice guardian', next:'Moonlit', pill:'background:#FCE8F1;color:#c4548a', gem:'#E1699C' },
  { name:'Moonlit cadet', next:'Starlit', pill:'background:#FCE8F1;color:#c4548a', gem:'#E1699C' },
  { name:'Starlit cadet', next:'Dawn', pill:'background:#FCE8F1;color:#c4548a', gem:'#E1699C' },
  { name:'Dawn sentry', next:'Twilight', pill:'background:#FCE8F1;color:#c4548a', gem:'#E1699C' },
  { name:'Twilight sentry', next:'Prism', pill:'background:#E9EEF9;color:#4C5E96', gem:'#7C8FC9' },
  { name:'Prism adept', next:'Tidecaller', pill:'background:#E9EEF9;color:#4C5E96', gem:'#7C8FC9' },
  { name:'Tidecaller adept', next:'Emberwing', pill:'background:#E9EEF9;color:#4C5E96', gem:'#7C8FC9' },
  { name:'Emberwing adept', next:'Stormveil', pill:'background:#E9EEF9;color:#4C5E96', gem:'#7C8FC9' },
  { name:'Stormveil knight', next:'Auroral', pill:'background:#E9EEF9;color:#4C5E96', gem:'#7C8FC9' },
  { name:'Auroral knight', next:'Solstice', pill:'background:#E4F4F7;color:#2F7F8C', gem:'#5EC4D6' },
  { name:'Solstice knight', next:'Mirrorheart', pill:'background:#E4F4F7;color:#2F7F8C', gem:'#5EC4D6' },
  { name:'Mirrorheart warden', next:'Nightbloom', pill:'background:#E4F4F7;color:#2F7F8C', gem:'#5EC4D6' },
  { name:'Nightbloom warden', next:'Cometfall', pill:'background:#E4F4F7;color:#2F7F8C', gem:'#5EC4D6' },
  { name:'Cometfall warden', next:'Eclipse', pill:'background:#E4F4F7;color:#2F7F8C', gem:'#5EC4D6' },
  { name:'Eclipse paragon', next:'Halcyon', pill:'background:#EDEFF6;color:#4A5268', gem:'#5C6684' },
  { name:'Halcyon paragon', next:'Radiant', pill:'background:#EDEFF6;color:#4A5268', gem:'#5C6684' },
  { name:'Radiant paragon', next:'Celestial', pill:'background:#EDEFF6;color:#4A5268', gem:'#5C6684' },
  { name:'Celestial vanguard', next:'Eternal', pill:'background:#EDEFF6;color:#4A5268', gem:'#5C6684' },
  { name:'Eternal sovereign', next:'the next season', pill:'background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%);color:#fff;box-shadow:0 2px 8px rgba(225,105,156,.35)', gem:'#fff' },
];
const CAT = n => n.indexOf('Push')>-1 ? 'Push' : n.indexOf('Pull')>-1 ? 'Pull' : n.indexOf('Leg')>-1 ? 'Legs' : 'Core';
const idOf = av => (av && av.id) || 'unknown';
const isoOf = dt => dt.getFullYear() + '-' + String(dt.getMonth() + 1).padStart(2,'0') + '-' + String(dt.getDate()).padStart(2,'0');
class PlannerLogic extends DCLogic {
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

  // Overlay state the edit screens accumulate; once a save lands in the database it is dropped.
  static EDIT_OVERLAYS = { renames:null, fields:null, removed:null, areas:null, icons:null, iconColors:null, exIcons:null,
    extra:null, repeat:false, rDist:null, rElev:null, rHrs:null, rMins:null, rZone:null,
    aDist:null, aElev:null, aHrs:null, aMins:null, editKey:null };

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
  renderVals(){
    const self = this;
    const st = this.state;
    const { EX, SEED, DIARY } = this.model;
    const nowDate = new Date();
    const Y = nowDate.getFullYear();
    const TODAY_M = nowDate.getMonth();
    const TODAY_D = nowDate.getDate();
    const TK = TODAY_M * 100 + TODAY_D;
    const seedAt = (m, d) => (SEED[m] || {})[d] || null;
    const ACT = SEED[TODAY_M] || {};
    const tab = on => 'padding:9px 15px;border:none;border-radius:11px;font-size:12.5px;font-weight:600;cursor:pointer;'
      + (on ? 'background:#232A45;color:#fff' : 'background:rgba(255,255,255,.75);color:#5C6684');
    const seg = on => 'flex:1;min-width:0;padding:12px' + (narrow ? '' : ' 20px') + ';border:none;border-radius:12px;font-size:14px;font-weight:600;cursor:pointer;'
      + (on ? 'background:'+PINK+';color:#fff' : 'background:none;color:#746E88');

    const nameOf = n => (((st.renames || {})[n]) != null && st.renames[n] !== '') ? st.renames[n] : n;
    const instList = (name, key) => (EX[name] || []).concat((st.extra||{})[key] || [])
      .filter(e => (((st.removed||{})[key]) || []).indexOf(e.name) === -1);
    const countAt = av => instList(av.name, idOf(av)).length;
    const doneCountAt = av => {
      const dn = (st.done || {})[idOf(av)] || [];
      return instList(av.name, idOf(av)).filter(e => dn.indexOf(e.name) !== -1).length;
    };
    const rankIx = st.rank != null ? st.rank : 0;
    const ENTRIES = {};
    Object.assign(ENTRIES, DIARY);
    const dScope = st.diaryScope || 'all';
    const isoToday = isoOf(nowDate);
    const iso30 = isoOf(new Date(Y, TODAY_M, TODAY_D - 29));
    const scopeStyle = on => 'flex:none;padding:9px 18px;border:none;border-radius:11px;font-size:12.5px;font-weight:600;cursor:pointer;'
      + (on ? 'background:#E1699C;color:#fff' : 'background:none;color:#746E88');
    const iconColor = st.iconColor || '#E1699C';
    const rideDoneAt = av => !!(st.rideDone || {})[idOf(av)];
    const isDoneEntry = av => !!av && (av.ride
      ? rideDoneAt(av)
      : (countAt(av) > 0 && doneCountAt(av) === countAt(av)));
    const metaFor = av => !av ? ''
      : av.ride ? (av.ride.dist ? av.ride.dist + ' mi · ' + av.time : av.time)
      : isDoneEntry(av) ? countAt(av) + ' exercises · ' + av.time
      : doneCountAt(av) > 0 ? doneCountAt(av) + ' of ' + countAt(av) + ' done · ' + av.time
      : countAt(av) + ' exercises · ' + av.time;
    const mi = MONTHS.indexOf(st.month);
    const dim = new Date(Y, mi+1, 0).getDate();
    const selDay = Math.min(st.day, dim);
    const isCurMonth = mi === TODAY_M;
    const actFor = d => seedAt(mi, d);
    const actForDate = d => seedAt(d.getMonth(), d.getDate());
    const selDate = new Date(Y, mi, selDay);
    const wkStart = new Date(Y, mi, selDay - selDate.getDay());
    const cells = [];
    for (let i=0;i<7;i++) cells.push(new Date(wkStart.getFullYear(), wkStart.getMonth(), wkStart.getDate()+i));
    const wkEnd = cells[6];
    const stamp = d => MON3[d.getMonth()] + ' ' + d.getDate();
    const weekLabel = wkStart.getMonth() === wkEnd.getMonth()
      ? MON3[wkStart.getMonth()] + ' ' + wkStart.getDate() + ' – ' + wkEnd.getDate()
      : stamp(wkStart) + ' – ' + stamp(wkEnd);
    const spansMonths = cells[0].getMonth() !== cells[6].getMonth();
    const dayDefs = cells.map(d => {
      const av = actForDate(d);
      const past = (d.getMonth() * 100 + d.getDate()) < TK;
      const done = !!av && isDoneEntry(av);
      return [DOW1[d.getDay()], d.getDate(), !!av, d.getMonth()===mi, d.getMonth(), done, !!av && !done && past];
    });
    const days = dayDefs.map(([letter,num,dot,same,cellMonth,done,miss]) => {
      const on = selDay === num && same;
      return {
        letter, num, pick: () => this.s({ month: MONTHS[cellMonth], day:num, monthOpen:false }),
        mon: spansMonths ? MON3[cellMonth].toUpperCase() : '',
        monStyle: spansMonths
          ? 'font-size:8.5px;font-weight:700;letter-spacing:.08em;color:' + (on ? 'rgba(255,255,255,.8)' : '#A9A2B4')
          : 'display:none',
        aria: DOWFULL[new Date(Y, cellMonth, num).getDay()] + ', ' + MONTHS[cellMonth] + ' ' + num + ' — '
          + (!dot ? 'rest day' : done ? 'completed' : miss ? 'missed' : 'planned'),
        isToday: (cellMonth === TODAY_M && num === TODAY_D) ? 'date' : false,
        wrapStyle:'flex:1;min-width:0;padding:8px 2px 10px;border:none;border-radius:16px;background:'+(on?PINK:'none')+';display:flex;flex-direction:column;align-items:center;gap:3px;cursor:pointer',
        letterStyle:"font-family:'Space Grotesk',system-ui,sans-serif;"+'font-size:11.5px;font-weight:600;color:'+(on?'rgba(255,255,255,.85)':'#746E88'),
        numStyle:"font-family:'Space Grotesk',system-ui,sans-serif;"+'font-size:16px;font-weight:'+(on?'700':'600')+';color:'+(on?'#fff':same?'#232A45':'#C7C4D0'),
        dotStyle: !dot
          ? 'width:10px;height:2px;border-radius:1px;background:'+(on?'rgba(255,255,255,.6)':'#DAD7E0')
          : done
            ? 'width:6px;height:6px;border-radius:50%;background:'+(on?'#fff':'#5C6684')
            : miss
              ? 'width:7px;height:7px;border-radius:50%;background:none;box-shadow:inset 0 0 0 1.5px '+(on?'rgba(255,255,255,.85)':'#746E88')
              : 'width:6px;height:6px;border-radius:50%;background:none;box-shadow:inset 0 0 0 1.5px '+(on?'#fff':'#5EC4D6')
      };
    });

    const months = MONTHS.map(name => ({
      name, short: MON3[MONTHS.indexOf(name)],
      pick: () => this.s({ month:name, monthOpen:false, day:1 }),
      style:"font-family:'Space Grotesk',system-ui,sans-serif;"+'padding:11px 6px;border-radius:12px;font-size:14px;border:none;cursor:pointer;'
        + (st.month===name ? 'background:'+PINK+';color:#fff;font-weight:700' : 'color:#232A45;font-weight:500')
    }));

    const moodDefs = [['Happy','#E1699C'],['Neutral','#5C6684'],['Sad','#7C8FC9'],['Mad','#B23A4C']];
    const moods = moodDefs.map(([name,bg]) => {
      const on = st.mood === name;
      return {
        name, pick: () => this.s({ mood:name }),
        wrap:'border:none;background:none;padding:6px;display:flex;flex-direction:column;align-items:center;gap:9px;cursor:pointer;border-radius:16px',
        face:'width:60px;height:60px;border-radius:50%;background:'+bg+';display:flex;align-items:center;justify-content:center;box-shadow:'
          + (on ? '0 0 0 2px #FBF1F3, 0 0 0 4px '+bg : 'none'),
        isHappy: name==='Happy', isNeutral: name==='Neutral', isSad: name==='Sad', isMad: name==='Mad',
        label:'font-size:12.5px;font-weight:'+(on?'700':'500')+';color:'+(on?'#232A45':'#746E88')
      };
    });

    const RPE_WORDS = ['Easy','Steady','Solid','Hard','All out'];
    const moodSvg = m => {
      const eyes = [
        React.createElement('circle', { key:'e1', cx:9, cy:10, r:1.1, fill:'#FBF1F3', stroke:'none' }),
        React.createElement('circle', { key:'e2', cx:15, cy:10, r:1.1, fill:'#FBF1F3', stroke:'none' }),
      ];
      const brows = [
        React.createElement('line', { key:'b1', x1:7.4, y1:8.4, x2:10.6, y2:10.2 }),
        React.createElement('line', { key:'b2', x1:16.6, y1:8.4, x2:13.4, y2:10.2 }),
      ];
      const mouth = m === 'Happy' ? React.createElement('path', { key:'m', d:'M8.5 14.5c1.1 1.7 5.9 1.7 7 0' })
        : m === 'Neutral' ? React.createElement('line', { key:'m', x1:8.5, y1:15, x2:15.5, y2:15 })
        : React.createElement('path', { key:'m', d:'M8.5 16c1.1-1.7 5.9-1.7 7 0' });
      return React.createElement('svg', {
        'aria-hidden':'true',
        viewBox:'0 0 24 24', fill:'none', stroke:'#FBF1F3', strokeWidth:2, strokeLinecap:'round',
        style:{ width:26, height:26 }
      }, (m === 'Mad' ? brows : eyes).concat([mouth]));
    };
    const stars = [1,2,3,4,5].map(n => ({
      glyph: n <= st.rpe ? '★' : '☆',
      pick: () => this.s({ rpe:n }),
      style:'border:none;background:none;padding:0;font-size:26px;line-height:1;cursor:pointer;color:'+(n<=st.rpe?'#232A45':'#C7C4D0')
    }));

    const todayDate = new Date(Y, TODAY_M, TODAY_D);
    const todayWkStart = new Date(Y, TODAY_M, TODAY_D - todayDate.getDay());
    const weekAll = [];
    for (let i=0;i<7;i++){
      const d = new Date(todayWkStart.getFullYear(), todayWkStart.getMonth(), todayWkStart.getDate()+i);
      if (actForDate(d)) weekAll.push(actForDate(d));
    }
    let nextUp = null;
    const upcoming = this.model.entries.find(x => x.m * 100 + x.d > TK && x.av.s !== 'c');
    if (upcoming) {
      const nd = new Date(Y, upcoming.m, upcoming.d);
      nextUp = { name: upcoming.av.name, meta2: DOW3[nd.getDay()].charAt(0) + DOW3[nd.getDay()].slice(1,3).toLowerCase() + ', ' + MON3[upcoming.m] + ' ' + upcoming.d + ' · ' + upcoming.av.time };
    }
    const creating = st.screen === 'edit' && !!st.creating;
    const diaryDays = Object.keys(ENTRIES)
      .sort((a,b) => (ENTRIES[b].m * 100 + ENTRIES[b].d) - (ENTRIES[a].m * 100 + ENTRIES[a].d))
      .filter(id => {
        const e = ENTRIES[id];
        const iso = isoOf(new Date(Y, e.m, e.d));
        if (st.rFrom && iso < st.rFrom) return false;
        if (st.rTo && iso > st.rTo) return false;
        return true;
      });
    const spanDays = [];
    (TODAY_M > 0 ? [TODAY_M - 1, TODAY_M] : [TODAY_M]).forEach(m => {
      const last = new Date(Y, m + 1, 0).getDate();
      for (let d = 1; d <= last; d++){
        const av = seedAt(m, d);
        if (av) spanDays.push({ m, d, av, done: isDoneEntry(av) });
      }
    });
    const monthDays = spanDays.filter(x => x.m === TODAY_M);
    const unloggedDays = monthDays.filter(x => !ENTRIES[idOf(x.av)] && x.d <= TODAY_D).slice().sort((a,b) => b.d - a.d);
    const thisWeekIx = Math.floor((TODAY_D - 1) / 7);
    const barSel = st.barSel == null ? thisWeekIx : st.barSel;
    const totalSessions = spanDays.length;
    const completedSessions = spanDays.filter(x => x.done).length;
    const doneByDay = {};
    spanDays.forEach(x => { if (x.done) doneByDay[x.d] = 1; });
    const plannedByDay = {}, dayComplete = {};
    spanDays.forEach(x => {
      const k = x.m + '-' + x.d;
      plannedByDay[k] = (plannedByDay[k] || 0) + 1;
      dayComplete[k] = (dayComplete[k] === undefined ? true : dayComplete[k]) && x.done;
    });
    const todayKey = TODAY_M + '-' + TODAY_D;
    const todayLogged = !!plannedByDay[todayKey] && !!dayComplete[todayKey];
    let streak = 0;
    for (let back = 1; back <= 90; back++){
      const dt = new Date(Y, TODAY_M, TODAY_D - back);
      const k = dt.getMonth() + '-' + dt.getDate();
      if (!plannedByDay[k]) continue;
      if (dayComplete[k]) streak++; else break;
    }
    let longest = 0, run = 0;
    for (let back = 90; back >= 0; back--){
      const dt = new Date(Y, TODAY_M, TODAY_D - back);
      const k = dt.getMonth() + '-' + dt.getDate();
      if (!plannedByDay[k]) continue;
      if (dayComplete[k]) { run++; longest = Math.max(longest, run); } else run = 0;
    }
    const weekBuckets = [];
    for (let w = 0; w < 5; w++){
      const from = 1 + w * 7, to = from + 6;
      const inWeek = monthDays.filter(x => x.d >= from && x.d <= to);
      weekBuckets.push({ planned: inWeek.length, done: inWeek.filter(x => x.done).length });
    }
    const spanWeeks = (() => {
      const wk = {};
      spanDays.forEach(x => { const dt = new Date(Y, x.m, x.d); wk[Math.floor((dt.getTime() - new Date(Y, Math.max(0, TODAY_M - 1), 1).getTime()) / 604800000)] = 1; });
      return Object.keys(wk).length || 1;
    })();
    const weeklyAvg = (completedSessions / spanWeeks).toFixed(1);
    const moodCounts = {};
    Object.keys(ENTRIES).forEach(k => { const m = ENTRIES[k].mood; moodCounts[m] = (moodCounts[m] || 0) + 1; });
    const moodTotal = Object.keys(ENTRIES).length || 1;
    const questCounts = {};
    spanDays.filter(x => x.done).forEach(x => {
      const t = questSeed(x.d, x.m).title;
      questCounts[t] = (questCounts[t] || 0) + 1;
    });
    const bestByEx = {};
    Object.keys(EX).forEach(k => EX[k].forEach(e => {
      const ov = ((st.fields || {})[k + '|' + e.name] || {}).weight;
      const w = parseFloat(String(ov != null ? ov : e.weight).replace(/[^0-9.]/g, ''));
      if (!isNaN(w) && w > (bestByEx[e.name] || 0)) bestByEx[e.name] = w;
    }));
    const longestRide = spanDays.reduce((max, x) =>
      x.av.ride && x.done ? Math.max(max, parseFloat(x.av.ride.dist) || 0) : max, 0);
    const xpTotal = spanDays.reduce((sum, x) =>
      sum + (x.av.ride ? 0 : doneCountAt(x.av) * 10) + (x.done ? 50 : 0), 0);
    const XP_STEPS = RANK_STEPS.map(s => s * 100);
    let derivedRank = 0;
    while (derivedRank < XP_STEPS.length - 1 && xpTotal >= XP_STEPS[derivedRank]) derivedRank++;
    const rankFloor = derivedRank === 0 ? 0 : XP_STEPS[derivedRank - 1];
    const rankCeil = XP_STEPS[derivedRank];
    const todayAct = seedAt(TODAY_M, TODAY_D);
    const arsenalNames = (() => {
      const s2 = {};
      Object.keys(EX).forEach(k => EX[k].forEach(e => { s2[e.name] = 1; }));
      Object.keys(st.extra || {}).forEach(k => (st.extra[k] || []).forEach(e => { s2[e.name] = 1; }));
      this.model.library.forEach(e => { s2[e.name] = 1; });
      return Object.keys(s2);
    })();
    const rankPct = Math.min(100, Math.round((xpTotal - rankFloor) / Math.max(1, rankCeil - rankFloor) * 100));
    const pickLead = new Date(Y, mi, 1).getDay();
    const pickRows = Math.ceil((pickLead + dim) / 7);
    const pickerCells = [];
    for (let i=0;i<pickRows*7;i++){
      const pd = i - pickLead + 1;
      if (pd < 1 || pd > dim){
        pickerCells.push({ label:'', style:'height:34px;border:none;background:none;cursor:default' });
        continue;
      }
      pickerCells.push({
        label: String(pd),
        pick: () => this.s({ day:pd, dateOpen:false }),
        style:'height:34px;border:none;border-radius:10px;cursor:pointer;font-family:\'Space Grotesk\',system-ui,sans-serif;font-size:12.5px;font-weight:'
          + (pd === selDay ? '700;background:#E1699C;color:#fff' : '500;background:none;color:#232A45')
      });
    }
    const editSrc = (st.screen === 'edit' && !creating && st.editKey)
      ? seedAt(Number(st.editKey.split('-')[0]), Number(st.editKey.split('-')[1])) : null;
    const srcAct = editSrc || actFor(selDay);
    const selRide = (srcAct && srcAct.ride) ? srcAct.ride : null;
    const rideDone = !!(st.rideDone || {})[idOf(srcAct)];
    const savedRide = (!creating && selRide) ? selRide : null;
    const isCycleView = creating ? st.newType === 'cycle' : !!savedRide;
    const rDist = st.rDist != null ? st.rDist : (savedRide ? (savedRide.dist || '') : '');
    const rElev = st.rElev != null ? st.rElev : (savedRide ? (savedRide.elev || '') : '');
    const rHrs = st.rHrs != null ? st.rHrs : (savedRide ? (savedRide.hrs || '') : '');
    const rMins = st.rMins != null ? st.rMins : (savedRide ? (savedRide.mins || '') : '');
    const plannedMin = Number(rHrs || 0) * 60 + Number(rMins || 0);
    const planDist = Number(rDist || 0);
    const actual: any = (srcAct && srcAct.actual) || {};
    const aDist = st.aDist != null ? st.aDist : (actual.dist || '');
    const aElev = st.aElev != null ? st.aElev : (actual.elev || '');
    const aHrs = st.aHrs != null ? st.aHrs : (actual.hrs || '');
    const aMins = st.aMins != null ? st.aMins : (actual.mins || '');
    const rodeDist = Number(aDist || 0);
    const ridePct = !rodeDist ? null : planDist ? Math.round(rodeDist / planDist * 100) : 100;
    const selAct = creating ? null : srcAct;
    const baseName = (srcAct && srcAct.name) || '';
    const selName = creating ? (st.newName || '') : (((st.renames || {})[baseName]) != null ? st.renames[baseName] : baseName);
    const libraryFor = name => {
      const have = {};
      ((EX[name] || []).concat((st.extra||{})[name] || [])
        .filter(e => (((st.removed||{})[name]) || []).indexOf(e.name) === -1))
        .forEach(e => { have[e.name] = 1; });
      const all = [];
      const add = e => { if (!have[e.name] && !all.some(x => x.name===e.name)) all.push(e); };
      Object.keys(EX).forEach(k => EX[k].forEach(add));
      Object.keys(st.extra || {}).forEach(k => (st.extra[k] || []).forEach(add));
      this.model.library.forEach(add);
      return all;
    };
    const listKey = creating ? '__draft' : idOf(srcAct);
    const picked = ((st.areas || {})[listKey]) || (srcAct && srcAct.areas) || [];
    const wIcon = ((st.icons || {})[listKey]) || (srcAct && srcAct.icon) || (isCycleView ? 'bike' : 'h');
    const wColor = ((st.iconColors || {})[listKey]) || (srcAct && srcAct.iconColor) || '#E1699C';
    const doneNames = (st.done || {})[listKey] || [];
    const doneSet = {};
    doneNames.forEach(n => { doneSet[n] = 1; });
    const doneCount = doneNames.length;
    const gone = (st.removed || {})[listKey] || [];
    const added = (st.extra || {})[listKey] || [];
    const selList = (creating ? [] : (EX[baseName] || [])).concat(added)
      .filter(e => gone.indexOf(e.name) === -1)
      .map(e => Object.assign({}, e, (st.fields || {})[listKey + '|' + e.name] || {}));
    const all = selList.map(e => ({
      text: e.name + ' — ' + e.sets + ' · ' + e.weight,
      isH: e.i==='h', isV: e.i==='v', isD: e.i==='d',
      textStyle:'flex:1;min-width:0;font-size:14.5px;font-weight:500;'
        + (doneSet[e.name] ? 'color:#746E88;text-decoration:line-through' : 'color:#232A45'),
      tick:'flex:none;width:18px;height:18px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:'
        + (doneSet[e.name] ? '#E1699C' : 'transparent')
    }));
    const ridePast = mi * 100 + selDay < TK;
    const ridePlanOpen = !!savedRide && !rideDone && !ridePast;
    const entryKey = idOf(actFor(selDay));
    const hasEntry = !!DIARY[entryKey];
    const questCleared = !!selAct && (rideDone
      || (!selRide && selList.length > 0 && doneCount === selList.length));
    const doneSel = !!selAct && (selAct.s === 'c' || rideDone
      || (!selRide && selList.length > 0 && doneCount === selList.length));

    const weekRows = cells.map(d => {
      const a = actForDate(d);
      if (!a) {
        const today0 = d.getMonth() === TODAY_M && d.getDate() === TODAY_D;
        const lab = DOW3[d.getDay()] + ' '
          + (d.getMonth() === mi ? '' : MON3[d.getMonth()].toUpperCase() + ' ')
          + d.getDate() + (today0 ? ' · TODAY' : '');
        return { label: lab, isRest: true, hasRow: false, done: false,
          eyebrow:'font-size:11px;font-weight:700;letter-spacing:.11em;margin:14px 0 9px;color:' + (today0 ? '#c4548a' : '#746E88') };
      }
      const today = a.s === 't';
      const label = DOW3[d.getDay()] + ' '
        + (d.getMonth() === mi ? '' : MON3[d.getMonth()].toUpperCase() + ' ')
        + d.getDate() + (today ? ' · TODAY' : '');
      return {
      label, hasRow: true, isRest: false, name: nameOf(a.name),
      done: isDoneEntry(a),
      meta: metaFor(a),
      isPush: CAT(a.name)==='Push', isPull: CAT(a.name)==='Pull', isLegs: CAT(a.name)==='Legs',
      isCore: CAT(a.name)==='Core', isRideRow: !!a.ride,
      open: () => this.nav({ screen:'detail', creating:false, month: MONTHS[d.getMonth()], day: d.getDate() }),
      aria: label.replace(' · ', ', ') + ': ' + a.name + ', ' + metaFor(a) + ', '
        + (isDoneEntry(a) ? 'completed' : (d.getMonth() * 100 + d.getDate()) < TK ? 'missed' : 'planned'),
      stateDot:'flex:none;margin-left:auto;'
        + (isDoneEntry(a) ? 'width:8px;height:8px;border-radius:50%;background:#5C6684'
           : (d.getMonth() * 100 + d.getDate()) < TK ? 'width:9px;height:9px;border-radius:50%;box-shadow:inset 0 0 0 1.5px #746E88'
           : 'width:8px;height:8px;border-radius:50%;box-shadow:inset 0 0 0 1.5px #5EC4D6'),
      eyebrow:'font-size:11px;font-weight:700;letter-spacing:.11em;margin:14px 0 9px;color:'+(label.indexOf('TODAY')>-1?'#c4548a':'#746E88'),
      };
    });

    const lead = new Date(Y, mi, 1).getDay();
    const rows = Math.ceil((lead + dim) / 7);
    const monthCells = [];
    for (let i=0;i<rows*7;i++){
      const d = i - lead + 1;
      if (d < 1 || d > dim){ monthCells.push({ label:'', wrap:'height:50px;border:none;background:none;outline:none;cursor:default', num:'display:none', dot:'display:none' }); continue; }
      const av = actFor(d);
      let a = av && av.s;
      if (av && a !== 't' && isDoneEntry(av)) a = 'c';
      const today = a === 't';
      const sel = d === selDay;
      const missed = !!a && a !== 'c' && a !== 't' && isCurMonth && d < TODAY_D;
      monthCells.push({
        label: String(d),
        pick: () => this.s({ day:d }),
        wrap:'height:50px;border:none;border-radius:14px;outline:none;cursor:pointer;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;'
          + (sel ? 'background:#E1699C'
             : missed ? 'background:rgba(255,255,255,.5)'
             : a ? 'background:#fff;box-shadow:0 1px 3px rgba(35,42,69,.06)' : 'background:none')
          + (today && !sel ? ';box-shadow:inset 0 0 0 1.5px rgba(225,105,156,.45)' : ''),
        aria: (d ? DOWFULL[new Date(Y, mi, d).getDay()] + ', ' + st.month + ' ' + d + ' — '
          + (a === 'c' ? 'completed' : missed ? 'missed' : a ? 'planned' : 'rest day')
          + (today ? ', today' : '') : ''),
        isToday: today ? 'date' : false,
        num:"font-family:'Space Grotesk',system-ui,sans-serif;font-size:13px;font-weight:"+(a?'600':'400')+';color:'+(sel?'#fff':missed?'#746E88':a?'#232A45':'#746E88'),
        dot: a === 'c' || (sel && a && !missed)
          ? 'width:6px;height:6px;border-radius:50%;background:' + (sel ? '#fff' : '#5C6684')
          : missed
            ? 'width:7px;height:7px;border-radius:50%;background:none;position:relative;box-shadow:inset 0 0 0 1.5px ' + (sel ? 'rgba(255,255,255,.85)' : '#746E88')
            : a
              ? 'width:6px;height:6px;border-radius:50%;background:none;box-shadow:inset 0 0 0 1.5px ' + (sel ? '#fff' : '#5EC4D6')
              : 'width:7px;height:1.5px;border-radius:1px;background:' + (sel ? 'rgba(255,255,255,.6)' : '#DAD7E0')
      });
    }
    const firstEntry = name => { const hit = this.model.entries.find(x => x.av.name === name); return hit ? { m:hit.m, d:hit.d } : null; };
    const activeDays = isCurMonth ? Object.keys(ACT).map(Number).sort((a,b)=>a-b) : [];
    const pts = activeDays.map(d => {
      const i = d + lead - 1;
      return ((i % 7) + 0.5) + ',' + (Math.floor(i / 7) + 0.5);
    }).join(' ');
    const constellation = React.createElement('svg', {
      'aria-hidden':'true',
      viewBox:'0 0 7 '+rows, preserveAspectRatio:'none',
      style:{ width:'100%', height:'100%', display:'block' }
    }, React.createElement('polyline', {
      points: pts, fill:'none', stroke:'#7C8FC9', strokeWidth:0.015,
      strokeDasharray:'0.06 0.05', strokeLinejoin:'round'
    }));

    const ICONS: any[] = [
      ['h','line',[['line',{x1:6,y1:12,x2:18,y2:12}],['line',{x1:4,y1:9,x2:4,y2:15}],['line',{x1:20,y1:9,x2:20,y2:15}],['line',{x1:7,y1:9,x2:7,y2:15}],['line',{x1:17,y1:9,x2:17,y2:15}]]],
      ['v','line',[['line',{x1:12,y1:6,x2:12,y2:18}],['line',{x1:9,y1:4,x2:15,y2:4}],['line',{x1:9,y1:20,x2:15,y2:20}],['line',{x1:9,y1:7,x2:15,y2:7}],['line',{x1:9,y1:17,x2:15,y2:17}]]],
      ['d','line',[['line',{x1:9,y1:12,x2:15,y2:12}],['line',{x1:6,y1:9,x2:6,y2:15}],['line',{x1:18,y1:9,x2:18,y2:15}]]],
      ['bike','line',[['circle',{cx:6,cy:17,r:3.4}],['circle',{cx:18,cy:17,r:3.4}],['path',{d:'M6 17l5-8h5l2 8'}],['path',{d:'M10 9h4'}]]],
    ];
    const iconSvg = (key, color?) => {
      const def = ICONS.find(i => i[0] === key) || ICONS[0];
      return React.createElement('svg', {
        'aria-hidden':'true',
        viewBox:'0 0 24 24', fill:'none', stroke: color || '#E1699C', strokeWidth:2,
        strokeLinecap:'round', strokeLinejoin:'round',
        style:{ width:20, height:20, flex:'none' }
      }, def[2].map((p,i) => React.createElement(p[0], Object.assign({ key:i }, p[1]))));
    };
    const zoneStyle = on => 'padding:10px 16px;border:none;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;'
      + (on ? 'background:#E1699C;color:#fff' : 'background:#FBF1F3;color:#5C6684');
    const modeStyle = on => 'padding:9px 13px;border:none;border-radius:10px;font-size:12.5px;font-weight:600;cursor:pointer;'
      + (on ? 'background:#fff;color:#c4548a;box-shadow:0 1px 3px rgba(35,42,69,.06)' : 'background:none;color:#746E88');
    const optStyle = on => 'min-height:48px;border:none;border-radius:14px;display:flex;align-items:center;justify-content:center;cursor:pointer;background:'
      + (on ? '#FCE8F1' : '#FBF1F3') + (on ? ';box-shadow:0 0 0 2px #E1699C' : '');
    const narrow = typeof window !== 'undefined' && window.innerWidth < 720;
    const tablet = typeof window !== 'undefined' && window.innerWidth >= 720 && window.innerWidth < 1020;
    const navExtra = tablet ? ';flex:none;padding:11px 16px' : '';
    const mTab = (on, accent?) => 'flex:1;min-height:56px;border:none;background:none;padding:8px 4px;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:4px;cursor:pointer;border-radius:14px;'
      + (on ? 'background:#FCE8F1' : '');
    const mLabel = on => 'font-size:10.5px;font-weight:'+(on?'700':'500')+';letter-spacing:.01em;color:'+(on?'#c4548a':'#746E88');
    const onCal = st.screen==='day' || st.screen==='rest' || st.screen==='diary' || st.screen==='edit';
    const calActive = ['day','rest','edit','detail','newEntry'].indexOf(st.screen) > -1;

    return {
      weekRows, monthCells, constellation,
      topTabsStyle: narrow ? 'display:none' : 'display:flex;flex-wrap:wrap;gap:6px;padding:18px 28px 0',
      sidebarStyle: narrow ? 'display:none'
        : tablet
          ? 'flex:1 1 100%;width:100%;position:relative;background:#fff;border-radius:18px;padding:8px;box-shadow:0 4px 14px rgba(35,42,69,.07)'
          : 'flex:0 1 208px;min-width:180px;position:relative;background:#fff;border-radius:22px;padding:18px 14px;box-shadow:0 4px 14px rgba(35,42,69,.07)',
      navListStyle: tablet
        ? 'display:flex;flex-direction:row;gap:4px'
        : 'display:flex;flex-direction:column;gap:4px',
      pageStyle: 'min-height:100vh;padding:0 0 ' + (narrow ? '108px' : '64px'),
      tabbarStyle: narrow
        ? 'position:fixed;left:0;right:0;bottom:0;z-index:50;display:flex;align-items:center;gap:4px;padding:8px 12px calc(8px + env(safe-area-inset-bottom));background:rgba(255,255,255,.94);backdrop-filter:blur(14px);border-top:1px solid rgba(35,42,69,.07);box-shadow:0 -4px 14px rgba(35,42,69,.07)'
        : 'display:none',
      mTabCal: mTab(onCal), mTabDiary: mTab(st.screen==='diaryList'), mTabSummary: mTab(st.screen==='summary'),
      mCalColor: onCal ? '#c4548a' : '#746E88',
      mDiaryColor: st.screen==='diaryList' ? '#c4548a' : '#746E88',
      mSummaryColor: st.screen==='summary' ? '#c4548a' : '#746E88',
      mTabProfile: mTab(st.screen==='profile'),
      mProfileColor: st.screen==='profile' ? '#c4548a' : '#746E88',
      mProfileLabel: mLabel(st.screen==='profile'),
      mCalLabel: mLabel(onCal), mDiaryLabel: mLabel(st.screen==='diaryList'), mSummaryLabel: mLabel(st.screen==='summary'),
      isDiaryList: st.screen==='diaryList',
      isProfile: st.screen==='profile',
      rankName: RANKS[derivedRank].name,
      rankStepLabel: 'Rank ' + (derivedRank + 1) + ' of ' + RANKS.length,
      xpInfoOpen: !!st.xpInfo,
      toggleXpInfo: () => this.s({ xpInfo: !st.xpInfo }),
      xpLine: xpTotal + ' of ' + rankCeil + ' XP toward ' + RANKS[derivedRank].next,
      ranksOpen: !!st.ranksOpen,
      openRanks: () => this.s({ ranksOpen:true }),
      closeRanks: () => this.s({ ranksOpen:false }),
      rankLadder: RANKS.map((r, ix) => {
        const cur = ix === derivedRank;
        const reached = ix < derivedRank;
        return {
          label: r.name,
          req: ix === 0 ? 'Start' : XP_STEPS[ix - 1] + ' XP',
          row:'display:flex;align-items:center;gap:12px;padding:11px 14px;border-radius:14px;'
            + (cur ? r.pill : reached ? 'background:#FBF1F3;color:#5C6684' : 'background:none;color:#746E88'),
          gem:'width:11px;height:15px;flex:none;clip-path:polygon(50% 0,100% 35%,50% 100%,0 35%);background:'
            + (ix === RANKS.length - 1
              ? 'linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)'
              : (cur && r.gem === '#fff' ? '#fff' : r.gem))
            + (cur || reached ? '' : ';opacity:.45'),
          name:'flex:1;min-width:0;font-size:13.5px;font-weight:' + (cur ? '700' : '500'),
          xp:'flex:none;font-family:\'Space Grotesk\',system-ui,sans-serif;font-size:12px;font-weight:600;opacity:.8'
        };
      }),
      profileName: PROFILE.name,
      profileInitial: PROFILE.name.charAt(0),
      profileSince: 'Training since ' + PROFILE.since,
      rankPill:'display:inline-flex;align-items:center;gap:8px;margin-top:9px;padding:7px 15px 7px 12px;border-radius:999px;font-size:12.5px;font-weight:700;letter-spacing:.02em;'
        + RANKS[derivedRank].pill,
      rankPillBtn:'display:inline-flex;align-items:center;gap:8px;margin-top:9px;min-height:36px;padding:8px 15px 8px 14px;border:none;border-radius:999px;font-family:inherit;font-size:12.5px;font-weight:700;letter-spacing:.02em;cursor:pointer;'
        + RANKS[derivedRank].pill,
      rankGem:'width:10px;height:14px;flex:none;clip-path:polygon(50% 0,100% 35%,50% 100%,0 35%);background:' + RANKS[derivedRank].gem,
      rankBar:'width:' + rankPct + '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
      rankProgress: rankPct === 0 ? 'Just promoted — 0% to ' + RANKS[derivedRank].next : rankPct + '% to ' + RANKS[derivedRank].next,
      rankTip: 'XP ' + xpTotal + ' of ' + rankCeil + ' · 10 XP per exercise completed, 50 XP per workout finished',
            goProfile: () => this.nav({ screen:'profile', monthOpen:false }),
      tabProfile: tab(st.screen==='profile'),
      navProfile:'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:13.5px;text-align:left;cursor:pointer;'
        + (st.screen==='profile' ? 'background:#FCE8F1;color:#c4548a;font-weight:600' : 'background:none;color:#746E88;font-weight:500') + navExtra,
      navProfileInk: st.screen==='profile' ? '#E1699C' : '#A9A2B4',
      monthSummaryLabel: monthDays.filter(x => x.done).length + ' of ' + monthDays.length + ' done',
      segRowStyle:'display:flex;gap:4px;padding:5px;background:#fff;border-radius:16px;box-shadow:0 4px 14px rgba(35,42,69,.07);'
        + (narrow ? 'flex:1 1 100%;width:100%' : 'flex:none'),
      monthBtn:'display:inline-flex;align-items:center;gap:7px;margin-left:-10px;padding:8px 10px;border:none;border-radius:14px;background:'
        + (st.monthOpen ? 'rgba(35,42,69,.05)' : 'none') + ';cursor:pointer',
      streakCount: streak,
      streakUnit: streak === 1 ? 'day' : 'days',
      streakPillLabel: (streak === 1 ? 'day' : 'day') + ' streak',
      streakNote: todayLogged ? 'Today is in the books.'
        : streak > 0 ? (plannedByDay[todayKey] ? 'Today still pending — finish it to reach ' + (streak + 1) + '.' : 'Rest day — the streak holds.')
        : 'Clear a full day to start one.',
      streakTicks: (() => {
        const out = [];
        for (let back = 0; back <= 90 && out.length < 7; back++){
          const dt = new Date(Y, TODAY_M, TODAY_D - back);
          const k = dt.getMonth() + '-' + dt.getDate();
          if (!plannedByDay[k]) continue;
          const pending = back === 0 && !dayComplete[k];
          out.unshift({
            label: ['S','M','T','W','T','F','S'][dt.getDay()] + ' ' + dt.getDate(),
            bar:'display:block;height:7px;border-radius:4px;background:'
              + (dayComplete[k] ? 'linear-gradient(135deg,#E1699C,#7C8FC9)'
                 : pending ? 'repeating-linear-gradient(135deg,rgba(225,105,156,.45) 0 3px,rgba(225,105,156,.16) 3px 6px)'
                 : 'rgba(35,42,69,.13)'),
            cap:'display:block;margin-top:6px;font-size:9.5px;font-weight:600;letter-spacing:.04em;text-align:center;color:'
              + (pending ? '#8f4f78' : dayComplete[k] ? '#5C6684' : '#746E88')
          });
        }
        return out;
      })(),
      chartRangeLabel: MON3[TODAY_M] + ' · ' + weekBuckets.length + ' weeks',
      weekEmpty: monthDays.filter(x => x.d >= 1 + barSel * 7 && x.d <= 1 + barSel * 7 + 6).length === 0,
      weekSessions: monthDays
        .filter(x => x.d >= 1 + barSel * 7 && x.d <= 1 + barSel * 7 + 6)
        .map(x => ({
          day: DOW3[new Date(Y, TODAY_M, x.d).getDay()] + ' ' + x.d,
          name: nameOf(x.av.name),
          statusLabel: x.done ? 'Done' : 'Planned',
          status:'flex:none;padding:5px 11px;border-radius:999px;font-size:11.5px;font-weight:600;'
            + (x.done ? 'background:#E1699C;color:#fff' : 'background:#fff;color:#746E88'),
          open: () => this.nav({ screen:'detail', creating:false, month:MONTHS[TODAY_M], day:x.d })
        })),
      chartCaption: (() => {
        const b = weekBuckets[barSel] || { planned:0, done:0 };
        const from = 1 + barSel * 7;
        const to = Math.min(new Date(Y, TODAY_M + 1, 0).getDate(), from + 6);
        return (barSel === thisWeekIx ? 'This week' : 'Week ' + (barSel + 1))
          + ' · ' + MON3[TODAY_M] + ' ' + from + '–' + to + ' · '
          + (b.planned ? b.done + ' of ' + b.planned + ' sessions done' : 'nothing planned');
      })(),
      questsClearedLabel: completedSessions + ' of ' + totalSessions,
      questsClearedBar:'width:' + (totalSessions ? Math.round(completedSessions / totalSessions * 100) : 0)
        + '%;height:100%;border-radius:5px;background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
      questStats: Object.keys(questCounts).sort((a,b)=>questCounts[b]-questCounts[a]).slice(0,5)
        .map((t,i) => [t, ['#E1699C','#7C8FC9','#5EC4D6','#5C6684','#F0A385'][i], String(questCounts[t])])
        .map(([name,color,count], ix, arr) => ({
        name, count,
        swatch:'width:10px;height:14px;flex:none;clip-path:polygon(50% 0,100% 35%,50% 100%,0 35%);background:'+color,
        row:'display:flex;align-items:center;gap:12px;padding:10px 0'
          + (ix === arr.length - 1 ? '' : ';border-bottom:1px solid rgba(35,42,69,.055)')
      })),
      profileStats: [
        { label:'SESSIONS DONE', value: String(completedSessions), unit:'of ' + totalSessions + ' since Aug' },
        { label:'CURRENT STREAK', value: String(streak), unit: streak === 1 ? 'day' : 'days' },
        { label:'LONGEST STREAK', value: String(longest), unit: longest === 1 ? 'day' : 'days' },
        { label:'WEEKLY AVERAGE', value: completedSessions ? weeklyAvg : '—',
          unit: completedSessions ? 'sessions' : 'no sessions yet' },
      ],
      weeklyBars: weekBuckets.map(b => b.done).map((n,ix) => ({
        week: ix === thisWeekIx ? 'now' : 'w' + (ix + 1),
        count: n,
        tip: n + (n === 1 ? ' session' : ' sessions') + ' in week ' + (ix + 1),
        pick: () => this.s({ barSel: ix }),
        on: ix === barSel,
        aria: (ix === weekBuckets.length - 1 ? 'This week' : 'Week ' + (ix + 1))
          + ': ' + n + (n === 1 ? ' session' : ' sessions'),
        value:'font-family:\'Space Grotesk\',system-ui,sans-serif;font-size:11px;font-weight:700;color:'
          + (ix === barSel ? '#c4548a' : '#746E88'),
        bar:'width:100%;border-radius:6px 6px 3px 3px;transition:background .2s;height:' + Math.max(4, Math.round(n / Math.max(1, Math.max.apply(null, weekBuckets.map(b=>b.done).concat([1]))) * 96)) + 'px;background:'
          + (ix === barSel ? 'linear-gradient(180deg,#E1699C 0%,#7C8FC9 100%)' : 'rgba(225,105,156,.3)'),
        label:'font-size:9.5px;font-weight:' + (ix === barSel ? '700;color:#c4548a' : '500;color:#746E88')
      })),
      moodSplit: [
        ['Happy','#E1699C'],['Neutral','#5C6684'],['Sad','#7C8FC9'],['Mad','#B23A4C']
      ].map(([name,color]) => [name, color, Math.round((moodCounts[name] || 0) / moodTotal * 100)])
       .map(([name,color,pct]) => ({
        name, pct: pct + '%',
        swatch:'width:10px;height:10px;flex:none;border-radius:50%;background:'+color,
        bar:'display:block;width:'+pct+'%;height:100%;border-radius:5px;background:'+color
      })),
      records: Object.keys(bestByEx).sort((a,b)=>bestByEx[b]-bestByEx[a]).slice(0,4)
        .map(n => [n, bestByEx[n] + ' lb', ''])
        .concat(longestRide ? [['Longest ride', longestRide + ' mi', '']] : [])
        .map(([name,value,delta], ix, arr) => ({
        name, value, delta,
        rowStyle:'display:flex;align-items:center;gap:12px;padding:11px 0;'
          + (ix === arr.length - 1 ? '' : 'border-bottom:1px solid rgba(35,42,69,.055)'),
        deltaStyle:'flex:none;width:44px;text-align:right;font-size:12px;font-weight:600;color:#c4548a'
      })),
      isSummary: st.screen==='summary',
      isSaved: st.screen==='saved',
      saveEntryLabel: st.diaryFrom === 'list' ? 'Save changes' : 'Save entry',
      entryNote: st.entryNote == null ? ((ENTRIES[entryKey]||{}).note || '') : st.entryNote,
      setEntryNote: e => this.s({ entryNote: e.target.value }),
      saveEntry: () => this.save(() => db.saveDiary(entryKey, {
        mood: st.mood, rpe: st.rpe,
        note: (st.entryNote == null ? ((ENTRIES[entryKey]||{}).note || '') : st.entryNote) || 'No notes for this one.'
      }), {
        screen: st.diaryFrom === 'list' ? 'diary' : 'saved',
        diaryEdit: false,
        entryNote: null
      }),
      savedLine: st.mood + ' · ' + st.rpe + '/5 effort on ' + selName + ', ' + MON3[mi] + ' ' + selDay
        + '. One ' + tokenFor(selDay + 2) + ' added to your collection.',
      savedCount: Object.keys(ENTRIES).length + ' entries so far',
      savedNextTitle: nextUp ? 'Get ready for ' + nextUp.name : 'Plan your next workout',
      savedNextMeta: nextUp ? nextUp.meta2 : 'Nothing scheduled ahead',
      goNextUp: () => this.s({ screen:'edit', editing: !!nextUp, seg:'Day' }),
      goSummary: () => this.nav({ screen:'summary', monthOpen:false }),
      tabSummary: tab(st.screen==='summary'),
      wkDone: weekAll.filter(a => a.s==='c').length,
      wkTotal: weekAll.length,
      wkBar: 'width:' + (weekAll.length ? Math.round(weekAll.filter(a=>a.s==='c').length / weekAll.length * 100) : 0) + '%;height:100%;border-radius:4px;background:#E1699C',
      hasNext: !!nextUp, noNext: !nextUp,
      nextName: nextUp && nextUp.name,
      nextMeta: nextUp && nextUp.meta2,
      loggedCount: Object.keys(ENTRIES).length,
      monthDone: monthDays.filter(x => x.done).length,
      monthDoneUnit: 'of ' + monthDays.length + ' done',
      questsDoneLabel: (function(){
        let t=0,d=0;
        for (let i=0;i<7;i++){
          const dt = new Date(Y, TODAY_M, TODAY_D - todayDate.getDay() + i);
          const av = seedAt(dt.getMonth(), dt.getDate());
          if (!av) continue;
          t++;
          if (isDoneEntry(av)) d++;
        }
        return d + ' of ' + t + ' cleared';
      })(),
      weekQuests: (function(){
        const out = [];
        for (let i=0;i<7;i++){
          const d = new Date(Y, TODAY_M, TODAY_D - todayDate.getDay() + i);
          const dm = d.getDate();
          const av = seedAt(d.getMonth(), dm);
          if (!av) continue;
          const isDone = isDoneEntry(av);
          const q = questSeed(dm, d.getMonth());
          out.push({
            day: DOW3[d.getDay()].slice(0,3), name: isDone ? q.done : q.title, done: isDone,
            row:'display:flex;align-items:center;gap:11px;padding:10px 0'
              + (i === 6 ? '' : ';border-bottom:1px solid rgba(35,42,69,.055)'),
            mark:'width:18px;height:18px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;'
              + (isDone ? 'background:#E1699C' : 'background:transparent'),
            title:'flex:1;min-width:0;font-size:13.5px;'
              + (isDone ? 'font-weight:500;color:#c4548a' : 'font-weight:500;color:#232A45')
          });
        }
        return out;
      })(),
      summarySub: (() => {
        const b = weekBuckets[thisWeekIx] || { planned:0, done:0 };
        const left = b.planned - b.done;
        return DOWFULL[todayDate.getDay()] + ', ' + MONTHS[TODAY_M] + ' ' + TODAY_D + '. '
          + (b.planned === 0 ? 'Nothing on the plan this week yet.'
            : left === 0 ? 'Every session this week is done.'
            : left + (left === 1 ? ' session' : ' sessions') + ' left this week.');
      })(),
      goDiaryList: () => this.nav({ screen:'diaryList', monthOpen:false }),
      diaryCount: Object.keys(ENTRIES).length + ' entries',
      isNewEntry: st.screen === 'newEntry',
      openNewEntry: () => this.nav({ screen:'newEntry' }),
      closeNewEntry: () => this.back(),
      noUnlogged: unloggedDays.length === 0,
      unlogged: unloggedDays.map(x => ({
        rowStyle:'display:flex;flex-wrap:wrap;align-items:center;gap:12px;padding:16px 22px;border:none;border-radius:999px;text-align:left;width:100%;background:#fff;box-shadow:0 4px 14px rgba(35,42,69,.07);cursor:pointer',
        day: DOW3[new Date(Y, TODAY_M, x.d).getDay()] + ' ' + x.d,
        name: nameOf(x.av.name),
        meta: x.av.ride ? (x.av.ride.dist ? x.av.ride.dist + ' mi' : x.av.time) : x.av.time,
        pick: () => this.nav({ screen:'diary', month:MONTHS[TODAY_M], day:x.d,
          mood:'Happy', rpe:3, entryNote:null, diaryFrom:'list', diaryEdit:true })
      })),
      navCal:'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:13.5px;text-align:left;cursor:pointer;'
        + (calActive ? 'background:#FCE8F1;color:#c4548a;font-weight:600' : 'background:none;color:#746E88;font-weight:500') + navExtra,
      navDiary:'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:13.5px;text-align:left;cursor:pointer;'
        + (st.screen==='diaryList' ? 'background:#FCE8F1;color:#c4548a;font-weight:600' : 'background:none;color:#746E88;font-weight:500') + navExtra,
      navCalInk: calActive ? '#E1699C' : '#A9A2B4',
      navDiaryInk: st.screen==='diaryList' ? '#E1699C' : '#A9A2B4',
      navSummary:'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:13.5px;text-align:left;cursor:pointer;'
        + (st.screen==='summary' ? 'background:#FCE8F1;color:#c4548a;font-weight:600' : 'background:none;color:#746E88;font-weight:500') + navExtra,
      navSummaryInk: st.screen==='summary' ? '#E1699C' : '#A9A2B4',
      announce: st.announce || '',
      saveError: st.saveError || '',
      dismissError: () => this.s({ saveError:null }),
      yearLabel: String(Y),
      confirmOpen: !!st.confirm,
      confirmTitle: (st.confirm || {}).title,
      confirmBody: (st.confirm || {}).body,
      confirmLabel: (st.confirm || {}).label,
      confirmCancel: () => this.s({ confirm:null }),
      confirmRun: () => {
        const c = st.confirm || {};
        this.s({ confirm:null });
        if (c.kind === 'workout') this.save(() => db.deletePlanEntries([idOf(srcAct)]), { screen:'day', creating:false });
        if (c.kind === 'entry') this.save(() => db.deleteDiary(c.day), { screen: c.after || st.screen });
        if (c.kind === 'series') this.save(() => db.endSeries(c.sid, isoOf(new Date(Y, mi, selDay))));
      },
      isArsenal: st.screen === 'arsenal',
      canGoBack: (st.hist || []).length > 0,
      goBack: () => this.back(),
      arsenalAddOpen: !!st.arsenalAdd,
      openArsenalAdd: () => this.s({ arsenalAdd:true }),
      closeArsenalAdd: () => this.s({ arsenalAdd:false, dName:'', dSets:'', dWeight:'', dRest:'' }),
      commitArsenal: () => {
        const nm = (st.dName || '').trim();
        if (!nm) return;
        const item = { name:nm, sets:(st.dSets||'3 × 10'), weight:(st.dWeight||'—'), rest:(st.dRest||'60 sec'), i:(st.dIcon||'h') };
        this.save(() => db.addLibraryExercise(item), { arsenalAdd:false, dName:'', dSets:'', dWeight:'', dRest:'', dIcon:'h' });
      },
      goArsenal: () => this.nav({ screen:'arsenal', monthOpen:false }),
      navArsenal:'display:flex;align-items:center;gap:11px;padding:11px 13px;border:none;border-radius:14px;font-size:13.5px;text-align:left;cursor:pointer;'
        + (st.screen==='arsenal' ? 'background:#FCE8F1;color:#c4548a;font-weight:600' : 'background:none;color:#746E88;font-weight:500') + navExtra,
      navArsenalInk: st.screen==='arsenal' ? '#E1699C' : '#A9A2B4',
      movesCount: (() => {
        const s2 = {};
        Object.keys(EX).forEach(k => EX[k].forEach(e => { s2[e.name] = 1; }));
        Object.keys(st.extra || {}).forEach(k => (st.extra[k] || []).forEach(e => { s2[e.name] = 1; }));
        this.model.library.forEach(e => { s2[e.name] = 1; });
        return Object.keys(s2).length + ' exercises';
      })(),
      arsenalQuery: st.arsenalQ || '',
      noMatches: !!(st.arsenalQ || '').trim() && !arsenalNames.some(n => n.toLowerCase().indexOf((st.arsenalQ||'').trim().toLowerCase()) > -1),
      noMatchNote: 'No exercise matches “' + (st.arsenalQ || '').trim() + '”.',
      hasQuery: !!(st.arsenalQ || '').trim(),
      setArsenalQuery: e => this.s({ arsenalQ: e.target.value }),
      clearArsenalQuery: () => this.s({ arsenalQ:'' }),
      moveGroups: (() => {
        const q = (st.arsenalQ || '').trim().toLowerCase();
        const groups = [];
        const push = (label, items) => {
          const hit = items.filter(e => !q || e.name.toLowerCase().indexOf(q) > -1);
          if (hit.length) groups.push({
            label: label.toUpperCase(),
            count: hit.length + (hit.length === 1 ? ' exercise' : ' exercises'),
            items: hit
          });
        };
        const rowStyle = clickable => 'display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:16px 20px;background:#fff;border-radius:18px;box-shadow:0 4px 14px rgba(35,42,69,.07)'
          + (clickable ? ';cursor:pointer' : '');
        Object.keys(EX).forEach(w => {
          const firstDay = firstEntry(w);
          push(w, (EX[w] || []).map(e => ({
            name: e.name, svg: iconSvg(e.i), detail: e.sets + ' · ' + e.weight,
            open: firstDay ? () => this.nav({ screen:'detail', creating:false, month:MONTHS[firstDay.m], day:firstDay.d }) : null,
            rowStyle: rowStyle(!!firstDay)
          })));
        });
        push('Unassigned', this.model.library.map(e => ({
          name: e.name, svg: iconSvg(e.i), detail: e.sets + ' · ' + e.weight,
          open: null, rowStyle: rowStyle(false)
        })));
        return groups;
      })(),
      moveLibrary: (() => {
        const seen = {};
        Object.keys(EX).forEach(k => EX[k].forEach(e => {
          if (!seen[e.name]) seen[e.name] = { name:e.name, i:e.i, sets:e.sets, weight:e.weight, used:[] };
          seen[e.name].used.push(k);
        }));
        Object.keys(st.extra || {}).forEach(k => (st.extra[k] || []).forEach(e => {
          if (!seen[e.name]) seen[e.name] = { name:e.name, i:e.i, sets:e.sets, weight:e.weight, used:[] };
          let label = 'Arsenal only';
          if (k === '__draft') label = 'New workout';
          else {
            const src = this.model.entries.find(x => x.av.id === k);
            label = src ? nameOf(src.av.name) : 'Arsenal only';
          }
          if (seen[e.name].used.indexOf(label) === -1) seen[e.name].used.push(label);
        }));
        this.model.library.forEach(e => {
          if (!seen[e.name]) seen[e.name] = { name:e.name, i:e.i, sets:e.sets, weight:e.weight, used:[] };
        });
        const q = (st.arsenalQ || '').trim().toLowerCase();
        return Object.keys(seen).filter(n => !q || n.toLowerCase().indexOf(q) > -1).map(n => {
          const owners = seen[n].used;
          const firstDay = owners.length ? firstEntry(owners[0]) : null;
          return {
            name: n, svg: iconSvg(seen[n].i),
            detail: seen[n].sets + ' · ' + seen[n].weight,
            used: !owners.length ? 'Arsenal only'
              : owners.length === 1 ? owners[0] : owners.length + ' workouts',
            open: firstDay ? () => this.nav({ screen:'detail', creating:false, month:MONTHS[firstDay.m], day:firstDay.d }) : null,
            rowStyle:'display:flex;flex-wrap:wrap;align-items:center;gap:14px;padding:16px 20px;background:#fff;border-radius:18px;box-shadow:0 4px 14px rgba(35,42,69,.07)'
              + (firstDay ? ';cursor:pointer' : '')
          };
        });
      })(),
      diaryAll: () => this.s({ diaryScope:'all', rFrom:'', rTo:'' }),
      diaryToday: () => this.s({ diaryScope:'today', rFrom:isoToday, rTo:isoToday }),
      diaryWeek: () => this.s({ diaryScope:'week', rFrom:isoOf(todayWkStart), rTo:isoOf(new Date(Y, TODAY_M, todayWkStart.getDate() + 6)) }),
      diaryMonth: () => this.s({ diaryScope:'month', rFrom: iso30, rTo: isoToday }),
      showRange: dScope === 'range',
      rangeFrom: st.rFrom || '', rangeTo: st.rTo || '',
      setRangeFrom: e => {
        const v = e.target.value;
        this.s({ rFrom: v, diaryScope:'range', rTo: (st.rTo && v && st.rTo < v) ? v : st.rTo });
      },
      setRangeTo: e => {
        const v = e.target.value;
        this.s({ rTo: (st.rFrom && v && v < st.rFrom) ? st.rFrom : v, diaryScope:'range' });
      },
      rangeMin: st.rFrom || '',
      clearRange: () => this.s({ rFrom:'', rTo:'' }),
      diaryAllStyle: scopeStyle(dScope === 'all'),
      diaryTodayStyle: scopeStyle(dScope === 'today'),
      diaryWeekStyle: scopeStyle(dScope === 'week'),
      diaryMonthStyle: scopeStyle(dScope === 'month'),
      dScopeAll: dScope === 'all', dScopeToday: dScope === 'today', dScopeWeek: dScope === 'week',
      dScope30: dScope === 'month', dScopeRange: dScope === 'range',
      diaryRange: () => this.s({ diaryScope:'range', rFrom: st.rFrom || iso30, rTo: st.rTo || isoToday }),
      diaryRangeStyle: scopeStyle(dScope === 'range'),
      rangeShown: dScope === 'range',
      diaryEmpty: diaryDays.length === 0,
      diaryEmptyNote: dScope === 'today' ? 'Nothing written down today yet.'
        : dScope === 'week' ? 'Nothing logged this week yet.'
        : dScope === 'month' ? 'Nothing logged in the last 30 days.'
        : dScope === 'range' ? 'Nothing written down in that stretch.'
        : 'The chronicle is still blank.',
      diaryList: diaryDays.map(id => {
        const en = ENTRIES[id];
        const d = en.d;
        const dt = new Date(Y, en.m, en.d);
        const bg = en.mood==='Happy' ? '#E1699C' : en.mood==='Neutral' ? '#5C6684' : en.mood==='Sad' ? '#7C8FC9' : '#B23A4C';
        return {
          date: DOW3[dt.getDay()] + ', ' + MON3[en.m].toUpperCase() + ' ' + en.d,
          name: en.workout || ((seedAt(en.m, en.d) || {}).name) || 'Workout', note: en.note, href:'#',
          aria: DOW3[dt.getDay()] + ', ' + MON3[en.m] + ' ' + en.d + ': '
            + (en.workout || ((seedAt(en.m, en.d) || {}).name) || 'Workout')
            + ', ' + en.mood + ', effort ' + en.rpe + ' of 5',
          open: () => this.nav({ screen:'diary', month: MONTHS[en.m], day: en.d, mood:en.mood, rpe:en.rpe, entryNote:null, diaryFrom:'list', diaryEdit:false }),
          remove: ev => { if (ev && ev.stopPropagation) ev.stopPropagation();
            this.s({ confirm:{ kind:'entry', day:id, title:'Delete this entry?',
              body:'Your reflection for ' + MON3[en.m] + ' ' + en.d + ' will be gone for good.', label:'Delete entry' } }); },
          faceWrap:'width:48px;height:48px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:'+bg,
          isHappy: en.mood==='Happy', isNeutral: en.mood==='Neutral', isSad: en.mood==='Sad', isMad: en.mood==='Mad',
          stars: [1,2,3,4,5].map(i => 'font-size:13px;line-height:1;color:'+(i<=en.rpe?'#232A45':'#C7C4D0'))
        };
      }),
      dowLabels: ['S','M','T','W','T','F','S'],
      showDay: st.seg==='Day', showWeek: st.seg==='Week', showMonth: st.seg==='Month',
      isCal: st.screen==='day' || st.screen==='rest',
      isEdit: st.screen==='edit' && !(creating && !st.newType), isDiary: st.screen==='diary',
      isRest: st.seg==='Day' && !actFor(selDay), hasWorkout: st.seg==='Day' && !!actFor(selDay),
      goDay: () => this.s({ screen:'day', month:MONTHS[TODAY_M], day:TODAY_D, monthOpen:false, seg:'Day', creating:false }),
      backToDay: () => this.back(),
      isDetail: st.screen==='detail',
      goDetail: () => this.nav({ screen:'detail', creating:false }),
      goEdit: () => this.nav({ screen:'edit', editing: !!actFor(selDay), creating:false, editKey: mi + '-' + selDay }),
      goNewWorkout: () => this.nav({ screen:'edit', editing:false, creating:true, addOpen:false, newName:'', newType:null }),
      pickTypeLift: () => this.s({ newType:'lift' }),
      pickTypeCycle: () => this.s({ newType:'cycle' }),
      needsType: creating && !st.newType,
      isCycle: isCycleView && !creating,
      rideLocked: isCycleView && !creating && !ridePlanOpen,
      rideLockNote: rideDone ? 'Completed — plan locked' : ridePast ? 'Past ride — plan locked' : '',
      ridePlanEdit: isCycleView && (creating || ridePlanOpen),
      ridePlanStatic: isCycleView && !creating && !ridePlanOpen,
      planDistText: rDist ? rDist + ' mi' : '—',
      planElevText: rElev ? rElev + ' ft' : '—',
      planDurText: plannedMin ? (Math.floor(plannedMin/60) ? Math.floor(plannedMin/60) + ' h ' : '') + (plannedMin%60) + ' min' : '—',
      isLift: !isCycleView,
      rideDistance: rDist, rideElev: rElev, rideZone: st.rZone || (savedRide && savedRide.zone) || 'Endurance',
      rideHours: rHrs, rideMins: rMins,
      setDistance: e => this.s({ rDist: e.target.value.replace(/[^0-9.]/g, '') }),
      setElev: e => this.s({ rElev: e.target.value.replace(/[^0-9]/g, '') }),
      actDistance: aDist, actElev: aElev,
      actHours: aHrs, actMins: aMins,
      setActDistance: e => this.s({ aDist: e.target.value.replace(/[^0-9.]/g, '') }),
      setActElev: e => this.s({ aElev: e.target.value.replace(/[^0-9]/g, '') }),
      setActHours: e => this.s({ aHrs: e.target.value.replace(/[^0-9]/g, '').slice(0,2) }),
      setActMins: e => {
        const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2);
        this.s({ aMins: v === '' ? '' : String(Math.min(59, Number(v))) });
      },
      plannedDist: rDist ? 'Planned ' + rDist + ' mi' : 'No planned distance',
      plannedElev: rElev ? 'Planned ' + rElev + ' ft' : 'No planned elevation',
      plannedDur: plannedMin ? 'Planned ' + (Math.floor(plannedMin/60) ? Math.floor(plannedMin/60) + ' h ' : '') + (plannedMin%60) + ' min' : 'No planned duration',
      plannedDistPh: rDist || '0',
      plannedElevPh: rElev || '0',
      ridePctLabel: ridePct == null ? 'Not started' : ridePct + '% of plan',
      rideBar:'width:' + (ridePct == null ? 0 : Math.min(100, ridePct)) + '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
      rideNote: ridePct == null ? 'Log what you rode — a partial ride still counts.'
        : ridePct >= 100 ? 'Full route ridden. Plan met.'
        : ridePct + '% of the planned distance. The rest stays on the plan.',
      rideNoteStyle:'margin:14px 0 0;font-size:13px;font-weight:' + (ridePct != null && ridePct >= 100 ? '600;color:#c4548a' : '400;color:#746E88'),
      setHours: e => this.s({ rHrs: e.target.value.replace(/[^0-9]/g, '').slice(0,2) }),
      setMins: e => {
        const v = e.target.value.replace(/[^0-9]/g, '').slice(0,2);
        this.s({ rMins: v === '' ? '' : String(Math.min(59, Number(v))) });
      },
      zoneRecovery: zoneStyle(st.rZone === 'Recovery'),
      zoneEndurance: zoneStyle((st.rZone||'Endurance') === 'Endurance'),
      zoneTempo: zoneStyle(st.rZone === 'Tempo'),
      zoneIntervals: zoneStyle(st.rZone === 'Intervals'),
      setZoneRecovery: () => this.s({ rZone:'Recovery' }),
      setZoneEndurance: () => this.s({ rZone:'Endurance' }),
      setZoneTempo: () => this.s({ rZone:'Tempo' }),
      setZoneIntervals: () => this.s({ rZone:'Intervals' }),
      goDiary: () => this.nav({ screen:'diary', diaryFrom:'day', diaryEdit:false }),
      diaryReading: st.diaryFrom === 'list' && !st.diaryEdit,
      diaryEditing: !(st.diaryFrom === 'list' && !st.diaryEdit),
      editEntry: () => this.s({ diaryEdit:true }),
      deleteEntry: () => this.s({ confirm:{ kind:'entry', day:entryKey, after:'diaryList',
        title:'Delete this entry?', body:'Your reflection for ' + MON3[mi] + ' ' + selDay + ' will be gone for good.',
        label:'Delete entry' } }),
      readMood: st.mood,
      readNote: (ENTRIES[entryKey] || {}).note || 'No notes for this one.',
      readStars: [1,2,3,4,5].map(n => 'font-size:13px;line-height:1;color:' + (n <= st.rpe ? '#232A45' : '#C7C4D0')),
      readMoodFace:'width:44px;height:44px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:'
        + (st.mood === 'Happy' ? '#E1699C' : st.mood === 'Neutral' ? '#5C6684' : st.mood === 'Sad' ? '#7C8FC9' : '#B23A4C'),
      readMoodSvg: moodSvg(st.mood),
      diaryBackLabel: st.diaryFrom === 'list' ? 'Chronicle' : 'Back',
      diaryEyebrow: st.diaryFrom === 'list' ? 'CHRONICLE ENTRY' : 'COMPLETED',
      diaryBack: () => this.back(),
      goRest: () => this.s({ screen:'rest', month:MONTHS[TODAY_M], day:TODAY_D, monthOpen:false, seg:'Day' }),
      tabDay: tab(st.screen==='day'), tabEdit: tab(st.screen==='edit'),
      tabDiary: tab(st.screen==='diary'), tabRest: tab(st.screen==='rest'),
      segDayStyle: seg(st.seg==='Day'), segWeekStyle: seg(st.seg==='Week'), segMonthStyle: seg(st.seg==='Month'),
      segDayOn: st.seg==='Day', segWeekOn: st.seg==='Week', segMonthOn: st.seg==='Month',
      navCalOn: calActive ? 'page' : false,
      navDiaryOn: st.screen==='diaryList' ? 'page' : false,
      navArsenalOn: st.screen==='arsenal' ? 'page' : false,
      navSummaryOn: st.screen==='summary' ? 'page' : false,
      navProfileOn: st.screen==='profile' ? 'page' : false,
      segDay: () => this.s({ seg:'Day' }), segWeek: () => this.s({ seg:'Week' }), segMonth: () => this.s({ seg:'Month' }),
      monthName: st.month, monthOpen: st.monthOpen,
      caretStyle:'border:none;background:none;cursor:pointer;padding:4px;display:flex;align-items:center;transition:transform .2s;transform:rotate(' + (st.monthOpen ? '180' : '0') + 'deg)',
      toggleMonth: () => this.s({ monthOpen: !st.monthOpen }),
      prevWeek: () => { const d = new Date(Y, mi, selDay - 7); this.s({ month: MONTHS[d.getMonth()], day: d.getDate() }); },
      nextWeek: () => { const d = new Date(Y, mi, selDay + 7); this.s({ month: MONTHS[d.getMonth()], day: d.getDate() }); },
      prevMonth: () => this.s({ month: MONTHS[(mi + 11) % 12], day:1 }),
      nextMonth: () => this.s({ month: MONTHS[(mi + 1) % 12], day:1 }),
      months, days,
      dayName: DOWFULL[selDate.getDay()],
      shortDate: MON3[mi] + ' ' + selDay,
      weekLabel, monthName2: st.month,
      hasRows: weekRows.some(r => r.hasRow), noRows: !weekRows.some(r => r.hasRow),
      emptyWeekNote: 'No sessions scheduled this week. Add one and there\'s a ' + tokenFor(wkStart.getDate() + 5) + ' waiting — three a week keeps the streak alive.',
      weekAllDone: weekRows.some(r => r.hasRow) && weekRows.filter(r => r.hasRow).every(r => r.done),
      weekDoneNote: 'All ' + weekRows.filter(r => r.hasRow).length + ' sessions logged. Every ' + tokenFor(wkStart.getDate() + mi * 3) + ' claimed this week.',
      wName: selAct ? nameOf(selAct.name) : '',
      wMeta: !selAct ? ''
        : selRide ? (rideDone ? 'Completed' : (selRide.dist ? selRide.dist + ' mi · ' + selAct.time : selAct.time))
        : (selList.length > 0 && doneCount === selList.length) ? 'Completed'
        : doneCount > 0 ? doneCount + ' of ' + selList.length + ' done · ' + selAct.time
        : selList.length + ' exercises · ' + selAct.time,
      showQuest: st.seg === 'Day' && !!actFor(selDay),
      questTitle: questSeed(selDay, mi).title,
      questNote: questCleared ? questSeed(selDay, mi).done : questSeed(selDay, mi).note,
      questDone: questCleared, questOpen: !questCleared,
      questEyebrow: questCleared ? 'QUEST CLEARED' : "TODAY'S QUEST",
      questIconWrap:'width:40px;height:40px;flex:none;border-radius:13px;display:flex;align-items:center;justify-content:center;'
        + (questCleared
          ? 'background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)'
          : 'background:#fff;box-shadow:0 1px 3px rgba(35,42,69,.06)'),
      questTitleStyle:"font-family:'Space Grotesk',system-ui,sans-serif;font-size:15px;font-weight:700;letter-spacing:-.01em;margin-top:4px;"
        + (questCleared ? 'color:#746E88;text-decoration:line-through' : 'color:#232A45'),
      isDone: (actFor(selDay)||{}).s === 'c' || rideDone || (selList.length > 0 && doneCount === selList.length),
      targetAreas: ['Core','Arms','Back','Legs'].map(name => {
        const on = picked.indexOf(name) > -1;
        return { name,
          toggle: () => this.s({ areas: Object.assign({}, st.areas, {
            [listKey]: on ? picked.filter(p => p !== name) : picked.concat([name]) }) }),
          style:'padding:10px 16px;border:none;border-radius:999px;font-size:13px;font-weight:600;cursor:pointer;'
            + (on ? 'background:#E1699C;color:#fff' : 'background:#FBF1F3;color:#5C6684') };
      }),
      dayIsRide: !!selRide, dayIsLift: !selRide,
      toggleRideDone: () => {
        this.s({ rideDone: Object.assign({}, st.rideDone, { [idOf(selAct)]: !rideDone }) });
        this.save(() => db.setRideDone(idOf(selAct), !rideDone));
      },
      rideDoneLabel: rideDone ? 'Ride completed' : 'Mark ride complete',
      rideDoneBtn:'display:inline-flex;align-items:center;gap:10px;margin-top:20px;height:46px;padding:0 18px 0 14px;border:none;border-radius:15px;cursor:pointer;font-size:14px;font-weight:600;'
        + (rideDone ? 'background:#FCE8F1;color:#c4548a' : 'background:#FBF1F3;color:#5C6684'),
      rideDoneMark:'width:24px;height:24px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;'
        + (rideDone ? 'background:#E1699C' : 'border:1.5px solid rgba(35,42,69,.18)'),
      rideDoneStroke: rideDone ? '#fff' : 'rgba(35,42,69,0.22)',
      dayIcoSvg: iconSvg(((st.icons || {})[listKey]) || (srcAct && srcAct.icon) || (selRide ? 'bike' : 'h'),
        ((st.iconColors || {})[listKey]) || (srcAct && srcAct.iconColor) || '#E1699C'),
      rideStats: !selRide ? [] : [
        { label:'DISTANCE', value: selRide.dist ? selRide.dist + ' mi' : '—' },
        { label:'DURATION', value: (selAct && selAct.time) || '—' },
        { label:'ELEVATION', value: selRide.elev ? selRide.elev + ' ft' : '—' },
        { label:'EFFORT', value: selRide.zone || 'Endurance' },
      ],
      dayProgLabel: doneCount + '/' + selList.length,
      dayProgBar: 'width:' + (selList.length ? Math.round(doneCount / selList.length * 100) : 0)
        + '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
      todayLabel: 'TODAY · ' + DOW3[todayDate.getDay()] + ' ' + TODAY_D,
      hasToday: isCurMonth && !!todayAct,
      todayName: todayAct ? nameOf(todayAct.name) : '',
      openToday: () => this.nav({ screen:'detail', creating:false, month:MONTHS[TODAY_M], day:TODAY_D }),
      todayMeta: todayAct ? metaFor(todayAct) : '',
      preview: st.more ? all : all.slice(0,3),
      hasMore: all.length > 3,
      moreLabel: st.more ? 'Show less' : '+ ' + (all.length - 3) + ' more',
      moreCaret:'width:15px;height:15px;flex:none;transition:transform .2s' + (st.more ? ';transform:rotate(180deg)' : ''),
      ctaLabel: hasEntry ? 'View chronicle entry' : 'Finish workout & log it',
      longDate: DOWFULL[selDate.getDay()] + ', ' + st.month + ' ' + selDay,
      badgeStyle:'margin-left:auto;padding:7px 13px;border-radius:999px;font-size:10.5px;font-weight:700;letter-spacing:.09em;'
        + (doneSel ? 'background:#EAECF3;color:#5C6684' : 'background:#FCE8F1;color:#c4548a'),
      hasProgress: st.screen === 'edit' && !isCycleView && selList.length > 0,
      progLabel: doneCount + ' of ' + selList.length + ' done',
      allDone: selList.length > 0 && doneCount === selList.length,
      someDone: !(selList.length > 0 && doneCount === selList.length),
      progNoteStyle:'margin:12px 0 0;display:flex;align-items:center;gap:7px;font-size:13px;font-weight:'
        + (selList.length && doneCount === selList.length ? '600;color:#c4548a' : '400;color:#746E88'),
      progBar: 'width:' + (selList.length ? Math.round(doneCount / selList.length * 100) : 0)
        + '%;height:100%;border-radius:5px;transition:width .35s ease;background:linear-gradient(135deg,#E1699C 0%,#7C8FC9 50%,#5EC4D6 100%)',
      progNote: selList.length === 0 ? ''
        : doneCount === 0 ? 'Mark each exercise as you clear it.'
        : doneCount === selList.length ? 'Transformation complete. Log how it felt to claim your ' + tokenFor(selDay + mi) + '.'
        : (selList.length - doneCount) + ' left to go.',
      addOpen: !!st.addOpen,
      addLib: st.addMode !== 'new', addNew: st.addMode === 'new',
      openAdd: () => this.s({ addOpen:true, addMode:'lib' }),
      closeAdd: () => this.s({ addOpen:false }),
      modeLib: () => this.s({ addMode:'lib' }), modeNew: () => this.s({ addMode:'new' }),
      modeLibStyle: modeStyle(st.addMode !== 'new'), modeNewStyle: modeStyle(st.addMode === 'new'),
      library: libraryFor(listKey).map(e => ({
        name: e.name, detail: e.sets + ' · ' + e.weight,
        add: () => this.s({
          extra: Object.assign({}, st.extra, { [listKey]: added.concat([e]) }),
          removed: Object.assign({}, st.removed, { [listKey]: gone.filter(n => n !== e.name) }),
          addOpen:false }),
        style:'display:flex;align-items:center;gap:12px;padding:14px 16px;border:none;border-radius:14px;background:#FBF1F3;text-align:left;cursor:pointer;width:100%'
      })),
      draftName: st.dName || '', draftSets: st.dSets || '', draftWeight: st.dWeight || '', draftRest: st.dRest || '',
      setName: e => this.s({ dName: e.target.value }),
      setSets: e => this.s({ dSets: e.target.value }),
      setWeight: e => this.s({ dWeight: e.target.value }),
      setRest: e => this.s({ dRest: e.target.value }),
      iconGrid: ICONS.map(def => ({
        svg: iconSvg(def[0]),
        pick: () => this.s({ dIcon: def[0] }),
        style: optStyle((st.dIcon||'h') === def[0])
      })),
      commitStyle:'height:52px;padding:0 30px;border:none;border-radius:16px;font-size:15px;font-weight:600;cursor:pointer;color:#fff;background:'
        + ((st.dName||'').trim() ? '#E1699C' : '#E8BFD2'),
      commitNew: () => {
        const nm = (st.dName||'').trim();
        if (!nm) return;
        const item = { name:nm, sets:(st.dSets||'3 × 10'), weight:(st.dWeight||'—'), rest:(st.dRest||'60 sec'), i:(st.dIcon||'h') };
        this.s({ extra: Object.assign({}, st.extra, { [listKey]: added.concat([item]) }),
          addOpen:false, dName:'', dSets:'', dWeight:'', dRest:'', dIcon:'h' });
      },
      iconsOpen: !!st.iconsOpen,
      toggleIcons: () => this.s({ iconsOpen: !st.iconsOpen }),
      iconBadge:'width:46px;height:46px;border-radius:15px;background:#FCE8F1;border:2px solid #fff;box-shadow:0 2px 6px rgba(214,96,139,.28),0 0 0 1px rgba(35,42,69,.05);display:flex;align-items:center;justify-content:center;cursor:pointer',
      workoutIcoSvg: iconSvg(wIcon, wColor),
      workoutIconGrid: ICONS.map(def => ({
        svg: iconSvg(def[0], wColor),
        pick: () => this.s({ icons: Object.assign({}, st.icons, { [listKey]: def[0] }) }),
        style: optStyle(wIcon === def[0])
      })),
      iconColors: ICON_COLORS.map(c => ({
        pick: () => this.s({ iconColors: Object.assign({}, st.iconColors, { [listKey]: c }) }),
        style:'width:34px;height:34px;border:none;border-radius:11px;cursor:pointer;background:' + c
          + (c === wColor ? ';box-shadow:0 0 0 2px #fff,0 0 0 4px ' + c : '')
      })),
      chipStyle:'flex:none;white-space:nowrap;padding:8px 14px;border-radius:999px;color:#fff;font-size:12.5px;font-weight:600;background:'
        + (doneSel ? '#5C6684' : '#E1699C'),
      eName: selName,
      eCat: selRide ? (selRide.zone || 'Endurance') : (picked.length ? picked.join(' · ') : 'No target areas'),
      areaPills: selRide ? [selRide.zone || 'Endurance'] : picked,
      inSeries: !!(selAct && selAct.series),
      endSeries: () => {
        const sid = selAct && selAct.series;
        if (!sid) return;
        return this.s({ confirm:{ kind:'series', sid,
          title:'End this weekly series?',
          body:'Later repeats of "' + selName + '" will be removed. Past sessions and this one stay.',
          label:'End series' } });
      },
      eNamePlaceholder: creating, eNameStatic: !creating,
      setNewName: e => this.s({ newName: e.target.value }),
      commitOnEnter: e => { if (e.key === 'Enter') { e.preventDefault(); e.target.blur(); } },
      setEditName: e => this.s({ renames: Object.assign({}, st.renames, { [baseName]: e.target.value }) }),
      eEyebrow: st.editing ? 'EDITING WORKOUT' : 'NEW WORKOUT',
      eSaveLabel: st.editing ? 'Update workout' : 'Save workout',
      eCancelLabel: creating ? 'Cancel' : 'Delete workout',
      footerSecondary: creating
        ? () => this.s({ screen:'day', creating:false, newType:null, newName:'',
            extra: Object.assign({}, st.extra, { __draft: [] }) })
        : () => this.s({ confirm:{ kind:'workout', title:'Delete this workout?',
            body:'"' + selName + '" on ' + MON3[mi] + ' ' + selDay + ' will be removed from your plan. This can\'t be undone.',
            label:'Delete workout' } }),
      leaveOpen: !!st.leaveOpen,
      tryLeave: () => {
        const dirty = !!(st.renames || st.fields || st.removed || st.areas
          || st.newName || st.rDist || st.rElev || st.rHrs || st.rMins
          || st.aDist || st.aElev || st.aHrs || st.aMins || st.repeat || st.icons || st.iconColors
          || (st.extra && Object.keys(st.extra).some(k => (st.extra[k] || []).length)));
        if (!dirty) return this.back();
        this.s({ leaveOpen:true });
      },
      stayHere: () => this.s({ leaveOpen:false }),
      deleteWorkout: () => this.save(() => db.deletePlanEntries([idOf(srcAct)]),
        { screen:'day', creating:false, newType:null, newName:'' }),
      dateOpen: !!st.dateOpen,
      toggleDate: () => this.s({ dateOpen: !st.dateOpen }),
      pickerCells,
      saveLeave: () => { this.s({ leaveOpen:false }); this.renderVals().saveWorkout(); },
      saveWorkout: () => {
        const weekly = () => {
          const out = [];
          for (let w = 1; w <= 12; w++) out.push(isoOf(new Date(Y, mi, selDay + w * 7)));
          return out;
        };
        const cleared = PlannerLogic.EDIT_OVERLAYS;
        const bare = e => ({ name:e.name, sets:e.sets, weight:e.weight, rest:e.rest, i:e.i });
        if (!creating) {
          const owned = EX[baseName] || [];
          const byName = n => owned.find(e => e.name === n);
          const prefix = listKey + '|';
          const update = Object.keys(st.fields || {}).filter(k => k.indexOf(prefix) === 0)
            .map(k => ({ ex: byName(k.slice(prefix.length)), patch: st.fields[k] }))
            .filter(u => u.ex && u.ex.id)
            .map(u => ({ id: u.ex.id, patch: Object.assign({}, u.patch, (st.exIcons || {})[u.ex.name] ? { i: st.exIcons[u.ex.name] } : {}) }));
          Object.keys(st.exIcons || {}).forEach(n => {
            const ex = byName(n);
            if (ex && ex.id && !update.some(u => u.id === ex.id)) update.push({ id: ex.id, patch: { i: st.exIcons[n] } });
          });
          const moved = st.editKey && st.editKey !== mi + '-' + selDay;
          const actualEdited = st.aDist != null || st.aElev != null || st.aHrs != null || st.aMins != null;
          return this.save(() => db.updateWorkout({
            entryId: selAct.id, workoutId: selAct.workoutId,
            name: (st.renames || {})[baseName],
            icon: (st.icons || {})[listKey], iconColor: (st.iconColors || {})[listKey],
            areas: (st.areas || {})[listKey],
            ride: selRide ? { dist: rDist, elev: rElev, zone: st.rZone || selRide.zone || 'Endurance', minutes: plannedMin } : null,
            moveTo: moved ? isoOf(new Date(Y, mi, selDay)) : undefined,
            actual: selRide && actualEdited ? { dist: aDist, elev: aElev, minutes: Number(aHrs || 0) * 60 + Number(aMins || 0) } : null,
            exercises: {
              update,
              removeIds: gone.map(n => byName(n)).filter(e => e && e.id).map(e => e.id),
              add: added.map(bare),
            },
            repeatDates: st.repeat && !selAct.series ? weekly() : [],
          }), Object.assign({ screen:'detail' }, cleared));
        }
        const nm = (st.newName || '').trim() || 'Untitled workout';
        const isRide = st.newType === 'cycle';
        return this.save(() => db.createWorkout({
          name: nm, isRide,
          durationMinutes: isRide ? (plannedMin || 45) : Math.max(20, selList.length * 10),
          ride: isRide ? { dist: st.rDist || '', elev: st.rElev || '', zone: st.rZone || 'Endurance' } : null,
          icon: (st.icons || {}).__draft || null, iconColor: (st.iconColors || {}).__draft || null,
          areas: picked,
          exercises: selList.map(bare),
          dates: [isoOf(new Date(Y, mi, selDay))].concat(st.repeat ? weekly() : []),
          repeat: !!st.repeat,
        }), Object.assign({ screen:'day', creating:false, newType:null, newName:'' }, cleared));
      },
      discardLeave: () => { this.s({
        leaveOpen:false,
        creating:false, newType:null, newName:'',
        renames:null, fields:null, repeat:false, areas:null, icons:null, iconColors:null,
        rDist:null, rElev:null, rHrs:null, rMins:null,
        aDist:null, aElev:null, aHrs:null, aMins:null,
        extra: Object.assign({}, st.extra, { __draft: [] })
      }); this.back(); },
      cancelEdit: () => this.s({
        screen: creating ? 'day' : 'detail', creating:false, newType:null, newName:'',
        extra: Object.assign({}, st.extra, { __draft: [] })
      }),
      eCancelStyle:'height:52px;padding:0 22px;border:none;border-radius:16px;background:none;font-size:14.5px;font-weight:600;cursor:pointer;color:'
        + (creating ? '#5C6684' : '#B23A4C'),
      eDate: DOW3[selDate.getDay()].charAt(0) + DOW3[selDate.getDay()].slice(1,3).toLowerCase() + ', ' + MON3[mi] + ' ' + selDay,
      eStatus: doneSel ? 'Completed' : 'Planned',
      eTime: (selAct && selAct.time) || (creating ? 'Duration TBD' : '~50 min'),
      toggleMore: () => this.s({ more: !st.more }),
      toggleRepeat: () => this.s({ repeat: !st.repeat }),
      repeatOn: !!st.repeat,
      switchTrack:'margin-left:auto;width:58px;height:34px;flex:none;border:none;border-radius:999px;padding:4px;cursor:pointer;display:flex;align-items:center;justify-content:'
        + (st.repeat?'flex-end':'flex-start') + ';background:' + (st.repeat?PINK:'#C7C4D0'),
      switchKnob:'width:26px;height:26px;border-radius:50%;background:#fff;box-shadow:0 1px 3px rgba(35,42,69,.35)',
      exercises: selList.map((e,ix) => {
        const cur = (st.exIcons || {})[e.name] || e.i;
        const set = v => () => this.s({ exIcons: Object.assign({}, st.exIcons, { [e.name]: v }), exOpen: null });
        const setField = k => ev => this.s({ fields: Object.assign({}, st.fields, {
          [listKey + '|' + e.name]: Object.assign({}, (st.fields||{})[listKey + '|' + e.name], { [k]: ev.target.value })
        }) });
        return { name:e.name, sets:e.sets, weight:e.weight, rest:e.rest,
          setSets: setField('sets'), setWeight: setField('weight'), setRest: setField('rest'),
          icoSvg: iconSvg(cur), hideLegacy: false,
          detail: e.sets + ' · ' + e.weight + ' · ' + e.rest + ' rest',
          nameStyle:"display:block;font-family:'Space Grotesk',system-ui,sans-serif;font-size:16.5px;font-weight:700;letter-spacing:-.01em;"
            + (doneSet[e.name] ? 'color:#746E88;text-decoration:line-through' : 'color:#232A45'),
          doneBtn:'margin-left:auto;display:flex;align-items:center;justify-content:center;width:34px;height:34px;flex:none;border-radius:11px;cursor:pointer;border:'
            + (doneSet[e.name] ? 'none;background:#E1699C' : '1.5px solid rgba(35,42,69,.15);background:none'),
          doneStroke: doneSet[e.name] ? '#fff' : 'rgba(35,42,69,0.22)',
          isDone: !!doneSet[e.name],
          iconAria: 'Choose icon for ' + e.name,
          removeAria: 'Remove ' + e.name,
          doneAria: (doneSet[e.name] ? 'Mark ' + e.name + ' not done' : 'Mark ' + e.name + ' done'),
          toggleDone: () => { const nowDone = !doneSet[e.name];
            const names = nowDone ? doneNames.concat([e.name]) : doneNames.filter(n => n !== e.name);
            const tot = selList.length;
            this.s({ done: Object.assign({}, st.done, { [listKey]: names }),
              announce: e.name + (nowDone ? ' marked done' : ' unmarked') + '. ' + names.length + ' of ' + tot + ' done.' });
            if (!creating) this.save(() => db.setExercisesDone(listKey, names, tot > 0 && names.length === tot)); },
          remove: () => this.s({
            removed: Object.assign({}, st.removed, { [listKey]: gone.concat([e.name]) }),
            exOpen: null }),
          isH: cur==='h', isV: cur==='v', isD: cur==='d',
          open: st.exOpen === e.name,
          toggle: () => this.s({ exOpen: st.exOpen === e.name ? null : e.name }),
          pickH: set('h'), pickV: set('v'), pickD: set('d'),
          optH: optStyle(cur==='h'), optV: optStyle(cur==='v'), optD: optStyle(cur==='d') };
      }),
      moods, stars,
      rpeLabel: RPE_WORDS[Math.max(1, Math.min(5, st.rpe)) - 1]
    };
  }
}

const centered: React.CSSProperties = {
  minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
  gap: 14, padding: 24, textAlign: 'center', color: '#746E88',
};

export default class Planner extends React.Component {
  private logic: PlannerLogic;

  constructor(props: {}) {
    super(props);
    this.logic = new PlannerLogic(props);
    this.logic.__host = this;
  }

  componentDidMount() {
    this.logic.componentDidMount();
  }

  componentDidUpdate() {
    this.logic.props = this.props;
    this.logic.componentDidUpdate();
  }

  componentWillUnmount() {
    this.logic.componentWillUnmount();
  }

  retry = () => {
    this.logic.status = 'loading';
    this.forceUpdate();
    this.logic.load();
  };

  render() {
    const { status, loadError } = this.logic;
    if (status === 'loading') return <div style={centered} role="status">Loading your plan…</div>;
    if (status === 'error') {
      return (
        <div style={centered} role="alert">
          <h1 style={{ margin: 0, color: '#232A45', fontSize: 20 }}>Couldn't reach your plan</h1>
          <p style={{ margin: 0, maxWidth: 420, fontSize: 14, lineHeight: 1.6 }}>{loadError}</p>
          <button onClick={this.retry} style={{ padding: '12px 22px', border: 'none', borderRadius: 14, background: '#E1699C', color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
            Try again
          </button>
        </div>
      );
    }
    return <PlannerView v={this.logic.renderVals()} />;
  }
}
