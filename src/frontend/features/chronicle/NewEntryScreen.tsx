// Starting a Chronicle entry: picking the session to write about.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import { Card } from '@moonshot/design-system/card';
import { Badge } from '@moonshot/design-system/badge';
import { Text } from '@moonshot/design-system/typography';
import { BackBar } from '@/frontend/components/BackBar';
import { GroupLabel } from '@/frontend/components/GroupLabel';
import { PageHeader } from '@/frontend/components/PageHeader';
import { WarmupTag } from '@/frontend/components/WarmupTag';

export function NewEntryScreen({ v }: { v: any }) {
  return (
    <>
      <div>
        <BackBar label={v.backLabel} onBack={v.goBack} />
        <PageHeader
          title="Which session are you writing about?"
          intro={<>Pick a session from the last 60 days. Ones you&apos;ve already written about aren&apos;t listed.</>}
          style={{ marginTop: 'var(--space-6)' }}
        />
        <div style={{ marginTop: '26px', maxWidth: '620px' }}>
          {/* One card per group (this week, last week, earlier), its sessions as rows. Back leaves. */}
          {(v.unloggedGroups ?? []).map((g) => (
            <div key={g.label} style={{ marginBottom: '16px' }}>
              <GroupLabel label={g.label} />
              <Card pad="none" style={{ overflow: 'hidden' }}>
                {g.items.map((u, i) => (
                  <button
                    key={i}
                    onClick={u.pick}
                    className="hv7"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      width: '100%',
                      minHeight: '60px',
                      padding: '12px 18px',
                      border: 'none',
                      borderTop: i ? '1px solid var(--color-line)' : 'none',
                      background: 'none',
                      fontFamily: 'inherit',
                      textAlign: 'left',
                      cursor: 'pointer',
                    }}
                  >
                    <Text variant="eyebrow" as="span" tone="slate" style={{ flex: 'none', width: '52px', lineHeight: 1.35 }}>
                      {u.dayTop}
                      <br />
                      {u.dayBottom}
                    </Text>
                    <span style={{ flex: '1', minWidth: '0' }}>
                      {u.warmup ? <WarmupTag /> : null}
                      <Text variant="itemTitle" as="span" tone="ink" style={{ display: 'block' }}>
                        {u.name}
                      </Text>
                      <Text variant="caption" as="span" tone="muted" style={{ display: 'block', marginTop: '1px' }}>
                        {u.meta}
                      </Text>
                    </span>
                    <Badge tone={u.statusTone}>{u.status}</Badge>
                  </button>
                ))}
              </Card>
            </div>
          ))}
          {v.noUnlogged ? (
            <>
              <Text variant="body" as="p" tone="muted" style={{ margin: '16px 0 0' }}>
                {v.noUnloggedNote}
              </Text>
            </>
          ) : null}
        </div>
      </div>
    </>
  );
}
