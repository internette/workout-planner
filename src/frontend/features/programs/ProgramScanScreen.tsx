// Turning the calendar's weekly repeats into a program: what the scan found, then naming it. Or, with nothing
// repeating, why not.
import { Button } from '@moonshot/design-system/buttons';
import { BlockBar } from '@moonshot/design-system/block-bar';
import { Card } from '@moonshot/design-system/card';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { EmptyState } from '@moonshot/design-system/empty-state';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { CheckCard, CheckGroup, OptionCard } from '@moonshot/design-system/option-card';
import { TextField } from '@moonshot/design-system/text-field';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { WeekStrip } from '@moonshot/design-system/week-strip';
import { Search } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

type Row = { key: string; name: string; meta: string; svg: React.ReactNode; on: boolean; toggle: () => void };

function Found({ v }: { v: PlannerVals }) {
  const s = v.scanFound!;
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack} />
      <div style={{ marginTop: 'var(--space-5)' }}>
        <Text variant="micro" tone="slate" as="div">
          From your calendar
        </Text>
        <Text variant="title" as="h1" style={{ margin: 'var(--space-1) 0 0' }}>
          {s.title}
        </Text>
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
          {s.meta}
        </Text>
      </div>
      {s.bar.length ? (
        <div style={{ marginTop: 'var(--space-4)' }}>
          <BlockBar blocks={s.bar} />
        </div>
      ) : null}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
        {s.blocks.map((b) => (
          <Card key={b.key} pad="sm" as="section" aria-label={b.title}>
            <Text variant="subheading" as="h2" style={{ margin: 0 }}>
              {b.title}
            </Text>
            <WeekStrip days={b.strip} style={{ marginTop: 'var(--space-3)' }} />
            {b.change ? (
              <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-3) 0 0' }}>
                {b.change}
              </Text>
            ) : null}
            {b.workouts.length ? (
              <div style={{ marginTop: 'var(--space-3)' }}>
                {/* Each workout it found, ticked in or out. */}
                <CheckGroup label={'Workouts in ' + b.title}>
                  {b.workouts.map((r: Row) => (
                    <CheckCard
                      key={r.key}
                      checked={r.on}
                      onChange={r.toggle}
                      icon={<IconTile as="span" size="xs" variant="flat">{r.svg}</IconTile>}
                      title={r.name}
                      description={r.meta}
                    />
                  ))}
                </CheckGroup>
              </div>
            ) : null}
          </Card>
        ))}
        {s.leftOut.length || s.oneOffs ? (
          <Card pad="sm" as="section" aria-label="Left out">
            {s.leftOut.length ? (
              <>
                <Text variant="micro" tone="slate" as="h2" style={{ margin: 0 }}>
                  Left out
                </Text>
                <div style={{ marginTop: 'var(--space-2)' }}>
                  <CheckGroup label="Left out">
                    {s.leftOut.map((r: Row) => (
                      <CheckCard
                        key={r.key}
                        checked={r.on}
                        onChange={r.toggle}
                        icon={<IconTile as="span" size="xs" variant="flat">{r.svg}</IconTile>}
                        title={r.name}
                        description={r.meta}
                      />
                    ))}
                  </CheckGroup>
                </div>
              </>
            ) : null}
            {s.oneOffs ? (
              <Text variant="body" tone="muted" as="p" style={{ margin: s.leftOut.length ? '8px 0 0' : 0 }}>
                {s.oneOffs}
              </Text>
            ) : null}
          </Card>
        ) : null}
      </div>
      <Button type="primary" size="lg" fullWidth onClick={s.next} disabled={!s.canNext} style={{ marginTop: 'var(--space-5)' }}>
        Next
      </Button>
    </div>
  );
}

function Naming({ v }: { v: PlannerVals }) {
  const n = v.scanNaming!;
  return (
    <div>
      <BackBar label="What it found" onBack={n.back} />
      <Text variant="title" as="h1" style={{ margin: 'var(--space-5) 0 0' }}>
        Make it a program
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)', maxWidth: '560px' }}>
        <TextField label="Program name" value={n.name} onChange={n.setName} maxLength={80} />
        {n.blocks.length ? (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)' }}>
            {n.blocks.map((b) => (
              <TextField key={b.key} label={b.label} value={b.value} onChange={b.set} maxLength={40} containerStyle={{ flex: '1 1 140px' }} />
            ))}
          </div>
        ) : null}
      </div>
      <SectionLabel label="The sessions on your calendar" style={{ marginTop: 'var(--space-6)' }} />
      <div role="radiogroup" aria-label="The sessions on your calendar" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)', marginTop: 'var(--space-2)', maxWidth: '560px' }}>
        <OptionCard name="scan-sessions" value="keep" checked={n.keep} onChange={n.setKeep} title="Keep them, as this program" description={n.keepNote} />
        <OptionCard name="scan-sessions" value="fresh" checked={!n.keep} onChange={n.setKeep} title="Start it fresh instead" description={n.freshNote} />
      </div>
      {!n.keep ? (
        <div style={{ marginTop: 'var(--space-4)', maxWidth: '560px' }}>
          <TextField label="Starting" type="date" value={n.date} min={n.min} onChange={n.setDate} />
        </div>
      ) : null}
      <div style={{ marginTop: 'var(--space-4)', maxWidth: '560px' }}>
        <Checkbox switch checked={n.endSeries} onChange={n.setEndSeries} description="Their weekly repeats are now the program’s, so nothing doubles up.">
          End the weekly series
        </Checkbox>
      </div>
      <Button type="primary" size="lg" fullWidth onClick={n.make} disabled={!n.canMake || n.busy} style={{ marginTop: 'var(--space-6)' }}>
        {n.busy ? 'Making it…' : 'Make program'}
      </Button>
    </div>
  );
}

function Nothing({ v }: { v: PlannerVals }) {
  const n = v.scanNothing!;
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack} />
      <EmptyState
        icon={<Search color="var(--color-pink-deep)" size={30} />}
        medallion="gem"
        titleAs="h1"
        title={n.title}
        description={n.body}
        actions={
          <Button type="secondary" size="md" onClick={n.saveWeek}>
            Save a week as a program
          </Button>
        }
        style={{ marginTop: 'calc(2 * var(--space-7))' }}
      />
    </div>
  );
}

export function ProgramScanScreen({ v }: { v: PlannerVals }) {
  if (v.scanNothing) return <Nothing v={v} />;
  if (v.scanNaming) return <Naming v={v} />;
  if (v.scanFound) return <Found v={v} />;
  return null;
}
