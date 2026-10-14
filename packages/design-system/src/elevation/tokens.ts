// The shadows the interface casts. Nothing else in the app should cast a shadow of its own.
// In styles, write the CSS variable, e.g. `box-shadow: var(--elevation-raised)`.

export const elevations = {
  hairline: { value: '0 1px 3px color-mix(in srgb, var(--color-ink) var(--alpha-1), transparent)', use: 'Info chips and quiet trays' },
  raised: { value: '0 4px 14px color-mix(in srgb, var(--color-ink) var(--alpha-1), transparent)', use: 'A card sitting on the page' },
  overlay: { value: '0 8px 24px color-mix(in srgb, var(--color-ink) var(--alpha-2), transparent)', use: 'Dialogs, menus and popovers; also a card on hover' },
} as const;

/** Rings: a line drawn inside an edge (an inset shadow, so nothing moves). Write `box-shadow: var(--ring-outline)`. */
export const rings = {
  outline: { value: 'inset 0 0 0 1.5px var(--color-outline)', use: 'An empty control you can still use: an unticked box, an unfilled pip' },
  accent: { value: 'inset 0 0 0 2px var(--color-pink)', use: 'The selected one of a set of cards or tiles' },
  accentSoft: { value: 'inset 0 0 0 1.5px color-mix(in srgb, var(--color-pink) var(--alpha-4), transparent)', use: 'Today on the calendar, when it isn’t the selected day' },
  danger: { value: 'inset 0 0 0 1.5px color-mix(in srgb, var(--color-danger) var(--alpha-4), transparent)', use: 'A card of destructive settings' },
} as const;

/** The accent's glow on a primary button. Reserved for one call to action on an otherwise empty surface. */
export const glow = {
  primary: { value: '0 8px 20px color-mix(in srgb, var(--color-pink) var(--alpha-4), transparent)', use: 'One primary call to action on an empty surface' },
} as const;

export type ElevationName = keyof typeof elevations;

/** Every token as a CSS custom property name and value. */
export const elevationVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(elevations).map(([k, v]) => [`--elevation-${k}`, v.value])),
  ...Object.fromEntries(Object.entries(glow).map(([k, v]) => [`--glow-${k}`, v.value])),
  ...Object.fromEntries(Object.entries(rings).map(([k, v]) => [`--ring-${k.replace(/[A-Z]/g, (c) => '-' + c.toLowerCase())}`, v.value])),
};
