import { Fragment } from 'react';
import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/features/planner/viewHelpers';
import { SectionHeader } from '@/components/SectionHeader';
import type { PlannerVals } from '@/features/planner/store/types';

/** Profile: how sessions felt, all time. */
export function MoodSplitCard({ v }: { v: PlannerVals }) {
  return (
    <Card>
      <SectionHeader title="HOW IT FEELS" note={v.allTimeLabel} />
      {v.moodEmpty ? (
        <Text variant="caption" as="p" tone="muted" weight="medium" style={{ margin: '10px 0 0' }}>
          Write about a session in the Chronicle and your moods gather here.
        </Text>
      ) : null}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '18px' }}
      >
        {(v.moodSplit ?? []).map((m, i) => (
          <Fragment key={i}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={css(m?.swatch)}></span>
              <Text variant="label" tone="ink" style={{ flex: 'none', width: '66px' }}>
                {m?.name}
              </Text>
              <ProgressBar value={m?.barPct ?? 0} track="mist" fill={m?.color} style={{ flex: '1' }} />
              <Text variant="figure" tone="slate" style={{ flex: 'none', width: '30px', textAlign: 'right' }}>
                {m?.pct}
              </Text>
            </div>
          </Fragment>
        ))}
      </div>
    </Card>
  );
}
