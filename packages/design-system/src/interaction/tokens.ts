// How controls answer a pointer and a keyboard. Hover washes are a tint laid over the control's own background; the
// focus ring is one style for every control. Write `background: var(--hover-neutral)` and `outline: var(--focus-ring)`.
import { toVariables, type Token } from '../tokenVariables';

export const hovers = {
  neutral: { value: 'color-mix(in srgb, var(--color-ink) 5%, transparent)', use: 'A ghost button in the neutral tone' },
  icon: { value: 'color-mix(in srgb, var(--color-ink) 6%, transparent)', use: 'An icon button, and a focused button' },
  dangerGhost: { value: 'color-mix(in srgb, var(--color-danger) 8%, transparent)', use: 'A ghost button in the danger tone' },
} as const satisfies Record<string, Token>;

export const focus = {
  ring: { value: '2px solid var(--color-pink)', use: 'Around whatever has keyboard focus' },
  offset: { value: '2px', use: 'The gap between a control and its ring' },
} as const satisfies Record<string, Token>;

/** The dark theme's hover washes: light over dark surfaces. */
export const darkInteraction: Record<string, string> = {
  '--hover-neutral': 'color-mix(in srgb, white 6%, transparent)',
  '--hover-icon': 'color-mix(in srgb, white 8%, transparent)',
  '--hover-danger-ghost': 'color-mix(in srgb, var(--color-danger) 12%, transparent)',
};

export const interactionVariables: Record<string, string> = {
  ...toVariables('hover', hovers),
  ...toVariables('focus', focus),
};
