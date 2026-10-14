// The Spellbook: saved and built-in workouts and exercises, searched and filtered.
// Moved out of PlannerView as it was; it reads the `v` object built in Planner.tsx.
import type { PlannerVals } from '@/frontend/features/planner/store/types';
import { Card } from '@moonshot/design-system/card';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { Button } from '@moonshot/design-system/buttons';
import { ChevronLeft, Plus } from '@moonshot/design-system/icons';
import { PageHeader } from '@/frontend/components/PageHeader';
import { SearchBar } from '@/frontend/components/SearchBar';
import { ActiveFilters, FilterButton } from '@/frontend/features/spellbook/FilterSheet';
import { ExerciseRow } from '@/frontend/features/spellbook/ExerciseRow';
import { NewExerciseCard } from '@/frontend/features/spellbook/NewExerciseCard';
import { WorkoutRow } from '@/frontend/features/spellbook/WorkoutRow';
import { ProgramList } from '@/frontend/features/programs/ProgramList';

export function SpellbookScreen({ v }: { v: PlannerVals }) {
  return (
    <div>
      {/* "New" makes whichever kind the list is showing. */}
      <PageHeader
        title="Spellbook"
        count={v.showArsenalPrograms ? v.programCount : v.arsenalCount}
        intro={v.arsenalIntro}
        action={
          <Button
            type="primary"
            size="sm"
            onClick={v.showArsenalPrograms ? v.newProgram : v.showArsenalWorkouts ? v.goNewWorkoutFromArsenal : v.openArsenalAdd}
            aria-label={v.arsenalNewName}
            aria-expanded={v.showArsenalWorkouts || v.showArsenalPrograms ? undefined : !!v.arsenalAddOpen}
            aria-controls={v.showArsenalExercises && v.arsenalAddOpen ? 'new-exercise' : undefined}
            data-arsenal-new
            style={{ whiteSpace: 'nowrap' }}
          >
            <Plus color="var(--color-surface)" strokeWidth={2.2} size={16} />
            {v.arsenalNewLabel}
          </Button>
        }
      />
      {v.arsenalPicking ? (
        // Stays in view down the long list, so it's always clear the Spellbook is picking for a workout.
        // The page-colored band behind it keeps the list from showing through above the card.
        <div
          style={{
            position: 'sticky',
            top: '0',
            zIndex: 5,
            margin: 'var(--space-1) calc(-1 * var(--space-1)) 0',
            padding: 'var(--space-3) var(--space-1) var(--space-1)',
            background: 'var(--color-canvas)',
          }}
        >
          <Card
            pad="xs"
            elevation="overlay"
            style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 'var(--space-2) var(--space-3)' }}
          >
            <Text variant="body" tone="ink" style={{ flex: '1 1 200px', minWidth: '0' }}>
              Adding to <strong>{v.arsenalPickTitle}</strong>
            </Text>
            <Button type="secondary" size="sm" onClick={v.backToPickedWorkout}>
              <ChevronLeft color="var(--color-pink-deep)" strokeWidth={2.2} size={14} />
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
        options={v.arsenalViews}
        value={v.arsenalView}
        onChange={v.setArsenalView}
        style={{ marginTop: 'var(--space-4)' }}
      />
      {/* The search, and beside it everything else that narrows the list, in one sheet. */}
      <div style={{ display: 'flex', alignItems: 'stretch', gap: 'var(--space-2)', marginTop: 'var(--space-3)' }}>
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
        {v.showArsenalPrograms ? null : <FilterButton v={v} />}
      </div>
      {v.showArsenalPrograms ? null : <ActiveFilters v={v} />}
      {v.showArsenalPrograms ? <ProgramList v={v} /> : null}
      {v.showArsenalExercises ? (
        <>
          {v.noMatches ? (
            <Text variant="body" as="p" tone="muted" style={{ margin: 'var(--space-5) 0 0' }}>
              {v.noMatchNote}
            </Text>
          ) : null}
          {v.arsenalAddOpen ? <NewExerciseCard v={v} /> : null}
          <Text variant="body" as="p" tone="muted" style={{ margin: 'var(--space-4) 0 0' }}>
            Tap an exercise to see it, or{' '}
            <Plus color="var(--color-pink-deep)" strokeWidth={2.6} size={14} style={{ verticalAlign: '-2px' }} /> to add it to a workout.
          </Text>
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', marginTop: 'var(--space-5)' }}
          >
            {(v.moveGroups ?? []).map((g, i) => (
              <div key={i}>
                <SectionLabel list label={g?.label} note={g?.count} />
                <Card pad="none" style={{ padding: '0 var(--space-4)' }}>
                  {(g?.items ?? []).map((m, i) => (
                    <div key={i} style={i ? { borderTop: '1px solid var(--color-line)' } : undefined}>
                      <ExerciseRow exercise={m} />
                    </div>
                  ))}
                </Card>
              </div>
            ))}
          </div>
        </>
      ) : null}
      {v.showArsenalWorkouts ? (
        <>
          {v.noSavedWorkouts ? (
            <Text variant="body" as="p" tone="muted" style={{ margin: 'var(--space-5) 0 0' }}>
              Your Spellbook is empty. Write your first workout with New.
            </Text>
          ) : null}
          {v.noWorkoutMatches ? (
            <Text variant="body" as="p" tone="muted" style={{ margin: 'var(--space-5) 0 0' }}>
              {v.noWorkoutMatchNote}
            </Text>
          ) : null}
          {/* Grouped like the Exercises tab: the person's own, then the built-in ones by group. */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-5)', marginTop: 'var(--space-5)' }}>
            {(v.workoutGroups ?? []).map((g, gi) => (
              <div key={gi}>
                {g?.label ? (
                  <SectionLabel list label={g?.label} note={g?.count} />
                ) : null}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-2)' }}>
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
  );
}
