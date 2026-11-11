'use client';

import { useEffect, useState } from 'react';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { RadioGroup } from '@moonshot/design-system/radio';
import { Text } from '@moonshot/design-system/typography';
import { SettingsCard } from './SettingsCard';
import { canWake, leaveChoice, liveSettings, onLiveSettings, setLeaveChoice, setLiveSetting, type LeaveChoice, type LiveSettings } from '@/frontend/features/live/settings';

/** Settings → During a workout: what leaving a workout does with its clock, then whether the screen stays on. Saved in
 * this browser. The switch shows only where the browser can keep the screen on. */
export function LiveSetting() {
  const [s, setS] = useState<LiveSettings>({ awake: false });
  const [canAwake, setCanAwake] = useState(false);
  const [leave, setLeave] = useState<LeaveChoice>('ask');
  // Read after mounting: the server doesn't know what this browser saved, or what it can do.
  useEffect(() => {
    setS(liveSettings());
    setLeave(leaveChoice());
    setCanAwake(canWake());
    return onLiveSettings(({ leave: l, ...p }) => {
      if (l) setLeave(l);
      setS((cur) => ({ ...cur, ...p }));
    });
  }, []);
  return (
    <SettingsCard title="During a workout">
      {/* What leaving a workout's page does with its clock: ask each time, or the answer given once. A rule sets the
          choice apart from the switch under it. */}
      <div
        style={{
          marginTop: 'var(--space-3)',
          paddingBottom: canAwake ? 'var(--space-4)' : undefined,
          marginBottom: canAwake ? 'var(--space-1)' : undefined,
          borderBottom: canAwake ? '1px solid var(--color-line)' : undefined,
        }}
      >
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
      {/* The switch under its own heading, styled as the leave choice's. */}
      {canAwake ? (
        <>
          <Text variant="body" as="div" tone="ink" style={{ marginTop: 'var(--space-3)' }}>
            Screen
          </Text>
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
        </>
      ) : null}
    </SettingsCard>
  );
}
