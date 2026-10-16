import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import { OptionCard, OptionGroup } from '@moonshot/design-system/option-card';
import { TextField } from '@moonshot/design-system/text-field';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/**
 * Saving a workout or exercise that has upcoming sessions: update it everywhere, update it only (its upcoming sessions
 * keep the old version), or save it as new. "Save as new" from the editor shows only the new one's name.
 */
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
            {v.tplConfirmSaveLabel}
          </Button>
        </>
      }
    >
      <div style={{ marginTop: 'var(--space-4)' }}>
        {v.tplConfirmOptions?.length ? (
          <OptionGroup label="How to save your changes">
            {v.tplConfirmOptions.map((o) => (
              <OptionCard
                key={o.value}
                name="tplConfirmChoice"
                value={o.value}
                checked={v.tplConfirmChoice === o.value}
                onChange={v.tplConfirmSetChoice}
                title={o.title}
                description={o.description}
              >
                {o.value === 'new' && v.tplConfirmShowName ? <NewName v={v} /> : null}
              </OptionCard>
            ))}
          </OptionGroup>
        ) : v.tplConfirmShowName ? (
          <NewName v={v} />
        ) : null}
      </div>
    </Dialog>
  );
}

/** The new one's name, with where it goes when that isn't plain. */
function NewName({ v }: { v: PlannerVals }) {
  return (
    <TextField
      label={v.tplConfirmNameLabel}
      value={v.tplConfirmName ?? ''}
      onChange={v.tplConfirmSetName}
      hint={v.tplConfirmNameHint || undefined}
      error={v.tplConfirmNameError || undefined}
    />
  );
}
