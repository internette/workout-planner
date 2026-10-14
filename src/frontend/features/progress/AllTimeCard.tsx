import { Card } from '@moonshot/design-system/card';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/**
 * Progress: the all-time numbers: sessions done, the longest streak and the weekly average. A grid of two rows, so
 * the labels line up along the top (one wrapping to two lines or not) and the values line up under them.
 */
export function AllTimeCard({ v }: { v: PlannerVals }) {
  const stats = v.allTimeStats ?? [];
  return (
    <Card style={{ marginTop: '14px' }}>
      <SectionLabel as="span" label="All time" />
      <dl
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(' + stats.length + ', minmax(0, 1fr))',
          gridTemplateRows: 'auto auto',
          gridAutoFlow: 'column',
          columnGap: 'var(--space-3)',
          rowGap: '6px',
          margin: 'var(--space-3) 0 0',
        }}
      >
        {stats.map((s) => [
          <Text key={s.label + '-l'} variant="micro" as="dt" tone="muted" style={{ alignSelf: 'start' }}>
            {s.label}
          </Text>,
          <dd key={s.label + '-v'} style={{ margin: 0, display: 'flex', alignItems: 'baseline', gap: '5px', alignSelf: 'end' }}>
            <Text variant="heading" tone="ink">
              {s.value}
            </Text>
            <Text variant="small" tone="muted" weight="medium">
              {s.unit}
            </Text>
          </dd>,
        ])}
      </dl>
    </Card>
  );
}
