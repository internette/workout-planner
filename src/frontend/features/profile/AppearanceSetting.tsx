'use client';

import { useEffect, useState } from 'react';
import { ACCENTS, paletteFor } from '@moonshot/design-system/colors';
import { IconChoiceGroup } from '@moonshot/design-system/icon-choice-group';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { Text } from '@moonshot/design-system/typography';
import { savedAccent, savedTheme, setAccent, setTheme, type Accent, type Theme } from '@moonshot/design-system/theme';

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '14px' };

/** Settings → Appearance: the color and light or dark. Saved in this browser and applied at once (its card says so). */
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
        <div style={{ flex: '1 1 120px', minWidth: 0 }}>
          <Text variant="strong" as="div" tone="ink" id="color-label">
            Color
          </Text>
          {/* The chosen one's name: the swatches alone only say it on hover. */}
          <Text variant="body" as="div" tone="muted" style={{ marginTop: '2px' }}>
            {(ACCENTS.find((a) => a.name === accent) || ACCENTS[0]).label}
          </Text>
        </div>
        <IconChoiceGroup
          labelledBy="color-label"
          kind="swatch"
          shape="round"
          style={{ flexWrap: 'nowrap', gap: '6px' }}
          options={ACCENTS.map((a) => ({
            value: a.name,
            label: a.label,
            color: a.swatch,
            // The tick is the theme's own color for things on its accent.
            checkColor: paletteFor('light', a.name).onAccent,
          }))}
          value={accent}
          onChange={pickAccent}
        />
      </div>
      <div style={row}>
        <div style={{ flex: '1 1 120px', minWidth: 0 }}>
          <Text variant="strong" as="div" tone="ink">
            Theme
          </Text>
        </div>
        <SegmentedControl
          label="Theme"
          size="sm"
          options={[
            { value: 'light', label: 'Light' },
            { value: 'dark', label: 'Dark' },
          ]}
          value={theme}
          onChange={pickTheme}
        />
      </div>
    </>
  );
}
