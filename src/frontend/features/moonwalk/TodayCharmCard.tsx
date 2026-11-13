import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { CharmGlyph } from './CharmGlyph';

/** Today's charm on the day view: one compact row above the workouts (the charm in use, or the recommended one,
 * preselected), so the first workout starts high on a phone. Only the Streak Ward question gets a full card. One a day. */
export function TodayCharmCard({ v }: { v: PlannerVals }) {
  if (!v.tcShow) return null;
  const rec = v.tcRec;
  const ward = v.tcWard;
  // A Streak Ward question keeps the full card below: it is a one-time choice with a midnight deadline.
  if (!ward) return <TodayCharmRow v={v} />;
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
      {rec ? (
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
            <CharmGlyph tint={rec.tint} fill={rec.fill} stroke={rec.deep} />
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
      ) : null}
    </Card>
  );
}

/** The one-row form: the charm, what it is, and Use / Change. Change opens the same picker. */
function TodayCharmRow({ v }: { v: PlannerVals }) {
  const used = v.tcUsed;
  const rec = v.tcRec;
  const shown = used || rec;
  const label = used ? 'Today’s charm' : rec ? 'Recommended charm' + (rec.count > 1 ? ' · ×' + rec.count : '') : 'Today’s charm';
  return (
    <Card
      as="section"
      aria-labelledby="today-charm-label"
      style={{ marginTop: 'var(--space-3)', padding: 'var(--space-3)', display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2) var(--space-3)' }}
    >
      {shown ? <CharmGlyph tint={shown.tint} fill={shown.fill} stroke={shown.deep} size={36} /> : null}
      <span style={{ flex: '1 1 8rem', minWidth: 0 }}>
        <Text variant="micro" tone="accent" as="h2" id="today-charm-label" style={{ margin: 0 }}>
          {label}
        </Text>
        {shown ? (
          <Text variant="strong" tone="ink" as="span" style={{ display: 'block' }}>
            {shown.name}
            {used ? (
              <Text variant="small" tone="muted" as="span">
                {v.tcCanChange ? ' · on today' : ' · working today'}
              </Text>
            ) : null}
          </Text>
        ) : (
          <Text variant="body" tone="muted" as="span" style={{ display: 'block' }}>
            {v.tcRest}
          </Text>
        )}
      </span>
      <span style={{ display: 'flex', gap: 'var(--space-1)', marginLeft: 'auto' }}>
        {used ? (
          v.tcCanChange ? (
            <Button type="neutral" ghost size="sm" onClick={v.tcChange} disabled={v.tcBusy} aria-label="Change today’s charm">
              Change
            </Button>
          ) : null
        ) : rec ? (
          <>
            <Button type="primary" size="sm" onClick={v.tcUse} disabled={v.tcBusy} aria-label={'Use ' + rec.name + ' today'}>
              Use
            </Button>
            <Button type="neutral" ghost size="sm" onClick={v.tcOpen} aria-label="Change today’s charm">
              Change
            </Button>
          </>
        ) : (
          <Button type="secondary" size="sm" onClick={v.tcOpen}>
            Pick a charm
          </Button>
        )}
      </span>
    </Card>
  );
}
