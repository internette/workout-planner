import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { CharmGlyph } from './CharmGlyph';

/** Profile: the charms held, today's, and the way to the Charm Table. */
export function CharmsCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: 'var(--space-4)' }}>
      <SectionLabel label="My charms" aside={v.mcKnown} />
      {v.mcToday ? (
        <Text variant="body" tone="slate" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
          {v.mcToday}
        </Text>
      ) : null}
      {v.mcHeld.length ? (
        <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-3) 0 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
          {v.mcHeld.map((c) => (
            <li key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <CharmGlyph tint={c.tint} fill={c.fill} stroke={c.deep} size={40} />
              <span style={{ minWidth: 0, flex: '1 1 0' }}>
                <Text variant="subheading" as="span" style={{ display: 'block' }}>
                  {c.name}
                </Text>
                <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                  {c.what}
                </Text>
              </span>
              <Text variant="strong" tone="ink" style={{ flex: 'none' }}>
                ×{c.count}
              </Text>
            </li>
          ))}
        </ul>
      ) : null}
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: 'var(--space-2) var(--space-3)',
          marginTop: 'var(--space-4)',
          paddingTop: 'var(--space-3)',
          borderTop: '1px solid var(--color-line)',
        }}
      >
        <Text variant="body" tone="muted" style={{ flex: '1 1 200px' }}>
          {v.mcHeld.length ? 'One a day, from the day view.' : 'No charms yet. Recipes turn up in pouches, glimmers and boss wins.'}
        </Text>
        <Button type="secondary" size="md" onClick={v.goCharms}>
          Open Charm Table
        </Button>
      </div>
    </Card>
  );
}
