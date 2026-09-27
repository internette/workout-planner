import type { MouseEvent } from 'react';

/**
 * Whether a press on a modal <dialog> landed on the dimmed area around it. The backdrop is not an element of its own:
 * a press on it is a press on the dialog element, at a point outside the box the dialog draws. A press on the dialog's
 * own padding also targets the element, so the point has to be checked, not only the target.
 */
export function pressedOutside(e: MouseEvent<HTMLDialogElement>): boolean {
  if (e.target !== e.currentTarget) return false;
  const r = e.currentTarget.getBoundingClientRect();
  return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
}
