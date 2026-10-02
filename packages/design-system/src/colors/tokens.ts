// The colour palette. Every colour the app uses is named here, grouped by role.
// In styles, write the CSS variable (e.g. `var(--color-pink)`); use the hex value from `colors`
// only where a real hex string is needed (computed alphas, values saved to the database).
// Each hex is written once: a colour that is the same as another names it with `ref` (surface is white, the default
// accent is pink), and its CSS variable points at that one, e.g. `--color-surface: var(--color-white)`.

export const colorGroups = {
  Text: {
    ink: { hex: '#232A45', use: 'Primary text and dark buttons' },
    slate: { hex: '#5C6684', use: 'Secondary text, completed states' },
    slateDeep: { hex: '#4A5268', use: 'Text on the tinted gradient cards and grey badges, where slate would fall short of 4.5:1' },
    muted: { hex: '#6E6881', use: 'Tertiary text, inactive controls (4.5:1 or more on canvas, mist and the accent tint)' },
  },
  'Lines and controls': {
    outline: { hex: '#8A859A', use: 'Empty controls you can still use: unticked boxes, unrated stars (3:1 or more on canvas and white)' },
    hairline: { hex: '#C7C4D0', use: 'Disabled and empty states, switch tracks, rest-day dashes' },
  },
  Surfaces: {
    canvas: { hex: '#FBF1F3', use: 'Page background, input fills' },
    surface: { ref: 'white', use: 'Cards, dialogs, inputs and trays: anything raised off the page, and the rims around what sits on them' },
    mist: { hex: '#F4EFF1', use: 'Quiet chips and tracks' },
    slateTint: { hex: '#EDEFF6', use: 'Rank badge, slate tier' },
    white: { hex: '#FFFFFF', use: 'White that stays white in every theme, such as the rank-up ceremony' },
  },
  // The theme's colour: pink here, and teal, periwinkle, slate or coral in the other colour themes (Profile →
  // Settings → Colour). Buttons, selection, ticks, accent text and tints use these.
  Accent: {
    accent: { ref: 'pink', use: 'Actions, selection, marks, bars and ticks' },
    accentHover: { hex: '#C7286C', use: 'Primary action, hovered' },
    accentDeep: { ref: 'pinkDeep', use: 'Accent text on white and on the accent tint' },
    accentTint: { ref: 'pinkTint', use: 'Selected and active backgrounds' },
  },
  // What goes on a coloured fill, so it can change with the theme.
  'On colour': {
    onAccent: { ref: 'white', use: 'Text and icons on the accent and the gem gradient' },
    onStrong: { ref: 'white', use: 'Text and icons on ink and danger fills, in any colour theme' },
  },
  // The brand's own colours, which stay themselves whatever the theme: pink for the Happy mood and the first rank
  // tier, periwinkle and teal for the planned and upcoming marks and the later tiers, and the sparkles.
  Brand: {
    pink: { hex: '#D63479', use: 'The brand pink: the Happy mood, the first rank tier, the gem. White text on it is 4.5:1' },
    pinkTint: { hex: '#FCE8F1', use: 'Pink rank badge' },
    pinkDeep: { hex: '#B22461', use: 'Pink text on light backgrounds (5.4:1 on pink tint, 6.3:1 on white)' },
    periwinkle: { hex: '#7C8FC9', use: 'Planned sessions, the Sad mood, the second rank tier' },
    periwinkleTint: { hex: '#E9EEF9', use: 'Periwinkle rank badge' },
    periwinkleDeep: { hex: '#4C5E96', use: 'Text on periwinkle tints' },
    teal: { hex: '#5EC4D6', use: 'Upcoming markers, the third rank tier' },
    tealTint: { hex: '#E4F4F7', use: 'Teal rank badge' },
    tealDeep: { hex: '#2A7480', use: 'Text on teal tints (4.75:1 on teal tint)' },
    peach: { hex: '#F0A385', use: 'Sparkles, and a workout icon colour' },
    gold: { hex: '#E0A93A', use: 'Rest-day sparkle' },
    goldLight: { hex: '#F0C060', use: 'Streak sparkle' },
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

/** name -> its value as written: a hex, or the name of the colour it is the same as. */
export const colorValues = Object.fromEntries(entries.map(([name, c]) => [name, c.hex ?? c.ref])) as Record<ColorName, string>;

/** Follows every name to its hex, for a palette whose values may name other colours. */
export const resolveColors = (values: Record<ColorName, string>): Record<ColorName, string> => {
  const hex = (v: string, seen = 0): string => (v.startsWith('#') || seen > 10 ? v : hex(values[v as ColorName], seen + 1));
  return Object.fromEntries(Object.entries(values).map(([name, v]) => [name, hex(v)])) as Record<ColorName, string>;
};

/** name -> hex, for the few places that need a real hex string. */
export const colors = resolveColors(colorValues);

/** "accentHover" -> "--color-accent-hover" */
export const cssVarName = (name: string) => '--color-' + name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

/** A palette value as CSS: a hex as it is, a colour's name as its variable. */
export const cssColor = (value: string) => (value.startsWith('#') ? value : `var(${cssVarName(value)})`);

/** A colour from the palette as its CSS variable, so it follows the theme; any other colour as it is. For colours
 * that arrive as hex, such as a workout's icon colour saved in the database. */
export const themed = (color: string | null | undefined): string | undefined => {
  if (!color) return undefined;
  const hit = (Object.entries(colors) as [string, string][]).find(
    ([name, hex]) => hex.toUpperCase() === color.toUpperCase() && !['surface', 'onAccent', 'onStrong', 'white'].includes(name) && !name.startsWith('accent'),
  );
  return hit ? `var(${cssVarName(hit[0])})` : color;
};

/** name -> "var(--color-…)" */
export const vars = Object.fromEntries(entries.map(([name]) => [name, `var(${cssVarName(name)})`])) as Record<
  ColorName,
  string
>;

const rgba = (hex: string, alpha: number) => {
  const [r, g, b] = [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

/** Composites built from the three accents. Written as CSS variables like the colours, e.g. `var(--gradient-gem)`. */
export const gradients = {
  gem: {
    value: 'linear-gradient(135deg, var(--color-accent) 0%, var(--color-periwinkle) 50%, var(--color-teal) 100%)',
    use: 'The crystal: progress fills, the avatar and the top ranks',
  },
  'gem-tint': {
    value: 'linear-gradient(135deg, color-mix(in srgb, var(--color-accent) 16%, transparent) 0%, color-mix(in srgb, var(--color-periwinkle) 16%, transparent) 50%, color-mix(in srgb, var(--color-teal) 16%, transparent) 100%)',
    use: 'A ceremonial panel: the quest and streak banners. Use it once per screen',
  },
} as const;

/** See-through colours, written as CSS variables like the others, e.g. `var(--color-line)`. Most are a token at a set
 * strength, written with color-mix so they follow the theme; the dark theme overrides the few that aren't. */
const mix = (token: string, pct: number) => `color-mix(in srgb, var(--color-${token}) ${pct}%, transparent)`;
export const translucents = {
  line: { value: rgba(colors.ink, 0.07), use: 'Every divider line: between rows, around cards, under a popover’s header. One strength everywhere.' },
  surfaceRest: { value: mix('white', 50), use: 'A quiet row on the page: rest days, a day gone by' },
  surfaceBar: { value: mix('surface', 94), use: 'The phone tab bar, over the page as it scrolls' },
  onAccentSoft: { value: mix('on-accent', 85), use: 'Secondary text and icons on the accent' },
  onAccentFaint: { value: mix('on-accent', 70), use: 'Marks on the accent, such as a rest-day dash' },
  accentWash: { value: mix('accent-tint', 50), use: 'A see-through accent fill: the dashed "add" button' },
  shadow: { value: rgba(colors.ink, 0.14), use: 'The shadow under something lifted off the page, such as a row being dragged' },
  scrim: { value: rgba(colors.ink, 0.35), use: 'The dimmed page behind a dialog' },
} as const;

/** Every see-through colour and gradient as a CSS custom property name and value. */
export const compositeVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(translucents).map(([k, v]) => [cssVarName(k), v.value])),
  ...Object.fromEntries(Object.entries(gradients).map(([k, v]) => [`--gradient-${k}`, v.value])),
};
