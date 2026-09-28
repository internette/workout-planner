'use client';

import { useEffect, useRef, useState } from 'react';
import { savedAccent, savedTheme } from '@moonshot/design-system/theme';
import type { PlannerLogic } from '@/frontend/features/planner/store/PlannerLogic';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { clockSeconds, type LiveActivity, type LiveDone } from './model';
import { liveLook } from './look';
import { canNotify, canPlayer, liveSettings, onLiveSettings, type LiveSettings } from './settings';
import type { WorkerIn, WorkerOut } from './timer.worker';

// The web's stand-in for a Live Activity: the workout in progress, kept up to date outside the page.
// - A Web Worker keeps the clock ticking (the page's own timers slow to once a minute in the background) and draws the
//   lock-screen artwork.
// - The service worker shows it as a notification with buttons (tick off the next exercise, finish, pause), updated
//   in place as it goes.
// - The Media Session puts it on the lock screen as the "now playing" player, with its own clock and buttons. That
//   needs audio playing, so it plays silence, which stops other music: it's off unless turned on.

type Action = 'open' | 'tick' | 'finish' | 'pause' | 'resume' | 'write';
type Shown = { title: string; body: string; actions: { action: Action; title: string }[] };

const minutes = (sec: number) => (sec < 60 ? 'just started' : Math.floor(sec / 60) + ' min');

// What the notification says about a session in progress.
function liveNotice(a: LiveActivity, now: number): Shown {
  const sec = clockSeconds(a.clock, now);
  const paused = !a.clock.runningSince;
  const title = a.name + ' · ' + (paused ? 'Paused at ' + Math.floor(sec / 60) + ' min' : minutes(sec));
  const body =
    a.kind === 'ride'
      ? [a.ride?.dist ? a.ride.dist + ' mi planned' : a.ride?.planned, a.ride?.climb ? a.ride.climb + ' ft climb' : '']
          .filter(Boolean)
          .join(' · ')
      : a.done + ' of ' + a.total + ' done' + (a.now ? '\nNow: ' + a.now.name + (a.now.line ? ' · ' + a.now.line : '') : '');
  const finish = { action: 'finish' as const, title: a.kind === 'ride' ? 'Finish ride' : 'Finish' };
  const actions =
    a.kind === 'lift' && a.now && !paused
      ? [{ action: 'tick' as const, title: 'Tick off ' + a.now.name }, finish]
      : [paused ? { action: 'resume' as const, title: 'Resume' } : { action: 'pause' as const, title: 'Pause' }, finish];
  return { title, body, actions };
}

// And about one just finished: the lock screen's "Quest cleared".
function doneNotice(d: LiveDone): Shown {
  return {
    title: 'Quest cleared · ' + d.name,
    body: ['Took ' + d.took, d.exercises ? (d.ride ? d.exercises : d.exercises + ' exercises') : '', d.streak ? d.streak + ' streak' : '']
      .filter(Boolean)
      .join(' · '),
    actions: [{ action: 'write', title: 'Write in the Chronicle' }],
  };
}

// One second of silence, as a WAV file (8 kHz, 8-bit, so it's tiny), looped under the lock-screen player.
function silence(): string {
  const n = 8000;
  const buf = new ArrayBuffer(44 + n);
  const v = new DataView(buf);
  const str = (o: number, s: string) => [...s].forEach((ch, i) => v.setUint8(o + i, ch.charCodeAt(0)));
  str(0, 'RIFF');
  v.setUint32(4, 36 + n, true);
  str(8, 'WAVE');
  str(12, 'fmt ');
  v.setUint32(16, 16, true);
  v.setUint16(20, 1, true);
  v.setUint16(22, 1, true);
  v.setUint32(24, 8000, true);
  v.setUint32(28, 8000, true);
  v.setUint16(32, 1, true);
  v.setUint16(34, 8, true);
  str(36, 'data');
  v.setUint32(40, n, true);
  for (let i = 0; i < n; i++) v.setUint8(44 + i, 128);
  return URL.createObjectURL(new Blob([buf], { type: 'audio/wav' }));
}

const post = (m: Record<string, unknown>) =>
  navigator.serviceWorker?.ready.then((reg) => reg.active?.postMessage(m)).catch(() => undefined);

/**
 * Keeps the session in progress up to date outside the page. `anyRunning`: some session's clock is going, so the
 * page needs to redraw every second.
 */
