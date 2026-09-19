import type { ReactNode } from 'react';
import { Svg, type IconProps } from './Svg';

// Line icon: round-capped strokes drawn in `color`.
export function strokeIcon(name: string, glyph: ReactNode) {
  const Icon = ({ size, color = 'currentColor', strokeWidth = 2, style, className }: IconProps) => (
    <Svg
      size={size}
      style={style}
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {glyph}
    </Svg>
  );
  Icon.displayName = name;
  return Icon;
}

// Solid icon: a single shape filled with `color`.
export function solidIcon(name: string, path: string) {
  const Icon = ({ size, color = 'currentColor', style, className }: IconProps) => (
    <Svg size={size} style={style} className={className}>
      <path d={path} fill={color} />
    </Svg>
  );
  Icon.displayName = name;
  return Icon;
}
