'use client';

import { useState } from 'react';
import { ACCENTS, cssVarName, paletteFor, type Accent, type ColorName } from '../../src/colors';
import { Select } from '../../src/select';
import { Swatch } from './Swatch';

// The roles a color theme fills, and the variable each is written as.
const ROLES: { role: string; token: ColorName; use: string }[] = [
  { role: 'accent', token: 'pink', use: 'Actions, selection, marks, bars and ticks; the Happy mood, the first rank tiers, the gem' },
  { role: 'accentHover', token: 'accentHover', use: 'Primary action, hovered' },
  { role: 'accentDeep', token: 'pinkDeep', use: 'Accent text on white and on the tint' },
  { role: 'accentTint', token: 'pinkTint', use: 'Selected and active backgrounds, the first rank tiers’ badge' },
  { role: 'onStrong', token: 'surface', use: 'Text and icons on the accent (and on ink and danger)' },
];

/** The swatch: the light theme's value on the left, the dark theme's on the right. onStrong is shown as a block on the accent. */
function Halves({ accent, token }: { accent: Accent; token: ColorName }) {
  const half = (theme: 'light' | 'dark') => {
    const p = paletteFor(theme, accent);
    const fill = token === 'surface'
      ? `linear-gradient(0deg, ${p.surface}, ${p.surface}) center / 44% 36% no-repeat, ${p.pink}`
      : p[token];
    return <div style={{ flex: 1, background: fill }} />;
  };
  return (
    <div style={{ height: 64, display: 'flex', borderBottom: '1px solid var(--color-line)' }}>
      {half('light')}
      {half('dark')}
    </div>
  );
}

const Dot = ({ color, size = 18 }: { color: string; size?: number }) => (
  <span aria-hidden style={{ width: size, height: size, flex: 'none', borderRadius: 'var(--radius-full)', background: color, boxShadow: 'inset 0 0 0 1px var(--color-line)' }} />
);

export function ThemeColors() {
  const [accent, setAccent] = useState<Accent>('pink');
  const light = paletteFor('light', accent);
  const dark = paletteFor('dark', accent);
  return (
    <>
      <ul
        style={{
          listStyle: 'none', margin: '0 0 28px', padding: '0 16px', maxWidth: 420,
          background: 'var(--color-surface)', borderRadius: 'var(--radius-lg)', boxShadow: 'var(--elevation-raised)',
        }}
      >
        {ACCENTS.map((a, i) => (
          <li key={a.name} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderTop: i ? '1px solid var(--color-line)' : undefined }}>
            <Dot color={a.swatch} size={20} />
            <span style={{ flex: 1, fontWeight: 'var(--font-weight-medium)' }}>{a.label}</span>
            <code style={{ fontSize: 'var(--text-sm)', color: 'var(--color-muted)' }}>{a.swatch}</code>
          </li>
        ))}
      </ul>
      <Select<Accent>
        label="Show the values for"
        options={ACCENTS.map((a) => ({ value: a.name, label: a.label, icon: <Dot color={a.swatch} /> }))}
        value={accent}
        onChange={setAccent}
        style={{ maxWidth: 280, marginBottom: 16 }}
      />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
        {ROLES.map(({ role, token, use }) => (
          <Swatch
            key={role}
            name={role}
            swatch={<Halves accent={accent} token={token} />}
            lines={[`${light[token]} light · ${dark[token]} dark`, `var(${cssVarName(token)})`]}
            use={use}
          />
        ))}
      </div>
    </>
  );
}
