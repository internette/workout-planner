import type { CSSProperties } from 'react';
import { vars } from '@moonshot/design-system/colors';
import { Sparkle } from '@moonshot/design-system/icons';

// Three sparkles in the brand's periwinkle, teal and peach, each twinkling at its own pace so they never pulse
// together. Where they sit: two near the top corners, one low on the left.
const TRIO: { at: CSSProperties; size: number; color: string; glow: number; secs: number }[] = [
  { at: { left: '12%', top: '24px' }, size: 12, color: vars.periwinkle, glow: 0.5, secs: 3.4 },
  { at: { right: '14%', top: '40px' }, size: 10, color: vars.teal, glow: 0.55, secs: 4.6 },
  { at: { left: '22%', bottom: '24px' }, size: 10, color: vars.peach, glow: 0.55, secs: 6 },
];

/** The sparkles behind a moment worth marking: a week sealed, a workout saved. Put it in a `position: relative`
 * container with `overflow: hidden`. Decorative only. */
export function Twinkles() {
  return (
    <>
      {TRIO.map((t) => (
        <span
          key={t.secs}
          aria-hidden="true"
          style={{ position: 'absolute', ...t.at, animation: `twinkle ${t.secs}s ease-in-out infinite` }}
        >
          <Sparkle size={t.size} color={t.color} glow={t.glow} />
        </span>
      ))}
    </>
  );
}
