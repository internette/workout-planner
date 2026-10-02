import { paletteFor } from '@moonshot/design-system/colors';
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

// Taken from the colour themes themselves, so the artwork follows any change to them.
export function liveLook(accent: Accent, theme: Theme): LiveLook {
  const p = paletteFor(theme, accent);
  const card = { card: p.surface, ink: p.ink, muted: p.muted, soft: p.slate, track: p.mist, accent: p.accent, onAccent: p.onAccent, second: p.accentTint };
  const gem: [string, string, string] = [p.accent, p.periwinkle, p.teal];
  return theme === 'dark'
    ? { ...card, onSecond: p.ink, iconInk: p.accent, gem }
    : { ...card, onSecond: p.accentDeep, iconInk: p.accentDeep, gem };
}
