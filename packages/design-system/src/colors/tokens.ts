// The color palette. Every color the app uses is named here, grouped by role.
// In styles, write the CSS variable (e.g. `var(--color-pink)`); use the hex value from `colors`
// only where a real hex string is needed (computed alphas, values saved to the database).
// Each hex is written once. What must stay white in every theme (the rank-up ceremony) writes CSS's own `white`.

import { toVariables, type Token } from '../tokens/variables';

export const colorGroups = {
  Text: {
    ink: { hex: '#232A45', use: 'Primary text and dark buttons' },
    slate: { hex: '#5C6684', use: 'Secondary text, completed states, and text on tinted cards and grey badges (4.5:1 or more on every tint)' },
    muted: { hex: '#6E6881', use: 'Tertiary text, inactive controls (4.5:1 or more on canvas, mist and the pink tint)' },
  },
  'Lines and controls': {
    outline: { hex: '#8A859A', use: 'Empty controls you can still use (unticked boxes, unrated stars), a sheet’s handle, a rest day’s dash: 3:1 or more on canvas and white' },
  },
  Surfaces: {
    canvas: { hex: '#FBF1F3', use: 'Page background, input fills' },
    surface: { hex: '#FFFFFF', use: 'Cards, dialogs, inputs and trays: anything raised off the page, and the rims around what sits on them. Also text and icons on a strong fill: pink, ink, danger and the gem gradient' },
    mist: { hex: '#F4EFF1', use: 'Quiet chips and tracks' },
    slateTint: { hex: '#EDEFF6', use: 'Rank badge, slate tier' },
  },
  // The theme's color: pink by default, and teal, periwinkle, slate or coral in the other color themes (Profile →
  // Settings → Color), so everything in pink follows the theme: buttons, selection, ticks, the Happy mood, the first
  // rank tiers, the gem. Text and icons on it are surface, as on any strong fill.
  'Theme color': {
    pink: { hex: '#D63479', use: 'Actions, selection, marks, bars and ticks; the Happy mood, the first rank tiers, the gem. White text on it is 4.5:1' },
    accentHover: { hex: '#C7286C', use: 'Primary action, hovered' },
    pinkDeep: { hex: '#B22461', use: 'Pink text on white and on the pink tint (5.4:1 on pink tint, 6.3:1 on white)' },
    pinkTint: { hex: '#FCE8F1', use: 'Selected and active backgrounds, the pink rank badge' },
  },
  // Colors that stay themselves whatever the theme: periwinkle and teal for the planned and upcoming marks and the
  // later rank tiers, and the sparkles; peach and gold for the sparkles and the rank tiers after teal.
  Brand: {
    periwinkle: { hex: '#7C8FC9', use: 'Planned sessions, the Sad mood, the second rank tier' },
    periwinkleTint: { hex: '#E9EEF9', use: 'Periwinkle rank badge' },
    periwinkleDeep: { hex: '#4C5E96', use: 'Text on periwinkle tints' },
    teal: { hex: '#5EC4D6', use: 'Upcoming markers, the third rank tier' },
    tealTint: { hex: '#E4F4F7', use: 'Teal rank badge' },
    tealDeep: { hex: '#2A7480', use: 'Text on teal tints (4.75:1 on teal tint)' },
    peach: { hex: '#F0A385', use: 'Sparkles, a workout icon color, and the fourth rank tier' },
    peachTint: { hex: '#FDEEE8', use: 'Peach rank badge' },
    peachDeep: { hex: '#9A4A2C', use: 'Text on peach tints (5.4:1 on peach tint)' },
    gold: { hex: '#E0A93A', use: 'Sparkles: the rest-day moon and the profile picture; the fifth rank tier' },
    goldTint: { hex: '#FBF3E0', use: 'Gold rank badge' },
    goldDeep: { hex: '#7D5A12', use: 'Text on gold tints (5.6:1 on gold tint)' },
  },
  Status: {
    danger: { hex: '#B23A4C', use: 'Destructive actions, errors, the Mad mood' },
    dangerHover: { hex: '#9C3243', use: 'Destructive action, hovered' },
    dangerTint: { hex: '#FBE9EC', use: 'Error banner background' },
  },
} as const;

type Groups = typeof colorGroups;
export type ColorName = { [G in keyof Groups]: keyof Groups[G] }[keyof Groups] & string;

const entries = Object.values(colorGroups).flatMap((g) => Object.entries(g)) as [ColorName, { hex?: string; ref?: ColorName }][];

/** name -> its value as written: a hex, or the name of the color it is the same as. */
export const colorValues = Object.fromEntries(entries.map(([name, c]) => [name, c.hex ?? c.ref])) as Record<ColorName, string>;

/** Follows every name to its hex, for a palette whose values may name other colors. */
export const resolveColors = (values: Record<ColorName, string>): Record<ColorName, string> => {
  const hex = (v: string, seen = 0): string => (v.startsWith('#') || seen > 10 ? v : hex(values[v as ColorName], seen + 1));
  return Object.fromEntries(Object.entries(values).map(([name, v]) => [name, hex(v)])) as Record<ColorName, string>;
};

