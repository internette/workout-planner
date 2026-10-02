// The type system: two families, a 7-step size scale (nothing under 12 px, the smallest that reads comfortably on a phone), four weights, tracking and leading.
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
  sm: { px: 12, use: 'Micro labels, small print, chart captions, the tab bar' },
  md: { px: 13, use: 'Captions and secondary text, compact buttons' },
  base: { px: 14, use: 'Body text, labels, form fields' },
  lg: { px: 16, use: 'Row and card titles, primary buttons' },
  xl: { px: 20, use: 'Card and dialog headings, stat numbers' },
  '2xl': { px: 22, use: 'Screen titles' },
  '3xl': { px: 32, use: 'The one big number or letter on a screen' },
} as const;

/**
 * Marketing display sizes. They fluidly follow the window width, so they are CSS expressions, not fixed pixels.
 * The app's own scale stops at 32 px, which is a screen-heading scale.
 */
export const displaySizes = {
  display: { css: 'clamp(34px, 5.2vw, 54px)', use: 'A marketing hero headline' },
  'display-sm': { css: 'clamp(26px, 3.2vw, 34px)', use: 'Section headlines on a marketing page' },
} as const;

export const fontWeights = {
  regular: { value: 400, use: 'Body copy' },
  medium: { value: 500, use: 'UI text, inactive controls' },
  semibold: { value: 600, use: 'Buttons and active controls' },
  bold: { value: 700, use: 'Headings, numbers, labels' },
} as const;

export const tracking = {
  base: { value: '0', use: 'Everything, unless it is in small capitals' },
  loose: { value: '.1em', use: 'Uppercase micro labels' },
} as const;

export const leading = {
  tight: { value: 1.2, use: 'Headings and big numbers' },
  base: { value: 1.5, use: 'Everything else (the page default)' },
} as const;

/** Every token as a CSS custom property name and value. */
export const typographyVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(fontFamilies).map(([k, v]) => [`--font-${k}`, v.value])),
  ...Object.fromEntries(Object.entries(fontSizes).map(([k, v]) => [`--text-${k}`, `${v.px}px`])),
  ...Object.fromEntries(Object.entries(displaySizes).map(([k, v]) => [`--text-${k}`, v.css])),
  ...Object.fromEntries(Object.entries(fontWeights).map(([k, v]) => [`--font-weight-${k}`, String(v.value)])),
  ...Object.fromEntries(Object.entries(tracking).map(([k, v]) => [`--tracking-${k}`, v.value])),
  ...Object.fromEntries(Object.entries(leading).map(([k, v]) => [`--leading-${k}`, String(v.value)])),
};
