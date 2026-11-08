'use client';

import { useEffect } from 'react';
import type { PlannerLogic } from '../planner/store/PlannerLogic';
import { trackError, trackFix } from './model';

/**
 * Follows GPS for the Run/Walk or Cycling session being collected (`id`, the one with Moonwalk on and its clock
 * running), and hands each fix to its track. The browser only sends fixes while the app is open on screen. When it
 * comes back, the next fix measures the gap (see track.ts).
 */
export function useMoonwalk(logic: PlannerLogic, id: string | null) {
  useEffect(() => {
    if (!id || typeof navigator === 'undefined' || !navigator.geolocation) {
      if (id) trackError(logic, id, 'This browser can’t share your location, so Moonwalk can’t count distance here.');
      return;
    }
    const watch = navigator.geolocation.watchPosition(
      (p) => trackFix(logic, id, { lat: p.coords.latitude, lon: p.coords.longitude, acc: p.coords.accuracy, t: p.timestamp || Date.now() }),
      (e) =>
        trackError(
          logic,
          id,
          e.code === e.PERMISSION_DENIED
            ? 'Location is off for Moonshot. Turn it on in your browser or phone settings to collect.'
            : 'Can’t find where you are right now. Moonwalk keeps trying.',
        ),
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 30000 },
    );
    return () => navigator.geolocation.clearWatch(watch);
  }, [logic, id]);
}
