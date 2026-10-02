import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { OpensChevron, progCard } from './progCard';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Progress: the next session planned, opening it. */
export function NextUpCard({ v }: { v: PlannerVals }) {
  return (
    <Card
      as={v.hasNext ? 'button' : 'div'}
      interactive={!!v.hasNext}
      pad="sm"
      onClick={v.hasNext ? v.openNext : undefined}
      style={progCard('1 1 260px')}
    >
      {v.hasNext ? <OpensChevron /> : null}
      <Text variant="micro" as="span" tone="muted" style={{ display: 'block' }}>
        Next call
      </Text>
      {v.hasNext ? (
        <>
          <Text variant="subheading" tone="ink" style={{ display: 'block', margin: '9px 0 0' }}>
            {v.nextName}
          </Text>
          <Text
            variant="strong"
            as="span"
            tone="muted"
           
            style={{ display: 'block', margin: '3px 0 0' }}
          >
            {v.nextMeta}
          </Text>
        </>
      ) : null}
      {v.noNext ? (
        <Text
          variant="strong"
          as="p"
          tone="muted"
         
          style={{ margin: '9px 0 0' }}
        >
          No call yet. Plan a session and it shows up here.
        </Text>
      ) : null}
    </Card>
  );
}
