import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { OpensChevron, progCard } from './progCard';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

// The bar's parts: done solid, partly done striped, missed grey. What's still to go is the track.
const SEGMENT = {
  done: 'var(--color-accent)',
  partly:
    'repeating-linear-gradient(135deg,color-mix(in srgb, var(--color-accent) 55%, transparent) 0 3px,color-mix(in srgb, var(--color-accent) 22%, transparent) 3px 6px)',
  missed: 'color-mix(in srgb, var(--color-ink) 18%, transparent)',
};

/** Progress: this week's sessions, done, partly done, missed and to go, opening the week. */
export function ThisWeekCard({ v }: { v: PlannerVals }) {
  return (
    <Card as="button" interactive pad="sm" onClick={v.openWeek} style={progCard('1 1 260px')}>
      <OpensChevron />
      <Text variant="micro" as="span" tone="muted" style={{ display: 'block' }}>
        {v.wkHas ? v.wkEyebrow : 'This week'}
      </Text>
      {v.wkEmpty ? (
        <Text variant="strong" as="span" tone="muted" style={{ display: 'block', margin: '6px 0 0' }}>
          Nothing planned this week yet.
        </Text>
      ) : null}
      {v.wkHas ? (
        <>
          <span style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '2px 14px', marginTop: '6px' }}>
            {(v.wkParts ?? []).map((p) => (
              <span key={p.label} style={{ display: 'inline-flex', alignItems: 'baseline', gap: '5px' }}>
                <Text variant="heading">{p.n}</Text>
                <Text variant="strong" tone="muted">
                  {p.label}
                </Text>
              </span>
            ))}
          </span>
          <span
            aria-hidden="true"
            style={{
              display: 'flex',
              height: '7px',
              borderRadius: '4px',
              background: 'var(--color-accent-tint)',
              marginTop: '14px',
              overflow: 'hidden',
            }}
          >
            {(v.wkSegments ?? []).map((g) => (
              <span key={g.kind} style={{ display: 'block', width: g.pct + '%', background: SEGMENT[g.kind] }} />
            ))}
          </span>
        </>
      ) : null}
    </Card>
  );
}
