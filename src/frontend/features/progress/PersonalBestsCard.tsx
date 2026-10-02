import type { CSSProperties } from 'react';
import { Card } from '@moonshot/design-system/card';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Progress: personal bests, all time. */
export function PersonalBestsCard({ v, style }: { v: PlannerVals; style?: CSSProperties }) {
  return (
    <Card style={style}>
      <SectionLabel as="span" label="Personal bests" aside={v.allTimeLabel} />
      {v.recordsEmpty ? (
        <Text variant="strong" as="p" tone="muted" style={{ margin: '10px 0 0' }}>
          Tick off an exercise with a weight, or finish a ride, and your bests show up here.
        </Text>
      ) : null}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '12px' }}
      >
        {(v.records ?? []).map((r, i) => (
          <div key={i} style={css(r?.rowStyle)}>
            <Text variant="strong" tone="ink" style={{ flex: '1', minWidth: '0' }}>
              {r?.name}
            </Text>
            <Text variant="figure" tone="ink" style={{ flex: 'none' }}>
              {r?.value}
            </Text>
            {r?.delta ? <span style={css(r?.deltaStyle)}>{r?.delta}</span> : null}
          </div>
        ))}
      </div>
    </Card>
  );
}
