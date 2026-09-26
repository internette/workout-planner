import { Svg, type IconProps } from './Svg';

export type Mood = 'Happy' | 'Neutral' | 'Sad' | 'Mad';

/** The moods in the order they're offered, and the disc each face sits on. These are identity colours: Happy stays
 * pink in every theme. */
export const MOODS: Mood[] = ['Happy', 'Neutral', 'Sad', 'Mad'];
export const MOOD_COLORS: Record<Mood, string> = {
  Happy: 'var(--color-pink)',
  Neutral: 'var(--color-slate)',
  Sad: 'var(--color-periwinkle)',
  Mad: 'var(--color-danger)',
};

// A minimal face drawn in `color` (the page background colour by default) to sit on a coloured disc.
export function MoodFace({
  mood,
  size,
  color = 'var(--color-canvas)',
  style,
  className,
}: { mood: Mood | string } & IconProps) {
  return (
    <Svg
      size={size}
      style={style}
      className={className}
      fill="none"
      stroke={color}
      strokeWidth={2}
      strokeLinecap="round"
    >
      {mood === 'Mad' ? (
        <>
          <line x1="7.4" y1="8.4" x2="10.6" y2="10.2" />
          <line x1="16.6" y1="8.4" x2="13.4" y2="10.2" />
        </>
      ) : (
        <>
          <circle cx="9" cy="10" r="1.1" fill={color} stroke="none" />
          <circle cx="15" cy="10" r="1.1" fill={color} stroke="none" />
        </>
      )}
      {mood === 'Happy' ? (
        <path d="M8.5 14.5c1.1 1.7 5.9 1.7 7 0" />
      ) : mood === 'Neutral' ? (
        <line x1="8.5" y1="15" x2="15.5" y2="15" />
      ) : (
        <path d="M8.5 16c1.1-1.7 5.9-1.7 7 0" />
      )}
    </Svg>
  );
}
