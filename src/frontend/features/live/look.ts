import type { Accent, Theme } from '@moonshot/design-system/theme';

/** The colours the lock-screen artwork is drawn in: the Live Activity designs' palette, per colour and light or dark. */
export type LiveLook = {
  card: string;
  ink: string;
  muted: string;
  track: string;
  accent: string;
  onAccent: string;
  second: string;
  onSecond: string;
  gem: [string, string, string];
};

const LIGHT: Record<Accent, { a: string; on: string; deep: string; tint: string; mist: string }> = {
  pink: { a: '#D53181', on: '#FFFFFF', deep: '#AF2367', tint: '#FCE8F2', mist: '#F4EFF1' },
  teal: { a: '#5EC4D6', on: '#232A45', deep: '#276B76', tint: '#E4F4F7', mist: '#EAF2F4' },
  periwinkle: { a: '#7C8FC9', on: '#161B2E', deep: '#4C5E96', tint: '#E9EEF9', mist: '#EDEFF7' },
  slate: { a: '#5C6684', on: '#FFFFFF', deep: '#4A5268', tint: '#EDEFF6', mist: '#EEEFF3' },
  coral: { a: '#F0A385', on: '#232A45', deep: '#A4502C', tint: '#FDEDE6', mist: '#F6EEEA' },
};
const DARK: Record<Accent, { a: string; on: string; tint: string; surf: string; mist: string; ink: string; muted: string }> = {
  pink: { a: '#F06FA6', on: '#281D2F', tint: '#45223A', surf: '#281D2F', mist: '#33263B', ink: '#F1E9EF', muted: '#B3A3B3' },
  teal: { a: '#5CC8D8', on: '#192629', tint: '#173A41', surf: '#192629', mist: '#22343A', ink: '#E6F0F2', muted: '#A2B3B7' },
  periwinkle: { a: '#9AAAF0', on: '#1D2038', tint: '#2B3260', surf: '#1D2038', mist: '#272B47', ink: '#ECEEF8', muted: '#A9AEC7' },
  slate: { a: '#B3BCD6', on: '#1E2128', tint: '#333A4B', surf: '#1E2128', mist: '#282C35', ink: '#ECEEF3', muted: '#A9AEBB' },
  coral: { a: '#F4AE93', on: '#281F1C', tint: '#48302A', surf: '#281F1C', mist: '#342925', ink: '#F4EAE6', muted: '#B9A9A3' },
};

export function liveLook(accent: Accent, theme: Theme): LiveLook {
  if (theme === 'dark') {
    const d = DARK[accent] || DARK.pink;
    return {
      card: d.surf,
      ink: d.ink,
      muted: d.muted,
      track: d.mist,
      accent: d.a,
      onAccent: d.on,
      second: d.tint,
      onSecond: d.ink,
      gem: [d.a, '#95A6DC', '#5CC8D8'],
    };
  }
  const l = LIGHT[accent] || LIGHT.pink;
  return {
    card: '#FFFFFF',
    ink: '#232A45',
    muted: '#6E6881',
    track: l.mist,
    accent: l.a,
    onAccent: l.on,
    second: l.tint,
    onSecond: l.deep,
    gem: [l.a, '#7C8FC9', '#5EC4D6'],
  };
}
