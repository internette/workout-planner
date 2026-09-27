import { useId } from 'react';
import { Svg, type IconProps } from './Svg';

// A soft, round-pointed star for ratings: filled with the pink → blue → teal gradient, or a pale pink shape when it
// isn't. The round joins on a stroke of the same colour give it its soft points. Each instance gets its own gradient id.
export function RatingStar({ on, size, style, className }: { on: boolean } & Pick<IconProps, 'size' | 'style' | 'className'>) {
  const id = 'star' + useId().replace(/:/g, '');
  const paint = on ? `url(#${id})` : 'color-mix(in srgb, var(--color-accent) 24%, var(--color-surface))';
  return (
    <Svg size={size} style={style} className={className}>
      {on ? (
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="var(--color-accent)" />
            <stop offset="55%" stopColor="var(--color-periwinkle)" />
            <stop offset="100%" stopColor="var(--color-teal)" />
          </linearGradient>
        </defs>
      ) : null}
      <polygon
        points="12,3.2 14.6,8.9 20.8,9.6 16.2,13.8 17.5,19.9 12,16.8 6.5,19.9 7.8,13.8 3.2,9.6 9.4,8.9"
        style={{ fill: paint, stroke: paint }}
        strokeWidth="2.6"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
