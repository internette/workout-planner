// The colour palette. Every colour the app uses is named here, grouped by role.
// In styles, write the CSS variable (e.g. `var(--color-pink)`); use the hex value from `colors`
// only where a real hex string is needed (computed alphas, values saved to the database).

export const colorGroups = {
  Text: {
    ink: { hex: '#232A45', use: 'Primary text and dark buttons' },
    slate: { hex: '#5C6684', use: 'Secondary text, completed states' },
    slateDeep: { hex: '#4A5268', use: 'Text on slate tints' },
    muted: { hex: '#746E88', use: 'Tertiary text, inactive controls' },
    subtle: { hex: '#A9A2B4', use: 'Inactive navigation icons, eyebrow labels' },
    hairline: { hex: '#C7C4D0', use: 'Disabled and empty states, switch track' },
    divider: { hex: '#DAD7E0', use: 'Rest-day dashes' },
  },
  Surfaces: {
    white: { hex: '#FFFFFF', use: 'Cards and dialogs' },
    canvas: { hex: '#FBF1F3', use: 'Page background, input fills' },
    mist: { hex: '#F4EFF1', use: 'Quiet chips and tracks' },
    cloud: { hex: '#EAECF3', use: 'Completed-state badge' },
    slateTint: { hex: '#EDEFF6', use: 'Rank badge, slate tier' },
  },
  Pink: {
    pink: { hex: '#E1699C', use: 'Brand accent, primary actions' },
    pinkHover: { hex: '#CF5A8C', use: 'Primary action, hovered' },
    pinkDeep: { hex: '#C4548A', use: 'Accent text on light backgrounds' },
    pinkPlum: { hex: '#8F4F78', use: 'Pending streak caption' },
    pinkTint: { hex: '#FCE8F1', use: 'Selected and active backgrounds' },
    pinkMuted: { hex: '#E8BFD2', use: 'Disabled primary action' },
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

export const overlays = {
  scrim: { value: rgba(colors.ink, 0.35), use: 'The dimmed page behind a dialog' },
} as const;

/** Every gradient and overlay as a CSS custom property name and value. */
export const compositeVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(gradients).map(([k, v]) => [`--gradient-${k}`, v.value])),
  ...Object.fromEntries(Object.entries(overlays).map(([k, v]) => [`--${k}`, v.value])),
};
