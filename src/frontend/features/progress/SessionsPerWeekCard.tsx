import { Pressable } from '@moonshot/design-system/buttons';
import { Badge } from '@moonshot/design-system/badge';
import { Card } from '@moonshot/design-system/card';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { css } from '@/frontend/features/planner/viewHelpers';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { KindTag, kindOf } from '@/frontend/components/KindTag';

/** Progress: sessions per week as a bar chart, and, once a week's bar is picked, that week's sessions. */
export function SessionsPerWeekCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: '14px' }}>
      <SectionLabel as="span" label="Sessions per week" aside={v.chartRangeLabel} />
      {v.chartCaption ? (
        <Text variant="body" as="p" tone="muted" style={{ margin: '8px 0 0' }}>
          {v.chartCaption}
        </Text>
      ) : null}
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-end',
          // No gap: each week's column is tappable edge to edge (the space between bars is inside each column).
          height: '132px',
          // Room for the tallest bar's count under the label when there's no caption.
          marginTop: v.chartCaption ? '14px' : '30px',
        }}
      >
        {(v.weeklyBars ?? []).map((b, i) => (
          <button key={i}
            onClick={b?.pick}
            aria-label={b?.aria}
            aria-pressed={b?.on}
            style={{
              flex: '1',
              minWidth: '0',
              minHeight: '44px',
              border: 'none',
              background: 'none',
              // The 4 px between bars, inside each column's tap area rather than between them.
              padding: '0 2px',
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
        ))}
      </div>
      {v.barPicked ? (
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
            <Pressable
              key={i}
              onClick={w?.open}
              wash="accent"
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '12px',
                padding: '12px 14px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-canvas)',
                width: '100%',
              }}
            >
              <Text variant="micro" tone="muted" style={{ flex: 'none', width: '56px' }}>
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
            </Pressable>
          ))}
          {v.weekEmpty ? (
            <Text variant="body" as="p" tone="muted" style={{ margin: '0' }}>
              A quiet week. Nothing was planned.
            </Text>
          ) : null}
        </div>
      ) : null}
    </Card>
  );
}
