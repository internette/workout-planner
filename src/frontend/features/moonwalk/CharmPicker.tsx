import { Button } from '@moonshot/design-system/buttons';
import { Chip } from '@moonshot/design-system/chip';
import { Dialog } from '@moonshot/design-system/dialog';
import { OptionCard, OptionGroup } from '@moonshot/design-system/option-card';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Picks today's charm from the ones held: the recommended one is selected when it opens. */
export function CharmPicker({ v }: { v: PlannerVals | null }) {
  if (!v || !v.cpOpen) return null;
  return (
    <Dialog
      open
      onClose={v.cpClose}
      title="Today’s charm"
      aside="1 a day"
      variant="sheet"
      description={v.cpNow ? 'This one works as soon as you use it, so it can’t be changed after.' : 'You can change it until it starts working.'}
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={v.cpClose}>
            Cancel
          </Button>
          <Button type="primary" size="md" onClick={v.cpUse} disabled={!v.cpCanUse || v.tcBusy}>
            {v.cpName ? 'Use ' + v.cpName + ' today' : 'Use today'}
          </Button>
        </>
      }
    >
      {v.cpList.length ? (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <OptionGroup label="Charms you hold">
            {v.cpList.map((c) => (
              <OptionCard
                key={c.key}
                name="charm"
                value={c.key}
                checked={c.selected}
                disabled={c.disabled}
                onChange={c.choose}
                title={(c.recommended ? 'Recommended · ' : '') + c.name + ' ×' + c.count}
                description={c.what + '. ' + c.note}
              >
                {c.selected && v.cpTargetLabel ? (
                  <div style={{ marginTop: 'var(--space-2)' }}>
                    {v.cpWishSets.length ? (
                      <div role="group" aria-label="Set" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginBottom: 'var(--space-2)' }}>
                        {v.cpWishSets.map((s) => (
                          <Chip key={s.key} tone="choice" size="sm" selected={s.on} onClick={s.choose}>
                            {s.label}
                          </Chip>
                        ))}
                      </div>
                    ) : null}
                    <div role="group" aria-label={v.cpTargetLabel} style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
                      {v.cpTargets.map((t) => (
                        <Chip key={t.key} tone="choice" size="sm" selected={t.on} onClick={t.choose}>
                          {t.label}
                        </Chip>
                      ))}
                    </div>
                  </div>
                ) : null}
              </OptionCard>
            ))}
          </OptionGroup>
        </div>
      ) : (
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-4) 0 0' }}>
          You don’t hold any charms yet. Craft one at the Charm Table, under Profile.
        </Text>
      )}
    </Dialog>
  );
}
