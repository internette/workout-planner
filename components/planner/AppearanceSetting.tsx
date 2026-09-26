'use client';

import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
import { ACCENTS } from '@/components/ui/colors/themes';
import { Check } from '@/components/ui/icons';
import { SegmentedControl } from '@/components/ui/segmented-control';
import { Text } from '@/components/ui/typography';
import { savedAccent, savedTheme, setAccent, setTheme, type Accent, type Theme } from './theme';

const row: React.CSSProperties = { display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px', marginTop: '14px' };

/** Profile → Settings: the colour and light or dark. Saved in this browser and applied at once. */
export function AppearanceSetting() {
  const [theme, setThemeState] = useState<Theme>('light');
  const [accent, setAccentState] = useState<Accent>('pink');
  const swatches = useRef<(HTMLButtonElement | null)[]>([]);
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
  // A radio group: the arrow keys (and Home, End) move the choice, and focus goes with it.
  const keys = (ix: number) => (e: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
    const to = step ? (ix + step + ACCENTS.length) % ACCENTS.length : e.key === 'Home' ? 0 : e.key === 'End' ? ACCENTS.length - 1 : -1;
    if (to < 0) return;
    e.preventDefault();
    pickAccent(ACCENTS[to].name);
    swatches.current[to]?.focus();
  };
  return (
    <>
      <div style={row}>
        <Text variant="label" as="div" tone="ink" id="colour-label" style={{ flex: '1 1 120px' }}>
          Colour
        </Text>
        <div role="radiogroup" aria-labelledby="colour-label" style={{ display: 'flex', gap: '6px' }}>
          {ACCENTS.map((a, ix) => {
            const on = a.name === accent;
            return (
              <button
                key={a.name}
                ref={(el) => {
                  swatches.current[ix] = el;
                }}
                type="button"
                role="radio"
                aria-checked={on}
                aria-label={a.label}
                title={a.label}
                tabIndex={on ? 0 : -1}
                onClick={() => pickAccent(a.name)}
                onKeyDown={keys(ix)}
                className="hit fc-keep"
                style={{
                  width: '34px',
                  height: '34px',
                  flex: 'none',
                  border: 'none',
                  borderRadius: 'var(--radius-full)',
                  background: a.swatch,
                  boxShadow: on ? `0 0 0 2px var(--color-surface), 0 0 0 4px ${a.swatch}` : 'inset 0 0 0 1px var(--color-line)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  padding: 0,
                }}
              >
                {on ? <Check color={a.name === 'slate' || a.name === 'pink' ? '#FFFFFF' : '#232A45'} strokeWidth={3} size={15} /> : null}
              </button>
            );
          })}
        </div>
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
