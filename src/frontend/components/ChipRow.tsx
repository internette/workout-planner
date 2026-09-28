import type { CSSProperties, ReactNode } from 'react';

/** Chips side by side, wrapping onto more lines as needed: target areas, equipment, a ride's effort. */
export function ChipRow({ children, style, as: Tag = 'div' }: { children: ReactNode; style?: CSSProperties; as?: 'div' | 'span' }) {
  return <Tag style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', ...style }}>{children}</Tag>;
}
