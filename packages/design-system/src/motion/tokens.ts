// How long things take, and how they ease. Write `transition: background-color var(--dur-state) var(--ease-standard)`.
// The keyframes (twinkle, pop, draw) are in planner.css; prefers-reduced-motion switches all of it off there.

export const durations = {
  state: { value: '0.15s', use: 'Background, colour and shadow changes on controls: hover, press, select' },
  bar: { value: '0.35s', use: 'Progress and rank bars filling' },
} as const;

export const easings = {
  standard: { value: 'ease', use: 'The default, for state changes' },
  soft: { value: 'ease-in-out', use: 'Movement that starts and ends at rest' },
} as const;

export const motionVariables: Record<string, string> = {
  ...Object.fromEntries(Object.entries(durations).map(([k, v]) => [`--dur-${k}`, v.value])),
  ...Object.fromEntries(Object.entries(easings).map(([k, v]) => [`--ease-${k}`, v.value])),
};
