// The Starbook, from Profile: Moonwalk's 324 Finds, a set at a time. A Find not found yet shows as a dashed outline.
import { Card } from '@moonshot/design-system/card';
import { Chip } from '@moonshot/design-system/chip';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { BackBar } from '@/frontend/components/BackBar';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { FindGlyph } from './FindGlyph';

export function StarbookScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack} />
      <Text variant="title" as="h1" style={{ margin: 'var(--space-5) 0 0' }}>
        Starbook
      </Text>
      <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
        {v.sbLabel} found. Finds turn up on Run/Walk and Cycling sessions with Moonwalk on.
      </Text>
      <ProgressBar value={v.sbPct} track="mist" label="Starbook filled" valueText={v.sbLabel} style={{ marginTop: 'var(--space-3)' }} />
      <div role="group" aria-label="Set" style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-4)' }}>
        {v.sbSets.map((s) => (
          <Chip key={s.key} tone="choice" size="md" surface="page" selected={s.on} onClick={s.pick}>
            {s.label} · {s.have}
          </Chip>
        ))}
      </div>
      <Card style={{ marginTop: 'var(--space-4)' }}>
        <SectionLabel as="h2" label={v.sbSetName} aside={v.sbSetLabel} />
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
          {v.sbSetHint}
        </Text>
        <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-4) 0 0', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(84px, 1fr))', gap: 'var(--space-3)' }}>
          {v.sbTiles.map((f) => (
            <li
              key={f.key}
              aria-label={f.found ? f.name + ', ' + f.rarityLabel + (f.copies > 1 ? ', ' + f.copies + ' copies' : '') : 'Not found yet, ' + f.rarityLabel}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 'var(--space-1)', textAlign: 'center' }}
            >
              <FindGlyph rarity={f.rarity} found={f.found} tint={f.tint} fill={f.fill} />
              <Text variant="small" tone={f.found ? 'ink' : 'muted'} aria-hidden="true">
                {f.found ? f.name : f.rarityLabel}
              </Text>
              {f.copies > 1 ? (
                <Text variant="small" aria-hidden="true" style={{ color: f.deep }}>
                  ×{f.copies}
                </Text>
              ) : null}
            </li>
          ))}
        </ul>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-4)', marginTop: 'var(--space-4)' }}>
          {v.sbRarities.map((r) => (
            <Text key={r.key} variant="small" tone="muted">
              <span aria-hidden="true" style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 'var(--radius-full)', background: r.fill, marginRight: 6 }} />
              {r.per} {r.label}
            </Text>
          ))}
        </div>
      </Card>
    </div>
  );
}
