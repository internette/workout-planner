// A program's page: its blocks as one bar, each block's week and workouts, and starting, sharing and editing it.
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Chip, ChipGroup } from '@moonshot/design-system/chip';
import { Dialog } from '@moonshot/design-system/dialog';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { TextField } from '@moonshot/design-system/text-field';
import { Text } from '@moonshot/design-system/typography';
import { Calendar, ChevronDown, ChevronRight, Copy, Pencil, Repeat } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { BlockBar } from '@moonshot/design-system/block-bar';
import { WeekStrip } from '@moonshot/design-system/week-strip';
import { ShareProgramDialog } from './ShareProgramDialog';

function StartDialog({ v }: { v: PlannerVals }) {
  const s = v.programStart;
  if (!s) return null;
  return (
    <Dialog
      open={s.open}
      onClose={s.cancel}
      title={s.title}
      sheet
      actions={
        <>
          <Button type="neutral" ghost size="md" onClick={s.cancel}>
            Cancel
          </Button>
          <Button type="primary" size="md" onClick={s.start} disabled={!s.canStart || s.busy}>
            {s.busy ? 'Starting…' : 'Start program'}
          </Button>
        </>
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
        <TextField label="Starting" type="date" value={s.date} min={s.min} onChange={s.setDate} />
        {s.blocks ? (
          <div>
            <Text variant="micro" tone="slate" as="div" aria-hidden="true" style={{ marginBottom: '8px' }}>
              Start at
            </Text>
            <SegmentedControl label="Start at" options={s.blocks} value={s.block} onChange={s.setBlock} fullWidth equalWidth wrap />
          </div>
        ) : null}
        <Card pad="sm" style={{ background: 'var(--color-canvas)', boxShadow: 'none' }}>
          <Text variant="body" weight="semibold" as="p" style={{ margin: 0 }}>
            {s.summary}
          </Text>
          {s.lands ? (
            <Text variant="body" tone="muted" as="p" style={{ margin: '4px 0 0' }}>
              {s.lands}
            </Text>
          ) : null}
          {s.overlap ? (
            <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
              {s.overlap}
            </Text>
          ) : null}
          {s.emptyNote ? (
            <Text variant="body" tone="danger" as="p" style={{ margin: '8px 0 0' }}>
              {s.emptyNote}
            </Text>
          ) : null}
        </Card>
      </div>
    </Dialog>
  );
}

export function ProgramScreen({ v }: { v: PlannerVals }) {
  const p = v.program;
  if (!p) return null;
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack}>
        <Button type="secondary" size="sm" onClick={p.edit} disabled={p.busy} style={{ whiteSpace: 'nowrap' }}>
          {p.builtin ? <Copy color="var(--color-pink-deep)" size={16} /> : <Pencil color="var(--color-pink-deep)" size={16} />}
          {p.editLabel}
        </Button>
      </BackBar>
      <div style={{ marginTop: '18px' }}>
        <Text variant="micro" as="div" tone="slate">
          {p.eyebrow}
        </Text>
        <Text variant="title" as="h1" style={{ margin: '3px 0 0' }}>
          {p.name}
        </Text>
      </div>
      <ChipGroup style={{ marginTop: '14px' }}>
        <Chip icon={<Calendar color="var(--color-muted)" size={15} />}>{p.chips[0]}</Chip>
        <Chip icon={<Repeat color="var(--color-muted)" size={15} />}>{p.chips[1]}</Chip>
        <Chip>{p.equipment}</Chip>
      </ChipGroup>
      {p.notes ? (
        <Text variant="body" tone="slate" as="p" style={{ margin: '14px 0 0', maxWidth: '560px', whiteSpace: 'pre-wrap' }}>
          {p.notes}
        </Text>
      ) : null}
      <div style={{ marginTop: '18px' }}>
        <BlockBar blocks={p.bar} />
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '18px' }}>
        <Button type="primary" size="lg" onClick={p.start} disabled={p.busy} style={{ flex: '1 1 200px' }}>
          <Calendar color="var(--color-surface)" size={17} />
          Start program
        </Button>
        {p.share ? (
          <Button type="secondary" size="lg" onClick={p.share} style={{ flex: '0 1 auto' }}>
            Share
          </Button>
        ) : null}
      </div>
      {p.runs.map((r) => (
        <Card key={r.key} pad="sm" style={{ marginTop: '12px', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px' }}>
          <span style={{ flex: '1 1 200px', minWidth: 0 }}>
            <Text variant="body" weight="semibold" as="span" style={{ display: 'block' }}>
              {r.label}
            </Text>
            <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
              {r.dates}
            </Text>
          </span>
          <Button type="danger" ghost size="sm" onClick={r.end}>
            End program
          </Button>
        </Card>
      ))}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '18px' }}>
        {p.blocks.map((b) => (
          <Card key={b.key} pad="sm">
            <button
              type="button"
              aria-expanded={b.open}
              onClick={b.toggle}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', minHeight: '44px', padding: 0, border: 'none', background: 'none', textAlign: 'left', cursor: 'pointer', font: 'inherit' }}
            >
              <span style={{ flex: 1, minWidth: 0 }}>
                <Text variant="subheading" as="span" style={{ display: 'block' }}>
                  {b.name}
                </Text>
                <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                  {b.range} · {b.summary}
                </Text>
              </span>
              <ChevronDown color="var(--color-muted)" size={16} style={{ transform: b.open ? 'rotate(180deg)' : undefined }} />
            </button>
            {b.open ? (
              <>
                <WeekStrip days={b.strip.map((d) => ({ letter: d.letter, label: d.day + ': ' + d.label, icon: d.svg || undefined }))} style={{ marginTop: '12px' }} />
                {b.empty ? (
                  <Text variant="body" tone="muted" as="p" style={{ margin: '12px 0 0' }}>
                    No workouts in this block yet.
                  </Text>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginTop: '12px' }}>
                    {b.workouts.map((w) => (
                      <button
                        key={w.key}
                        type="button"
                        onClick={w.open}
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
                            {w.days} · {w.meta}
                          </Text>
                        </span>
                        <ChevronRight color="var(--color-muted)" size={14} />
                      </button>
                    ))}
                  </div>
                )}
              </>
            ) : null}
          </Card>
        ))}
      </div>
      <StartDialog v={v} />
      {v.programShare ? <ShareProgramDialog s={v.programShare} /> : null}
    </div>
  );
}
