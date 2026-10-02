import type { CSSProperties, ReactNode } from 'react';
import { Text, type TextProps } from './Text';

export interface SectionLabelProps {
  /** Written in capitals, e.g. "PERSONAL BESTS". */
  label: ReactNode;
  /** A muted note beside it, e.g. "4 exercises". */
  note?: ReactNode;
  /** A muted note at the right, e.g. "All time". */
  aside?: ReactNode;
  /** A figure at the right, e.g. "12 of 20". */
  value?: ReactNode;
  /** The label's element: a heading for the page's outline (h2 by default), or a span inside a card's top line. */
  as?: 'h2' | 'h3' | 'div' | 'span';
  /** The label's colour. */
  tone?: TextProps['tone'];
  /** Over a list of rows: a little inset, with room below before the first row. */
  list?: boolean;
  style?: CSSProperties;
}

const muted = (children: ReactNode, style?: CSSProperties) => (
  <Text variant="small" tone="muted" weight="medium" style={style}>
    {children}
  </Text>
);

/** The small capitals over a section or a group of rows, with a count or note beside it and a note or figure at the
 * right: the Spellbook's groups, the Chronicle's months, a stats card's top line. */
export function SectionLabel({ label, note, aside, value, as = 'h2', tone = 'slate', list, style }: SectionLabelProps) {
  const has = (x: ReactNode) => x != null && x !== false;
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        gap: 'var(--space-2)',
        ...(list ? { padding: '0 2px', marginBottom: 'var(--space-2)' } : null),
        ...style,
      }}
    >
      <Text variant="micro" tone={tone} as={as} style={{ margin: 0 }}>
        {label}
      </Text>
      {has(note) ? muted(note) : null}
      {has(aside) ? muted(aside, { marginLeft: 'auto' }) : null}
      {has(value) ? (
        <Text variant="subheading" tone="ink" style={{ marginLeft: 'auto' }}>
          {value}
        </Text>
      ) : null}
    </div>
  );
}
