import { Fragment } from 'react';
import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/features/planner/viewHelpers';
import { SectionHeader } from '@/components/SectionHeader';
import type { PlannerVals } from '@/features/planner/store/types';

/** Profile: quests cleared, all time. */
export function QuestsClearedCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: '14px' }}>
      <SectionHeader title="QUESTS CLEARED" note={v.allTimeLabel} value={v.questsHas ? v.questsClearedLabel : undefined} />
      {v.questsNone ? (
        <Text variant="caption" as="p" tone="muted" weight="medium" style={{ margin: '10px 0 0' }}>
          Every day with a session gets a quest. The ones you clear gather here.
        </Text>
      ) : null}
      {v.questsHas ? (
        <ProgressBar value={v.questsClearedPct ?? 0} track="mist" style={{ marginTop: '12px' }} />
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '16px' }}>
        {(v.questStats ?? []).map((q, i) => (
          <Fragment key={i}>
            <div style={css(q?.row)}>
              <span style={css(q?.swatch)}></span>
              <Text variant="label" tone="ink" style={{ flex: '1', minWidth: '0' }}>
                {q?.name}
              </Text>
              <Text variant="figure" tone="slate" style={{ flex: 'none' }}>
                {q?.count}
              </Text>
            </div>
          </Fragment>
        ))}
      </div>
    </Card>
  );
}
