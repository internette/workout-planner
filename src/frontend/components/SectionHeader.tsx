import type { ReactNode } from 'react';
import { Text } from '@moonshot/design-system/typography';

export interface SectionHeaderProps {
  /** Written in capitals, e.g. "PERSONAL BESTS". */
  title: ReactNode;
  /** A muted note, e.g. "All time". At the right, or beside the title when there's a value. */
  note?: ReactNode;
  /** A figure at the right, e.g. "12 of 20". */
  value?: ReactNode;
}

/** The top line of a stats card: a small title, with a muted note and maybe a figure. */
export function SectionHeader({ title, note, value }: SectionHeaderProps) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--space-2)' }}>
      <Text variant="eyebrow" tone="slate">
        {title}
      </Text>
      {note != null && note !== false ? (
        <Text variant="small" tone="muted" weight="medium" style={value != null ? undefined : { marginLeft: 'auto' }}>
          {note}
        </Text>
      ) : null}
      {value != null ? (
        <Text variant="itemTitle" tone="ink" style={{ marginLeft: 'auto' }}>
          {value}
        </Text>
      ) : null}
    </div>
  );
}
