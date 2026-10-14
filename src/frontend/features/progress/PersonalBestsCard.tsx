import type { CSSProperties } from 'react';
import { Card } from '@moonshot/design-system/card';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Progress: personal bests, all time. */
export function PersonalBestsCard({ v, style }: { v: PlannerVals; style?: CSSProperties }) {
  return (
    <Card style={style}>
      <SectionLabel as="span" label="Personal bests" aside={v.allTimeLabel} />
      {v.recordsEmpty ? (
        <Text variant="strong" as="p" tone="muted" style={{ margin: 'var(--space-3) 0 0' }}>
          Tick off an exercise with a weight, or finish a ride, and your bests show up here.
        </Text>
      ) : null}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)', marginTop: 'var(--space-3)' }}
      >
        {(v.records ?? []).map((r, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', padding: 'var(--space-3) 0', borderBottom: r?.last ? undefined : '1px solid var(--color-line)' }}>
            <Text variant="strong" tone="ink" style={{ flex: '1', minWidth: '0' }}>
              {r?.name}
            </Text>
            <Text variant="figure" tone="ink" style={{ flex: 'none' }}>
              {r?.value}
            </Text>
            {r?.delta ? (
              <span style={{ flex: 'none', width: '44px', textAlign: 'right', fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-semibold)', color: 'var(--color-pink-deep)' }}>{r?.delta}</span>
            ) : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
