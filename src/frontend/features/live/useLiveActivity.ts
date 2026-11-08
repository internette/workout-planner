'use client';

import { useEffect, useRef, useState } from 'react';
import type { PlannerLogic } from '@/frontend/features/planner/store/PlannerLogic';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { clockSeconds, type LiveActivity, type LiveDone } from './model';
import { canNotify, liveSettings, onLiveSettings, setAudioSession, type LiveSettings } from './settings';
import type { WorkerIn, WorkerOut } from './timer.worker';

// The web's stand-in for a Live Activity: the workout in progress, kept up to date outside the page.
// - A Web Worker keeps the clock ticking (the page's own timers slow to once a minute in the background).
// - The service worker shows it as a notification with buttons (tick off the next exercise, finish, pause), updated
//   in place as it goes.
// It plays no sound of its own, so music from other apps plays on at its own volume.

// 'tick' is what the first version's notifications called 'set'; one still showing may send it.
type Action = 'open' | 'set' | 'tick' | 'more' | 'skip' | 'finish' | 'pause' | 'resume' | 'write';
type Shown = { title: string; body: string; actions: { action: Action; title: string }[] };

const clockTime = (at: number) => new Date(at).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
// A running clock: 4:05, 12:36, 1:02:09.
const clock = (sec: number) => {
  const s = Math.floor(sec);
  const mm = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return s >= 3600 ? Math.floor(s / 3600) + ':' + String(mm).padStart(2, '0') + ':' + ss : mm + ':' + ss;
};

// What the notification says about a session in progress. The clock leads the title, and is sent again each second
// while it runs (a notification can't count by itself), so it ticks.
function liveNotice(a: LiveActivity, now: number): Shown {
  // A timed set: its time left leads, as the clock does, with which set of which exercise.
  if (a.hold)
    return {
      title: clock(Math.max(0, Math.ceil((a.hold.endsAt - now) / 1000))) + ' · ' + a.hold.name + (a.hold.of > 1 ? ', set ' + a.hold.set + ' of ' + a.hold.of : ''),
      body: a.hold.total + ' sec\n' + a.name + ' · ' + a.done + ' of ' + a.total + ' done',
      actions: [
        { action: 'more', title: '+30 sec' },
        { action: 'set', title: 'Done set' },
      ],
    };
  // Resting: how long is left, and what's next.
  if (a.rest)
    return {
      title: 'Rest · ' + clock(Math.max(0, Math.ceil((a.rest.endsAt - now) / 1000))) + ' left',
      body: a.rest.next ? 'Up next: ' + a.rest.next.name + (a.rest.next.line ? ' · ' + a.rest.next.line : '') : '',
      actions: [
        { action: 'more', title: '+30 sec' },
        { action: 'skip', title: 'Skip rest' },
      ],
    };
  const sec = clockSeconds(a.clock, now);
  const paused = !a.clock.runningSince;
  // Lifting, the title is what's being done now; the session's name moves to the body.
  const what = a.kind === 'lift' && a.now ? a.now.name + (a.now.of > 1 ? ', set ' + a.now.set + ' of ' + a.now.of : '') : a.name;
  const title = (paused ? 'Paused at ' : '') + clock(sec) + ' · ' + what;
  const body =
    a.kind === 'ride'
      ? [a.ride?.zone, a.ride?.dist ? a.ride.dist + ' mi planned' : a.ride?.planned, a.ride?.climb ? a.ride.climb + ' ft climb' : '']
          .filter(Boolean)
          .join(' · ')
      : a.now
        ? (a.now.line ? a.now.line + '\n' : '') + a.name + ' · ' + a.done + ' of ' + a.total + ' done'
        : a.total > 0 && a.done === a.total
          ? a.name + ' · All ' + a.total + ' done · Finish to record it'
          : a.name + ' · ' + a.done + ' of ' + a.total + ' done';
  const finish = { action: 'finish' as const, title: a.kind === 'ride' ? (a.ride?.run ? 'Finish run' : 'Finish ride') : 'Finish' };
  const pause = { action: 'pause' as const, title: 'Pause' };
  // Lifting, the set and Pause; paused, Resume and Finish; riding, Pause and Finish.
  const actions =
    a.kind === 'lift' && a.now && !paused
      ? [{ action: 'set' as const, title: a.now.of > 1 ? 'Done: set ' + a.now.set + ' of ' + a.now.of : 'Tick off ' + a.now.name }, pause]
      : [paused ? { action: 'resume' as const, title: 'Resume' } : pause, finish];
  return { title, body, actions };
}

