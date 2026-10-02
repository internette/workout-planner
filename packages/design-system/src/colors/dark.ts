// Plum dusk: the dark theme. The light palette's names, with values for a dark plum page. Applied when
// <html data-theme="dark"> is set (Profile → Settings → Appearance). Text on its surfaces is 4.5:1 or more; the pink
// is brightened so it glows, and text on it turns dark plum (5.8:1), since white on the brighter pink would be faint.
// Only what changes is listed: white, peach and gold stay as they are, and the accent still names pink, so it
// takes the brighter pink from here. As in the light palette, a value can name another colour instead of a hex.
import type { ColorName } from './tokens';

export const darkColors: Partial<Record<ColorName, string>> = {
  // Text
  ink: '#F1E9EF',
  slate: '#C9BCCB',
  slateDeep: '#D8CCD9',
  muted: '#B3A3B3',
  // Lines and controls
  outline: '#8E7F93',
  hairline: '#54445A',
  // Surfaces
  canvas: '#1B1320',
  surface: '#281D2F',
  mist: '#33263B',
  slateTint: '#2F2640',
  // Accent (pink, as in light; only its hover differs from the brand pink's shades)
  accentHover: '#F48AB6',
  // Text on the bright fills: the card colour
  onAccent: 'surface',
  onStrong: 'surface',
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
  // Status
  danger: '#E0677A',
  dangerHover: '#E88595',
  dangerTint: '#3E1D26',
};

/** The dark theme's see-through colours, where they differ from the light formula: light lines and rows on a dark
 * page, black shadows, and a stronger accent wash. The rest follow their tokens. */
const mix = (token: string, pct: number) => `color-mix(in srgb, var(--color-${token}) ${pct}%, transparent)`;
export const darkTranslucents: Record<string, string> = {
  line: mix('white', 8),
  surfaceRest: mix('white', 4),
  accentWash: mix('accent-tint', 60),
  shadow: 'rgba(0, 0, 0, 0.5)',
  scrim: 'rgba(0, 0, 0, 0.55)',
};
