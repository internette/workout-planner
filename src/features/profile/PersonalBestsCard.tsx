import { Fragment } from 'react';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/features/planner/viewHelpers';
import { SectionHeader } from '@/components/SectionHeader';
import type { PlannerVals } from '@/features/planner/store/types';

/** Profile: personal bests, all time. */
export function PersonalBestsCard({ v }: { v: PlannerVals }) {
  return (
    <Card>
      <SectionHeader title="PERSONAL BESTS" note={v.allTimeLabel} />
      {v.recordsEmpty ? (
        <Text variant="caption" as="p" tone="muted" weight="medium" style={{ margin: '10px 0 0' }}>
          Tick off an exercise with a weight, or finish a ride, and your bests show up here.
        </Text>
      ) : null}
      <div
        style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginTop: '12px' }}
      >
        {(v.records ?? []).map((r, i) => (
          <Fragment key={i}>
            <div style={css(r?.rowStyle)}>
              <Text variant="label" tone="ink" style={{ flex: '1', minWidth: '0' }}>
                {r?.name}
              </Text>
              <span
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-bold)',
                  color: 'var(--color-ink)',
                  flex: 'none',
                }}
              >
                {r?.value}
              </span>
              <span style={css(r?.deltaStyle)}>{r?.delta}</span>
            </div>
          </Fragment>
        ))}
      </div>
    </Card>
  );
}
