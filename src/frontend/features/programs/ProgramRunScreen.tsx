// A program run's page: the program as it was when it ran, read-only, with how it went. It can be added to the
// person's programs again (a copy to change and start) or shared behind a link.
import { BlockBar } from '@moonshot/design-system/block-bar';
import { Button, Pressable } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Chip, ChipGroup } from '@moonshot/design-system/chip';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { Text } from '@moonshot/design-system/typography';
import { WeekStrip } from '@moonshot/design-system/week-strip';
import { Calendar, Check, ChevronDown, Repeat } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { ShareProgramDialog } from './ShareProgramDialog';

export function ProgramRunScreen({ v }: { v: PlannerVals }) {
  const p = v.programRun;
  // An address for a run that isn't there (someone else's, or one with nothing kept of its program).
  if (!p)
    return (
      <div>
        <BackBar label={v.backLabel} onBack={v.goBack} />
        <Text variant="title" as="h1" style={{ margin: '18px 0 0' }}>
          Not in your programs
        </Text>
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
          This link is to a program someone else ran, or one that’s no longer kept.
        </Text>
      </div>
    );
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack} />
      <div style={{ marginTop: '18px' }}>
        <Text variant="micro" tone="slate" as="div">
          {p.eyebrow}
        </Text>
        <Text variant="title" as="h1" style={{ margin: '3px 0 0' }}>
          {p.name}
        </Text>
      </div>
      {/* Finished: its moment, before the details. */}
      {p.complete ? (
        <div style={{ position: 'relative', display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', marginTop: 'var(--space-4)', padding: '14px 16px', borderRadius: 'var(--radius-lg)', background: 'var(--gradient-gem-tint)', overflow: 'hidden' }}>
          <span style={{ width: '32px', height: '32px', flex: 'none', borderRadius: 'var(--radius-sm)', background: 'var(--gradient-gem)', display: 'grid', placeItems: 'center' }}>
            <Check color="var(--color-surface)" strokeWidth={2.6} size={16} />
          </span>
          <span style={{ flex: 1, minWidth: 0 }}>
            <Text variant="micro" tone="accent" as="div">
              Arc complete
            </Text>
            <Text variant="body" tone="slateDeep" as="p" style={{ margin: '2px 0 0' }}>
              {p.complete}
            </Text>
          </span>
        </div>
      ) : null}
      <ChipGroup style={{ marginTop: '14px' }}>
        <Chip icon={<Calendar color="var(--color-muted)" size={15} />}>{p.chips[0]}</Chip>
        <Chip icon={<Repeat color="var(--color-muted)" size={15} />}>{p.chips[1]}</Chip>
        <Chip>{p.chips[2]}</Chip>
      </ChipGroup>
      <div style={{ marginTop: '18px' }}>
        <BlockBar blocks={p.bar} />
      </div>
      <div style={{ display: 'flex', gap: '10px', marginTop: '18px' }}>
        <Button type="primary" size="lg" onClick={p.add} disabled={p.adding} style={{ flex: '1 1 0', minWidth: 0, whiteSpace: 'nowrap' }}>
          {p.adding ? 'Adding…' : 'Add to my programs'}
        </Button>
        <Button type="secondary" size="lg" onClick={p.share} style={{ flex: 'none' }}>
          Share
        </Button>
      </div>
      <Text variant="body" tone="muted" as="p" style={{ margin: '10px 0 0' }}>
        {p.note}
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: 'var(--space-4)' }}>
        {p.blocks.map((b) => (
          <Card key={b.key} pad="sm" as="section" aria-label={b.name}>
            <Text variant="subheading" as="h2" style={{ margin: 0 }}>
              {b.name}
            </Text>
            <Text variant="body" tone="muted" as="div">
              {b.range}
            </Text>
            <WeekStrip days={b.strip} style={{ marginTop: 'var(--space-3)' }} />
            <div style={{ display: 'flex', flexDirection: 'column', marginTop: 'var(--space-2)' }}>
              {b.workouts.map((w) => (
                <div key={w.key}>
                  <Pressable
                    aria-expanded={w.open}
                    onClick={w.toggle}
                    style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', width: '100%', minHeight: '52px', padding: 'var(--space-1) 0'}}
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
                    <ChevronDown color="var(--color-muted)" size={16} style={{ flex: 'none', transform: w.open ? 'rotate(180deg)' : undefined }} />
                  </Pressable>
                  {w.open ? (
                    <div style={{ margin: '2px 0 10px 50px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {w.lines.map((line, i) => (
                        <Text key={i} variant="body" as="div">
                          {line}
                        </Text>
                      ))}
                      {w.notes ? (
                        <Text variant="body" tone="slate" as="p" style={{ margin: 0, whiteSpace: 'pre-wrap' }}>
                          {w.notes}
                        </Text>
                      ) : null}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
      {v.runShare ? <ShareProgramDialog s={v.runShare} /> : null}
    </div>
  );
}
