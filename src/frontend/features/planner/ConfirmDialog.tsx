import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Dialog } from '@moonshot/design-system/dialog';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** The planner’s one confirm dialog (“Keep your changes?”, deleting, and so on). The screen asking fills it in. */
export function ConfirmDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.confirmOpen}
      onClose={v.confirmCancel}
      title={v.confirmTitle}
      description={v.confirmBody}
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={v.confirmCancel}>
            {v.confirmCancelLabel}
          </Button>
          <Button type={v.confirmSafe ? 'primary' : 'danger'} size="md" onClick={v.confirmRun}>
            {v.confirmLabel}
          </Button>
        </>
      }
    >
      {v.confirmOption ? (
        <div style={{ marginTop: '16px' }}>
          <Checkbox switch checked={v.confirmOption.on} onChange={v.confirmOption.set}>
            {v.confirmOption.label}
          </Checkbox>
        </div>
      ) : null}
    </Dialog>
  );
}
