// A Spellbook address for a workout or exercise that isn’t there (deleted, or someone else’s).
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Text } from '@moonshot/design-system/typography';
import { Button } from '@moonshot/design-system/buttons';
import { BackLink } from '@/frontend/components/BackLink';

export function NotInSpellbook({ v }: { v: PlannerVals }) {
  return (
    <div>
      <BackLink label="Spellbook" onClick={v.goArsenal} />
      <Text variant="title" as="h1" style={{ margin: '14px 0 0' }}>
        Not in your Spellbook
      </Text>
      <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
        {v.isTemplate
          ? 'This workout has been deleted, or the link is to someone else’s Spellbook.'
          : 'This exercise has been deleted, or the link is to someone else’s Spellbook.'}
      </Text>
      <Button type="primary" size="md" onClick={v.goArsenal} style={{ marginTop: '18px' }}>
        Go to your Spellbook
      </Button>
    </div>
  );
}
