import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ChevronRight } from '@moonshot/design-system/icons';
import { StarRating } from '@moonshot/design-system/rating';
import { Stat } from '@moonshot/design-system/stat';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import { DeleteSection } from '@/frontend/components/DeleteSection';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { NotesCard } from '@/frontend/components/NotesCard';

/** Reading a Chronicle entry. */
export function EntryReadView({ v }: { v: PlannerVals }) {
  return (
    <>
      <div style={{ marginTop: '32px' }}>
        <Text variant="eyebrow" as="div" tone="subtle">
          {v.longDate}
        </Text>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: '8px',
            marginTop: '8px',
          }}
        >
          <Text variant="display" as="h1" style={{ margin: '0' }}>
            {v.eName}
          </Text>
          <Button type="secondary" ghost size="xs" onClick={v.goDetail} style={{ alignSelf: 'center' }}>
            View workout
            <ChevronRight color="var(--color-accent-deep)" strokeWidth={2.2} size={15} />
          </Button>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '24px' }}>
          <Card
            pad="sm"
            style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '16px' }}
          >
            <span className="fc-keep" style={css(v.readMoodFace)}>{v.readMoodSvg}</span>
            <Stat label="MOOD" value={v.readMood} style={{ minWidth: '0' }} />
          </Card>
          <Card pad="sm" style={{ flex: '1 1 200px' }}>
            <Text variant="micro" as="div" tone="subtle">
              EFFORT
            </Text>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '4px' }}
            >
              <Text variant="cardTitle" tone="ink">
                {v.rpeLabel}
              </Text>
              <StarRating readOnly value={v.rpe} />
            </div>
          </Card>
        </div>
        <NotesCard lead style={{ marginTop: '12px' }}>
          {v.readNote}
        </NotesCard>
        <DeleteSection label="Delete entry" onClick={v.deleteEntry} />
      </div>
    </>
  );
}