export function useLiveActivity(logic: PlannerLogic, view: PlannerVals | null, anyRunning: boolean) {
  const [settings, setSettings] = useState<LiveSettings>({ notify: false, player: false });
  useEffect(() => {
    setSettings(liveSettings());
    return onLiveSettings((s) => setSettings((cur) => ({ ...cur, ...s })));
  }, []);
  const viewRef = useRef(view);
  viewRef.current = view;
  const activity = view ? view.liveActivity : null;
  const activityRef = useRef(activity);
  activityRef.current = activity;

  // What the page does when a notification's (or the lock-screen player's) button is pressed.
  const act = (action: Action, id: string) => {
    const v = viewRef.current;
    if (!v || !id) return;
    if (action === 'tick') v.liveTick(id);
    else if (action === 'pause') v.livePause(id);
    else if (action === 'resume') v.liveResume(id);
    else if (action === 'finish') v.liveFinish(id);
    else if (action === 'write') v.liveWrite(id);
    else v.openLive(id);
  };

  // The worker: a tick a second while a clock runs, and the artwork on request.
  const worker = useRef<Worker | null>(null);
  const artWanted = useRef<(key: string, blob: Blob | null) => void>(() => undefined);
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
      else artWanted.current(e.data.key, e.data.blob);
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

  // The browser asks whether notifications may be shown the first time a workout starts (it needs a tap to ask from),
  // and the lock-screen player's silence starts on a tap too. Both listen after the page's own handling of the tap,
  // so the clock the tap started is already in state.
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
      if (settings.player) startSilence();
    };
    window.addEventListener('click', onTap);
    return () => window.removeEventListener('click', onTap);
  });

  // ---- The notification ----
  const shownKey = useRef('');
  const shownId = useRef<string | null>(null);
  const dismissed = useRef('');
  const ended = useRef<{ id: string; until: number } | null>(null);
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
    // Swiped away: gone until something besides the minutes changes.
    const content = JSON.stringify({ ...shown, title: activity.name, paused: !activity.clock.runningSince });
    if (key === shownKey.current || content === dismissed.current) return;
    dismissed.current = '';
    const first = shownId.current !== activity.id;
    shownKey.current = key;
    shownId.current = activity.id;
    post({
      type: 'live-show',
      ...shown,
      // Only a session's first one makes a sound; updates are quiet.
      silent: !first,
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

  // ---- The lock-screen player ----
  const audio = useRef<HTMLAudioElement | null>(null);
  const startSilence = () => {
    if (!canPlayer()) return;
    if (!audio.current) {
      audio.current = new Audio(silence());
      audio.current.loop = true;
    }
    if (audio.current.paused) audio.current.play().catch(() => undefined);
  };
  const art = useRef<{ key: string; url: string | null }>({ key: '', url: null });
  const metaKey = useRef('');
  const posKey = useRef('');
  useEffect(() => {
    const ms = canPlayer() ? navigator.mediaSession : null;
    if (!ms) return;
    const a = settings.player ? activity : null;
    if (!a) {
      if (metaKey.current) {
        audio.current?.pause();
        ms.metadata = null;
        ms.playbackState = 'none';
        (['play', 'pause', 'nexttrack'] as MediaSessionAction[]).forEach((h) => ms.setActionHandler(h, null));
        metaKey.current = '';
        posKey.current = '';
      }
      return;
    }
    const paused = !a.clock.runningSince;
    const now = Date.now();
    // The artwork: drawn by the worker when what's on it changes, in the colours this browser uses.
    const accent = savedAccent();
    const theme = savedTheme();
    const artKey = JSON.stringify([a.name, a.kind, a.done, a.total, a.now, a.ride, paused, accent, theme]);
    if (art.current.key !== artKey) {
      art.current.key = artKey;
      artWanted.current = (key, blob) => {
        if (key !== art.current.key) return;
        if (art.current.url) URL.revokeObjectURL(art.current.url);
        art.current.url = blob ? URL.createObjectURL(blob) : null;
        metaKey.current = '';
        logic.forceUpdate();
      };
      send({ type: 'art', key: artKey, activity: a, look: liveLook(accent, theme), paused });
    }
    const title = a.name;
    const artist =
      a.kind === 'ride'
        ? a.ride?.dist
          ? a.ride.dist + ' mi planned'
          : 'Ride'
        : a.done + ' of ' + a.total + ' done' + (a.now ? ' · Now: ' + a.now.name : '');
    const key = JSON.stringify([title, artist, art.current.url, paused]);
    if (key !== metaKey.current) {
      metaKey.current = key;
      ms.metadata = new MediaMetadata({
        title,
        artist,
        album: paused ? 'Paused · Moonshot' : 'Moonshot',
        artwork: art.current.url
          ? [{ src: art.current.url, sizes: '512x512', type: 'image/png' }]
          : [{ src: '/icons/icon-512.png', sizes: '512x512', type: 'image/png' }],
      });
      ms.playbackState = paused ? 'paused' : 'playing';
      ms.setActionHandler('play', () => {
        startSilence();
        act('resume', a.id);
      });
      ms.setActionHandler('pause', () => {
        audio.current?.pause();
        act('pause', a.id);
      });
      // "Next": tick off the next exercise.
      ms.setActionHandler('nexttrack', a.kind === 'lift' && a.now ? () => act('tick', a.id) : null);
    }
    // The player's bar is the clock: it runs by itself while playing, so it's only set when the clock changes. Its
    // length is the plan, stretched in ten-minute steps once a session runs past it.
    const sec = clockSeconds(a.clock, now);
    const plan = Math.max(a.plannedSec, 60);
    const duration = sec < plan ? plan : plan + Math.ceil((sec - plan + 1) / 600) * 600;
    const pos = JSON.stringify([a.clock.elapsed, a.clock.runningSince, duration]);
    if (pos !== posKey.current && ms.setPositionState) {
      posKey.current = pos;
      try {
        ms.setPositionState({ duration, position: Math.min(sec, duration), playbackRate: 1 });
      } catch {
        // Some browsers refuse a position state; the player then just shows the title.
      }
    }
    if (paused) audio.current?.pause();
  });
}
