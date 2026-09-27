import type { CSSProperties } from 'react';
import { vars } from '../colors';
import { Sparkle } from './Sparkle';

// A trail of stars that tapers off and wanders up and down: rose, periwinkle, cyan, repeating. Each one twinkles on its
// own slower clock, so the trail never pulses in step. The twinkle keyframes are in planner.css.
const COLORS = [vars.pink, vars.periwinkle, vars.teal];
const WANDER = [-9, 3, -4, 7, -7, 1, -2, 5, -5]; // px
const SIZE = [11, 8, 9, 6, 7, 5, 6, 4, 3]; // px

export interface SparkleTrailProps {
  /** How many stars, up to 9. */
  count?: number;
  /** Twinkle. Turn it off for a still trail. */
  animate?: boolean;
  className?: string;
  style?: CSSProperties;
}

export function SparkleTrail({ count = 7, animate = true, className, style }: SparkleTrailProps) {
  return (
    <span
      aria-hidden="true"
      className={className}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', flex: 'none', pointerEvents: 'none', ...style }}
    >
      {Array.from({ length: Math.min(count, SIZE.length) }, (_, i) => (
        <span key={i} style={{ display: 'flex', flex: 'none', transform: `translateY(${WANDER[i]}px)` }}>
          <Sparkle
            size={SIZE[i]}
            color={COLORS[i % COLORS.length]}
            style={{
              flex: 'none',
              ...(animate ? { animation: `twinkle ${3.4 + i * 0.4}s ease-in-out ${i * 0.25}s infinite` } : { opacity: 0.6 }),
            }}
          />
        </span>
      ))}
    </span>
  );
}
