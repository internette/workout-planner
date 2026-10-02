// Editing an exercise saved in the Spellbook.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Text } from '@moonshot/design-system/typography';
import { BackBar } from '@/frontend/components/BackBar';
import { ExerciseEditForm } from '@/frontend/features/spellbook/ExerciseEditForm';

export function ExerciseEditScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      <BackBar label={v.backLabel} onBack={v.exerciseEdit.cancel} />
      {/* The same as the workout editor: Back on its own row, then what's being edited. */}
      <Text variant="eyebrow" as="h1" tone="slate" style={{ margin: '18px 0 0' }}>
        {v.exerciseEdit.heading}
      </Text>
      <ExerciseEditForm v={v} />
    </div>
  );
}
