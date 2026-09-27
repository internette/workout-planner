import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import type { PlannerVals } from '@/features/planner/store/types';

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
    />
  );
}
