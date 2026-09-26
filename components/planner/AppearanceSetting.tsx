'use client';

import { useEffect, useState } from 'react';
import { ACCENTS } from '@/components/ui/colors/themes';
import { IconChoiceGroup } from '@/components/ui/icon-choice-group';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/typography';
import { savedAccent, savedTheme, setAccent, setTheme, type Accent, type Theme } from './theme';

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '14px' };

/** Profile → Settings: the colour and light or dark. Saved in this browser and applied at once. */
export function AppearanceSetting() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [accent, setAccentState] = useState<Accent>('pink');
  // Read after mounting: the server doesn't know what this browser saved.
  useEffect(() => {
    setThemeState(savedTheme());
    setAccentState(savedAccent());
  }, []);
  const pickTheme = (t: Theme) => {
    setTheme(t);
    setThemeState(t);
  };
  const pickAccent = (a: Accent) => {
    setAccent(a);
    setAccentState(a);
  };
  return (
    <>
      <div style={row}>
        <Text variant="label" as="div" tone="ink" id="colour-label" style={{ flex: '1 1 120px' }}>
          Colour
        </Text>
        <IconChoiceGroup
          labelledBy="colour-label"
          kind="swatch"
          shape="round"
          style={{ flexWrap: 'nowrap', gap: '6px' }}
          options={ACCENTS.map((a) => ({
            value: a.name,
            label: a.label,
            color: a.swatch,
            checkColor: a.name === 'slate' || a.name === 'pink' ? '#FFFFFF' : '#232A45',
          }))}
          value={accent}
          onChange={pickAccent}
        />
      </div>
      <div style={row}>
        <div style={{ flex: '1 1 120px', minWidth: 0 }}>
          <Text variant="label" as="div" tone="ink">
            Appearance
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
          onChange={pickTheme}
        />
      </div>
      <Text variant="caption" as="p" tone="muted" style={{ margin: '12px 0 0' }}>
        Saved on this device.
      </Text>
    </>
  );
}
