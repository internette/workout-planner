import type { ReactNode } from 'react';

export interface IconSquareProps {
  /** Width and height in px. 34 in lists, 36 on the calendar, 40 on the Spellbook's workouts. */
  size?: number;
  /** The icon, drawn about 19–20px. */
  children: ReactNode;
  /** Hidden from screen readers, where the row's text already says what it is. */
  decorative?: boolean;
}

/** A workout's or exercise's icon on a flat pale square, at the start of a row. (IconTile is the raised version, for
 * a page's title or an icon you can change.) */
export function IconSquare({ size = 34, children, decorative = false }: IconSquareProps) {
  return (
    <span
      aria-hidden={decorative || undefined}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        flex: 'none',
        borderRadius: 'var(--radius-sm)',
        background: 'var(--color-accent-tint)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {children}
    </span>
  );
}
