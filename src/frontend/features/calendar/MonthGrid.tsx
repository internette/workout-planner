import { Fragment } from 'react';
import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { StatusDot } from '@/frontend/components/StatusDot';

/** The Month view’s grid of days, moved around with the arrow keys. */
export function MonthGrid({ v }: { v: PlannerVals }) {
  return (
    <>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
          marginTop: '26px',
        }}
      >
        {(v.dowLabels ?? []).map((l, i) => (
          <Fragment key={i}>
            <div
              style={{
                textAlign: 'center',
                fontFamily: 'var(--font-heading)',
                fontSize: 'var(--text-md)',
                fontWeight: 'var(--font-weight-semibold)',
                color: 'var(--color-muted)',
                paddingBottom: '10px',
              }}
            >
              {l}
            </div>
          </Fragment>
        ))}
      </div>
      <div style={{ position: 'relative' }}>
        <div
          role="group"
          aria-label={v.monthYear + '. Use the arrow keys to move between days.'}
          onKeyDown={v.monthKeyDown}
          style={{
            position: 'relative',
            display: 'grid',
            gridTemplateColumns: 'repeat(7,minmax(0,1fr))',
            gap: '4px',
          }}
        >
          {(v.monthCells ?? []).map((c, i) =>
            c?.blank ? (
              <div key={i} aria-hidden="true" style={css(c?.wrap)}></div>
            ) : (
              <button
                key={i}
                onClick={c?.pick}
                tabIndex={c?.tabStop}
                data-month-day={c?.day}
                aria-label={c?.aria}
                aria-current={c?.isToday}
                aria-pressed={c?.selected}
                style={css(c?.wrap)}
              >
                <span style={css(c?.num)}>{c?.label}</span>
                <StatusDot status={c?.dot} onAccent={!!c?.selected} />
              </button>
            ),
          )}
        </div>
      </div>
    </>
  );
}
