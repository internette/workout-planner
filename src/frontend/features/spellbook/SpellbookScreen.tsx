// The Spellbook: saved and built-in workouts and exercises, searched and filtered.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Fragment } from 'react';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { Button } from '@moonshot/design-system/buttons';
import { ChevronLeft, Plus } from '@moonshot/design-system/icons';
import { GroupLabel } from '@/frontend/components/GroupLabel';
import { PageHeader } from '@/frontend/components/PageHeader';
import { SearchBar } from '@/frontend/components/SearchBar';
import { ActiveFilters, FilterButton } from '@/frontend/features/spellbook/FilterSheet';
import { ExerciseRow } from '@/frontend/features/spellbook/ExerciseRow';
import { NewExerciseCard } from '@/frontend/features/spellbook/NewExerciseCard';
import { WorkoutRow } from '@/frontend/features/spellbook/WorkoutRow';

export function SpellbookScreen({ v }: { v: PlannerVals }) {
  return (
    <>
      <div>
        {/* "New" makes whichever kind the list is showing. */}
        <PageHeader
          title="Spellbook"
          count={v.arsenalCount}
          intro={v.arsenalIntro}
          action={
            <Button
              type="primary"
              size="sm"
              onClick={v.showArsenalWorkouts ? v.goNewWorkoutFromArsenal : v.openArsenalAdd}
              aria-label={v.arsenalNewName}
              aria-expanded={v.showArsenalWorkouts ? undefined : !!v.arsenalAddOpen}
              aria-controls={!v.showArsenalWorkouts && v.arsenalAddOpen ? 'new-exercise' : undefined}
              data-arsenal-new
              style={{ whiteSpace: 'nowrap' }}
            >
              <Plus color="var(--color-on-accent)" strokeWidth={2.2} size={16} />
              {v.arsenalNewLabel}
            </Button>
          }
        />
        {v.arsenalPicking ? (
          // Stays in view down the long list, so it's always clear the Spellbook is picking for a workout.
          // The page-coloured band behind it keeps the list from showing through above the card.
          <div
            style={{
              position: 'sticky',
              top: '0',
              zIndex: 5,
              margin: '4px -4px 0',
              padding: '12px 4px 4px',
              background: 'var(--color-canvas)',
            }}
          >
            <Card
              pad="xs"
              elevation="overlay"
              style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '8px 12px' }}
            >
              <Text variant="body" tone="ink" style={{ flex: '1 1 200px', minWidth: '0' }}>
                Adding to <strong>{v.arsenalPickTitle}</strong>
              </Text>
              <Button type="secondary" size="sm" onClick={v.backToPickedWorkout}>
                <ChevronLeft color="var(--color-accent-deep)" strokeWidth={2.2} size={14} />
                Back to workout
              </Button>
            </Card>
          </div>
        ) : null}
        <SegmentedControl
          label="Spellbook view"
          size="sm"
          fullWidth
          equalWidth
          options={[
            { value: 'workouts', label: 'Workouts' },
            { value: 'exercises', label: 'Exercises' },
          ]}
          value={v.arsenalView}
          onChange={v.setArsenalView}
          style={{ marginTop: '16px' }}
        />
        {/* The search, and beside it everything else that narrows the list, in one sheet. */}
        <div style={{ display: 'flex', alignItems: 'stretch', gap: '10px', marginTop: '12px' }}>
          <div style={{ flex: '1', minWidth: '0' }}>
            <SearchBar
              value={v.arsenalQuery ?? ''}
              onChange={v.setArsenalQuery}
              placeholder={v.arsenalSearchPlaceholder}
              label="Search the Spellbook"
              onClear={v.clearArsenalQuery}
              status={v.arsenalResults}
            />
          </div>
          <FilterButton v={v} />
        </div>
        <ActiveFilters v={v} />
        {v.showArsenalExercises ? (
          <>
            {v.noMatches ? (
              <>
                <Text variant="body" as="p" tone="muted" style={{ margin: '20px 0 0' }}>
                  {v.noMatchNote}
                </Text>
              </>
            ) : null}
            {v.arsenalAddOpen ? <NewExerciseCard v={v} /> : null}
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginTop: '22px' }}
            >
              {(v.moveGroups ?? []).map((g, i) => (
                <Fragment key={i}>
                  <div>
                    <GroupLabel label={g?.label} count={g?.count} />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {(g?.items ?? []).map((m, i) => (
                        <Fragment key={i}>
                          <ExerciseRow exercise={m} />
                        </Fragment>
                      ))}
                    </div>
                  </div>
                </Fragment>
              ))}
            </div>
          </>
        ) : null}
        {v.showArsenalWorkouts ? (
          <>
            {v.noSavedWorkouts ? (
              <Text variant="body" as="p" tone="muted" style={{ margin: '20px 0 0' }}>
                Your Spellbook is empty. Write your first workout with New.
              </Text>
            ) : null}
            {v.noWorkoutMatches ? (
              <Text variant="body" as="p" tone="muted" style={{ margin: '20px 0 0' }}>
                {v.noWorkoutMatchNote}
              </Text>
            ) : null}
            {/* Grouped like the Exercises tab: the person's own, then the built-in ones by group. */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '22px', marginTop: '18px' }}>
              {(v.workoutGroups ?? []).map((g, gi) => (
                <div key={gi}>
                  {g?.label ? (
                    <GroupLabel label={g?.label} count={g?.count} />
                  ) : null}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {(g?.items ?? []).map((w, i) => (
                        <WorkoutRow key={i}  workout={w} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : null}
      </div>
    </>
  );
}
