import { Card } from '@moonshot/design-system/card';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Progress: weekly challenges so far, and the last few weeks with a dot for each one cleared. */
export function ChallengeWeeksCard({ v }: { v: PlannerVals }) {
  const s = v.challengeStats;
  if (!s.has) return null;
  const tiles = [
    { label: 'Cleared', value: s.cleared },
    { label: 'Full weeks', value: s.full },
    { label: 'XP won', value: s.xp },
  ];
  return (
    <Card style={{ marginTop: 'var(--space-4)' }}>
      <SectionLabel as="span" label="Weekly challenges" aside={s.aside || undefined} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
        {tiles.map((t) => (
          <div key={t.label} style={{ background: 'var(--color-pink-tint)', borderRadius: 'var(--radius-lg)', padding: 'var(--space-2) var(--space-3)', display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <Text variant="small" tone="slate">
              {t.label}
            </Text>
            <span style={{ fontFamily: 'var(--font-heading)', fontSize: 'var(--text-xl)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-ink)' }}>{t.value}</span>
          </div>
        ))}
      </div>
      <ul style={{ listStyle: 'none', margin: 'var(--space-3) 0 0', padding: 0 }}>
        {s.weeks.map((w) => (
          <li key={w.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: '44px', borderBottom: w.last ? undefined : '1px solid var(--color-line)' }}>
            <Text variant="small" tone="slate" style={{ flex: 'none', width: '72px' }}>
              {w.label}
            </Text>
            <Text variant="body" tone="ink" style={{ flex: 1, minWidth: 0 }}>
              {w.what}
            </Text>
            <span role="img" aria-label={w.aria} style={{ display: 'flex', gap: '3px', flex: 'none' }}>
              {w.dots.map((d) => (
                <span
                  key={d.key}
                  style={{ width: '12px', height: '12px', boxSizing: 'border-box', borderRadius: 'var(--radius-full)', ...(d.on ? { background: 'var(--color-pink)' } : { border: '2px solid var(--color-outline)' }) }}
                />
              ))}
            </span>
          </li>
        ))}
      </ul>
    </Card>
  );
}
