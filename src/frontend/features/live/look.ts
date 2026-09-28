import type { Accent, Theme } from '@moonshot/design-system/theme';

/** The colours the lock-screen artwork is drawn in: the Live Activity designs' palette, per colour and light or dark. */
export type LiveLook = {
  card: string;
  ink: string;
  muted: string;
  /** Secondary text, a step stronger than muted. */
  soft: string;
  track: string;
  accent: string;
  onAccent: string;
  second: string;
  onSecond: string;
  /** An icon on the second colour's tile (the ride's bike). */
  iconInk: string;
  gem: [string, string, string];
};

const LIGHT: Record<Accent, { a: string; on: string; deep: string; tint: string; mist: string }> = {
  pink: { a: '#D63479', on: '#FFFFFF', deep: '#B22461', tint: '#FCE8F1', mist: '#F4EFF1' },
  teal: { a: '#5EC4D6', on: '#232A45', deep: '#276B76', tint: '#E4F4F7', mist: '#EAF2F4' },
  periwinkle: { a: '#7C8FC9', on: '#161B2E', deep: '#4C5E96', tint: '#E9EEF9', mist: '#EDEFF7' },
  slate: { a: '#5C6684', on: '#FFFFFF', deep: '#4A5268', tint: '#EDEFF6', mist: '#EEEFF3' },
  coral: { a: '#F0A385', on: '#232A45', deep: '#A4502C', tint: '#FDEDE6', mist: '#F6EEEA' },
};
const DARK: Record<Accent, { a: string; on: string; tint: string; surf: string; mist: string; ink: string; muted: string; soft: string }> = {
  pink: { a: '#F06FA6', on: '#281D2F', tint: '#45223A', surf: '#281D2F', mist: '#33263B', ink: '#F1E9EF', muted: '#B3A3B3', soft: '#C9BCCB' },
  teal: { a: '#5CC8D8', on: '#192629', tint: '#173A41', surf: '#192629', mist: '#22343A', ink: '#E6F0F2', muted: '#A2B3B7', soft: '#BBCBCF' },
  periwinkle: { a: '#9AAAF0', on: '#1D2038', tint: '#2B3260', surf: '#1D2038', mist: '#272B47', ink: '#ECEEF8', muted: '#A9AEC7', soft: '#C0C5DC' },
  slate: { a: '#B3BCD6', on: '#1E2128', tint: '#333A4B', surf: '#1E2128', mist: '#282C35', ink: '#ECEEF3', muted: '#A9AEBB', soft: '#C3C7D2' },
  coral: { a: '#F4AE93', on: '#281F1C', tint: '#48302A', surf: '#281F1C', mist: '#342925', ink: '#F4EAE6', muted: '#B9A9A3', soft: '#D4C6C1' },
};

export function liveLook(accent: Accent, theme: Theme): LiveLook {
  if (theme === 'dark') {
    const d = DARK[accent] || DARK.pink;
    return {
      card: d.surf,
      ink: d.ink,
      muted: d.muted,
      soft: d.soft,
      track: d.mist,
      accent: d.a,
      onAccent: d.on,
      second: d.tint,
      onSecond: d.ink,
      iconInk: d.a,
      gem: [d.a, '#95A6DC', '#5CC8D8'],
    };
  }
  const l = LIGHT[accent] || LIGHT.pink;
  return {
    card: '#FFFFFF',
    ink: '#232A45',
    muted: '#6E6881',
    soft: '#5C6684',
    track: l.mist,
    accent: l.a,
    onAccent: l.on,
    second: l.tint,
    onSecond: l.deep,
    iconInk: l.deep,
    gem: [l.a, '#7C8FC9', '#5EC4D6'],
  };
}
