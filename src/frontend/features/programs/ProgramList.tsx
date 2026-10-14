// The Spellbook's Programs tab: the programs running, then the person's own, then built-in ones.
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { ChevronRight, Gem } from '@moonshot/design-system/icons';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { ProgressBar } from '@moonshot/design-system/progress-bar';

function Row({ name, eyebrow, meta, icon, open, children }: { name: string; eyebrow?: string; meta?: string; icon?: React.ReactNode; open: () => void; children?: React.ReactNode }) {
  return (
    <Card as="button" interactive pad="sm" onClick={open} style={{ display: 'block', width: '100%', textAlign: 'left' }}>
      <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
        {icon ? <IconTile as="span" size="sm" variant="flat">{icon}</IconTile> : null}
        <span style={{ flex: 1, minWidth: 0 }}>
          {eyebrow ? (
            <Text variant="micro" tone="accent" as="span" style={{ display: 'block' }}>
              {eyebrow}
            </Text>
          ) : null}
          <Text variant="subheading" tone="ink" as="span" style={{ display: 'block' }}>
            {name}
          </Text>
          {meta ? (
            <Text variant="body" tone="muted" as="span" style={{ display: 'block', marginTop: 'var(--space-1)' }}>
              {meta}
            </Text>
          ) : null}
        </span>
        <ChevronRight color="var(--color-muted)" size={16} />
      </span>
      {children}
    </Card>
  );
}

export function ProgramList({ v }: { v: PlannerVals }) {
  const l = v.programList;
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
      {l.noMatch ? (
        <Text variant="body" as="p" tone="muted" style={{ margin: 0 }}>
          {l.noMatchNote}
        </Text>
      ) : null}
      {v.scanCard ? (
        <Card as="section" aria-labelledby="scan-card" style={{ background: 'var(--color-pink-tint)', boxShadow: 'none' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)' }}>
            <Gem size={24} style={{ flex: 'none' }} />
            <Text id="scan-card" variant="subheading" as="h2" style={{ margin: 0 }}>
              {v.scanCard.title}
            </Text>
          </div>
          <Text variant="body" tone="slate" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
            {v.scanCard.body}
          </Text>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
            <Button type="primary" size="md" onClick={v.scanCard.go}>
              Turn into a program
            </Button>
            <Button type="neutral" ghost size="md" onClick={v.scanCard.notNow}>
              Not now
            </Button>
          </div>
        </Card>
      ) : null}
      {l.running.length ? (
        <div>
          <SectionLabel list label="Running" note={String(l.running.length)} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {l.running.map((r) => (
              <Row key={r.key} name={r.name} eyebrow={r.place} open={r.open}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
                  <ProgressBar value={r.pct} track="tint" label="Sessions done" valueText={r.valueText} style={{ flex: 1 }} />
                  <Text variant="figure" as="span" style={{ flex: 'none' }}>
                    {r.figure}
                  </Text>
                </span>
              </Row>
            ))}
          </div>
        </div>
      ) : null}
      {/* With only a running one, it's above: no Yours with nothing in it. */}
      {l.mine.length || !l.running.length ? (
        <div>
          <SectionLabel list label="Yours" note={l.mine.length ? String(l.mine.length) : undefined} />
          {l.mine.length ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
              {l.mine.map((p) => (
                <Row key={p.key} name={p.name} meta={p.meta} icon={p.icon} open={p.open} />
              ))}
            </div>
          ) : (
            <Text variant="body" as="p" tone="muted" style={{ margin: 0 }}>
              None yet. Start one with New, copy a built-in one, or save a week from the calendar as one.
            </Text>
          )}
        </div>
      ) : null}
      {l.builtin.length ? (
        <div>
          <SectionLabel list label="Built-in" note={String(l.builtin.length)} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
            {l.builtin.map((p) => (
              <Row key={p.key} name={p.name} meta={p.meta} icon={p.icon} open={p.open} />
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}
