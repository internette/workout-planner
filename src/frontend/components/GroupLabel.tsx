import type { CSSProperties, ReactNode } from 'react';
import { Text } from '@moonshot/design-system/typography';

export interface GroupLabelProps {
  /** Written in capitals, e.g. "YOUR OWN EXERCISES". */
  label: ReactNode;
  /** A muted count beside it, e.g. "4 exercises". */
  count?: ReactNode;
  /** The heading level, for the page's outline. */
  as?: 'h2' | 'h3';
  style?: CSSProperties;
}

/** The small heading over a group of rows in a list: the Spellbook's groups, the Chronicle's weeks. */
export function GroupLabel({ label, count, as = 'h2', style }: GroupLabelProps) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'baseline',
        gap: 'var(--space-2)',
        padding: '0 2px',
        marginBottom: 'var(--space-2)',
        ...style,
      }}
    >
      <Text variant="eyebrow" tone="slate" as={as} style={{ margin: 0 }}>
        {label}
      </Text>
      {count != null ? (
        <Text variant="small" tone="muted" weight="medium">
          {count}
        </Text>
      ) : null}
    </div>
  );
}