// And about one just finished: the lock screen's "Quest cleared".
function doneNotice(d: LiveDone): Shown {
  return {
    title: 'Quest cleared · ' + d.name,
    body: ['Took ' + d.took, d.exercises ? (d.ride ? d.exercises : d.exercises + ' exercises') : '', d.streak > 0 ? d.streak + '-day streak' : '']
      .filter(Boolean)
      .join(' · '),
    actions: [{ action: 'write', title: 'Write in the Chronicle' }],
  };
}

const post = (m: Record<string, unknown>) =>
  navigator.serviceWorker?.ready.then((reg) => reg.active?.postMessage(m)).catch(() => undefined);

/**
 * Keeps the session in progress up to date outside the page. `anyRunning`: some session's clock is going, so the
 * page needs to redraw every second.
 */
export function useLiveActivity(logic: PlannerLogic, view: PlannerVals | null, anyRunning: boolean) {
  const [settings, setSettings] = useState<LiveSettings>({ awake: false, notify: false });
  useEffect(() => {
    setSettings(liveSettings());
    return onLiveSettings((s) => setSettings((cur) => ({ ...cur, ...s })));
  }, []);
  const viewRef = useRef(view);
  viewRef.current = view;
  const activity = view ? view.liveActivity : null;
  const activityRef = useRef(activity);
  activityRef.current = activity;

  // What the page does when a notification's button is pressed.
  const act = (action: Action, id: string) => {
    const v = viewRef.current;
    if (!v || !id) return;
    if (action === 'set' || action === 'tick') v.liveSet(id);
    else if (action === 'more') v.liveMoreRest();
    else if (action === 'skip') v.liveSkipRest();
    else if (action === 'pause') v.livePause(id);
    else if (action === 'resume') v.liveResume(id);
    else if (action === 'finish') v.liveFinish(id);
    else if (action === 'write') v.liveWrite(id);
    else v.openLive(id);
  };

  // A rest or a timed set that has run out goes (and the phone buzzes, where it can), whether or not anything shows
  // outside the page. A timed set's end counts it done, which may start a rest.
  useEffect(() => {
    const v = viewRef.current;
    if (!v) return;
    const holdOut = !!v.holdEndsAt && Date.now() >= v.holdEndsAt;
    const restOut = !!v.restEndsAt && Date.now() >= v.restEndsAt;
    if (!holdOut && !restOut) return;
    if (holdOut) v.holdOver();
    else v.restOver();
    try {
      navigator.vibrate?.([200, 100, 200]);
    } catch {
      // Not every browser lets a page vibrate.
    }
  });

  // The worker: a tick a second while a clock runs.
  const worker = useRef<Worker | null>(null);
  useEffect(() => {
    if (typeof Worker === 'undefined') return;
    let w: Worker;
    try {
      w = new Worker(new URL('./timer.worker.ts', import.meta.url));
    } catch {
      return;
    }
    w.onmessage = (e: MessageEvent<WorkerOut>) => {
      if (e.data.type === 'tick') logic.forceUpdate();
    };
    worker.current = w;
    return () => {
      w.terminate();
      worker.current = null;
    };
  }, [logic]);
  const send = (m: WorkerIn) => worker.current?.postMessage(m);
  useEffect(() => {
    // Without a worker, the page's own timer does it (and slows down in the background, as before).
    if (!worker.current) {
      if (!anyRunning) return;
      const id = setInterval(() => logic.forceUpdate(), 1000);
      return () => clearInterval(id);
    }
    send({ type: 'run', on: anyRunning });
  }, [anyRunning, logic]);

  // The browser asks whether notifications may be shown the first time a workout starts (it needs a tap to ask from).
  // This listens after the page's own handling of the tap, so the clock the tap started is already in state.
  useEffect(() => {
    const onTap = () => {
      const running = Object.values(logic.state.workoutTimer || {}).some((t) => t && t.runningSince);
      if (!running) return;
      if (settings.notify && canNotify() && Notification.permission === 'default') {
        try {
          if (!localStorage.getItem('moonshot.live.asked')) {
            localStorage.setItem('moonshot.live.asked', '1');
            Notification.requestPermission().catch(() => undefined);
          }
        } catch {
          // Storage blocked: don't ask on every tap.
        }
      }
    };
    window.addEventListener('click', onTap);
    return () => window.removeEventListener('click', onTap);
  });

  // ---- The notification ----
  const shownKey = useRef('');
  const shownId = useRef<string | null>(null);
  const dismissed = useRef('');
  const ended = useRef<{ id: string; until: number } | null>(null);
  // When the rest in the last notification sent was to end (0 when it wasn't resting).
  const restWas = useRef(0);
  useEffect(() => {
    if (!settings.notify || !canNotify() || Notification.permission !== 'granted') return;
    const now = Date.now();
    const lastId = shownId.current;
    if (!activity) {
      // Just finished: "Quest cleared" takes its place. Finishing is saved first, so it waits a little for that.
      // Otherwise (the clock stopped, the session started over or deleted) it just goes.
      if (lastId) {
        shownId.current = null;
        shownKey.current = '';
        ended.current = { id: lastId, until: now + 10000 };
        post({ type: 'live-clear' });
      }
      const e = ended.current;
      if (!e) return;
      const d = viewRef.current?.liveDoneFor(e.id);
      if (d || now > e.until) ended.current = null;
      if (d) post({ type: 'live-show', ...doneNotice(d), silent: true, timestamp: now, data: { id: d.id, url: '/calendar/sessions/' + d.id } });
      return;
    }
    ended.current = null;
    const shown = liveNotice(activity, now);
    const key = JSON.stringify(shown);
    // Swiped away: gone until something besides the clock changes.
    const content = JSON.stringify({ ...shown, title: activity.name, paused: !activity.clock.runningSince });
    if (key === shownKey.current || content === dismissed.current) return;
    dismissed.current = '';
    const first = shownId.current !== activity.id;
    shownKey.current = key;
    // A rest that ran out (rather than being skipped) sounds, so a phone in a pocket says it's time.
    const restRanOut = !activity.rest && restWas.current > 0 && now >= restWas.current - 1000;
    restWas.current = activity.rest ? activity.rest.endsAt : 0;
    shownId.current = activity.id;
    post({
      type: 'live-show',
      ...shown,
      // Only a session's first one makes a sound, and the end of a rest; other updates are quiet.
      silent: !first && !restRanOut,
      // When it started, so the notification's own time says so.
      timestamp: now - clockSeconds(activity.clock, now) * 1000,
      data: { id: activity.id, url: '/calendar/sessions/' + activity.id, content },
    });
  });

  // Taps on the notification, relayed by the service worker, and one that opened this page.
  useEffect(() => {
    const sw = navigator.serviceWorker;
    if (!sw) return;
    const onMessage = (e: MessageEvent) => {
      const m = e.data || {};
      if (m.type === 'live-action') {
        shownKey.current = '';
        act(m.action, m.id);
      } else if (m.type === 'live-dismissed' && activityRef.current && m.id === activityRef.current.id) {
        const a = activityRef.current;
        dismissed.current = JSON.stringify({ ...liveNotice(a, Date.now()), title: a.name, paused: !a.clock.runningSince });
      }
    };
    sw.addEventListener('message', onMessage);
    return () => sw.removeEventListener('message', onMessage);
  }, []);
  // Read on the first render, before the planner puts its own address in the bar.
  const [opened] = useState(() => {
    if (typeof window === 'undefined') return null;
    const q = new URLSearchParams(window.location.search);
    const action = q.get('live') as Action | null;
    const id = q.get('id');
    return action && id ? { action, id } : null;
  });
  const pending = useRef(opened);
  useEffect(() => {
    if (!view || !pending.current) return;
    const { action, id } = pending.current;
    pending.current = null;
    act(action, id);
  });

  // ---- Other apps' music ----
  // The app has no sound of its own, so it tells the phone so (Safari's Audio Session API): other apps' music plays on,
  // at its own volume.
  useEffect(() => setAudioSession(), []);
}
