// Every program run, from the Profile: the one running, then the ones done (finished, or ended early), newest first.
// A running one opens its program; one that's done, its own page with the program as it ran. Another program is added
// (or a first one started) from here: picked from a sheet, then started in the program's Start sheet.
import { Badge } from '@moonshot/design-system/badge';
import { Card } from '@moonshot/design-system/card';
import { Dialog } from '@moonshot/design-system/dialog';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { Button, Pressable } from '@moonshot/design-system/buttons';
import { ChevronRight, Plus } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import { SearchBar } from '@/frontend/components/SearchBar';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { StartDialog } from './ProgramScreen';

type Row = NonNullable<PlannerVals['programRuns']>['done'][number];

function RunRow({ r }: { r: Row }) {
  return (
    <Card as="button" interactive pad="sm" onClick={r.open} style={{ display: 'block', width: '100%', textAlign: 'left' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        <IconTile as="span" size="sm" variant="flat">
          {r.svg}
        </IconTile>
        <span style={{ flex: 1, minWidth: 0 }}>
          <Text variant="micro" tone={r.statusTone} as="span" style={{ display: 'block' }}>
            {r.status}
          </Text>
          <Text variant="subheading" as="span" style={{ display: 'block' }}>
            {r.name}
          </Text>
          <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
            {r.dates}
          </Text>
        </span>
        <ChevronRight color="var(--color-muted)" size={16} />
      </span>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
        <ProgressBar value={r.pct} track="tint" style={{ flex: 1 }} />
        <Text variant="body" tone="muted" style={{ flex: 'none' }}>
          {r.done} of {r.total}
        </Text>
      </span>
    </Card>
  );
}

/** Picking a program to add: the person's own (those not running), then the built-in ones, each with its days. */
function AddDialog({ v }: { v: PlannerVals }) {
  const p = v.programAdd.picker;
  if (!p) return null;
  return (
    <Dialog
      open={p.open}
      onClose={p.cancel}
      title={p.title}
      variant="sheet"
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={p.cancel}>
            Cancel
          </Button>
          <Button type="secondary" size="md" onClick={p.newProgram} disabled={p.busy}>
            New program
          </Button>
        </>
      }
    >
      <div style={{ marginTop: 'var(--space-3)' }}>
        <SearchBar value={p.q} onChange={p.setQ} placeholder="Search programs" label="Search programs" onClear={p.clearQ} status="" />
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)', marginTop: 'var(--space-4)', maxHeight: '50vh', overflowY: 'auto' }}>
        {p.groups.map((g) => (
          <div key={g.label}>
            <SectionLabel list label={g.label} />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-1)' }}>
              {g.items.map((r) => (
                <Pressable
                  key={r.key}
                  onClick={r.pick}
                  style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', minHeight: '52px', padding: 'var(--space-1) 0' }}
                >
                  <IconTile as="span" size="xs" variant="flat">
                    {r.svg}
                  </IconTile>
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <Text variant="body" weight="semibold" as="span" style={{ display: 'block' }}>
                      {r.name}
                    </Text>
                    <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                      {r.meta}
                      {r.days ? ' · ' + r.days : ''}
                    </Text>
                    {r.tag ? (
                      <Badge tone={r.tag.tone} size="sm" style={{ marginTop: 'var(--space-1)' }}>
                        {r.tag.label}
                      </Badge>
                    ) : null}
                  </span>
                  <ChevronRight color="var(--color-muted)" size={14} />
                </Pressable>
              ))}
            </div>
          </div>
        ))}
        {!p.groups.length ? (
          <Text variant="body" tone="muted" as="p" style={{ margin: 0 }}>
            {p.noMatch}
          </Text>
        ) : null}
      </div>
    </Dialog>
  );
}

export function ProgramRunsScreen({ v }: { v: PlannerVals }) {
  const l = v.programRuns;
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack} />
      <Text variant="title" as="h1" style={{ margin: 'var(--space-5) 0 0' }}>
        Your programs
      </Text>
      {l.empty ? (
        <>
          <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
            None run yet. Start one and it shows here, and stays here once it’s done.
          </Text>
          <Button type="secondary" size="md" onClick={v.programAdd.openPicker} style={{ marginTop: 'var(--space-4)' }}>
            {v.programAdd.label}
          </Button>
        </>
      ) : (
        <>
          <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
            {l.summary}
          </Text>
          <div style={{ marginTop: 'var(--space-5)' }}>
            {l.running.length ? <SectionLabel list label="Running" note={l.running.length > 1 ? String(l.running.length) : undefined} /> : null}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {l.running.map((r) => (
                <RunRow key={r.key} r={r} />
              ))}
              {/* Right under what's running: another one to run alongside it (or, with none running, one to start). */}
              <Button type="dashed" size="md" fullWidth onClick={v.programAdd.openPicker}>
                <Plus color="var(--color-pink-deep)" size={14} />
                {v.programAdd.label}
              </Button>
            </div>
          </div>
          {l.done.length ? (
            <div style={{ marginTop: 'var(--space-5)' }}>
              <SectionLabel list label="Done" note={String(l.done.length)} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
                {l.done.map((r) => (
                  <RunRow key={r.key} r={r} />
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
      <AddDialog v={v} />
      <StartDialog v={v} />
    </div>
  );
}
