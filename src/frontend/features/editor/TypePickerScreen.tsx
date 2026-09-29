// A new workout’s first question: what kind it is (lifting, cycling, stretching or yoga), and whether it's a warm-up.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Card } from '@moonshot/design-system/card';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { Text } from '@moonshot/design-system/typography';
import { BackBar } from '@/frontend/components/BackBar';
import { SavedChoices } from '@/frontend/features/editor/SavedChoices';
import { TypeChoiceCards } from '@/frontend/features/editor/TypeChoiceCards';

export function TypePickerScreen({ v }: { v: PlannerVals }) {
  return (
    <>
      <div style={{ maxWidth: '560px' }}>
        <BackBar label={v.backLabel} onBack={v.backToDay} />
        <div style={{ marginTop: '18px' }}>
          <Text variant="eyebrow" as="div" tone="slate">
            NEW WORKOUT
          </Text>
          <Text variant="heading" as="h1" style={{ margin: '3px 0 0' }}>
            What kind of workout?
          </Text>
        </div>
        <TypeChoiceCards v={v} />
        {/* Apart from its kind: set here before picking one, and kept in the editor to change later. A ride isn't one. */}
        {v.warmupShown ? (
          <Card pad="sm" style={{ marginTop: '12px' }}>
            <Checkbox switch checked={!!v.warmupOn} onChange={v.setWarmup}>
              Warm-up
            </Checkbox>
            <Text variant="caption" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
              Listed first on its day and tagged as a warm-up. Lifting, stretching or yoga can be one.
            </Text>
          </Card>
        ) : null}
        {v.hasSavedChoices ? <SavedChoices v={v} /> : null}
      </div>
    </>
  );
}
