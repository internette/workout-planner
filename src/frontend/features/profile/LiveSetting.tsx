'use client';

import { useEffect, useState } from 'react';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Text } from '@moonshot/design-system/typography';
import { canNotify, canPlayer, liveSettings, onLiveSettings, setLiveSetting, type LiveSettings } from '@/frontend/features/live/settings';

/** Profile → Settings: whether a workout in progress shows outside the app. Saved in this browser. */
export function LiveSetting() {
  const [s, setS] = useState<LiveSettings>({ notify: false, player: false });
  const [can, setCan] = useState({ notify: false, player: false });
  const [blocked, setBlocked] = useState(false);
  // Read after mounting: the server doesn't know what this browser saved, or what it can do.
  useEffect(() => {
    setS(liveSettings());
    setCan({ notify: canNotify(), player: canPlayer() });
    setBlocked(canNotify() && Notification.permission === 'denied');
    return onLiveSettings((p) => setS((cur) => ({ ...cur, ...p })));
  }, []);
  if (!can.notify && !can.player) return null;
  // Turning notifications on asks the browser now, while there's a tap to ask from.
  const pickNotify = (on: boolean) => {
    setLiveSetting('notify', on);
    if (on && Notification.permission === 'default')
      Notification.requestPermission()
        .then((p) => setBlocked(p === 'denied'))
        .catch(() => undefined);
  };
  return (
    <div style={{ marginTop: '18px' }}>
      <Text variant="label" as="div" tone="ink">
        During a workout
      </Text>
      {can.notify ? (
        <div style={{ marginTop: '10px' }}>
          <Checkbox switch checked={s.notify} onChange={pickNotify}>
            Show it in a notification, with buttons to tick off and finish
          </Checkbox>
          {s.notify && blocked ? (
            <Text variant="caption" as="p" tone="muted" style={{ margin: '6px 0 0', paddingLeft: 'calc(20px + var(--space-3))' }}>
              Notifications are blocked for Moonshot. Allow them in your browser’s site settings.
            </Text>
          ) : null}
        </div>
      ) : null}
      {can.player ? (
        <div style={{ marginTop: '10px' }}>
          <Checkbox switch checked={s.player} onChange={(on) => setLiveSetting('player', on)}>
            Show it on the lock screen as what’s playing
          </Checkbox>
          <Text variant="caption" as="p" tone="muted" style={{ margin: '6px 0 0', paddingLeft: 'calc(20px + var(--space-3))' }}>
            This plays silence to hold the spot, so it stops other music.
          </Text>
        </div>
      ) : null}
    </div>
  );
}
