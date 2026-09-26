// The shadows the interface casts. Nothing else in the app should cast a shadow of its own.
// In styles, write the CSS variable, e.g. `box-shadow: var(--elevation-raised)`.

export const elevations = {
  hairline: { value: '0 1px 3px rgba(35, 42, 69, 0.06)', use: 'Info chips and quiet trays' },
  raised: { value: '0 4px 14px rgba(35, 42, 69, 0.07)', use: 'A card sitting on the page' },
  overlay: { value: '0 8px 24px rgba(35, 42, 69, 0.14)', use: 'Dialogs, menus and popovers; also a card on hover' },
} as const;

/** The pink glow on a primary button. Reserved for one call to action on an otherwise empty surface. */
export const glow = {
  primary: { value: '0 8px 20px rgba(213, 49, 129, 0.4)', use: 'One primary call to action on an empty surface' },
} as const;

/** The dark theme's shadows: black and stronger, since a soft ink shadow doesn't show on a dark page. */
export const darkElevations: Record<string, string> = {
  '--elevation-hairline': '0 1px 3px rgba(0, 0, 0, 0.35)',
  '--elevation-raised': '0 4px 14px rgba(0, 0, 0, 0.35)',
  '--elevation-overlay': '0 8px 24px rgba(0, 0, 0, 0.5)',
  '--glow-primary': '0 8px 20px rgba(240, 111, 166, 0.35)',
};

export type ElevationName = keyof typeof elevations;

/** Every token as a CSS custom property name and value. */
export const elevationVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(elevations).map(([k, v]) => [`--elevation-${k}`, v.value])),
  ...Object.fromEntries(Object.entries(glow).map(([k, v]) => [`--glow-${k}`, v.value])),
};
