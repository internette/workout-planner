import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Dialog } from '@moonshot/design-system/dialog';
import { ChevronRight, Plus } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/features/planner/store/types';

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
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
        {(v.addToDialog?.options ?? []).map((o, i) => (
          <Card
            key={i}
            as="button"
            pad="sm"
            interactive
            disabled={o?.disabled}
            onClick={o?.pick}
            style={{ display: 'flex', alignItems: 'center', gap: '12px', textAlign: 'left', width: '100%', opacity: o?.disabled ? 0.55 : 1 }}
          >
            <span style={{ flex: '1', minWidth: '0' }}>
              <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
                {o?.name}
              </Text>
              <Text variant="caption" tone="muted" style={{ display: 'block', marginTop: '2px' }}>
                {o?.meta}
              </Text>
            </span>
            {o?.disabled ? null : <ChevronRight color="var(--color-muted)" size={16} />}
          </Card>
        ))}
        <Button type="dashed" size="md" fullWidth onClick={v.addToDialog?.pickNew}>
          <Plus color="var(--color-accent-deep)" size={16} />
          New workout
        </Button>
      </div>
    </Dialog>
  );
}
