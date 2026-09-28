// A new workout’s first question: lifting or cycling.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import { Text } from '@moonshot/design-system/typography';
import { BackBar } from '@/frontend/components/BackBar';
import { SavedChoices } from '@/frontend/features/editor/SavedChoices';
import { TypeChoiceCards } from '@/frontend/features/editor/TypeChoiceCards';

export function TypePickerScreen({ v }: { v: any }) {
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
        {v.hasSavedChoices ? <SavedChoices v={v} /> : null}
      </div>
    </>
  );
}
