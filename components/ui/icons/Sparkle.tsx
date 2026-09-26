import { Svg, type IconProps } from './Svg';

const SPARKLE = 'M12 1c0 6.5 2 9.5 10 11-8 1.5-10 4.5-10 11-1-6.5-3-9.5-11-11 8-1.5 10-4.5 11-11z';

// "var(--color-periwinkle)" + 0.5 -> the periwinkle at half strength. Works for a hex or a CSS variable, so the glow
// follows the theme.
function withAlpha(color: string, alpha: number) {
  return `color-mix(in srgb, ${color} ${Math.round(alpha * 100)}%, transparent)`;
}

export interface SparkleProps extends IconProps {
  /** Adds a soft glow in the sparkle's own colour; the value is the glow's opacity (0–1). */
  glow?: number;
  glowBlur?: number;
  /** Draws only the outline instead of a solid shape. */
  outline?: boolean;
}

export function Sparkle({
  size,
  color = 'currentColor',
  strokeWidth = 2,
  glow,
  glowBlur = 4,
  outline,
  style,
  className,
}: SparkleProps) {
  const filter = glow != null ? `drop-shadow(0 0 ${glowBlur}px ${withAlpha(color, glow)})` : undefined;
  return (
    <Svg
      size={size}
      className={className}
      style={style}
      {...(outline ? { fill: 'none', stroke: color, strokeWidth, strokeLinejoin: 'round' as const } : {})}
    >
      <path d={SPARKLE} {...(outline ? {} : { fill: color })} style={filter ? { filter } : undefined} />
    </Svg>
  );
}
