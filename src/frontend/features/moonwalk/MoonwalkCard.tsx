import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

const Star = ({ on }: { on: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
    <path
      d="M12 2.5l2.9 6.3 6.9.7-5.2 4.6 1.5 6.8L12 17.4l-6.1 3.5 1.5-6.8L2.2 9.5l6.9-.7z"
      fill={on ? 'var(--color-gold)' : 'var(--color-mist)'}
      stroke={on ? 'none' : 'var(--color-outline)'}
      strokeWidth="1"
    />
  </svg>
);

/** Moonwalk on a Run/Walk or Cycling session: turning on finding things as you go, then how far GPS has counted and
 * the stars the pouch has so far. */
export function MoonwalkCard({ v }: { v: PlannerVals }) {
  if (v.mwUnopened)
    return (
      <Card style={{ marginTop: 'var(--space-4)' }}>
        <SectionLabel as="h2" label="Moonwalk" />
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
          Your pouch didn’t open when you finished. Its {v.mwStars} {v.mwStars === 1 ? 'star is' : 'stars are'} still here.
        </Text>
        <Button type="primary" size="md" onClick={v.mwOpen} style={{ marginTop: 'var(--space-3)' }}>
          Open your pouch
        </Button>
      </Card>
    );
  if (!v.mwOn)
    return (
      <Card style={{ marginTop: 'var(--space-4)' }}>
        <SectionLabel as="h2" label="Moonwalk" />
        <Text variant="body" tone="muted" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
          Collect Finds for your Starbook as you {v.mwRide ? 'ride' : 'go'}. GPS fills a pouch with stars, {v.mwPer.toLowerCase()}, and it opens when you finish.
          Your route and location are never saved.
        </Text>
        <Button type="secondary" size="md" onClick={v.mwStart} style={{ marginTop: 'var(--space-3)' }}>
          Find things as I go
        </Button>
      </Card>
    );
  return (
    <Card style={{ marginTop: 'var(--space-4)' }}>
      <SectionLabel as="h2" label="Moonwalk" aside={v.mwMiles + ' mi'} />
      <div role="img" aria-label={v.mwStars + ' of ' + v.mwMaxStars + ' stars'} style={{ display: 'flex', flexWrap: 'wrap', gap: 2, marginTop: 'var(--space-3)' }}>
        {Array.from({ length: v.mwMaxStars }, (_, i) => (
          <Star key={i} on={i < v.mwStars} />
        ))}
      </div>
      <Text variant="body" tone="ink" as="p" style={{ margin: 'var(--space-2) 0 0' }}>
        {v.mwNext}
      </Text>
      {v.mwNewMiles ? (
        <Text variant="small" tone="muted" as="p" style={{ margin: 'var(--space-1) 0 0' }}>
          {v.mwNewMiles}
        </Text>
      ) : null}
      <Text variant="small" tone={v.mwError ? 'danger' : 'muted'} as="p" role="status" style={{ margin: 'var(--space-2) 0 0' }}>
        {v.mwStatus}
      </Text>
      <Button type="neutral" ghost size="sm" onClick={v.mwStop} style={{ marginTop: 'var(--space-2)' }}>
        Stop collecting
      </Button>
    </Card>
  );
}
