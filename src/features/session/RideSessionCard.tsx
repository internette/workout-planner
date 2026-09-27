import { Fragment } from 'react';
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Check } from '@moonshot/design-system/icons';
import { Stat } from '@moonshot/design-system/stat';
import { css, t } from '@/features/planner/viewHelpers';
import type { PlannerVals } from '@/features/planner/store/types';

/** A ride session: its stats and marking it done. */
export function RideSessionCard({ v }: { v: PlannerVals }) {
  return (
    <>
      <Card style={{ marginTop: '18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px' }}>
          {(v.rideStats ?? []).map((r, i) => (
            <Fragment key={i}>
              <Stat label={r?.label} value={r?.value} note={r?.note} />
            </Fragment>
          ))}
        </div>
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
    </>
  );
}
