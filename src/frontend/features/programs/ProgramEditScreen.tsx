// Editing a program: its name and notes, and each block's name, weeks and week of workouts (or, a block that goes week
// by week, each of its weeks' workouts). Every change saves as it's
// made. A day's workouts are picked from the Spellbook and copied into the program; tapping one opens it in the
// workout editor, where changes stay in this program.
import { Button, IconButton, Pressable } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Dialog } from '@moonshot/design-system/dialog';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
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
    <Dialog open={p.open} onClose={p.cancel} title={p.title} variant="sheet">
      <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
        The program gets its own copy: changes to it stay in the program.
      </Text>
      {p.dayChoice ? (
        <div style={{ marginTop: 'var(--space-3)' }}>
          <Text variant="micro" tone="slate" as="div" aria-hidden="true" style={{ marginBottom: 'var(--space-2)' }}>
            On
          </Text>
          <SegmentedControl label="On" options={p.dayChoice.options} value={p.dayChoice.value} onChange={p.dayChoice.set} fullWidth equalWidth compact />
        </div>
      ) : null}
      <div style={{ marginTop: 'var(--space-3)' }}>
        <SearchBar value={p.q} onChange={p.setQ} placeholder="Search workouts" label="Search workouts" onClear={p.clearQ} status="" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)', maxHeight: '50vh', overflowY: 'auto' }}>
        {p.groups.map((g) => (
          <div key={g.label}>
            <SectionLabel list label={g.label} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {g.items.map((w) => (
                <Pressable
                  key={w.key}
                  onClick={w.pick}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: '52px', padding: 'var(--space-1) 0'}}
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
                </Pressable>
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
      <Text variant="micro" tone="slate" as="div" style={{ marginTop: 'var(--space-5)' }}>
        Editing program
      </Text>
      {/* Saved when the field is left, so each letter typed isn't a save. Keyed by the saved value, so a change saved
          elsewhere shows. */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
        <TextField key={'n' + e.name} label="Program name" defaultValue={e.name} onBlur={e.rename} maxLength={80} />
        <TextField key={'t' + e.notes} label="Notes" labelNote="Optional" defaultValue={e.notes} onBlur={e.setNotes} placeholder="What it's for, how to run it" />
      </div>
      {e.runningNote ? (
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-3) 0 0' }}>
          {e.runningNote}
        </Text>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-5)' }}>
        {e.blocks.map((b) => (
          <Card key={b.key}>
            <Text variant="micro" tone="slate" as="div">
              {b.heading}
            </Text>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-3)', alignItems: 'flex-end', marginTop: 'var(--space-3)' }}>
              <TextField key={'b' + b.name} label="Block name" defaultValue={b.name} onBlur={b.rename} maxLength={40} containerStyle={{ flex: '1 1 160px' }} />
              <div>
                <Text variant="micro" tone="slate" as="div" style={{ marginBottom: 'var(--space-2)' }}>
                  Weeks
                </Text>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', height: '48px', padding: '0 var(--space-1)', borderRadius: 'var(--radius-md)', background: 'var(--color-canvas)' }}>
                  <IconButton label="One week fewer" size="md" onClick={b.fewer || undefined} disabled={!b.fewer || b.weeksBusy}>
                    <span aria-hidden="true" style={{ fontSize: 'var(--text-xl)', lineHeight: 1, color: 'var(--color-pink-deep)' }}>
                      −
                    </span>
                  </IconButton>
                  <Text variant="subheading" aria-live="polite" style={{ minWidth: '24px', textAlign: 'center' }}>
                    {b.weeks}
                  </Text>
                  <IconButton label="One week more" size="md" onClick={b.more || undefined} disabled={!b.more || b.weeksBusy}>
                    <Plus color="var(--color-pink-deep)" size={16} />
                  </IconButton>
                </div>
              </div>
            </div>
            {b.weekModes ? (
              // Held still while its weeks save: copying workouts into every week takes a moment.
              <div aria-busy={b.weeksBusy} style={{ marginTop: 'var(--space-4)', ...(b.weeksBusy ? { pointerEvents: 'none', opacity: 0.6 } : {}) }}>
                <SegmentedControl label="How its weeks go" options={b.weekModes} value={b.byWeek ? 'week' : 'same'} onChange={b.setWeekMode} tone="quiet" fullWidth equalWidth />
              </div>
            ) : null}
            <Text variant="body" tone="muted" as="p" role="status" style={{ margin: b.weeksBusy ? 'var(--space-2) 0 0' : 0 }}>
              {b.weeksBusy ? 'Updating its weeks…' : ''}
            </Text>
            {b.weekList ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)' }}>
                {b.weekList.map((wk, k) => (
                  <div
                    key={wk.key}
                    style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', ...(k ? { borderTop: '1px solid var(--color-line)', paddingTop: 'var(--space-4)' } : {}) }}
                  >
                    <Text variant="micro" tone="slate" as="div">
                      {wk.label}
                    </Text>
                    {wk.workouts.map((w) => (
                      <div key={w.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-1) var(--space-1) var(--space-1) var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-canvas)' }}>
                        <Pressable onClick={w.open} aria-label={w.openLabel} style={{ flex: 1, minWidth: 0, minHeight: '44px' }}>
                          <Text variant="body" weight="semibold" as="span" style={{ display: 'block' }}>
                            {w.name}
                          </Text>
                          <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                            {w.meta}
                          </Text>
                        </Pressable>
                        <Pencil color="var(--color-muted)" size={14} aria-hidden="true" />
                        <IconButton label={w.removeLabel} size="md" onClick={w.remove}>
                          <Close color="var(--color-muted)" size={14} />
                        </IconButton>
                      </div>
                    ))}
                    {!wk.workouts.length ? (
                      <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
                        No workouts yet.
                      </Text>
                    ) : null}
                  </div>
                ))}
                <Button type="dashed" size="md" onClick={b.addEveryWeek} style={{ width: '100%' }}>
                  <Plus color="var(--color-pink-deep)" size={14} />
                  Add a workout to every week
                </Button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
                {b.days.map((d) => (
                  <div key={d.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-2)' }}>
                    <Text variant="micro" tone="slate" style={{ width: '88px', flex: 'none', paddingTop: 'var(--space-3)' }}>
                      {d.day}
                    </Text>
                    <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
                      {d.workouts.map((w) => (
                        <div key={w.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-1)', padding: 'var(--space-1) var(--space-1) var(--space-1) var(--space-3)', borderRadius: 'var(--radius-md)', background: 'var(--color-canvas)' }}>
                          <Pressable
                            onClick={w.open}
                            aria-label={'Edit ' + w.name}
                            style={{ flex: 1, minWidth: 0, minHeight: '44px'}}
                          >
                            <Text variant="body" weight="semibold" as="span" style={{ display: 'block' }}>
                              {w.name}
                            </Text>
                            <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                              {w.meta}
                            </Text>
                          </Pressable>
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
            )}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
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
      <Button type="dashed" size="md" onClick={e.addEmpty} style={{ width: '100%', marginTop: 'var(--space-4)' }}>
        <Plus color="var(--color-pink-deep)" size={16} />
        Empty block
      </Button>
      <div style={{ marginTop: 'var(--space-7)' }}>
        <Button type="danger" ghost size="sm" onClick={e.remove}>
          <Trash color="var(--color-danger)" size={14} />
          Delete program
        </Button>
      </div>
      <PickerDialog v={v} />
    </div>
  );
}
