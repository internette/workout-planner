// Every achievement, from the Profile: a group at a time (Workouts, Sets, Streaks…), and in each of its families the
// tier last earned and the next one with how close it is.
import { Card } from '@moonshot/design-system/card';
import { Chip } from '@moonshot/design-system/chip';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { BackBar } from '@/frontend/components/BackBar';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { AchievementBadge } from './AchievementBadge';

type Family = PlannerVals['achFamilies'][number];

function FamilyCard({ f }: { f: Family }) {
  return (
    <Card pad="sm">
      <SectionLabel as="h2" label={f.title} aside={f.label} />
      {f.last ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
          <AchievementBadge tint={f.last.tint} deep={f.last.deep} fill={f.last.fill} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <Text variant="subheading" as="span" style={{ display: 'block' }}>
              {f.last.name}
            </Text>
            <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
              {f.last.how}
            </Text>
          </span>
          <Text variant="small" tone="muted" style={{ flex: 'none' }}>
            {f.last.when}
          </Text>
        </div>
      ) : null}
      {f.next ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
          <AchievementBadge tint={f.next.tint} deep={f.next.deep} fill={f.next.fill} earned={false} />
          <span style={{ flex: 1, minWidth: 0 }}>
            <span style={{ display: 'flex', justifyContent: 'space-between', gap: 'var(--space-2)' }}>
              <Text variant="strong" tone="ink">
                {f.next.name}
              </Text>
              <Text variant="small" tone="muted" style={{ flex: 'none' }}>
                {f.next.label}
              </Text>
            </span>
            <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
              {f.next.how}
            </Text>
            <ProgressBar value={f.next.pct} track="mist" style={{ marginTop: 'var(--space-2)' }} />
          </span>
        </div>
      ) : (
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
          Every one earned.
        </Text>
      )}
    </Card>
  );
}

export function AchievementsScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack} />
      <Text variant="title" as="h1" style={{ margin: 'var(--space-5) 0 0' }}>
        Achievements
      </Text>
      <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
        {v.achLabel} earned. Every workout you’ve done counts.
      </Text>
      <div role="group" aria-label="Kind of achievement" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
        {v.achGroups.map((g) => (
          <Chip key={g.key} tone="choice" size="md" surface="page" selected={g.on} onClick={g.pick}>
            {g.label} · {g.earned}
          </Chip>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(300px, 100%), 1fr))', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
        {v.achFamilies.map((f) => (
          <FamilyCard key={f.key} f={f} />
        ))}
      </div>
    </div>
  );
}
