// Everything the dark theme changes, in one list: Plum dusk's colors (colors/dark.ts, which the palette and the
// contrast check read too), and the see-through colors, shadows and hover washes that don't follow their tokens
// there: light lines and rows on a dark page, black shadows, stronger washes. Applied under [data-theme="dark"].
import { darkColors } from '../colors/dark';
import { cssColor, cssVarName } from '../colors/tokens';

const mix = (token: string, pct: number) => `color-mix(in srgb, var(--color-${token}) ${pct}%, transparent)`;

export const darkOverrides: Record<string, string> = {
  ...Object.fromEntries(Object.entries(darkColors).map(([name, value]) => [cssVarName(name), cssColor(value as string)])),
  // See-through colors
  '--color-line': 'color-mix(in srgb, white 8%, transparent)',
  '--color-surface-rest': 'color-mix(in srgb, white 4%, transparent)',
  '--color-accent-wash': mix('pink-tint', 60),
  '--color-shadow': 'rgba(0, 0, 0, 0.5)',
  '--color-scrim': 'rgba(0, 0, 0, 0.55)',
  // Shadows: black and stronger, since a soft ink shadow doesn't show on a dark page
  '--elevation-hairline': '0 1px 3px rgba(0, 0, 0, 0.35)',
  '--elevation-raised': '0 4px 14px rgba(0, 0, 0, 0.35)',
  '--elevation-overlay': '0 8px 24px rgba(0, 0, 0, 0.5)',
  '--glow-primary': '0 8px 20px ' + mix('pink', 35),
  // Hover washes: light over dark surfaces
  '--hover-neutral': 'color-mix(in srgb, white 6%, transparent)',
  '--hover-icon': 'color-mix(in srgb, white 8%, transparent)',
  '--hover-danger-ghost': mix('danger', 12),
  'color-scheme': 'dark',
};
