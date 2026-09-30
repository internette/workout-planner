'use client';

import { useEffect, useState } from 'react';
import { canWake, liveSettings, onLiveSettings } from './settings';

/**
 * Keeps the screen on while `active` (a workout in progress, running or paused) and the setting is on. The browser
 * lets go whenever the page is hidden (another app, the screen locked), so it's asked again on coming back. It may say
 * no (Low Power Mode, battery saver); then the screen just behaves as usual.
 */
export function useWakeLock(active: boolean) {
  const [on, setOn] = useState(false);
  // Read after mounting: the server doesn't know what this browser saved.
  useEffect(() => {
    setOn(liveSettings().awake);
    return onLiveSettings((s) => {
      if (s.awake !== undefined) setOn(s.awake);
    });
  }, []);
  const want = active && on;
  useEffect(() => {
    if (!want || !canWake()) return;
    let lock: WakeLockSentinel | null = null;
    let gone = false;
    const hold = () => {
      if (document.visibilityState !== 'visible' || (lock && !lock.released)) return;
      navigator.wakeLock
        .request('screen')
        .then((l) => {
          if (gone) l.release().catch(() => undefined);
          else lock = l;
        })
        .catch(() => undefined);
    };
    hold();
    document.addEventListener('visibilitychange', hold);
    return () => {
      gone = true;
      document.removeEventListener('visibilitychange', hold);
      lock?.release().catch(() => undefined);
    };
  }, [want]);
}
