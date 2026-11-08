// The Charm Table, from Profile: what's in the satchel, and every recipe found so far, to craft from it. Recipes not
// found yet stay as "???", Hidden ones show their pages, and Legendary ones are picked after finishing a set.
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ProgressBar } from '@moonshot/design-system/progress-bar';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { BackBar } from '@/frontend/components/BackBar';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { CharmGlyph } from './CharmGlyph';

export function CharmTableScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack} />
      <Text variant="title" as="h1" style={{ margin: 'var(--space-5) 0 0' }}>
        Charm Table
      </Text>
      <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
        Craft one-time charms from the Finds in your satchel. Crafting never takes a page out of your Starbook. {v.ctToday}
      </Text>
      <Card style={{ marginTop: 'var(--space-4)' }}>
        <SectionLabel as="h2" label="Satchel" />
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2) var(--space-4)', marginTop: 'var(--space-2)' }}>
          {v.ctSatchel.map((r) => (
            <Text key={r.key} variant="body" tone="ink">
              <span aria-hidden="true" style={{ display: 'inline-block', width: 10, height: 10, borderRadius: 'var(--radius-full)', background: r.fill, marginRight: 6 }} />
              {r.n} {r.label}
            </Text>
          ))}
        </div>
      </Card>
      {v.ctPicks.length ? (
        <Card style={{ marginTop: 'var(--space-4)' }}>
          <SectionLabel as="h2" label="Pick a Legendary recipe" aside={v.ctPicksLeft === 1 ? '1 pick' : v.ctPicksLeft + ' picks'} />
          <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
            You finished a Starbook set. Pick one recipe to keep for good.
          </Text>
          <ul style={{ listStyle: 'none', padding: 0, margin: 'var(--space-3) 0 0', display: 'flex', flexDirection: 'column', gap: 'var(--space-3)' }}>
            {v.ctPicks.map((c) => (
              <li key={c.key} style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <CharmGlyph tint={c.tint} fill={c.fill} size={40} />
                <span style={{ flex: '1 1 160px', minWidth: 0 }}>
                  <Text variant="strong" tone="ink" as="span" style={{ display: 'block' }}>
                    {c.name}
                  </Text>
                  <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                    {c.what} · {c.cost}
                  </Text>
                </span>
                <Button type="secondary" size="sm" onClick={c.pick}>
                  Pick
                </Button>
              </li>
            ))}
          </ul>
        </Card>
      ) : null}
      {v.ctGroups.map((g) => (
        <Card key={g.key} as="section" aria-label={g.label} style={{ marginTop: 'var(--space-4)' }}>
          <SectionLabel as="h2" label={g.label} />
          {g.key === 'legendary' && v.ctLocked ? (
            <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
              {v.ctLocked}
            </Text>
          ) : null}
          <ul style={{ listStyle: 'none', padding: 0, margin: g.rows.length ? 'var(--space-3) 0 0' : 0, display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {g.rows.map((c) => (
              <li key={c.key} style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)', flexWrap: 'wrap' }}>
                <CharmGlyph tint={c.tint} fill={c.fill} size={40} known={c.known} />
                <span style={{ flex: '1 1 180px', minWidth: 0 }}>
                  <Text variant="strong" tone={c.known || c.pages ? 'ink' : 'muted'} as="span" style={{ display: 'block' }}>
                    {c.name}
                    {c.held ? (
                      <Text variant="small" tone="muted" as="span">
                        {' '}
                        · {c.held} held
                      </Text>
                    ) : null}
                  </Text>
                  <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                    {c.what}
                  </Text>
                  {!c.known && c.pages ? (
                    <ProgressBar value={c.pagePct} track="mist" label={c.name + ' recipe pages'} valueText={c.pages + ' of 3 pages'} style={{ marginTop: 'var(--space-2)', maxWidth: 220 }} />
                  ) : null}
                  {c.known ? (
                    <Text variant="small" tone="slate" as="span" style={{ display: 'block', marginTop: 'var(--space-1)' }}>
                      {c.cost}
                      {c.need ? ' · ' + c.need : ''}
                    </Text>
                  ) : null}
                </span>
                {c.known ? (
                  <Button type={c.canCraft ? 'primary' : 'secondary'} size="sm" onClick={c.craft} disabled={!c.canCraft || c.busy} aria-label={'Craft ' + c.name}>
                    Craft
                  </Button>
                ) : null}
              </li>
            ))}
          </ul>
        </Card>
      ))}
    </div>
  );
}
