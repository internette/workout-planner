import styles from './mark.module.css';

// The six facets of the crescent, in the order they light up: rose to cyan. The artwork's box is 64 × 64. The lockup
// draws the same facets, so this is the one place they are written down. Source artwork: public/brand/moonshot-mark.svg.
export const MARK_FACETS = [
  { d: 'M24.9 9.1 L22.1 18.1 L10.8 20.7 Z', fill: '#D53181' },
  { d: 'M10.8 20.7 L22.1 18.1 L23.3 27.5 L9.1 39 Z', fill: '#BE5D99' },
  { d: 'M9.1 39 L23.3 27.5 L28.4 35.6 L20.7 53.2 Z', fill: '#A279B1' },
  { d: 'M20.7 53.2 L28.4 35.6 L36.5 40.7 L39 54.9 Z', fill: '#7C8FC9' },
  { d: 'M39 54.9 L36.5 40.7 L45.9 41.9 L53.2 43.3 Z', fill: '#6DA9CF' },
  { d: 'M53.2 43.3 L45.9 41.9 L54.9 39.1 Z', fill: '#5EC4D6' },
] as const;

const SEAMS = 'M22.1 18.1 L10.8 20.7 M23.3 27.5 L9.1 39 M28.4 35.6 L20.7 53.2 M36.5 40.7 L39 54.9 M45.9 41.9 L53.2 43.3';

export interface MarkProps {
  size?: number;
  /** Light the facets up one after another, for a loading screen. */
  animate?: boolean;
  className?: string;
}

/** The Moonshot mark on its own, decorative: put the name beside it, or give the parent a label. */
export function Mark({ size = 64, animate = false, className }: MarkProps) {
  return (
    <svg aria-hidden="true" viewBox="0 0 64 64" width={size} height={size} fill="none" className={className}>
      {MARK_FACETS.map((f, i) => (
        <path
          key={i}
          d={f.d}
          fill={f.fill}
          className={animate ? styles.facet : undefined}
          style={animate ? { animationDelay: `${i * 0.2}s` } : undefined}
        />
      ))}
      <path d={SEAMS} stroke="#FFFFFF" strokeOpacity=".4" strokeWidth="1" />
    </svg>
  );
}
