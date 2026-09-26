// The colour themes: the same app in teal, periwinkle, slate or coral instead of pink, each with a light and a dark
// version. Chosen in Profile → Settings → Colour, and applied as <html data-accent="teal"> (with data-theme="dark" for
// the dark version). Pink needs nothing here: it's the default light palette and Plum dusk.
//
// Light: the accent is the palette colour itself. Teal, periwinkle and coral are light, so text on them is dark (ink,
// and a deeper navy on periwinkle, 4.5:1 or more, hovered too); slate keeps white text. Accent text uses each colour's deep shade (5:1 or more on white and tint).
// Dark: the page and cards lean toward the colour, the accent is brightened, and text on it is the card colour.
import { cssVarName } from './tokens';

export type Accent = 'pink' | 'teal' | 'periwinkle' | 'slate' | 'coral';
export const ACCENTS: { name: Accent; label: string; swatch: string }[] = [
  { name: 'pink', label: 'Pink', swatch: '#D53181' },
  { name: 'teal', label: 'Teal', swatch: '#5EC4D6' },
  { name: 'periwinkle', label: 'Periwinkle', swatch: '#7C8FC9' },
  { name: 'slate', label: 'Slate', swatch: '#5C6684' },
  { name: 'coral', label: 'Coral', swatch: '#F0A385' },
];

const alpha = (hex: string, a: number) => {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${n >> 16}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
};

type Light = { accent: string; hover: string; deep: string; tint: string; muted: string; on: string; canvas: string; mist: string };
type Dark = Light & {
  surface: string;
  ink: string;
  slate: string;
  slateDeep: string;
  textMuted: string;
  subtle: string;
  hairline: string;
  outline: string;
  divider: string;
};

const LIGHT: Record<Exclude<Accent, 'pink'>, Light> = {
  teal: { accent: '#5EC4D6', hover: '#4DB6C9', deep: '#276B76', tint: '#E4F4F7', muted: '#B6E3EB', on: '#232A45', canvas: '#F1F9FA', mist: '#EAF2F4' },
  periwinkle: { accent: '#7C8FC9', hover: '#6E82BF', deep: '#4C5E96', tint: '#E9EEF9', muted: '#C9D2EC', on: '#161B2E', canvas: '#F4F5FB', mist: '#EDEFF7' },
  slate: { accent: '#5C6684', hover: '#505A77', deep: '#4A5268', tint: '#EDEFF6', muted: '#C8CCD9', on: '#FFFFFF', canvas: '#F5F5F8', mist: '#EEEFF3' },
  coral: { accent: '#F0A385', hover: '#EB9373', deep: '#A4502C', tint: '#FDEDE6', muted: '#F6CDBD', on: '#232A45', canvas: '#FDF5F1', mist: '#F6EEEA' },
};

const DARK: Record<Exclude<Accent, 'pink'>, Dark> = {
  teal: {
    canvas: '#10191C', surface: '#192629', mist: '#22343A', accent: '#5CC8D8', hover: '#7AD3E0', deep: '#7FD6E3', tint: '#173A41', muted: '#2A5760', on: '#192629',
    ink: '#E6F0F2', slate: '#BBCBCF', slateDeep: '#CDDBDE', textMuted: '#A2B3B7', subtle: '#9DAEB2', hairline: '#3E5358', outline: '#7F9499', divider: '#2F4449',
  },
  periwinkle: {
    canvas: '#14162A', surface: '#1D2038', mist: '#272B47', accent: '#9AAAF0', hover: '#B0BDF4', deep: '#AEBBF5', tint: '#2B3260', muted: '#3E4677', on: '#1D2038',
    ink: '#ECEEF8', slate: '#C0C5DC', slateDeep: '#D0D4E6', textMuted: '#A9AEC7', subtle: '#A3A8C2', hairline: '#454A6A', outline: '#858AA7', divider: '#363B5A',
  },
  slate: {
    canvas: '#15171C', surface: '#1E2128', mist: '#282C35', accent: '#B3BCD6', hover: '#C6CDE1', deep: '#C3CBE2', tint: '#333A4B', muted: '#4A5266', on: '#1E2128',
    ink: '#ECEEF3', slate: '#C3C7D2', slateDeep: '#D3D6DF', textMuted: '#A9AEBB', subtle: '#A4A9B6', hairline: '#474C58', outline: '#878C99', divider: '#383C47',
  },
  coral: {
    canvas: '#1D1614', surface: '#281F1C', mist: '#342925', accent: '#F4AE93', hover: '#F7BEA7', deep: '#F7BEA7', tint: '#48302A', muted: '#6A443A', on: '#281F1C',
    ink: '#F4EAE6', slate: '#D4C6C1', slateDeep: '#E0D5D1', textMuted: '#B9A9A3', subtle: '#B3A39D', hairline: '#574641', outline: '#95857F', divider: '#443632',
  },
};

const accentVars = (t: Light) => ({
  accent: t.accent,
  accentHover: t.hover,
  accentDeep: t.deep,
  accentTint: t.tint,
  accentMuted: t.muted,
  onAccent: t.on,
  onAccentSoft: alpha(t.on, 0.85),
  onAccentMuted: alpha(t.on, 0.8),
  onAccentFaint: alpha(t.on, 0.7),
  canvas: t.canvas,
  mist: t.mist,
});

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
      block(`html[data-accent="${name}"]`, { ...accentVars(l), accentWash: alpha(l.tint, 0.5) }) +
      block(`html[data-accent="${name}"][data-theme="dark"]`, {
        ...accentVars(d),
        surface: d.surface,
        onStrong: d.surface,
        cloud: d.mist,
        slateTint: d.mist,
        ink: d.ink,
        slate: d.slate,
        slateDeep: d.slateDeep,
        muted: d.textMuted,
        subtle: d.subtle,
        hairline: d.hairline,
        outline: d.outline,
        divider: d.divider,
        surfaceBar: alpha(d.surface, 0.94),
        accentWash: alpha(d.tint, 0.6),
      })
    );
  })
  .join('') + `html[data-accent="teal"]{--gradient-gem-tint:${TEAL_GEM_TINT}}`;
