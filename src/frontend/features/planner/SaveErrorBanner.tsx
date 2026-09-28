import { Button } from '@moonshot/design-system/buttons';
import { Check } from '@moonshot/design-system/icons';
import { t } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Says a save didn’t go through, until it’s dismissed. */
export function SaveErrorBanner({ v }: { v: PlannerVals }) {
  return (
    <div
      role="alert"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '14px',
        padding: '12px 16px',
        borderRadius: 'var(--radius-md)',
        background: 'var(--color-danger-tint)',
        color: 'var(--color-danger)',
        fontSize: 'var(--text-base)',
      }}
    >
      <span style={{ flex: '1', minWidth: '0' }}>
        Couldn&apos;t save that. Check your connection and try again.
        <span style={{ display: 'block', marginTop: '2px', fontSize: 'var(--text-xs)', opacity: 0.8 }}>{v.saveError}</span>
      </span>
      <Button type="danger" ghost size="xs" onClick={v.dismissError}>
        Dismiss
      </Button>
    </div>
  );
}
