import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Check } from '@moonshot/design-system/icons';
import { css, t } from '@/frontend/features/planner/viewHelpers';
import { StatRow } from '@/frontend/components/StatRow';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** A ride session: its stats and marking it done. */
export function RideSessionCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: '18px' }}>
      <StatRow stats={v.rideStats ?? []} />
      {!v.isFuture ? (
        <Button
          type={v.rideDoneType}
          size="md"
          onClick={v.toggleRideDone}
          style={{ marginTop: '20px' }}
        >
          <span style={css(v.rideDoneMark)}>
            <Check color={v.rideDoneStroke} strokeWidth={2.8} size={13} />
          </span>
          {t(v.rideDoneLabel)}
        </Button>
      ) : null}
    </Card>
  );
}
