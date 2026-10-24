import { Card } from '@moonshot/design-system/card';
import { Check } from '@moonshot/design-system/icons';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

type Row = PlannerVals['challengeSessionRows'][number];

/** One challenge: what it asks, how far along it is, and its XP. */
function ChallengeRow({ r, compact = false }: { r: Row; compact?: boolean }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <Text variant="strong" tone="ink" style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', minWidth: 0 }}>
          {r.cleared ? <Check color="var(--color-pink-deep)" strokeWidth={3} size={14} /> : null}
          {r.name}
        </Text>
        <Text variant="small" tone="slate" style={{ flex: 'none', fontVariantNumeric: 'tabular-nums', ...(r.cleared ? { color: 'var(--color-pink-deep)', fontWeight: 'var(--font-weight-semibold)' } : {}) }}>
          {r.count}
        </Text>
      </div>
      <ProgressBar value={r.pct} track="tint" fill={r.cleared ? 'var(--color-pink-deep)' : 'var(--color-pink)'} label={r.name} valueText={r.valueText} />
      {compact ? null : (
        <Text variant="small" tone="muted" style={r.cleared ? { color: 'var(--color-pink-deep)' } : undefined}>
          {r.note}
        </Text>
      )}
    </div>
  );
}

/** The Day view: this week's three challenges, taken from this week's plan. */
export function ChallengesCard({ v }: { v: PlannerVals }) {
  const c = v.challengeCard;
  if (!c) return null;
  return (
    <Card as="section" aria-label="This week's challenges" style={{ marginTop: 'var(--space-4)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-2)' }}>
        <Text variant="subheading" as="h2" tone="ink" style={{ margin: 0 }}>
          This week&rsquo;s challenges
        </Text>
        <Text variant="small" tone="slate" style={{ flex: 'none' }}>
          {c.ends}
        </Text>
      </div>
      <Text variant="small" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
        From this week&rsquo;s plan
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
        {c.rows.map((r) => (
          <ChallengeRow key={r.key} r={r} />
        ))}
      </div>
      <Text variant="body" tone="slate" as="p" style={{ margin: 'var(--space-4) 0 0', paddingTop: 'var(--space-3)', borderTop: '1px solid var(--color-line)' }}>
        {c.footer}
      </Text>
    </Card>
  );
}

/** The session page: the challenges this workout counts toward, moving as each exercise is ticked. */
export function SessionChallenges({ v }: { v: PlannerVals }) {
  const rows = v.challengeSessionRows;
  if (!rows.length) return null;
  return (
    <Card as="section" aria-label="Challenges this workout counts toward" style={{ marginTop: 'var(--space-4)' }}>
      <Text variant="micro" as="div" tone="accent">
        Weekly challenges
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-2)' }}>
        {rows.map((r) => (
          <ChallengeRow key={r.key} r={r} compact />
        ))}
      </div>
      <span className="sr-only" aria-live="polite">
        {rows.map((r) => r.valueText).join('. ')}
      </span>
    </Card>
  );
}
