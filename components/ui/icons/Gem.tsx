import { useId } from 'react';
import { Svg, type IconProps } from './Svg';

// The pink → blue → teal gem. Each instance gets its own gradient id so several can share a page.
export function Gem({ size, style, className }: Pick<IconProps, 'size' | 'style' | 'className'>) {
  const id = 'gem' + useId().replace(/:/g, '');
  return (
    <Svg size={size} style={style} className={className}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="var(--color-pink)" />
          <stop offset="50%" stopColor="var(--color-periwinkle)" />
          <stop offset="100%" stopColor="var(--color-teal)" />
        </linearGradient>
      </defs>
      <path d="M12 2 L20 8 L17 14 L12 22 L7 14 L4 8 Z" fill={`url(#${id})`} />
      <path
        d="M12 2 L12 22 M4 8 L20 8 M4 8 L12 22 M20 8 L12 22"
        stroke="rgba(255,255,255,0.45)"
        strokeWidth="0.6"
        fill="none"
      />
    </Svg>
  );
}
