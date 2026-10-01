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
      <Text variant="eyebrow" as="span" tone="muted" style={{ display: 'block' }}>
        NEXT CALL
      </Text>
      {v.hasNext ? (
        <>
          <span
            style={{
              display: 'block',
              fontFamily: 'var(--font-heading)',
              margin: '9px 0 0',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-semibold)',
              color: 'var(--color-ink)',
            }}
          >
            {v.nextName}
          </span>
          <Text
            variant="caption"
            as="span"
            tone="muted"
            weight="medium"
            style={{ display: 'block', margin: '3px 0 0' }}
          >
            {v.nextMeta}
          </Text>
        </>
      ) : null}
      {v.noNext ? (
        <Text
          variant="caption"
          as="p"
          tone="muted"
          weight="medium"
          style={{ margin: '9px 0 0' }}
        >
          No call yet. Plan a session and it shows up here.
        </Text>
      ) : null}
    </Card>
  );
}
