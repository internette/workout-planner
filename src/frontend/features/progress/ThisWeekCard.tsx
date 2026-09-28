import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { t } from '@/frontend/features/planner/viewHelpers';
import { progCard } from './progCard';
import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Progress: sessions done this week, opening the week. */
export function ThisWeekCard({ v }: { v: PlannerVals }) {
  return (
    <Card as="button" interactive pad="sm" onClick={v.openWeek} style={progCard('1 1 260px')}>
      <Text variant="eyebrow" as="span" tone="muted" style={{ display: 'block' }}>
        THIS WEEK
      </Text>
      {v.wkEmpty ? (
        <Text variant="caption" as="span" tone="muted" weight="medium" style={{ display: 'block', margin: '8px 0 0' }}>
          Nothing planned this week yet.
        </Text>
      ) : null}
      {v.wkHas ? (
        <>
          <span style={{ display: 'flex', alignItems: 'baseline', gap: '8px', marginTop: '8px' }}>
            <Text variant="subheading">{v.wkDone}</Text>
            <Text variant="caption" tone="muted" weight="medium">
              {'of '}
              {t(v.wkTotal)}
              {' ' + v.wkTotalUnit}
            </Text>
          </span>
          <span
            style={{
              display: 'block',
              height: '7px',
              borderRadius: '4px',
              background: 'var(--color-accent-tint)',
              marginTop: '16px',
              overflow: 'hidden',
            }}
          >
            <span style={{ display: 'block', ...css(v.wkBar) }}></span>
          </span>
        </>
      ) : null}
    </Card>
  );
}
