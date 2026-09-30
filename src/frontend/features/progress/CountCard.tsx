import type { ReactNode } from 'react';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { OpensChevron, progCard } from './progCard';

/** A Progress card with one count, e.g. CHRONICLE, 12 entries, that opens what it counts. */
export function CountCard({ label, count, unit, onClick }: { label: ReactNode; count: ReactNode; unit: ReactNode; onClick: () => void }) {
  return (
    <Card as="button" interactive pad="sm" onClick={onClick} style={progCard('1 1 170px')}>
      <OpensChevron />
      <Text variant="eyebrow" as="span" tone="muted" style={{ display: 'block' }}>
        {label}
      </Text>
      <span style={{ display: 'flex', alignItems: 'baseline', gap: '6px', marginTop: '6px' }}>
        <Text variant="subheading">{count}</Text>
        <Text variant="caption" tone="muted" weight="medium">
          {unit}
        </Text>
      </span>
    </Card>
  );
}
