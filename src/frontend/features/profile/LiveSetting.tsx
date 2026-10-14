'use client';

import { useEffect, useState } from 'react';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { RadioGroup } from '@moonshot/design-system/radio';
import { Text } from '@moonshot/design-system/typography';
import { SettingsCard } from './SettingsCard';
import { canNotify, canPlayer, canWake, leaveChoice, liveSettings, onLiveSettings, setLeaveChoice, setLiveSetting, type LeaveChoice, type LiveSettings } from '@/frontend/features/live/settings';

/** Settings → During a workout: what leaving a workout does with its clock, then whether the screen stays on and
 * whether a workout in progress shows outside the app. Saved in this browser. Each switch shows only where the browser
 * can do it, and their heading only with one to show. */
export function LiveSetting() {
  const [s, setS] = useState<LiveSettings>({ awake: false, notify: false, player: false });
  const [can, setCan] = useState({ awake: false, notify: false, player: false });
  const [blocked, setBlocked] = useState(false);
  const [leave, setLeave] = useState<LeaveChoice>('ask');
  // Read after mounting: the server doesn't know what this browser saved, or what it can do.
  useEffect(() => {
    setS(liveSettings());
    setLeave(leaveChoice());
    setCan({ awake: canWake(), notify: canNotify(), player: canPlayer() });
    setBlocked(canNotify() && Notification.permission === 'denied');
    return onLiveSettings(({ leave: l, ...p }) => {
      if (l) setLeave(l);
      setS((cur) => ({ ...cur, ...p }));
    });
  }, []);
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
      {/* What leaving a workout's page does with its clock: ask each time, or the answer given once. A rule sets the
          choice apart from the switches under it. */}
      <div style={{ marginTop: 'var(--space-3)', paddingBottom: 'var(--space-4)', marginBottom: 'var(--space-1)', borderBottom: '1px solid var(--color-line)' }}>
        <RadioGroup<LeaveChoice>
          label="When you leave a workout"
          options={[
            { value: 'ask', label: 'Ask me each time' },
            { value: 'run', label: 'Keep the timer running' },
            { value: 'pause', label: 'Pause the timer' },
          ]}
          value={leave}
          onChange={setLeaveChoice}
        />
      </div>
      {/* The switches under their own heading, styled as the leave choice's. */}
      {can.awake || can.notify || can.player ? (
        <Text variant="body" as="div" tone="ink" style={{ marginTop: 'var(--space-3)' }}>
          Screen and notifications
        </Text>
      ) : null}
      {can.awake ? (
        <div style={{ marginTop: 'var(--space-3)' }}>
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
        <div style={{ marginTop: 'var(--space-2h)' }}>
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
