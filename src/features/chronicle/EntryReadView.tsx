import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ChevronRight } from '@moonshot/design-system/icons';
import { StarRating } from '@moonshot/design-system/rating';
import { Stat } from '@moonshot/design-system/stat';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/features/planner/viewHelpers';
import type { PlannerVals } from '@/features/planner/store/types';

/** Reading a Chronicle entry. */
export function EntryReadView({ v }: { v: PlannerVals }) {
  return (
    <>
      <div style={{ marginTop: '30px' }}>
        <Text variant="eyebrow" as="div" tone="subtle">
          {v.longDate}
        </Text>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: '10px',
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
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '22px' }}>
          <Card
            pad="sm"
            style={{ flex: '1 1 200px', display: 'flex', alignItems: 'center', gap: '14px' }}
          >
            <span className="fc-keep" style={css(v.readMoodFace)}>{v.readMoodSvg}</span>
            <Stat label="MOOD" value={v.readMood} style={{ minWidth: '0' }} />
          </Card>
          <Card pad="sm" style={{ flex: '1 1 200px' }}>
            <Text variant="micro" as="div" tone="subtle">
              EFFORT
            </Text>
            <div
              style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '5px' }}
            >
              <Text variant="cardTitle" tone="ink">
                {v.rpeLabel}
              </Text>
              <StarRating readOnly value={v.rpe} />
            </div>
          </Card>
        </div>
        <Card style={{ marginTop: '12px' }}>
          <Text variant="micro" as="div" tone="subtle">
            NOTES
          </Text>
          <p
            style={{
              margin: '10px 0 0',
              fontSize: 'var(--text-lg)',
              fontWeight: 'var(--font-weight-regular)',
              lineHeight: 'var(--leading-relaxed)',
              color: 'var(--color-ink)',
              textWrap: 'pretty',
            }}
          >
            {v.readNote}
          </p>
        </Card>
        {/* Laid out like the other pages' own Delete (a saved workout's, an exercise's). */}
        <div style={{ marginTop: '28px', paddingTop: '18px', borderTop: '1px solid var(--color-line)' }}>
          <Button type="danger" ghost size="md" onClick={v.deleteEntry}>
            Delete entry
          </Button>
        </div>
      </div>
    </>
  );
}
