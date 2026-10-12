// Editing a program: its name and notes, and each block's name, weeks and week of workouts. Every change saves as it's
// made. A day's workouts are picked from the Spellbook and copied into the program; tapping one opens it in the
// workout editor, where changes stay in this program.
import { Button, IconButton } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Dialog } from '@moonshot/design-system/dialog';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { TextField } from '@moonshot/design-system/text-field';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { Close, Copy, Pencil, Plus, Trash } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import { SearchBar } from '@/frontend/components/SearchBar';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

function PickerDialog({ v }: { v: PlannerVals }) {
  const p = v.programPicker;
  if (!p) return null;
  return (
    <Dialog open={p.open} onClose={p.cancel} title={p.title} sheet>
      <Text variant="body" tone="muted" as="p" style={{ margin: '6px 0 0' }}>
        The program gets its own copy: changes to it stay in the program.
      </Text>
      <div style={{ marginTop: '12px' }}>
        <SearchBar value={p.q} onChange={p.setQ} placeholder="Search workouts" label="Search workouts" onClear={p.clearQ} status="" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '14px', maxHeight: '50vh', overflowY: 'auto' }}>
        {p.groups.map((g) => (
          <div key={g.label}>
            <SectionLabel list label={g.label} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
              {g.items.map((w) => (
                <button
                  key={w.key}
                  type="button"
                  onClick={w.pick}
                  style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '52px', padding: '4px 0', border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                >
                  <IconTile as="span" size="xs" variant="flat">
                    {w.svg}
                  </IconTile>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="body" weight="semibold" as="span" style={{ display: 'block' }}>
                      {w.name}
                    </Text>
                    <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                      {w.meta}
                    </Text>
                  </span>
                  <Plus color="var(--color-pink-deep)" size={16} />
                </button>
              ))}
            </div>
          </div>
        ))}
        {!p.groups.length ? (
          <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
            No workouts match.
          </Text>
        ) : null}
      </div>
    </Dialog>
  );
}

export function ProgramEditScreen({ v }: { v: PlannerVals }) {
  const e = v.programEdit;
  if (!e) return null;
  return (
    <div>
      <BackBar label={v.backLabel} onBack={e.done}>
        <Button type="primary" size="sm" onClick={e.done}>
          Done
        </Button>
      </BackBar>
      <Text variant="micro" tone="slate" as="div" style={{ marginTop: '18px' }}>
        Editing program
      </Text>
      {/* Saved when the field is left, so each letter typed isn't a save. Keyed by the saved value, so a change saved
          elsewhere shows. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '10px' }}>
        <TextField key={'n' + e.name} label="Program name" defaultValue={e.name} onBlur={e.rename} maxLength={80} />
        <TextField key={'t' + e.notes} label="Notes" labelNote="Optional" defaultValue={e.notes} onBlur={e.setNotes} placeholder="What it's for, how to run it" />
      </div>
      {e.runningNote ? (
        <Text variant="body" tone="muted" as="p" style={{ margin: '12px 0 0' }}>
          {e.runningNote}
        </Text>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '18px' }}>
        {e.blocks.map((b) => (
          <Card key={b.key}>
            <Text variant="micro" tone="slate" as="div">
              {b.heading}
            </Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'flex-end', marginTop: '10px' }}>
              <TextField key={'b' + b.name} label="Block name" defaultValue={b.name} onBlur={b.rename} maxLength={40} containerStyle={{ flex: '1 1 160px' }} />
              <div>
                <Text variant="micro" tone="slate" as="div" style={{ marginBottom: '8px' }}>
                  Weeks
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', height: '48px', padding: '0 4px', borderRadius: 'var(--radius-md)', background: 'var(--color-canvas)' }}>
                  <IconButton label="One week fewer" size="md" onClick={b.fewer || undefined} disabled={!b.fewer}>
                    <span aria-hidden="true" style={{ fontSize: '20px', lineHeight: 1, color: 'var(--color-pink-deep)' }}>
                      −
                    </span>
                  </IconButton>
                  <Text variant="subheading" aria-live="polite" style={{ minWidth: '24px', textAlign: 'center' }}>
                    {b.weeks}
                  </Text>
                  <IconButton label="One week more" size="md" onClick={b.more || undefined} disabled={!b.more}>
                    <Plus color="var(--color-pink-deep)" size={16} />
                  </IconButton>
                </div>
              </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '16px' }}>
              {b.days.map((d) => (
                <div key={d.key} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                  <Text variant="micro" tone="slate" style={{ width: '88px', flex: 'none', paddingTop: '14px' }}>
                    {d.day}
                  </Text>
                  <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                    {d.workouts.map((w) => (
                      <div key={w.key} style={{ display: 'flex', alignItems: 'center', gap: '4px', padding: '4px 4px 4px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-canvas)' }}>
                        <button
                          type="button"
                          onClick={w.open}
                          aria-label={'Edit ' + w.name}
                          style={{ flex: 1, minWidth: 0, minHeight: '44px', padding: 0, border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
                        >
                          <Text variant="body" weight="semibold" as="span" style={{ display: 'block' }}>
                            {w.name}
                          </Text>
                          <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                            {w.meta}
                          </Text>
                        </button>
                        <Pencil color="var(--color-muted)" size={14} aria-hidden="true" />
                        <IconButton label={w.removeLabel} size="md" onClick={w.remove}>
                          <Close color="var(--color-muted)" size={14} />
                        </IconButton>
                      </div>
                    ))}
                    <Button type="dashed" size="sm" onClick={d.add} aria-label={d.addLabel}>
                      <Plus color="var(--color-pink-deep)" size={14} />
                      {d.workouts.length ? 'Add another' : 'Add workout'}
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
              <Button type="secondary" ghost size="sm" onClick={b.copyNext}>
                <Copy color="var(--color-pink-deep)" size={14} />
                Copy as next block
              </Button>
              {b.remove ? (
                <Button type="danger" ghost size="sm" onClick={b.remove} style={{ marginLeft: 'auto' }}>
                  <Trash color="var(--color-danger)" size={14} />
                  Delete block
                </Button>
              ) : null}
            </div>
          </Card>
        ))}
      </div>
      <Button type="dashed" size="md" onClick={e.addEmpty} style={{ width: '100%', marginTop: '14px' }}>
        <Plus color="var(--color-pink-deep)" size={16} />
        Empty block
      </Button>
      <div style={{ marginTop: '28px' }}>
        <Button type="danger" ghost size="sm" onClick={e.remove}>
          <Trash color="var(--color-danger)" size={14} />
          Delete program
        </Button>
      </div>
      <PickerDialog v={v} />
    </div>
  );
}
