// Everything the dark theme changes, in one list: Plum dusk's colors (colors/dark.ts, which the palette and the
// contrast check read too), and the see-through colors, shadows and hover washes that don't follow their tokens
// there: light lines and rows on a dark page, black shadows, stronger washes. Applied under [data-theme="dark"].
import { darkColors } from '../colors/dark';
import { cssColor, cssVarName, translucent } from '../colors/tokens';

export const darkOverrides: Record<string, string> = {
  ...Object.fromEntries(Object.entries(darkColors).map(([name, value]) => [cssVarName(name), cssColor(value as string)])),
  // See-through colors
  '--color-line': translucent('white', 1),
  '--color-surface-rest': translucent('white', 1),
  '--color-accent-wash': translucent('pinkTint', 5),
  '--color-shadow': translucent('black', 5),
  '--color-scrim': translucent('black', 5),
  // Shadows: black and stronger, since a soft ink shadow doesn't show on a dark page
  '--elevation-hairline': '0 1px 3px ' + translucent('black', 4),
  '--elevation-raised': '0 4px 14px ' + translucent('black', 4),
  '--elevation-overlay': '0 8px 24px ' + translucent('black', 5),
  '--glow-primary': '0 8px 20px ' + translucent('pink', 4),
  // Hover washes: light over dark surfaces
  '--hover-neutral': translucent('white', 1),
  '--hover-icon': translucent('white', 1),
  '--hover-danger-ghost': translucent('danger', 2),
  'color-scheme': 'dark',
};
