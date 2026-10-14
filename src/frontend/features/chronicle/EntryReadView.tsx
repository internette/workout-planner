import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ChevronRight } from '@moonshot/design-system/icons';
import { StarRating } from '@moonshot/design-system/rating';
import { Stat } from '@moonshot/design-system/stat';
import { Text } from '@moonshot/design-system/typography';
import { DeleteSection } from '@/frontend/components/DeleteSection';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { NotesCard } from '@/frontend/components/NotesCard';

/** Reading a Chronicle entry. */
export function EntryReadView({ v }: { v: PlannerVals }) {
  return (
    <div style={{ marginTop: 'var(--space-7)' }}>
      <Text variant="micro" as="div" tone="muted">
        {v.longDate}
      </Text>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'baseline',
          gap: 'var(--space-2)',
          marginTop: 'var(--space-2)',
        }}
      >
        <Text variant="title" as="h1" style={{ margin: '0' }}>
          {v.eName}
        </Text>
        <Button type="secondary" ghost size="xs" onClick={v.goDetail} style={{ alignSelf: 'center' }}>
          View workout
          <ChevronRight color="var(--color-pink-deep)" strokeWidth={2.2} size={15} />
        </Button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-6)' }}>
        <Card
          pad="sm"
          style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}
        >
          <span className="fc-keep" style={{ width: '44px', height: '44px', flex: 'none', borderRadius: 'var(--radius-full)', display: 'flex', alignItems: 'center', justifyContent: 'center', background: v.readMoodColor }}>
            {v.readMoodSvg}
          </span>
          <Stat label="Mood" value={v.readMood} style={{ minWidth: '0' }} />
        </Card>
        <Card pad="sm" style={{ flex: '1 1 200px' }}>
          <Text variant="micro" as="div" tone="muted">
            Effort
          </Text>
          <div
            style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-1)' }}
          >
            <Text variant="subheading" tone="ink">
              {v.rpeLabel}
            </Text>
            <StarRating readOnly value={v.rpe} />
          </div>
        </Card>
      </div>
      <NotesCard lead style={{ marginTop: 'var(--space-3)' }}>
        {v.readNote}
      </NotesCard>
      <DeleteSection label="Delete entry" onClick={v.deleteEntry} />
    </div>
  );
}
