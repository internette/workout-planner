import { Fragment } from 'react';
import { Gem } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { t } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { STATUS_NAMES, StatusDot } from '@/frontend/components/StatusDot';

/** Progress: the streak, with each recent training day and its status dot, as the calendar draws them. */
export function StreakBanner({ v }: { v: PlannerVals }) {
  const ticks = v.streakTicks ?? [];
  // The key names only the dots that are showing, in the order a day goes: done, partly, missed, then today's planned.
  const order = ['done', 'partly', 'missed', 'planned'];
  const shown = STATUS_NAMES.filter(([status]) => ticks.some((x) => x.dot === status)).sort(
    (a, b) => order.indexOf(a[0]) - order.indexOf(b[0]),
  );
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
        <ul style={{ display: 'flex', gap: '6px', margin: '9px 0 0', padding: 0, listStyle: 'none' }}>
          {ticks.map((x, i) => (
            <Fragment key={i}>
              <li
                style={{
                  flex: '1',
                  minWidth: '0',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '2px',
                  fontFamily: 'var(--font-heading)',
                  color: x.today ? 'var(--color-accent-deep)' : 'var(--color-ink)',
                }}
              >
                <span aria-hidden="true" style={{ fontSize: 'var(--text-sm)', fontWeight: 'var(--font-weight-bold)' }}>
                  {x.day}
                </span>
                <span
                  aria-hidden="true"
                  style={{
                    fontSize: 'var(--text-xs)',
                    fontWeight: 'var(--font-weight-semibold)',
                    color: x.today ? 'var(--color-accent-deep)' : 'var(--color-muted)',
                  }}
                >
                  {x.num}
                </span>
                <span style={{ marginTop: '4px' }}>
                  <StatusDot status={x.dot} />
                </span>
                <span className="sr-only">{x.aria}</span>
              </li>
            </Fragment>
          ))}
        </ul>
        {shown.length ? (
          <div aria-hidden="true" style={{ display: 'flex', flexWrap: 'wrap', gap: '4px 12px', marginTop: '10px' }}>
            {shown.map(([status, name]) => (
              <Text key={status} variant="small" tone="slateDeep" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                <StatusDot status={status} />
                {name}
              </Text>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
