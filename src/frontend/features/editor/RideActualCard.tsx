import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Label, TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import { DurationFields } from '@/frontend/components/DurationFields';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** A ride against its plan: what was actually ridden. */
export function RideActualCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: 'var(--space-4)' }}>
      <div
        style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--space-2)' }}
      >
        <Text variant="micro" tone="slate">
          {v.rideWord === 'run' ? 'What you actually covered' : 'What you actually rode'}
        </Text>
        <Text variant="figure" tone="ink" style={{ marginLeft: 'auto' }}>
          {v.ridePctLabel}
        </Text>
      </div>
      <ProgressBar value={v.rideBarPct ?? 0} track="mist" style={{ marginTop: 'var(--space-3)' }} />
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
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
          <Text variant="small" tone="muted" as="span" style={{ display: 'block', marginTop: 'var(--space-2)' }}>
            {v.plannedDur}
          </Text>
        </div>
      </div>
      {/* Plan met: said in the accent. */}
      <p style={{ margin: 'var(--space-4) 0 0', fontSize: 'var(--text-base)', fontWeight: v.rideMet ? 'var(--font-weight-semibold)' : 'var(--font-weight-regular)', color: v.rideMet ? 'var(--color-pink-deep)' : 'var(--color-muted)' }}>
        {v.rideNote}
      </p>
    </Card>
  );
}
