import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import { TextField } from '@moonshot/design-system/text-field';
import type { PlannerVals } from '@/features/planner/store/types';

/** Finishing a session: how long it took, and for a ride, how far and how high. */
export function FinishDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.finishOpen}
      onClose={v.cancelFinish}
      title={v.finishTitle}
      description={v.finishNote || undefined}
      actions={
        <>
          {v.canUnfinish ? (
            <Button type="neutral" ghost size="md" onClick={v.unfinish} style={{ marginRight: 'auto' }}>
              Mark not done
            </Button>
          ) : null}
          <Button type="neutral" ghost size="md" onClick={v.cancelFinish}>
            {v.finishCancelLabel}
          </Button>
          <Button type="primary" size="md" onClick={v.saveFinish} disabled={!v.canSaveFinish}>
            {v.finishSaveLabel}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
        {v.finishIsRide ? (
          <TextField
            label="Distance"
            labelNote="(miles)"
            inputMode="decimal"
            containerStyle={{ flex: '1 1 100%', minWidth: '0' }}
            value={v.finishDist}
            onChange={v.setFinishDist}
          />
        ) : null}
        <TextField
          label="Hours"
          inputMode="numeric"
          containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
          value={v.finishHrs}
          onChange={v.setFinishHrs}
        />
        <TextField
          label="Minutes"
          inputMode="numeric"
          containerStyle={{ flex: '1 1 90px', minWidth: '0' }}
          value={v.finishMins}
          onChange={v.setFinishMins}
          onBlur={v.rollFinishMins}
        />
        {v.finishIsRide ? (
          <TextField
            label="Elevation"
            labelNote="(feet)"
            inputMode="numeric"
            containerStyle={{ flex: '1 1 100%', minWidth: '0' }}
            value={v.finishElev}
            onChange={v.setFinishElev}
          />
        ) : null}
      </div>
    </Dialog>
  );
}
