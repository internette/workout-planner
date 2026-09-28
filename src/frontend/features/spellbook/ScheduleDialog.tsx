import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Dialog } from '@moonshot/design-system/dialog';
import { TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** A saved workout’s “Add to calendar”: the day, and repeating it. */
export function ScheduleDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.scheduleCalendar?.open}
      onClose={v.scheduleCalendar?.cancel}
      title={v.scheduleCalendar?.title ?? ''}
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={v.scheduleCalendar?.cancel}>
            Cancel
          </Button>
          <Button type="primary" size="md" onClick={v.scheduleCalendar?.add} disabled={!v.scheduleCalendar?.canAdd}>
            Add to calendar
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '16px' }}>
        <TextField
          label="Day"
          type="date"
          value={v.scheduleCalendar?.date ?? ''}
          onChange={v.scheduleCalendar?.setDate}
        />
        <Checkbox switch checked={!!v.scheduleCalendar?.repeat} onChange={v.scheduleCalendar?.setRepeat}>
          Repeat weekly
        </Checkbox>
        {v.scheduleCalendar?.showLogDone ? (
          <Checkbox switch checked={!!v.scheduleCalendar?.logDone} onChange={v.scheduleCalendar?.setLogDone}>
            Log it as done
          </Checkbox>
        ) : null}
        <Text variant="caption" tone="muted" as="p" style={{ margin: 0 }}>
          {v.scheduleCalendar?.note}
        </Text>
      </div>
    </Dialog>
  );
}
