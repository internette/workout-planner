import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Label, TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import { css } from '@/features/planner/viewHelpers';
import { DurationFields } from '@/components/DurationFields';
import type { PlannerVals } from '@/features/planner/store/types';

/** A ride against its plan: what was actually ridden. */
export function RideActualCard({ v }: { v: PlannerVals }) {
  return (
    <>
      <Card style={{ marginTop: '14px' }}>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '8px' }}
        >
          <Text variant="eyebrow" tone="slate">
            WHAT YOU ACTUALLY RODE
          </Text>
          <span
            style={{
              marginLeft: 'auto',
              fontFamily: 'var(--font-heading)',
              fontSize: 'var(--text-base)',
              fontWeight: 'var(--font-weight-bold)',
              color: 'var(--color-ink)',
            }}
          >
            {v.ridePctLabel}
          </span>
        </div>
        <ProgressBar value={v.rideBarPct ?? 0} track="mist" style={{ marginTop: '12px' }} />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '18px' }}>
          <TextField
            label="Distance"
            labelNote="(miles)"
            hint={v.plannedDist}
            containerStyle={{ flex: '1 1 130px', minWidth: '0' }}
            value={v.actDistance ?? ''}
            onChange={v.setActDistance}
            inputMode="decimal"
            placeholder={v.plannedDistPh}
          />
          <TextField
            label="Elevation"
            labelNote="(feet)"
            hint={v.plannedElev}
            containerStyle={{ flex: '1 1 130px', minWidth: '0' }}
            value={v.actElev ?? ''}
            onChange={v.setActElev}
            inputMode="numeric"
            placeholder={v.plannedElevPh}
          />
          <div style={{ flex: '1 1 210px', minWidth: '0' }}>
            <Label>Duration</Label>
            <DurationFields
              hours={v.actHours ?? ''}
              minutes={v.actMins ?? ''}
              onHours={v.setActHours}
              onMinutes={v.setActMins}
              onMinutesBlur={v.rollActMins}
              placeholders={['0', '0']}
              name="Actual duration"
            />
            <span
              style={{
                display: 'block',
                fontSize: 'var(--text-xs)',
                fontWeight: 'var(--font-weight-regular)',
                color: 'var(--color-subtle)',
                marginTop: '6px',
              }}
            >
              {v.plannedDur}
            </span>
          </div>
        </div>
        <p style={css(v.rideNoteStyle)}>{v.rideNote}</p>
      </Card>
    </>
  );
}
