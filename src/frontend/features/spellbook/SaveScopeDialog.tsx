import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Dialog } from '@moonshot/design-system/dialog';
import { OptionCard, OptionGroup } from '@moonshot/design-system/option-card';
import { TextField } from '@moonshot/design-system/text-field';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Saving a workout or exercise that has upcoming sessions: update it, or save it as new. */
export function SaveScopeDialog({ v }: { v: PlannerVals }) {
  return (
    <Dialog
      open={!!v.tplConfirmOpen}
      onClose={v.tplConfirmCancel}
      title={v.tplConfirmTitle}
      description={v.tplConfirmBody}
      size="md"
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={v.tplConfirmCancel}>
            Cancel
          </Button>
          <Button type="primary" size="md" onClick={v.tplConfirmSave} disabled={!!v.tplConfirmBlocked}>
            Save
          </Button>
        </>
      }
    >
      <div style={{ marginTop: '16px' }}>
        <OptionGroup label="How to save your changes">
          {(v.tplConfirmOptions ?? []).map((o) => (
            <OptionCard
              key={o.value}
              name="tplConfirmChoice"
              value={o.value}
              checked={v.tplConfirmChoice === o.value}
              onChange={v.tplConfirmSetChoice}
              title={o.title}
              description={o.description}
            >
              {o.value === 'update' && v.tplConfirmShowUpcoming ? (
                <Checkbox switch checked={v.tplConfirmUpcoming} onChange={v.tplConfirmToggleUpcoming}>
                  {v.tplConfirmUpcomingLabel}
                </Checkbox>
              ) : null}
              {o.value === 'new' && v.tplConfirmShowName ? (
                <TextField
                  aria-label="New workout name"
                  value={v.tplConfirmName ?? ''}
                  onChange={v.tplConfirmSetName}
                  placeholder="Name the new workout"
                  error={v.tplConfirmNameError || undefined}
                />
              ) : null}
            </OptionCard>
          ))}
        </OptionGroup>
      </div>
    </Dialog>
  );
}
