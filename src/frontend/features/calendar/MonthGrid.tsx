import type { CSSProperties } from 'react';
import { Pressable } from '@moonshot/design-system/buttons';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { StatusDot } from '@/frontend/components/StatusDot';

// A day's tile by what's on it; today that isn't the selected day gets the soft accent ring.
const TILE: Record<string, CSSProperties> = {
  selected: { background: 'var(--color-pink)' },
  missed: { background: 'var(--color-surface-rest)' },
  planned: { background: 'var(--color-surface)', boxShadow: 'var(--elevation-hairline)' },
  rest: { background: 'none' },
};

/** The Month view’s grid of days, moved around with the arrow keys. */
export function MonthGrid({ v }: { v: PlannerVals }) {
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
          marginTop: 'var(--space-7)',
        }}
      >
        {(v.dowLabels ?? []).map((l, i) => (
          <Text key={i} variant="figure" tone="muted" as="div" style={{ textAlign: 'center', paddingBottom: 'var(--space-2)' }}>
            {l}
          </Text>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <div
          role="group"
          aria-label={v.monthYear + '. Use the arrow keys to move between days, and Page Up and Page Down between months.'}
          onKeyDown={v.monthKeyDown}
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
            gap: 'var(--space-1)',
          }}
        >
          {(v.monthCells ?? []).map((c, i) =>
            c?.blank ? (
              <div key={i} aria-hidden="true" style={{ height: '50px' }}></div>
            ) : (
              <Pressable
                key={i}
                onClick={c?.pick}
                tabIndex={c?.tabStop}
                data-month-day={c?.day}
                aria-label={c?.aria}
                aria-current={c?.isToday}
                aria-pressed={c?.selected}
                style={{
                  height: '50px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 'var(--space-1)',
                  ...TILE[c?.tone ?? 'rest'],
                  ...(c?.today && !c?.selected ? { boxShadow: 'var(--ring-accent-soft)' } : {}),
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontSize: 'var(--text-base)',
                    fontWeight: c?.has ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)',
                    color: c?.selected ? 'var(--color-surface)' : c?.tone === 'missed' ? 'var(--color-muted)' : c?.has ? 'var(--color-ink)' : 'var(--color-muted)',
                  }}
                >
                  {c?.label}
                </span>
                <StatusDot status={c?.dot} selected={!!c?.selected} />
              </Pressable>
            ),
          )}
        </div>
      </div>
    </>
  );
}
