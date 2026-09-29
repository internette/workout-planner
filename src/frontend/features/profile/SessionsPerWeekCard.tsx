import { Fragment } from 'react';
import { Badge } from '@moonshot/design-system/badge';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import { SectionHeader } from '@/frontend/components/SectionHeader';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { KindTag, kindOf } from '@/frontend/components/KindTag';

/** Profile: sessions per week as a bar chart, and the picked week’s sessions. */
export function SessionsPerWeekCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: '14px' }}>
      <SectionHeader title="SESSIONS PER WEEK" note={v.chartRangeLabel} />
      <Text variant="caption" as="p" tone="muted" style={{ margin: '8px 0 0' }}>
        {v.chartCaption}
      </Text>
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          gap: '4px',
          height: '132px',
          marginTop: '14px',
        }}
      >
        {(v.weeklyBars ?? []).map((b, i) => (
          <Fragment key={i}>
            <button
              onClick={b?.pick}
              aria-label={b?.aria}
              aria-pressed={b?.on}
              style={{
                flex: '1',
                minWidth: '0',
                minHeight: '44px',
                border: 'none',
                background: 'none',
                padding: '0',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-end',
                alignItems: 'center',
                gap: '6px',
                cursor: 'pointer',
              }}
              title={b?.tip}
            >
              <span style={css(b?.value)}>{b?.count}</span>
              <div style={css(b?.bar)}></div>
              <span style={css(b?.label)}>{b?.week}</span>
            </button>
          </Fragment>
        ))}
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
          marginTop: '18px',
          paddingTop: '16px',
          borderTop: '1px solid var(--color-line)',
        }}
      >
        {(v.weekSessions ?? []).map((w, i) => (
          <Fragment key={i}>
            <button
              onClick={w?.open}
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                border: 'none',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-canvas)',
                textAlign: 'left',
                cursor: 'pointer',
                width: '100%',
              }}
              className="hv7"
            >
              <Text variant="eyebrow" tone="muted" style={{ flex: 'none', width: '56px' }}>
                {w?.day}
              </Text>
              <span
                style={{
                  flex: '1 1 140px',
                  minWidth: '0',
                  fontSize: 'var(--text-base)',
                  fontWeight: 'var(--font-weight-semibold)',
                  color: 'var(--color-ink)',
                }}
              >
                {w?.name}
                <KindTag inline kind={kindOf(w)} />
              </span>
              <Badge tone={w?.statusTone}>{w?.statusLabel}</Badge>
            </button>
          </Fragment>
        ))}
        {v.weekEmpty ? (
          <>
            <Text variant="body" as="p" tone="muted" style={{ margin: '0' }}>
              A quiet week. Nothing was planned.
            </Text>
          </>
        ) : null}
      </div>
    </Card>
  );
}
