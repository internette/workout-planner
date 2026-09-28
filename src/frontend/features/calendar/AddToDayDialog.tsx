import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import { Plus } from '@moonshot/design-system/icons';
import { LinkRow } from '@/frontend/components/LinkRow';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Adding a workout to a day: one already saved, or a new one. */
export function AddToDayDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.addToDialog?.open}
      onClose={v.addToDialog?.cancel}
      title={v.addToDialog?.title ?? ''}
      actions={
        <Button type="neutral" ghost size="md" onClick={v.addToDialog?.cancel}>
          Cancel
        </Button>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: '16px' }}>
        {(v.addToDialog?.options ?? []).map((o, i) => (
          <LinkRow key={i} title={o?.name} detail={o?.meta} disabled={o?.disabled} onClick={o?.pick} />
        ))}
        <Button type="dashed" size="md" fullWidth onClick={v.addToDialog?.pickNew}>
          <Plus color="var(--color-accent-deep)" size={16} />
          New workout
        </Button>
      </div>
    </Dialog>
  );
}
