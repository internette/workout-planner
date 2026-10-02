// The colour themes: the same app in teal, periwinkle, slate or coral instead of pink, each with a light and a dark
// version. Chosen in Profile → Settings → Colour, and applied as <html data-accent="teal"> (with data-theme="dark" for
// the dark version). Pink needs nothing here: it's the default light palette and Plum dusk.
//
// Light: pink and slate are the palette colours themselves, with white text. Teal, periwinkle and coral are deepened
// just enough that a tick, bar or mark in them is 3:1 or more on the page and on a card; text on them is a near-black
// navy (5:1 or more), and their hover goes a step lighter so it stays 4.5:1. Accent text uses each colour's deep shade
// (5:1 or more on white and tint).
// Dark: the page and cards lean toward the colour, the accent is brightened, and text on it is the card colour.
import { colors, cssVarName, type ColorName } from './tokens';
import { darkColors } from './dark';

export type Accent = 'pink' | 'teal' | 'periwinkle' | 'slate' | 'coral';
export const ACCENTS: { name: Accent; label: string; swatch: string }[] = [
  { name: 'pink', label: 'Pink', swatch: '#D63479' },
  { name: 'teal', label: 'Teal', swatch: '#2C9BAE' },
  { name: 'periwinkle', label: 'Periwinkle', swatch: '#788CC8' },
  { name: 'slate', label: 'Slate', swatch: '#5C6684' },
  { name: 'coral', label: 'Coral', swatch: '#E76938' },
];

type Light = { accent: string; hover: string; deep: string; tint: string; on: string; canvas: string; mist: string };
type Dark = Light & {
  surface: string;
  ink: string;
  slate: string;
  slateDeep: string;
  textMuted: string;
  hairline: string;
  outline: string;
};

const LIGHT: Record<Exclude<Accent, 'pink'>, Light> = {
  teal: { accent: '#2C9BAE', hover: '#32B1C6', deep: '#276B76', tint: '#E4F4F7', on: '#161B2E', canvas: '#F1F9FA', mist: '#EAF2F4' },
  periwinkle: { accent: '#788CC8', hover: '#8E9FD1', deep: '#4C5E96', tint: '#E9EEF9', on: '#161B2E', canvas: '#F4F5FB', mist: '#EDEFF7' },
  slate: { accent: '#5C6684', hover: '#505A77', deep: '#4A5268', tint: '#EDEFF6', on: '#FFFFFF', canvas: '#F5F5F8', mist: '#EEEFF3' },
  coral: { accent: '#E76938', hover: '#EA7E53', deep: '#A4502C', tint: '#FDEDE6', on: '#161B2E', canvas: '#FDF5F1', mist: '#F6EEEA' },
};

const DARK: Record<Exclude<Accent, 'pink'>, Dark> = {
  teal: {
    canvas: '#10191C', surface: '#192629', mist: '#22343A', accent: '#5CC8D8', hover: '#7AD3E0', deep: '#7FD6E3', tint: '#173A41', on: '#192629',
    ink: '#E6F0F2', slate: '#BBCBCF', slateDeep: '#CDDBDE', textMuted: '#A2B3B7', hairline: '#3E5358', outline: '#7F9499',
  },
  periwinkle: {
    canvas: '#14162A', surface: '#1D2038', mist: '#272B47', accent: '#9AAAF0', hover: '#B0BDF4', deep: '#AEBBF5', tint: '#2B3260', on: '#1D2038',
    ink: '#ECEEF8', slate: '#C0C5DC', slateDeep: '#D0D4E6', textMuted: '#A9AEC7', hairline: '#454A6A', outline: '#858AA7',
  },
  slate: {
    canvas: '#15171C', surface: '#1E2128', mist: '#282C35', accent: '#B3BCD6', hover: '#C6CDE1', deep: '#C3CBE2', tint: '#333A4B', on: '#1E2128',
    ink: '#ECEEF3', slate: '#C3C7D2', slateDeep: '#D3D6DF', textMuted: '#A9AEBB', hairline: '#474C58', outline: '#878C99',
  },
  coral: {
    canvas: '#1D1614', surface: '#281F1C', mist: '#342925', accent: '#F4AE93', hover: '#F7BEA7', deep: '#F7BEA7', tint: '#48302A', on: '#281F1C',
    ink: '#F4EAE6', slate: '#D4C6C1', slateDeep: '#E0D5D1', textMuted: '#B9A9A3', hairline: '#574641', outline: '#95857F',
  },
};

/** Each theme's page colour, for the browser's own bars (<meta name="theme-color">). */
export const PAGE_COLORS: Record<Accent, { light: string; dark: string }> = {
  pink: { light: colors.canvas, dark: darkColors.canvas },
  ...(Object.fromEntries((Object.keys(LIGHT) as Exclude<Accent, 'pink'>[]).map((a) => [a, { light: LIGHT[a].canvas, dark: DARK[a].canvas }])) as Record<
    Exclude<Accent, 'pink'>,
    { light: string; dark: string }
  >),
};

const accentVars = (t: Light) => ({
  accent: t.accent,
  accentHover: t.hover,
  accentDeep: t.deep,
  accentTint: t.tint,
  onAccent: t.on,
  canvas: t.canvas,
  mist: t.mist,
});

// What a dark colour theme changes on top of Plum dusk, besides the accent.
const darkVars = (d: Dark) => ({
  ...accentVars(d),
  surface: d.surface,
  onStrong: d.surface,
  slateTint: d.mist,
  ink: d.ink,
  slate: d.slate,
  slateDeep: d.slateDeep,
  muted: d.textMuted,
  hairline: d.hairline,
  outline: d.outline,
});

/** Every palette colour as a hex value, for a colour theme in light or dark: for what can't read CSS variables, such
 * as the lock-screen artwork drawn in a worker, and for checking contrast. */
export function paletteFor(theme: 'light' | 'dark', accent: Accent): Record<ColorName, string> {
  const base = theme === 'dark' ? darkColors : colors;
  if (accent === 'pink') return { ...base };
  const over: Record<string, string> = theme === 'dark' ? darkVars(DARK[accent]) : accentVars(LIGHT[accent]);
  const out = { ...base };
  for (const k of Object.keys(out) as ColorName[]) if (over[k] && over[k].startsWith('#')) out[k] = over[k];
  return out;
}

const block = (selector: string, values: Record<string, string>) =>
  selector + '{' + Object.entries(values).map(([k, v]) => `${cssVarName(k)}:${v}`).join(';') + '}';

// The soft gem gradient (quest and streak panels, empty states) runs accent → periwinkle → teal. In the teal theme
// that starts and ends on teal and reads as flat, so there it runs teal → periwinkle → pink instead.
const TEAL_GEM_TINT =
  'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 16%, transparent) 0%, color-mix(in srgb, var(--color-periwinkle) 16%, transparent) 50%, color-mix(in srgb, var(--color-pink) 16%, transparent) 100%)';

/** Every colour theme as CSS, for ColorVariables. Each light block overrides the accent and page tint; each dark
 * block overrides Plum dusk's surfaces and text too. */
export const accentThemeCss = (Object.keys(LIGHT) as Exclude<Accent, 'pink'>[])
  .map((name) => {
    const l = LIGHT[name];
    const d = DARK[name];
    return (
      block(`[data-accent="${name}"]`, accentVars(l)) +
      block(`[data-accent="${name}"][data-theme="dark"]`, darkVars(d))
    );
  })
  .join('') + `[data-accent="teal"]{--gradient-gem-tint:${TEAL_GEM_TINT}}`;
