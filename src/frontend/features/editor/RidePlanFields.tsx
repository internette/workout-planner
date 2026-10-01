import { Card } from '@moonshot/design-system/card';
import { Chip } from '@moonshot/design-system/chip';
import { Label, TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import { DurationFields } from '@/frontend/components/DurationFields';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { RIDE_ZONES } from '@/shared/planDraft';
import { ChipRow } from '@/frontend/components/ChipRow';

/** A ride’s plan: distance, elevation, duration and effort zone. */
export function RidePlanFields({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: '16px' }}>
      <Text variant="eyebrow" as="div" tone="slate">
        RIDE PLAN
      </Text>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '16px' }}>
        <TextField
          label="Distance"
          labelNote="(miles)"
          containerStyle={{ flex: '1 1 130px', minWidth: '0' }}
          value={v.rideDistance ?? ''}
          onChange={v.setDistance}
          inputMode="decimal"
          placeholder="24.5"
        />
        <TextField
          label="Elevation"
          labelNote="(feet)"
          containerStyle={{ flex: '1 1 130px', minWidth: '0' }}
          value={v.rideElev ?? ''}
          onChange={v.setElev}
          inputMode="numeric"
          placeholder="1200"
        />
        <div style={{ flex: '1 1 210px', minWidth: '0' }}>
          <Label>Duration</Label>
          <DurationFields
            hours={v.rideHours ?? ''}
            minutes={v.rideMins ?? ''}
            onHours={v.setHours}
            onMinutes={v.setMins}
            onMinutesBlur={v.rollMins}
            placeholders={['1', '20']}
          />
        </div>
      </div>
      <Label style={{ margin: '18px 0 9px' }}>Target effort</Label>
      <ChipRow>
        {RIDE_ZONES.map((zone) => (
          <Chip
            key={zone}
            tone="choice"
            size="md"
            selected={v.rideZone === zone}
            onClick={() => v.setRideZone(zone)}
          >
            {zone}
          </Chip>
        ))}
      </ChipRow>
    </Card>
  );
}
