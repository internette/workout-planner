// The colour palette. Every colour the app uses is named here, grouped by role.
// In styles, write the CSS variable (e.g. `var(--color-pink)`); use the hex value from `colors`
// only where a real hex string is needed (computed alphas, values saved to the database).

export const colorGroups = {
  Text: {
    ink: { hex: '#232A45', use: 'Primary text and dark buttons' },
    slate: { hex: '#5C6684', use: 'Secondary text, completed states' },
    slateDeep: { hex: '#4A5268', use: 'Text on slate tints' },
    muted: { hex: '#6E6881', use: 'Tertiary text, inactive controls (4.5:1 or more on canvas, mist and pink tint)' },
    subtle: { hex: '#756B85', use: 'Inactive navigation icons, eyebrow labels (4.5:1 or more on white and canvas)' },
    hairline: { hex: '#C7C4D0', use: 'Disabled and empty states, switch track' },
    outline: { hex: '#8A859A', use: 'Empty controls you can still use: unticked boxes, unrated stars (3:1 or more on canvas and white)' },
    divider: { hex: '#DAD7E0', use: 'Rest-day dashes' },
  },
  // Roles rather than colours: what a colour is for, so a theme can change it without touching the screens.
  Roles: {
    surface: { hex: '#FFFFFF', use: 'Cards, dialogs, inputs and trays: anything raised off the page, and the rims around what sits on them' },
    onAccent: { hex: '#FFFFFF', use: 'Text and icons on pink, danger, ink and the gem gradient' },
  },
  Surfaces: {
    white: { hex: '#FFFFFF', use: 'Cards and dialogs' },
    canvas: { hex: '#FBF1F3', use: 'Page background, input fills' },
    mist: { hex: '#F4EFF1', use: 'Quiet chips and tracks' },
    cloud: { hex: '#EAECF3', use: 'Completed-state badge' },
    slateTint: { hex: '#EDEFF6', use: 'Rank badge, slate tier' },
  },
  Pink: {
    // One pink, in steps of lightness on the same hue and saturation: pink, then hover one step darker, then deep.
    pink: { hex: '#D53181', use: 'The primary pink: actions, selection, marks, bars, ticks and gems. White text on it is 4.5:1' },
    pinkHover: { hex: '#C42773', use: 'Primary action, hovered (one step darker than pink)' },
    pinkDeep: { hex: '#AF2367', use: 'Pink text on light backgrounds (two steps darker; 5.5:1 on pink tint, 6.4:1 on white)' },
    pinkTint: { hex: '#FCE8F2', use: 'Selected and active backgrounds' },
    pinkMuted: { hex: '#E8BFD3', use: 'Disabled primary action' },
  },
  Periwinkle: {
    periwinkle: { hex: '#7C8FC9', use: 'Secondary accent, planned sessions' },
    periwinkleTint: { hex: '#E9EEF9', use: 'Periwinkle rank badge' },
    periwinkleDeep: { hex: '#4C5E96', use: 'Text on periwinkle tints' },
  },
  Teal: {
    teal: { hex: '#5EC4D6', use: 'Tertiary accent, upcoming markers' },
    tealTint: { hex: '#E4F4F7', use: 'Teal rank badge' },
    tealDeep: { hex: '#2F7F8C', use: 'Text on teal tints' },
  },
  Highlights: {
    coral: { hex: '#F0A385', use: 'Sparkles, fifth workout colour' },
    gold: { hex: '#E0A93A', use: 'Rest-day sparkle' },
    goldLight: { hex: '#F0C060', use: 'Streak sparkle' },
  },
  Danger: {
    danger: { hex: '#B23A4C', use: 'Destructive actions, "mad" mood' },
    dangerHover: { hex: '#9C3243', use: 'Destructive action, hovered' },
    dangerTint: { hex: '#FBE9EC', use: 'Error banner background' },
  },
} as const;

type Groups = typeof colorGroups;
export type ColorName = { [G in keyof Groups]: keyof Groups[G] }[keyof Groups] & string;

const entries = Object.values(colorGroups).flatMap((g) => Object.entries(g)) as [ColorName, { hex: string }][];

/** name -> hex, for the few places that need a real hex string. */
export const colors = Object.fromEntries(entries.map(([name, c]) => [name, c.hex])) as Record<ColorName, string>;

/** "pinkHover" -> "--color-pink-hover" */
export const cssVarName = (name: string) => '--color-' + name.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase());

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
    value: 'linear-gradient(135deg, var(--color-pink) 0%, var(--color-periwinkle) 50%, var(--color-teal) 100%)',
    use: 'The crystal: progress fills, the avatar and the top ranks',
  },
  'gem-tint': {
    value: `linear-gradient(135deg, ${rgba(colors.pink, 0.16)} 0%, ${rgba(colors.periwinkle, 0.16)} 50%, ${rgba(colors.teal, 0.16)} 100%)`,
    use: 'A ceremonial panel: the quest and streak banners. Use it once per screen',
  },
} as const;

/** See-through colours, written as CSS variables like the others, e.g. `var(--color-line)`. */
export const translucents = {
  line: { value: rgba(colors.ink, 0.07), use: 'Lines between rows and around cards' },
  lineFaint: { value: rgba(colors.ink, 0.055), use: 'Lines between the rows of a dense list' },
  lineStrong: { value: rgba(colors.ink, 0.09), use: 'Lines under a popover’s header' },
  surfaceRest: { value: rgba('#FFFFFF', 0.5), use: 'A quiet row on the page: rest days, a day gone by' },
  surfaceBar: { value: rgba('#FFFFFF', 0.94), use: 'The phone tab bar, over the page as it scrolls' },
  onAccentSoft: { value: rgba('#FFFFFF', 0.85), use: 'Secondary text and icons on pink' },
  onAccentMuted: { value: rgba('#FFFFFF', 0.8), use: 'Small labels on pink' },
  onAccentFaint: { value: rgba('#FFFFFF', 0.6), use: 'Marks on pink, such as a rest-day dash' },
  accentWash: { value: 'rgba(252, 231, 239, 0.5)', use: 'A see-through pink fill: the dashed "add" button' },
} as const;

export const overlays = {
  scrim: { value: rgba(colors.ink, 0.35), use: 'The dimmed page behind a dialog' },
} as const;

/** Every gradient and overlay as a CSS custom property name and value. */
export const compositeVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(translucents).map(([k, v]) => [cssVarName(k), v.value])),
  ...Object.fromEntries(Object.entries(gradients).map(([k, v]) => [`--gradient-${k}`, v.value])),
  ...Object.fromEntries(Object.entries(overlays).map(([k, v]) => [`--${k}`, v.value])),
};
