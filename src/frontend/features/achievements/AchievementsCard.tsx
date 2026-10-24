import { Card } from '@moonshot/design-system/card';
import { Button } from '@moonshot/design-system/buttons';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { AchievementBadge } from './AchievementBadge';

/** Profile: how many achievements are earned, the latest few, and the one closest to being earned. */
export function AchievementsCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: 'var(--space-4)' }}>
      <SectionLabel as="span" label="Achievements" aside={v.achLabel} />
      <ProgressBar value={v.achPct} track="mist" label="Achievements earned" valueText={v.achLabel} style={{ marginTop: 'var(--space-3)' }} />
      {v.achLatest.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          {v.achLatest.map((a) => (
            <div key={a.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <AchievementBadge tint={a.tint} deep={a.deep} fill={a.fill} />
              <span style={{ minWidth: 0 }}>
                <Text variant="subheading" as="span" style={{ display: 'block' }}>
                  {a.name}
                </Text>
                <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                  {a.how} · {a.when}
                </Text>
              </span>
            </div>
          ))}
        </div>
      ) : null}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-2) var(--space-3)',
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--color-line)',
        }}
      >
        {v.achClosest ? (
          <div>
            <Text variant="small" tone="muted" as="div">
              Closest next
            </Text>
            <Text variant="strong" tone="ink" as="div">
              {v.achClosest.name} · {v.achClosest.label}
            </Text>
          </div>
        ) : (
          <Text variant="body" tone="muted">
            Finish a workout to start earning them.
          </Text>
        )}
        <Button type="secondary" size="md" onClick={v.goAchievements}>
          See all
        </Button>
      </div>
    </Card>
  );
}
