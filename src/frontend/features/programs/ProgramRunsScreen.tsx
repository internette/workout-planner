// Every program run, from the Profile: the one running, then the ones done (finished, or ended early), newest first.
// A running one opens its program; one that's done, its own page with the program as it ran.
import { Card } from '@moonshot/design-system/card';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { Button } from '@moonshot/design-system/buttons';
import { ChevronRight } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

type Row = NonNullable<PlannerVals['programRuns']>['done'][number];

function RunRow({ r }: { r: Row }) {
  return (
    <Card as="button" interactive pad="sm" onClick={r.open} style={{ display: 'block', width: '100%', textAlign: 'left' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: '13px' }}>
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
      <span style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
        <ProgressBar value={r.pct} track="tint" style={{ flex: 1 }} />
        <Text variant="body" tone="muted" style={{ flex: 'none' }}>
          {r.done} of {r.total}
        </Text>
      </span>
    </Card>
  );
}

export function ProgramRunsScreen({ v }: { v: PlannerVals }) {
  const l = v.programRuns;
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack} />
      <Text variant="title" as="h1" style={{ margin: '18px 0 0' }}>
        Your programs
      </Text>
      {l.empty ? (
        <>
          <Text variant="body" tone="muted" as="p" style={{ margin: '6px 0 0' }}>
            None run yet. Start one from the Spellbook and it shows here, and stays here once it’s done.
          </Text>
          <Button type="secondary" size="md" onClick={l.find} style={{ marginTop: '16px' }}>
            Find a program
          </Button>
        </>
      ) : (
        <>
          <Text variant="body" tone="muted" as="p" style={{ margin: '4px 0 0' }}>
            {l.summary}
          </Text>
          {l.running.length ? (
            <div style={{ marginTop: '20px' }}>
              <SectionLabel list label="Running" note={l.running.length > 1 ? String(l.running.length) : undefined} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {l.running.map((r) => (
                  <RunRow key={r.key} r={r} />
                ))}
              </div>
            </div>
          ) : null}
          {l.done.length ? (
            <div style={{ marginTop: '20px' }}>
              <SectionLabel list label="Done" note={String(l.done.length)} />
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {l.done.map((r) => (
                  <RunRow key={r.key} r={r} />
                ))}
              </div>
            </div>
          ) : null}
        </>
      )}
    </div>
  );
}
