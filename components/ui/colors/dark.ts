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
  subtle: '#AC9CB0',
  hairline: '#54445A',
  outline: '#8E7F93',
  divider: '#45364C',
  // Roles
  surface: '#281D2F',
  onAccent: '#281D2F',
  // Surfaces (white stays white: it's only used where white is meant)
  white: '#FFFFFF',
  canvas: '#1B1320',
  mist: '#33263B',
  cloud: '#34283F',
  slateTint: '#2F2640',
  // Pink
  pink: '#F06FA6',
  pinkHover: '#F48AB6',
  pinkDeep: '#F58BB8',
  pinkTint: '#45223A',
  pinkMuted: '#6B3552',
  // Periwinkle and teal
  periwinkle: '#95A6DC',
  periwinkleTint: '#2A2C45',
  periwinkleDeep: '#B5C2EA',
  teal: '#6FD0E0',
  tealTint: '#1E3238',
  tealDeep: '#8FDCE8',
  // Highlights
  coral: '#F0A385',
  gold: '#E0A93A',
  goldLight: '#F0C060',
  // Danger
  danger: '#E0677A',
  dangerHover: '#E88595',
  dangerTint: '#3E1D26',
};

/** The see-through colours for the dark theme: light lines on dark, and dark plum dimmed on pink. */
export const darkTranslucents: Record<string, string> = {
  line: 'rgba(255, 255, 255, 0.08)',
  lineFaint: 'rgba(255, 255, 255, 0.06)',
  lineStrong: 'rgba(255, 255, 255, 0.11)',
  surfaceRest: 'rgba(255, 255, 255, 0.04)',
  surfaceBar: 'rgba(40, 29, 47, 0.94)',
  onAccentSoft: 'rgba(40, 29, 47, 0.85)',
  onAccentMuted: 'rgba(40, 29, 47, 0.8)',
  onAccentFaint: 'rgba(40, 29, 47, 0.7)',
  accentWash: 'rgba(69, 34, 58, 0.6)',
};

export const darkOverlays: Record<string, string> = {
  scrim: 'rgba(0, 0, 0, 0.55)',
};
