import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** The session’s clock, with start, pause and finish. */
export function SessionTimer({ v }: { v: PlannerVals }) {
  return (
    <>
      <Card style={{ marginTop: '16px' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          <div>
            <Text variant="eyebrow" tone="slate">
              WORKOUT TIMER
            </Text>
            <Text
              variant="title"
              as="div"
              style={{ margin: '4px 0 0', fontVariantNumeric: 'tabular-nums' }}
            >
              {v.timerLabel}
            </Text>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            <Button
              type={v.canFinish || v.timerButtonLabel === 'Pause' ? 'secondary' : 'primary'}
              size="md"
              onClick={v.timerButtonAction}
            >
              {v.timerButtonLabel}
            </Button>
            {v.canFinish ? (
              <Button type="primary" size="md" onClick={v.openFinish}>
                Finish
              </Button>
            ) : null}
          </div>
        </div>
      </Card>
    </>
  );
}
