'use client';

import { useEffect, useState } from 'react';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/typography';
import { savedTheme, setTheme, type Theme } from './theme';

/** Profile → Settings: Appearance, light or dark. Saved in this browser and applied at once. */
export function AppearanceSetting() {
  const [theme, setThemeState] = useState<Theme>('light');
  // Read after mounting: the server doesn't know what this browser saved.
  useEffect(() => setThemeState(savedTheme()), []);
  const pick = (t: Theme) => {
    setTheme(t);
    setThemeState(t);
  };
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
      <div style={{ flex: '1 1 180px', minWidth: 0 }}>
        <Text variant="label" as="div" tone="ink">
          Appearance
        </Text>
        <Text variant="caption" as="div" tone="muted" style={{ marginTop: '2px' }}>
          Saved on this device.
        </Text>
      </div>
      <SegmentedControl
        label="Appearance"
        size="sm"
        options={[
          { value: 'light', label: 'Light' },
          { value: 'dark', label: 'Dark' },
        ]}
        value={theme}
        onChange={pick}
      />
    </div>
  );
}
