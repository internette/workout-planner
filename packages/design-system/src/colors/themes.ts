// The color themes: the same app in teal, periwinkle, slate or coral instead of pink, each with a light and a dark
// version. Chosen in Profile → Settings → Color, and applied as <html data-accent="teal"> (with data-theme="dark" for
// the dark version). Pink needs nothing here: it's the default light palette and Plum dusk.
//
// Light: pink and slate are the palette colors themselves, with white text. Teal, periwinkle and coral are deepened
// just enough that a tick, bar or mark in them is 3:1 or more on the page and on a card; text on them is a near-black
// navy (5:1 or more), and their hover goes a step lighter so it stays 4.5:1. Accent text uses each color's deep shade
// (5:1 or more on white and tint).
// Dark: the page and cards lean toward the color, the accent is brightened, and text on it is the card color.
//
// As in the palette, a value can name a color instead of repeating its hex: the slate theme's accent is the slate
// text color, some light tints and deep shades are the brand's, and in dark, text on the accent is the card color.
import { colorValues, cssColor, cssVarName, resolveColors, type ColorName } from './tokens';
import { darkColors } from './dark';

export type Accent = 'pink' | 'teal' | 'periwinkle' | 'slate' | 'coral';

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

// Text on the light teal, periwinkle and coral accents: a near-black navy.
const NAVY = '#161B2E';

const LIGHT: Record<Exclude<Accent, 'pink'>, Light> = {
  teal: { accent: '#2C9BAE', hover: '#32B1C6', deep: '#276B76', tint: 'tealTint', on: NAVY, canvas: '#F1F9FA', mist: '#EAF2F4' },
  periwinkle: { accent: '#788CC8', hover: '#8E9FD1', deep: 'periwinkleDeep', tint: 'periwinkleTint', on: NAVY, canvas: '#F4F5FB', mist: '#EDEFF7' },
  slate: { accent: 'slate', hover: '#505A77', deep: 'slateDeep', tint: 'slateTint', on: 'white', canvas: '#F5F5F8', mist: '#EEEFF3' },
  coral: { accent: '#E76938', hover: '#EA7E53', deep: '#A4502C', tint: '#FDEDE6', on: NAVY, canvas: '#FDF5F1', mist: '#F6EEEA' },
};

const DARK: Record<Exclude<Accent, 'pink'>, Dark> = {
  teal: {
    canvas: '#10191C', surface: '#192629', mist: '#22343A', accent: '#5CC8D8', hover: '#7AD3E0', deep: '#7FD6E3', tint: '#173A41', on: 'surface',
    ink: '#E6F0F2', slate: '#BBCBCF', slateDeep: '#CDDBDE', textMuted: '#A2B3B7', hairline: '#3E5358', outline: '#7F9499',
  },
  periwinkle: {
    canvas: '#14162A', surface: '#1D2038', mist: '#272B47', accent: '#9AAAF0', hover: '#B0BDF4', deep: '#AEBBF5', tint: '#2B3260', on: 'surface',
    ink: '#ECEEF8', slate: '#C0C5DC', slateDeep: '#D0D4E6', textMuted: '#A9AEC7', hairline: '#454A6A', outline: '#858AA7',
  },
  slate: {
    canvas: '#15171C', surface: '#1E2128', mist: '#282C35', accent: '#B3BCD6', hover: '#C6CDE1', deep: '#C3CBE2', tint: '#333A4B', on: 'surface',
    ink: '#ECEEF3', slate: '#C3C7D2', slateDeep: '#D3D6DF', textMuted: '#A9AEBB', hairline: '#474C58', outline: '#878C99',
  },
  coral: {
    canvas: '#1D1614', surface: '#281F1C', mist: '#342925', accent: '#F4AE93', hover: '#F7BEA7', deep: 'accentHover', tint: '#48302A', on: 'surface',
    ink: '#F4EAE6', slate: '#D4C6C1', slateDeep: '#E0D5D1', textMuted: '#B9A9A3', hairline: '#574641', outline: '#95857F',
  },
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

// What a dark color theme changes on top of Plum dusk, besides the accent.
const darkVars = (d: Dark) => ({
  ...accentVars(d),
  surface: d.surface,
  onStrong: 'surface',
  slateTint: d.mist,
  ink: d.ink,
  slate: d.slate,
  slateDeep: d.slateDeep,
  muted: d.textMuted,
  hairline: d.hairline,
  outline: d.outline,
});

/** Every palette color as a hex value, for a color theme in light or dark: for what can't read CSS variables, such
 * as the lock-screen artwork drawn in a worker, and for checking contrast. */
export function paletteFor(theme: 'light' | 'dark', accent: Accent): Record<ColorName, string> {
  const over = accent === 'pink' ? {} : theme === 'dark' ? darkVars(DARK[accent]) : accentVars(LIGHT[accent]);
  return resolveColors({ ...colorValues, ...(theme === 'dark' ? darkColors : {}), ...over } as Record<ColorName, string>);
}

const ACCENT_LABELS: Record<Accent, string> = { pink: 'Pink', teal: 'Teal', periwinkle: 'Periwinkle', slate: 'Slate', coral: 'Coral' };

/** The color themes, each with its light accent as a swatch. */
export const ACCENTS: { name: Accent; label: string; swatch: string }[] = (Object.keys(ACCENT_LABELS) as Accent[]).map((name) => ({
  name,
  label: ACCENT_LABELS[name],
  swatch: paletteFor('light', name).accent,
}));

/** Each theme's page color, for the browser's own bars (<meta name="theme-color">). */
export const PAGE_COLORS = Object.fromEntries(
  ACCENTS.map(({ name }) => [name, { light: paletteFor('light', name).canvas, dark: paletteFor('dark', name).canvas }]),
) as Record<Accent, { light: string; dark: string }>;

const block = (selector: string, values: Record<string, string>) =>
  selector + '{' + Object.entries(values).map(([k, v]) => `${cssVarName(k)}:${cssColor(v)}`).join(';') + '}';

// The soft gem gradient (quest and streak panels, empty states) runs accent → periwinkle → teal. In the teal theme
// that starts and ends on teal and reads as flat, so there it runs teal → periwinkle → pink instead.
const TEAL_GEM_TINT =
  'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 16%, transparent) 0%, color-mix(in srgb, var(--color-periwinkle) 16%, transparent) 50%, color-mix(in srgb, var(--color-pink) 16%, transparent) 100%)';

/** Every color theme as CSS, for ColorVariables. Each light block overrides the accent and page tint; each dark
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
