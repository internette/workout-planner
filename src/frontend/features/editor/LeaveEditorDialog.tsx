import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** “Keep your changes?” when leaving the editor with unsaved changes. */
export function LeaveEditorDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.leaveOpen}
      onClose={v.stayHere}
      title={v.leaveTitle}
      description={v.leaveBody}
      actions={
        <>
          <Button type="danger" ghost size="md" onClick={v.discardLeave}>
            {v.leaveDiscardLabel}
          </Button>
          <Button type="primary" size="md" onClick={v.saveLeave}>
            {v.leaveSaveLabel}
          </Button>
        </>
      }
    />
  );
}
