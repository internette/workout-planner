'use client';

import { useEffect, useRef } from 'react';
import type { PlannerLogic } from '@/frontend/features/planner/store/PlannerLogic';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { setAudioSession } from './settings';
import type { WorkerIn, WorkerOut } from './timer.worker';

// Keeps a workout's clock going while the page is in the background: a Web Worker ticks once a second (the page's own
// timers slow to once a minute there), and a rest or timed set that runs out ends on time. Nothing shows outside the
// page, and it plays no sound of its own, so music from other apps plays on at its own volume.

/** `anyRunning`: some session's clock (or a rest, or a timed set) is going, so the page needs to redraw every second. */
export function useWorkoutClock(logic: PlannerLogic, view: PlannerVals | null, anyRunning: boolean) {
  const viewRef = useRef(view);
  viewRef.current = view;

  // A rest or a timed set that has run out goes (and the phone buzzes, where it can). A timed set's end counts it
  // done, which may start a rest.
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
}
