'use client';

import { useEffect, useRef } from 'react';
import type { PlannerLogic } from '@/frontend/features/planner/store/PlannerLogic';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { CUE_MS, markEnd, playChime, playTick, unlockChime } from './cue';
import { liveSettings, setAudioSession } from './settings';
import type { WorkerIn, WorkerOut } from './timer.worker';

// Keeps a workout's clock going while the page is in the background: a Web Worker ticks once a second (the page's own
// timers slow to once a minute there), and a rest or timed set that runs out ends on time. Nothing shows outside the
// page. Its only sound is a short chime when a rest or timed set runs out, which mixes with music from other apps
// rather than pausing or lowering it.

/** `anyRunning`: some session's clock (or a rest, or a timed set) is going, so the page needs to redraw every second. */
export function useWorkoutClock(logic: PlannerLogic, view: PlannerVals | null, anyRunning: boolean) {
  const viewRef = useRef(view);
  viewRef.current = view;

  // A timed set: when getting ready is over its time starts (said to screen readers), and each of its last three
  // seconds ticks softly, with the chime setting. Each is done once, keyed by the set and the second.
  const said = useRef('');
  const ticked = useRef('');
  useEffect(() => {
    const v = viewRef.current;
    if (!v || !v.holdEndsAt) return;
    const now = Date.now();
    if (v.holdStartsAt && now >= v.holdStartsAt && said.current !== String(v.holdStartsAt)) {
      said.current = String(v.holdStartsAt);
      // Only when it has just started, not when the page comes back to one long since going.
      if (now - v.holdStartsAt < 2000) v.holdGo();
    }
    const left = Math.ceil((v.holdEndsAt - now) / 1000);
    if (!v.holdLead && left >= 1 && left <= 3) {
      const key = v.holdEndsAt + ':' + left;
      if (ticked.current !== key) {
        ticked.current = key;
        if (liveSettings().chime) playTick();
      }
    }
  });

  // A rest or a timed set that has run out goes, with a chime (unless turned off), a short glow on the card, and a buzz
  // where the phone allows it. A timed set's end counts it done, which may start a rest.
  useEffect(() => {
    const v = viewRef.current;
    if (!v) return;
    const holdOut = !!v.holdEndsAt && Date.now() >= v.holdEndsAt;
    const restOut = !!v.restEndsAt && Date.now() >= v.restEndsAt;
    if (!holdOut && !restOut) return;
    markEnd(holdOut ? 'hold' : 'rest');
    if (holdOut) v.holdOver();
    else v.restOver();
    if (liveSettings().chime) playChime(holdOut ? 'hold' : 'rest');
    // The glow goes after a few seconds even if nothing else redraws the page.
    setTimeout(() => logic.forceUpdate(), CUE_MS + 50);
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
  useEffect(() => {
    // Without a worker, the page's own timer does it (and slows down in the background, as before).
    if (!worker.current) {
      if (!anyRunning) return;
      const id = setInterval(() => logic.forceUpdate(), 1000);
      return () => clearInterval(id);
    }
    worker.current.postMessage({ type: 'run', on: anyRunning } satisfies WorkerIn);
  }, [anyRunning, logic]);

  // The app has no sound of its own, so it tells the phone so (Safari's Audio Session API): other apps' music plays on,
  // at its own volume.
  useEffect(() => setAudioSession(), []);

  // iOS plays a page's sound only after a tap on it, so any tap or key press readies the chime. It counts a tap when
  // the finger lifts (touchend, click), not when it lands, so readying on pointerdown alone could leave it silent.
  useEffect(() => {
    const ready = () => unlockChime();
    const events = ['pointerup', 'touchend', 'click', 'keydown'] as const;
    events.forEach((e) => window.addEventListener(e, ready, { passive: true }));
    return () => events.forEach((e) => window.removeEventListener(e, ready));
  }, []);
}
