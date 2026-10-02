// Plum dusk: the dark theme. The same names as the light palette, with values for a dark plum page. Applied when
// <html data-theme="dark"> is set (Profile → Settings → Appearance). Text on its surfaces is 4.5:1 or more; the pink
// is brightened so it glows, and text on it turns dark plum (5.8:1), since white on the brighter pink would be faint.
import type { ColorName } from './tokens';

export const darkColors: Record<ColorName, string> = {
  // Text
  ink: '#F1E9EF',
  slate: '#C9BCCB',
  slateDeep: '#D8CCD9',
  muted: '#B3A3B3',
  // Lines and controls
  outline: '#8E7F93',
  hairline: '#54445A',
  // Surfaces (white stays white: it's only used where white is meant)
  canvas: '#1B1320',
  surface: '#281D2F',
  mist: '#33263B',
  slateTint: '#2F2640',
  white: '#FFFFFF',
  // Accent (Plum dusk's is pink)
  accent: '#F06FA6',
  accentHover: '#F48AB6',
  accentDeep: '#F58BB8',
  accentTint: '#45223A',
  // On colour
  onAccent: '#281D2F',
  onStrong: '#281D2F',
  // Brand
  pink: '#F06FA6',
  pinkTint: '#45223A',
  pinkDeep: '#F58BB8',
  periwinkle: '#95A6DC',
  periwinkleTint: '#2A2C45',
  periwinkleDeep: '#B5C2EA',
  teal: '#6FD0E0',
  tealTint: '#1E3238',
  tealDeep: '#8FDCE8',
  peach: '#F0A385',
  gold: '#E0A93A',
  goldLight: '#F0C060',
  // Status
  danger: '#E0677A',
  dangerHover: '#E88595',
  dangerTint: '#3E1D26',
};

/** The dark theme's see-through colours, where they differ from the light formula: light lines and rows on a dark
 * page, black shadows, and a stronger accent wash. The rest follow their tokens. */
export const darkTranslucents: Record<string, string> = {
  line: 'rgba(255, 255, 255, 0.08)',
  surfaceRest: 'rgba(255, 255, 255, 0.04)',
  accentWash: 'color-mix(in srgb, var(--color-accent-tint) 60%, transparent)',
  shadow: 'rgba(0, 0, 0, 0.5)',
  scrim: 'rgba(0, 0, 0, 0.55)',
};
