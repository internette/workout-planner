// The type system: two families, a 12-step size scale, four weights, tracking and leading.
// In styles, write the CSS variable (e.g. `var(--text-md)`, `var(--font-weight-bold)`).

export const fontFamilies = {
  heading: {
    value: "'Space Grotesk', system-ui, sans-serif",
    use: 'Headings, numbers and labels that need presence',
  },
  body: {
    value: "'IBM Plex Sans', system-ui, sans-serif",
    use: 'Everything else, and the page default',
  },
} as const;

export const fontSizes = {
  '2xs': { px: 10, use: 'Micro labels, tab-bar captions' },
  xs: { px: 11, use: 'Eyebrow labels, chart captions' },
  sm: { px: 12, use: 'Captions, helper text' },
  md: { px: 13, use: 'Secondary text, compact buttons' },
  base: { px: 14, use: 'Body text, form fields' },
  lg: { px: 15, use: 'Emphasised body, primary buttons, card titles' },
  xl: { px: 16, use: 'Small headings, list titles' },
  '2xl': { px: 18, use: 'Section headings, stat numbers' },
  '3xl': { px: 20, use: 'Card headings' },
  '4xl': { px: 22, use: 'Screen headings' },
  '5xl': { px: 26, use: 'Display numbers' },
  '6xl': { px: 32, use: 'Hero numbers' },
} as const;

export const fontWeights = {
  regular: { value: 400, use: 'Body copy' },
  medium: { value: 500, use: 'UI text, inactive controls' },
  semibold: { value: 600, use: 'Buttons and active controls' },
  bold: { value: 700, use: 'Headings, numbers, labels' },
} as const;

export const tracking = {
  tight: { value: '-.02em', use: 'Large headings' },
  snug: { value: '-.01em', use: 'Card titles' },
  loose: { value: '.02em', use: 'Small badges' },
  wide: { value: '.1em', use: 'Uppercase eyebrow labels' },
} as const;

export const leading = {
  none: { value: 1, use: 'Single-line icons and stars' },
  snug: { value: 1.5, use: 'Compact paragraphs' },
  relaxed: { value: 1.6, use: 'Body paragraphs' },
} as const;

/** Every token as a CSS custom property name and value. */
export const typographyVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(fontFamilies).map(([k, v]) => [`--font-${k}`, v.value])),
  ...Object.fromEntries(Object.entries(fontSizes).map(([k, v]) => [`--text-${k}`, `${v.px}px`])),
  ...Object.fromEntries(Object.entries(fontWeights).map(([k, v]) => [`--font-weight-${k}`, String(v.value)])),
  ...Object.fromEntries(Object.entries(tracking).map(([k, v]) => [`--tracking-${k}`, v.value])),
  ...Object.fromEntries(Object.entries(leading).map(([k, v]) => [`--leading-${k}`, String(v.value)])),
};
