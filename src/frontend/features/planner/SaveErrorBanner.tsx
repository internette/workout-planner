import { Button } from '@moonshot/design-system/buttons';
import { Callout } from '@/frontend/components/Callout';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Says a save didn’t go through, until it’s dismissed. */
export function SaveErrorBanner({ v }: { v: PlannerVals }) {
  return (
    <Callout
      tone="danger"
      role="alert"
      action={
        <Button type="danger" ghost size="xs" onClick={v.dismissError}>
          Dismiss
        </Button>
      }
      style={{ marginBottom: 'var(--space-4)' }}
    >
      Couldn&apos;t save that. Check your connection and try again.
      <span style={{ display: 'block', marginTop: '2px', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-regular)', opacity: 0.8 }}>
        {v.saveError}
      </span>
    </Callout>
  );
}
