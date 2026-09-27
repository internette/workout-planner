import { Fragment } from 'react';
import { Gem } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { css, t } from '@/features/planner/viewHelpers';
import type { PlannerVals } from '@/features/planner/store/types';

/** Progress: the streak, with a tick for each recent day. */
export function StreakBanner({ v }: { v: PlannerVals }) {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '18px 26px',
        marginTop: '22px',
        padding: '22px 24px',
        borderRadius: 'var(--radius-lg)',
        background:
          'var(--gradient-gem-tint)',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: '0 1 auto', minWidth: '0' }}>
        <Gem size={30} />
        <div style={{ minWidth: '0' }}>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: '7px' }}>
            <Text variant="bigNumber" tone="ink">
              {v.streakCount}
            </Text>
            <Text variant="label" weight="semibold" tone="accent">
              {t(v.streakUnit)}
              {' streak'}
            </Text>
          </div>
          <Text
            variant="caption"
            as="p"
            weight="medium"
            tone="slateDeep"
            style={{ margin: '6px 0 0' }}
          >
            {v.streakNote}
          </Text>
        </div>
      </div>
      <div style={{ flex: '1 1 180px', minWidth: '0' }}>
        <Text variant="micro" as="div" tone="slateDeep">
          {v.ticksLabel}
        </Text>
        {v.ticksEmpty ? (
          <Text variant="caption" as="p" weight="medium" tone="slateDeep" style={{ margin: '9px 0 0' }}>
            Clear a day and it lights up here.
          </Text>
        ) : null}
        <div style={{ display: 'flex', gap: '6px', marginTop: '9px' }}>
          {(v.streakTicks ?? []).map((t, i) => (
            <Fragment key={i}>
              <span style={{ flex: '1', minWidth: '0' }}>
                <span style={css(t?.bar)}></span>
                <span style={css(t?.cap)}>{t?.label}</span>
              </span>
            </Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}
