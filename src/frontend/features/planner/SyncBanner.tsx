import { Button } from '@moonshot/design-system/buttons';
import { Callout } from '@moonshot/design-system/callout';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Says the connection dropped: ticks waiting to be saved, or a plan that couldn't be refreshed. It stays in view while
 * the page scrolls (a session is long), and goes once everything is saved and reloaded. */
export function SyncBanner({ v }: { v: PlannerVals }) {
  return (
    <Callout
      tone="success"
      action={
        <Button type="secondary" size="xs" onClick={v.resync}>
          Try again
        </Button>
      }
      style={{ marginBottom: 'var(--space-4)', position: 'sticky', top: 'var(--space-2)', zIndex: 5 }}
    >
      {v.syncNote}
    </Callout>
  );
}
