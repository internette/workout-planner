import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { RankGem } from '@/frontend/components/RankGem';

/** Profile: quests cleared, all time. */
export function QuestsClearedCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: '14px' }}>
      <SectionLabel
        as="span"
        label="QUESTS CLEARED"
        {...(v.questsHas ? { note: v.allTimeLabel, value: v.questsClearedLabel } : { aside: v.allTimeLabel })}
      />
      {v.questsNone ? (
        <Text variant="body" as="p" tone="muted" weight="medium" style={{ margin: '10px 0 0' }}>
          Every day with a session gets a quest. The ones you clear gather here.
        </Text>
      ) : null}
      {v.questsHas ? (
        <ProgressBar value={v.questsClearedPct ?? 0} track="mist" style={{ marginTop: '12px' }} />
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '16px' }}>
        {(v.questStats ?? []).map((q, i) => (
          <div key={i} style={css(q?.row)}>
            <RankGem fill={q?.color} />
            <Text variant="label" tone="ink" style={{ flex: '1', minWidth: '0' }}>
              {q?.name}
            </Text>
            <Text variant="figure" tone="slate" style={{ flex: 'none' }}>
              {q?.count}
            </Text>
          </div>
        ))}
      </div>
    </Card>
  );
}
