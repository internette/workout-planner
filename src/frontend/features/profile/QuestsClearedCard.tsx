import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { RankGem } from '@/frontend/components/RankGem';

/** Profile: quests cleared, all time. */
export function QuestsClearedCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: 'var(--space-3h)' }}>
      <SectionLabel
        as="span"
        label="Quests cleared"
        {...(v.questsHas ? { note: v.allTimeLabel, value: v.questsClearedLabel } : { aside: v.allTimeLabel })}
      />
      {v.questsNone ? (
        <Text variant="strong" as="p" tone="muted" style={{ margin: 'var(--space-2h) 0 0' }}>
          Every day with a session gets a quest. The ones you clear gather here.
        </Text>
      ) : null}
      {v.questsHas ? (
        <ProgressBar value={v.questsClearedPct ?? 0} track="mist" style={{ marginTop: 'var(--space-3)' }} />
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-0h)', marginTop: 'var(--space-4)' }}>
        {(v.questStats ?? []).map((q, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-2h) 0', borderBottom: q?.last ? undefined : '1px solid var(--color-line)' }}>
            <RankGem fill={q?.color} />
            <Text variant="strong" tone="ink" style={{ flex: '1', minWidth: '0' }}>
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
