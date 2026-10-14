import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Check } from '@moonshot/design-system/icons';
import { t } from '@/frontend/features/planner/viewHelpers';
import { StatRow } from '@moonshot/design-system/stat';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** A ride session: its stats and marking it done. */
export function RideSessionCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: 'var(--space-5)' }}>
      <StatRow stats={v.rideStats ?? []} />
      {/* Once its clock has started, Finish (by the clock) is how a ride is done; marking it is for one not timed. */}
      {!v.isFuture && !v.timerStarted ? (
        <Button
          type={v.rideDoneType}
          size="md"
          onClick={v.toggleRideDone}
          style={{ marginTop: 'var(--space-5)' }}
        >
          <span
            style={{
              width: '24px',
              height: '24px',
              flex: 'none',
              borderRadius: 'var(--radius-full)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              ...(v.rideIsDone ? { background: 'var(--color-pink)' } : { border: '1.5px solid var(--color-outline)' }),
            }}
          >
            <Check color={v.rideDoneStroke} strokeWidth={2.8} size={13} />
          </span>
          {t(v.rideDoneLabel)}
        </Button>
      ) : null}
    </Card>
  );
}
