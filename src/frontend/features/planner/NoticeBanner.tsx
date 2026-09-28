import { IconButton } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Check, Close } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** A notice after something happened elsewhere, e.g. a plan added to the calendar. */
export function NoticeBanner({ v }: { v: PlannerVals }) {
  return (
    <Card
      pad="sm"
      style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', background: 'var(--color-accent-tint)', boxShadow: 'none' }}
    >
      <Check color="var(--color-accent-deep)" strokeWidth={2.4} size={16} />
      <Text variant="body" weight="medium" style={{ flex: '1', minWidth: '0', color: 'var(--color-accent-deep)' }}>
        {v.notice}
      </Text>
      <IconButton label="Dismiss" size="sm" onClick={v.dismissNotice}>
        <Close color="var(--color-muted)" strokeWidth={2.2} size={14} />
      </IconButton>
    </Card>
  );
}
