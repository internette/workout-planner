// How controls answer a pointer and a keyboard. Hover washes are a tint laid over the control's own background; the
// focus ring is one style for every control. Write `background: var(--hover-neutral)` and `outline: var(--focus-ring)`.
import { toVariables, type Token } from '../tokenVariables';

export const hovers = {
  neutral: { value: 'rgba(35, 42, 69, 0.05)', use: 'A ghost button in the neutral tone' },
  icon: { value: 'rgba(35, 42, 69, 0.06)', use: 'An icon button, and a focused button' },
  danger: { value: 'rgba(178, 58, 76, 0.09)', use: 'A danger icon button' },
  dangerGhost: { value: 'rgba(178, 58, 76, 0.08)', use: 'A ghost button in the danger tone' },
  inverse: { value: 'rgba(255, 255, 255, 0.22)', use: 'An icon button on a dark or coloured surface' },
} as const satisfies Record<string, Token>;

export const focus = {
  ring: { value: '2px solid var(--color-pink)', use: 'Around whatever has keyboard focus' },
  offset: { value: '2px', use: 'The gap between a control and its ring' },
} as const satisfies Record<string, Token>;

export const interactionVariables: Record<string, string> = {
  ...toVariables('hover', hovers),
  ...toVariables('focus', focus),
};
