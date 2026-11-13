import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { FindGlyph } from './FindGlyph';

/** Profile: how much of the Starbook is filled, and the latest Finds. */
export function StarbookCard({ v }: { v: PlannerVals }) {
  return (
    <Card style={{ marginTop: 'var(--space-4)' }}>
      <SectionLabel label="Starbook" aside={v.sbLabel} />
      <ProgressBar value={v.sbPct} track="mist" label="Starbook filled" valueText={v.sbLabel} style={{ marginTop: 'var(--space-3)' }} />
      {v.sbLatest.length ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-3)', marginTop: 'var(--space-4)' }}>
          {v.sbLatest.map((f) => (
            <div key={f.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)' }}>
              <FindGlyph rarity={f.rarity} found tint={f.tint} fill={f.fill} stroke={f.deep} size={40} />
              <span style={{ minWidth: 0 }}>
                <Text variant="subheading" as="span" style={{ display: 'block' }}>
                  {f.name}
                </Text>
                <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                  {f.rarityLabel} · {f.setName}
                </Text>
              </span>
            </div>
          ))}
        </div>
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
          {v.sbLatest.length ? 'Run, walk or ride with Moonwalk on to find more.' : 'Turn on Moonwalk on a Run/Walk or Cycling session to find your first.'}
        </Text>
        <Button type="secondary" size="md" onClick={v.goStarbook}>
          Open Starbook
        </Button>
      </div>
    </Card>
  );
}
