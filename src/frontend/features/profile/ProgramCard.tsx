// The Profile's program card: the one running (where you are in it, sessions done, what's next), or with none running
// the last one run, to run again. Either way, the way to every program run. Not shown before any has been.
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { Text } from '@moonshot/design-system/typography';
import { ChevronRight } from '@moonshot/design-system/icons';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

const plainButton = { display: 'flex', alignItems: 'center', width: '100%', padding: 0, border: 'none', background: 'none', font: 'inherit', cursor: 'pointer', textAlign: 'left' } as const;

function AllPrograms({ count, open }: { count: number; open: () => void }) {
  return (
    <button type="button" onClick={open} style={{ ...plainButton, minHeight: '44px', marginTop: '8px', paddingTop: '4px', borderTop: '1px solid var(--color-line)' }}>
      <Text variant="body" weight="semibold" tone="accent" style={{ flex: 1 }}>
        All your programs
      </Text>
      <Text variant="body" tone="muted">
        {count}
      </Text>
      <ChevronRight color="var(--color-muted)" size={16} style={{ marginLeft: '6px' }} />
    </button>
  );
}

export function ProgramCard({ v }: { v: PlannerVals }) {
  const p = v.profileProgram;
  if (!p) return null;
  if ('lastLine' in p)
    return (
      <Card style={{ marginTop: '14px' }}>
        <Text variant="micro" tone="slate" as="h2" style={{ margin: 0 }}>
          Current program
        </Text>
        <Text variant="heading" as="div" style={{ marginTop: '6px' }}>
          None running
        </Text>
        <Text variant="body" tone="muted" as="p" style={{ margin: '4px 0 0' }}>
          {p.lastLine}
        </Text>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '14px' }}>
          <Button type="secondary" size="md" onClick={p.runAgain} disabled={p.busy}>
            Run it again
          </Button>
          <Button type="neutral" ghost size="md" onClick={p.find}>
            Find a program
          </Button>
        </div>
        <AllPrograms count={p.count} open={p.openAll} />
      </Card>
    );
  return (
    <Card style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: '4px 8px' }}>
        <Text variant="micro" tone="slate" as="h2" style={{ margin: 0, flex: 1, whiteSpace: 'nowrap' }}>
          Current program
        </Text>
        <Text variant="micro" tone="accent">
          {p.place}
        </Text>
      </div>
      <button type="button" onClick={p.open} style={{ ...plainButton, gap: '8px', marginTop: '6px', minHeight: '36px' }}>
        <Text variant="heading" as="span" style={{ flex: 1, minWidth: 0 }}>
          {p.name}
        </Text>
        <ChevronRight color="var(--color-muted)" size={17} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '12px' }}>
        <ProgressBar value={p.pct} track="tint" style={{ flex: 1 }} label="Sessions done" valueText={p.done + ' of ' + p.total} />
        <Text variant="figure" style={{ flex: 'none' }}>
          {p.done}/{p.total}
        </Text>
      </div>
      <Text variant="body" tone="muted" as="p" style={{ margin: '6px 0 0' }}>
        {p.next}
      </Text>
      <AllPrograms count={p.count} open={p.openAll} />
    </Card>
  );
}
