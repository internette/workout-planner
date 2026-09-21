// The Moonshot mark with its name. Drawn inline rather than loaded as an image: the name is live text, and an SVG
// used as an <img> cannot see the page's fonts. Source artwork is in public/brand/moonshot-lockup.svg.
import { MARK_FACETS } from './Mark';

const RATIO = 214 / 32;

export function Lockup({ height = 28, className }: { height?: number; className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 214 32"
      width={Math.round(height * RATIO)}
      height={height}
      role="img"
      aria-label="Moonshot"
      className={className}
    >
      <g transform="translate(0,1) scale(.469)">
        {MARK_FACETS.map((f) => (
          <path key={f.d} d={f.d} fill={f.fill} />
        ))}
      </g>
      <text
        x="41"
        y="23.5"
        fontSize="23"
        fontWeight="500"
        letterSpacing="-.46"
        style={{ fontFamily: 'var(--font-heading)', fill: 'var(--color-ink)' }}
      >
        Moonshot
      </text>
    </svg>
  );
}
