// A new workout’s first question: what kind it is (lifting, cycling, stretching or yoga). Whether it's a warm-up is
// asked in the editor that follows. Its type chip there comes back here to change it: then Back returns to the editor,
// the current type is chosen, and the Spellbook's workouts aren't offered.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Text } from '@moonshot/design-system/typography';
import { BackBar } from '@/frontend/components/BackBar';
import { SavedChoices } from '@/frontend/features/editor/SavedChoices';
import { TypeChoiceCards } from '@/frontend/features/editor/TypeChoiceCards';

export function TypePickerScreen({ v }: { v: PlannerVals }) {
  return (
    <div style={{ maxWidth: '560px' }}>
      {v.retyping ? <BackBar label="Back" onBack={v.closeRetype} /> : <BackBar label={v.backLabel} onBack={v.backToDay} />}
      <div style={{ marginTop: '18px' }}>
        <Text variant="micro" as="div" tone="slate">
          {v.retyping ? v.eEyebrow : 'NEW WORKOUT'}
        </Text>
        <Text variant="heading" as="h1" style={{ margin: '3px 0 0' }}>
          What kind of workout?
        </Text>
      </div>
      <TypeChoiceCards v={v} />
      {v.hasSavedChoices && !v.retyping ? <SavedChoices v={v} /> : null}
    </div>
  );
}
