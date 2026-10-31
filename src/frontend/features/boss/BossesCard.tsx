import { Card } from '@moonshot/design-system/card';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { BossGlyph } from './BossGlyph';

/** Profile: the bosses beaten, the one being fought, and the next few still ahead. */
export function BossesCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: 'var(--space-4)' }}>
      <SectionLabel as="span" label="Bosses" aside={v.bossesLabel} />
      <ul
        style={{
          listStyle: 'none',
          margin: 'var(--space-3) 0 0',
          padding: 0,
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(72px, 1fr))',
          gap: 'var(--space-3)',
        }}
      >
        {(v.bossTrophies ?? []).map((b) => (
          <li key={b.k} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)' }}>
            <span
              style={{
                width: '60px',
                height: '60px',
                borderRadius: 'var(--radius-md)',
                background: b.won ? b.tint : 'var(--color-mist)',
                boxShadow: b.fighting ? 'inset 0 0 0 2px var(--color-pink)' : undefined,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <BossGlyph k={b.k} fill={b.won || b.fighting ? b.deep : 'var(--color-outline)'} size={36} faded={!b.won && !b.fighting} />
            </span>
            <Text variant="small" tone={b.won ? 'ink' : 'muted'} style={{ textAlign: 'center', lineHeight: 'var(--leading-tight)' }}>
              {b.label}
            </Text>
          </li>
        ))}
      </ul>
      {v.bossNext ? (
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'baseline', gap: 'var(--space-1) var(--space-3)', marginTop: 'var(--space-4)' }}>
          <div>
            <Text variant="small" tone="muted" as="div">
              {v.bossNext.label}
            </Text>
            <Text variant="strong" tone="ink" as="div">
              {v.bossNext.value}
            </Text>
          </div>
          <Text variant="body" tone="slate">
            {v.bossNext.aside}
          </Text>
        </div>
      ) : null}
    </Card>
  );
}
