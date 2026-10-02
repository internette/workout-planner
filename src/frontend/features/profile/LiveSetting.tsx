'use client';

import { useEffect, useState } from 'react';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { SettingsCard } from './SettingsCard';
import { canNotify, canPlayer, canWake, liveSettings, onLiveSettings, setLiveSetting, type LiveSettings } from '@/frontend/features/live/settings';

/** Settings → During a workout: whether the screen stays on, and whether a workout in progress shows outside the app.
 * Saved in this browser. Each shows only where the browser can do it; nothing, card and all, where it can do none. */
export function LiveSetting() {
  const [s, setS] = useState<LiveSettings>({ awake: false, notify: false, player: false });
  const [can, setCan] = useState({ awake: false, notify: false, player: false });
  const [blocked, setBlocked] = useState(false);
  // Read after mounting: the server doesn't know what this browser saved, or what it can do.
  useEffect(() => {
    setS(liveSettings());
    setCan({ awake: canWake(), notify: canNotify(), player: canPlayer() });
    setBlocked(canNotify() && Notification.permission === 'denied');
    return onLiveSettings((p) => setS((cur) => ({ ...cur, ...p })));
  }, []);
  if (!can.awake && !can.notify && !can.player) return null;
  // Turning notifications on asks the browser now, while there's a tap to ask from.
  const pickNotify = (on: boolean) => {
    setLiveSetting('notify', on);
    if (on && Notification.permission === 'default')
      Notification.requestPermission()
        .then((p) => setBlocked(p === 'denied'))
        .catch(() => undefined);
  };
  return (
    <SettingsCard title="During a workout">
      {can.awake ? (
        <div style={{ marginTop: '12px' }}>
          <Checkbox
            switch
            checked={s.awake}
            onChange={(on) => setLiveSetting('awake', on)}
            description="From Start until you finish, paused or not. Low Power Mode can overrule it."
          >
            Keep the screen on during a workout
          </Checkbox>
        </div>
      ) : null}
      {can.notify ? (
        <div style={{ marginTop: can.awake ? '10px' : '12px' }}>
          <Checkbox
            switch
            checked={s.notify}
            onChange={pickNotify}
            description={s.notify && blocked ? 'Notifications are blocked for Moonshot. Allow them in your browser’s site settings.' : undefined}
          >
            Show it in a notification, with buttons to tick off and finish
          </Checkbox>
        </div>
      ) : null}
      {can.player ? (
        <div style={{ marginTop: '10px' }}>
          <Checkbox
            switch
            checked={s.player}
            onChange={(on) => setLiveSetting('player', on)}
            description="This plays silence to hold the spot, so it stops other music."
          >
            Show it on the lock screen as what’s playing
          </Checkbox>
        </div>
      ) : null}
    </SettingsCard>
  );
}
