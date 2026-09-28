import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** The rest between sets, counting down, with what's up next. */
export function RestCard({ v }: { v: PlannerVals }) {
  return (
    <Card as="section" style={{ marginTop: '16px' }} aria-label="Rest">
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end', justifyContent: 'space-between', gap: '12px' }}>
        <div>
          <Text variant="eyebrow" tone="slate" as="div">
            REST
          </Text>
          {/* Read out once a second would be too much; the rest's end is announced instead. */}
          <Text variant="title" as="div" aria-hidden="true" style={{ margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}>
            {v.restLabel}
          </Text>
        </div>
        {v.restNextName ? (
          <div style={{ flex: '1 1 160px', minWidth: 0, textAlign: 'right' }}>
            <Text variant="eyebrow" tone="slate" as="div">
              UP NEXT
            </Text>
            <Text variant="cardTitle" as="div" style={{ marginTop: '4px' }}>
              {v.restNextName}
            </Text>
            <Text variant="caption" tone="muted" as="div" style={{ marginTop: '2px' }}>
              {v.restNextLine}
            </Text>
          </div>
        ) : null}
      </div>
      <ProgressBar value={v.restPct} style={{ marginTop: '14px' }} />
      <div style={{ display: 'flex', gap: '8px', marginTop: '14px' }}>
        <Button type="secondary" size="md" onClick={v.restMore}>
          +30 sec
        </Button>
        <Button type="primary" size="md" onClick={v.restSkip}>
          Skip rest
        </Button>
      </div>
    </Card>
  );
}