/** name -> hex, for the few places that need a real hex string. */
export const colors = resolveColors(colorValues);

/** "accentHover" -> "--color-accent-hover" */
export const cssVarName = (name: string) => '--color-' + name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

/** A palette value as CSS: a hex as it is, a color's name as its variable. */
export const cssColor = (value: string) => (value.startsWith('#') ? value : `var(${cssVarName(value)})`);

/** A color from the palette as its CSS variable, so it follows the theme; any other color as it is. For colors
 * that arrive as hex, such as a workout's icon color saved in the database. */
export const themed = (color: string | null | undefined): string | undefined => {
  if (!color) return undefined;
  const hit = (Object.entries(colors) as [string, string][]).find(
    ([name, hex]) => hex.toUpperCase() === color.toUpperCase() && !['surface', 'accentHover'].includes(name),
  );
  return hit ? `var(${cssVarName(hit[0])})` : color;
};

/** name -> "var(--color-…)" */
export const vars = Object.fromEntries(entries.map(([name]) => [name, `var(${cssVarName(name)})`])) as Record<
  ColorName,
  string
>;

/** Composites built from the three accents. Written as CSS variables like the colors, e.g. `var(--gradient-gem)`. */
export const gradients = {
  gem: {
    value: 'linear-gradient(135deg, var(--color-pink) 0%, var(--color-periwinkle) 50%, var(--color-teal) 100%)',
    use: 'The crystal: progress fills, the avatar and the top ranks',
  },
  'gem-tint': {
    value: 'linear-gradient(135deg, color-mix(in srgb, var(--color-pink) var(--alpha-2), transparent) 0%, color-mix(in srgb, var(--color-periwinkle) var(--alpha-2), transparent) 50%, color-mix(in srgb, var(--color-teal) var(--alpha-2), transparent) 100%)',
    use: 'A ceremonial panel: the quest and streak banners. Use it once per screen',
  },
} as const;

/** How see-through a color is: seven rungs, as percentages, e.g. `var(--alpha-3)`. Nothing in between: a strength
 * takes its nearest rung. They go into color-mix (`translucent` writes that) and into `opacity`. */
export const alpha = {
  '1': { value: '6%', use: 'A line, a hover wash, the faintest shadow' },
  '2': { value: '15%', use: 'A tint laid over something: the gem tint, a missed day' },
  '3': { value: '25%', use: 'A dashed outline, the faintest block, the edge of a glow' },
  '4': { value: '40%', use: 'A ring, a scrim, a sparkle’s glow, what has stepped back' },
  '5': { value: '55%', use: 'A half-strength fill, a dimmed page, what is disabled' },
  '6': { value: '70%', use: 'Text on a ceremony’s night sky, a strong glow' },
  '7': { value: '85%', use: 'Nearly solid: the tab bar over the page' },
} as const satisfies Record<string, Token>;
export type AlphaStep = 1 | 2 | 3 | 4 | 5 | 6 | 7;

/** A color at a rung of the ladder: `translucent('ink', 3)` is the ink at 25%, over whatever is behind it, or over
 * `into` (a color) where one is given. Works for a palette name, `white` or `black`. */
export const translucent = (color: ColorName | 'white' | 'black', step: AlphaStep, into = 'transparent') =>
  `color-mix(in srgb, ${color === 'white' || color === 'black' ? color : `var(${cssVarName(color)})`} var(--alpha-${step}), ${into})`;

/** See-through colors, written as CSS variables like the others, e.g. `var(--color-line)`. Each is a token at a rung
 * of the ladder, written with color-mix so it follows the theme; the dark theme overrides the few that don't (tokens/dark). */
export const translucents = {
  line: { value: translucent('ink', 1), use: 'Every divider line: between rows, around cards, under a popover’s header. One strength everywhere.' },
  surfaceRest: { value: translucent('surface', 5), use: 'A quiet row on the page: rest days, a day gone by' },
  surfaceBar: { value: translucent('surface', 7), use: 'The phone tab bar, over the page as it scrolls' },
  accentWash: { value: translucent('pinkTint', 5), use: 'A see-through accent fill: the dashed "add" button' },
  shadow: { value: translucent('ink', 2), use: 'The shadow under something lifted off the page, such as a row being dragged' },
  scrim: { value: translucent('ink', 4), use: 'The dimmed page behind a dialog' },
  dayRest: { value: translucent('ink', 1), use: 'A day with nothing on it in a week strip (WeekStrip), on a card or the page' },
  blockFaint: { value: translucent('pink', 3), use: 'The first block of a program in a block bar (BlockBar); the last is the theme color itself' },
  blockHalf: { value: translucent('pink', 5), use: 'A middle block of a program in a block bar (BlockBar), and the outline round every block, so the faintest still shows on the page' },
} as const;

/** Every see-through color and gradient as a CSS custom property name and value. */
export const compositeVariables: Record<string, string> = {
  ...toVariables('alpha', alpha),
  ...Object.fromEntries(Object.entries(translucents).map(([k, v]) => [cssVarName(k), v.value])),
  ...Object.fromEntries(Object.entries(gradients).map(([k, v]) => [`--gradient-${k}`, v.value])),
};
