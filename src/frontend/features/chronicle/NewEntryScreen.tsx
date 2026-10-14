// Starting a Chronicle entry: picking the session to write about.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import { Pressable } from '@moonshot/design-system/buttons';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Card } from '@moonshot/design-system/card';
import { Badge } from '@moonshot/design-system/badge';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { BackBar } from '@/frontend/components/BackBar';
import { PageHeader } from '@/frontend/components/PageHeader';
import { KindTag, kindOf } from '@/frontend/components/KindTag';

export function NewEntryScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.goBack} />
      <PageHeader
        title="Which session are you writing about?"
        intro={<>Pick a session from the last 60 days. Ones you&apos;ve already written about aren&apos;t listed.</>}
        style={{ marginTop: 'var(--space-6)' }}
      />
      <div style={{ marginTop: 'var(--space-7)', maxWidth: '620px' }}>
        {/* One card per group (this week, last week, earlier), its sessions as rows. Back leaves. */}
        {(v.unloggedGroups ?? []).map((g) => (
          <div key={g.label} style={{ marginBottom: 'var(--space-4)' }}>
            <SectionLabel list label={g.label} />
            <Card pad="none" style={{ overflow: 'hidden' }}>
              {g.items.map((u, i) => (
                <Pressable
                  key={i}
                  onClick={u.pick}
                  wash="accent"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 'var(--space-3)',
                    width: '100%',
                    minHeight: '60px',
                    padding: 'var(--space-3) var(--space-4)',
                    borderTop: i ? '1px solid var(--color-line)' : 'none',
                  }}
                >
                  <Text variant="micro" as="span" tone="slate" style={{ flex: 'none', width: '52px', lineHeight: 'var(--leading-tight)' }}>
                    {u.dayTop}
                    <br />
                    {u.dayBottom}
                  </Text>
                  <span style={{ flex: '1', minWidth: '0' }}>
                    <KindTag kind={kindOf(u)} />
                    <Text variant="subheading" as="span" tone="ink" style={{ display: 'block' }}>
                      {u.name}
                    </Text>
                    <Text variant="body" as="span" tone="muted" style={{ display: 'block', marginTop: 'var(--space-1)' }}>
                      {u.meta}
                    </Text>
                  </span>
                  <Badge tone={u.statusTone}>{u.status}</Badge>
                </Pressable>
              ))}
            </Card>
          </div>
        ))}
        {v.noUnlogged ? (
          <Text variant="body" as="p" tone="muted" style={{ margin: 'var(--space-4) 0 0' }}>
            {v.noUnloggedNote}
          </Text>
        ) : null}
      </div>
    </div>
  );
}
