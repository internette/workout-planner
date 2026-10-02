import { IconButton } from '@moonshot/design-system/buttons';
import { Check, Close } from '@moonshot/design-system/icons';
import { Callout } from '@/frontend/components/Callout';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** A notice after something happened elsewhere, e.g. a plan added to the calendar. */
export function NoticeBanner({ v }: { v: PlannerVals }) {
  return (
    <Callout
      tone="success"
      icon={<Check color="var(--color-pink-deep)" strokeWidth={2.4} size={16} />}
      action={
        <IconButton label="Dismiss" size="md" onClick={v.dismissNotice}>
          <Close color="var(--color-muted)" strokeWidth={2.2} size={14} />
        </IconButton>
      }
      style={{ marginBottom: 'var(--space-4)' }}
    >
      {v.notice}
    </Callout>
  );
}
