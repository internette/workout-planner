// One exercise in the Spellbook: its sets, areas, equipment and the workouts that use it.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { Chip } from '@moonshot/design-system/chip';
import { Button } from '@moonshot/design-system/buttons';
import { ChevronRight, Copy, Pencil, Plus } from '@moonshot/design-system/icons';
import { BackBar } from '@/frontend/components/BackBar';
import { DeleteSection } from '@/frontend/components/DeleteSection';
import { StatRow } from '@/frontend/components/StatRow';
import { PageTitle } from '@/frontend/components/PageTitle';
import { ChipRow } from '@/frontend/components/ChipRow';

export function ExerciseScreen({ v }: { v: PlannerVals }) {
  return (
    <>
      <div>
        <BackBar label={v.backLabel} onBack={v.goBack}>
          {v.exercise.builtin ? (
            <Button type="secondary" size="sm" onClick={v.exercise.copy} style={{ whiteSpace: 'nowrap' }}>
              <Copy color="var(--color-accent-deep)" size={16} />
              Copy
            </Button>
          ) : (
            <Button type="secondary" size="sm" onClick={v.exercise.edit} style={{ whiteSpace: 'nowrap' }}>
              <Pencil color="var(--color-accent-deep)" size={16} />
              Edit
            </Button>
          )}
          <Button type="primary" size="sm" onClick={v.exercise.add} style={{ whiteSpace: 'nowrap' }}>
            <Plus color="var(--color-on-accent)" size={16} />
            Add
          </Button>
        </BackBar>
        <PageTitle icon={v.exercise.svg} eyebrow={v.exercise.builtin ? 'BUILT-IN EXERCISE' : 'EXERCISE'} title={v.exercise.name} />
        <Card style={{ marginTop: '18px' }}>
          <StatRow
            size="lg"
            stats={[
              { label: 'SETS × REPS', value: v.exercise.sets },
              { label: 'WEIGHT', value: v.exercise.weight },
              { label: 'REST', value: v.exercise.rest },
            ]}
          />
          {(v.exercise.areas ?? []).length ? (
            <ChipRow style={{ marginTop: '18px' }}>
              {(v.exercise.areas ?? []).map((a, i) => (
                <Chip key={i}>{a}</Chip>
              ))}
            </ChipRow>
          ) : null}
          {v.exercise.equipment ? (
            <>
              <Text variant="eyebrow" as="h2" tone="slate" style={{ margin: '16px 0 8px' }}>
                EQUIPMENT
              </Text>
              <ChipRow>
                {v.exercise.equipment.map((a, i) => (
                  <Chip key={i}>{a}</Chip>
                ))}
              </ChipRow>
            </>
          ) : null}
        </Card>
        {v.exercise.builtin ? (
          <Text variant="body" as="p" tone="muted" style={{ margin: '18px 0 0' }}>
            Built-in exercises can&apos;t be changed. Add it to any workout as it is, or copy it to make
            your own version to edit.
          </Text>
        ) : (
          <>
            <Text variant="eyebrow" tone="slate" as="div" style={{ margin: '24px 0 10px' }}>
              USED IN
            </Text>
            {(v.exercise.usedIn ?? []).length ? (
              <ChipRow>
                {(v.exercise.usedIn ?? []).map((w, i) => (
                  <Chip key={i} onClick={w?.open} trailing={<ChevronRight color="var(--color-muted)" strokeWidth={2.2} size={14} />}>
                    {w?.name}
                  </Chip>
                ))}
              </ChipRow>
            ) : (
              <Text variant="body" as="p" tone="muted" style={{ margin: '0' }}>
                Not part of a saved workout yet.
              </Text>
            )}
            {v.exercise.usedInNote ? (
              <Text variant="caption" as="p" tone="muted" style={{ margin: '10px 0 0' }}>
                {v.exercise.usedInNote}
              </Text>
            ) : null}
          </>
        )}
        {v.exercise.canDelete ? (
          <DeleteSection label="Delete exercise" onClick={v.exercise.remove} />
        ) : null}
      </div>
    </>
  );
}
