// The Moonshot mark with its name. Drawn inline rather than loaded as an image: the name is live text, and an SVG
// used as an <img> cannot see the page's fonts. Source artwork is in public/brand/moonshot-lockup.svg.
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
        <path d="M24.9 9.1 L22.1 18.1 L10.8 20.7 Z" fill="#E1699C" />
        <path d="M10.8 20.7 L22.1 18.1 L23.3 27.5 L9.1 39 Z" fill="#C173AF" />
        <path d="M9.1 39 L23.3 27.5 L28.4 35.6 L20.7 53.2 Z" fill="#A17EC2" />
        <path d="M20.7 53.2 L28.4 35.6 L36.5 40.7 L39 54.9 Z" fill="#7C8FC9" />
        <path d="M39 54.9 L36.5 40.7 L45.9 41.9 L53.2 43.3 Z" fill="#6DA9CF" />
        <path d="M53.2 43.3 L45.9 41.9 L54.9 39.1 Z" fill="#5EC4D6" />
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
