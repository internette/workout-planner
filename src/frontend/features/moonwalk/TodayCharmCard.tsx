import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { CharmGlyph } from './CharmGlyph';

/** Today's charm on the day view: the one in use, or the recommended one, preselected, with why. One a day. */
export function TodayCharmCard({ v }: { v: PlannerVals }) {
  if (!v.tcShow) return null;
  const used = v.tcUsed;
  const rec = v.tcRec;
  const ward = v.tcWard;
  return (
    <Card as="section" aria-label="Today’s charm" style={{ marginTop: 'var(--space-4)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 'var(--space-3)' }}>
        <Text variant="subheading" as="h2" tone="ink" style={{ margin: 0 }}>
          {ward ? 'Save your ' + ward.streak + '-day streak?' : 'Today’s charm'}
        </Text>
        <Text variant="small" tone="muted">
          1 a day
        </Text>
      </div>
      {used ? (
        <>
          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginTop: 'var(--space-3)' }}>
            <CharmGlyph tint={used.tint} fill={used.fill} />
            <span style={{ minWidth: 0 }}>
              <Text variant="strong" tone="ink" as="span" style={{ display: 'block' }}>
                {used.name}
              </Text>
              <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                {used.note}
              </Text>
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2) var(--space-3)', marginTop: 'var(--space-3)' }}>
            {v.tcCanChange ? (
              <>
                <Button type="secondary" size="md" onClick={v.tcChange} disabled={v.tcBusy}>
                  Change
                </Button>
                <Text variant="small" tone="muted">
                  You can change it until it starts working.
                </Text>
              </>
            ) : (
              <Text variant="small" tone="muted">
                It’s working today. A new charm can be used tomorrow.
              </Text>
            )}
          </div>
        </>
      ) : rec ? (
        <>
          {ward ? (
            <Text variant="body" tone="slate" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
              {rec.reason}
            </Text>
          ) : null}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 'var(--space-3)',
              marginTop: 'var(--space-3)',
              padding: 'var(--space-3)',
              borderRadius: 'var(--radius-md)',
              border: '2px solid var(--color-pink)',
              background: 'var(--color-surface)',
            }}
          >
            <CharmGlyph tint={rec.tint} fill={rec.fill} />
            <span style={{ minWidth: 0, flex: '1 1 0' }}>
              <Text variant="micro" tone="accent" as="span" style={{ display: 'block' }}>
                Recommended{rec.count > 1 ? ' · ×' + rec.count : ''}
              </Text>
              <Text variant="strong" tone="ink" as="span" style={{ display: 'block' }}>
                {rec.name}
              </Text>
              {ward ? (
                <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                  {rec.count === 1 ? '1 held' : rec.count + ' held'}. It counts as today’s charm.
                </Text>
              ) : (
                <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
                  {rec.reason}
                </Text>
              )}
            </span>
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
            <Button type="primary" size="md" onClick={v.tcUse} disabled={v.tcBusy}>
              {ward ? 'Use a ' + rec.name : 'Use ' + rec.name + ' today'}
            </Button>
            {ward ? (
              <Button type="neutral" ghost size="md" onClick={v.tcWardNo}>
                Let it go, keep today’s charm
              </Button>
            ) : (
              <Button type="neutral" ghost size="md" onClick={v.tcOpen}>
                Change
              </Button>
            )}
          </div>
          {ward ? (
            <Text variant="small" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
              You have until midnight to decide. If you don’t, the streak ends and your ward is kept.
            </Text>
          ) : null}
        </>
      ) : (
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: 'var(--space-2) var(--space-3)', marginTop: 'var(--space-2)' }}>
          <Text variant="body" tone="muted">
            {v.tcRest}
          </Text>
          <Button type="secondary" size="md" onClick={v.tcOpen}>
            Pick a charm
          </Button>
        </div>
      )}
    </Card>
  );
}
