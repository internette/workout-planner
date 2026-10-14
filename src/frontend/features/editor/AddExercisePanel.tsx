import { Button, IconButton } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ChevronRight, Plus } from '@moonshot/design-system/icons';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { SectionLabel, Text } from '@moonshot/design-system/typography';
import { FormActions } from '@/frontend/components/FormActions';
import { ExerciseFields } from '@/frontend/components/ExerciseFields';
import { SearchBar } from '@/frontend/components/SearchBar';
import type { PlannerVals } from '@/frontend/features/planner/store/types';

/** Adding an exercise to the workout: one from the Spellbook, or a new one. */
export function AddExercisePanel({ v }: { v: PlannerVals }) {
  return (
    <Card elevation="overlay" id="add-exercise" data-add-exercise-panel style={{ marginTop: '14px' }}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '12px' }}>
        <Text variant="subheading">Add exercise</Text>
        <SegmentedControl
          label="Add exercise from"
          size="sm"
          tone="quiet"
          compact
          options={[
            { value: 'lib', label: 'From Spellbook' },
            { value: 'new', label: 'Create new' },
          ]}
          value={v.addMode}
          onChange={v.setAddMode}
          style={{ marginLeft: 'auto' }}
        />
      </div>
      {v.addLib ? (
        <>
          <div style={{ marginTop: '16px' }}>
            <SearchBar
              inset
              value={v.pickQuery ?? ''}
              onChange={v.setPickQuery}
              placeholder="Search exercises"
              onClear={v.clearPickQuery}
              status={v.libraryAnnounce}
            />
          </div>
          {v.libraryFilterNote || v.libraryCanNarrow ? (
            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '4px 8px', marginTop: '8px' }}>
              {v.libraryFilterNote ? (
                <>
                  <Text variant="body" tone="muted">
                    {v.libraryFilterNote}
                  </Text>
                  <Button type="secondary" ghost size="xs" onClick={v.libraryShowAll}>
                    Show all
                  </Button>
                </>
              ) : (
                <Button type="secondary" ghost size="xs" onClick={v.libraryNarrow}>
                  {v.libraryNarrowLabel}
                </Button>
              )}
            </div>
          ) : null}
        </>
      ) : null}
      {v.addLib ? (
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '7px',
            marginTop: '18px',
          }}
        >
          {/* Your own exercises first, then the built-in ones, each a list of compact rows: the row opens the exercise,
              the round + adds it. */}
          {[
            { label: 'Your exercises', items: (v.library ?? []).filter((l) => !l.builtin) },
            { label: 'Built-in', items: (v.library ?? []).filter((l) => l.builtin) },
          ]
            .filter((g) => g.items.length)
            .map((g) => (
              <div key={g.label}>
                <SectionLabel list label={g.label} note={String(g.items.length)} />
                <div style={{ borderRadius: 'var(--radius-md)', background: 'var(--color-canvas)', padding: '0 6px 0 14px' }}>
                  {g.items.map((l, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', borderTop: i ? '1px solid var(--color-line)' : 'none' }}>
                      <button
                        type="button"
                        onClick={l?.open ?? undefined}
                        disabled={!l?.open}
                        aria-label={'View details for ' + l?.name}
                        style={{ flex: '1', minWidth: '0', minHeight: '52px', padding: '8px 0', border: 'none', background: 'none', textAlign: 'left', cursor: l?.open ? 'pointer' : 'default', fontFamily: 'inherit' }}
                      >
                        <Text variant="strong" weight="semibold" tone="ink" style={{ display: 'block' }}>
                          {l?.name}
                        </Text>
                        <Text variant="body" tone="muted" style={{ display: 'block' }}>
                          {l?.detail}
                        </Text>
                      </button>
                      <button
                        type="button"
                        onClick={l?.add}
                        aria-label={'Add ' + l?.name + ' to workout'}
                        style={{ flex: 'none', width: '44px', height: '44px', display: 'grid', placeItems: 'center', border: 'none', background: 'none', cursor: 'pointer', borderRadius: 'var(--radius-full)' }}
                      >
                        <span style={{ width: '32px', height: '32px', display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-full)', background: 'var(--color-pink-tint)' }}>
                          <Plus color="var(--color-pink-deep)" strokeWidth={2.6} size={16} />
                        </span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          {v.libraryEmpty ? (
            <Text variant="body" tone="muted" as="p" style={{ margin: '4px 0 0' }}>
              {v.libraryEmptyNote}
            </Text>
          ) : null}
          {v.createFromSearch ? (
            <Button type="secondary" size="md" onClick={v.createFromSearch.go} style={{ alignSelf: 'flex-start', marginTop: '4px' }}>
              <Plus color="var(--color-pink-deep)" strokeWidth={2.4} size={16} />
              {v.createFromSearch.label}
            </Button>
          ) : null}
          {v.libraryMore ? (
            <Text variant="body" tone="muted" as="p" style={{ margin: '4px 0 0' }}>
              {v.libraryMore}
            </Text>
          ) : null}
          <Button
            type="secondary"
            ghost
            size="sm"
            onClick={v.browseArsenal}
            style={{ marginTop: '4px' }}
          >
            Browse the full Spellbook
            <ChevronRight color="var(--color-pink-deep)" strokeWidth={2.2} size={14} />
          </Button>
        </div>
      ) : null}
      {v.addNew ? (
        <div style={{ marginTop: '18px' }}>
          <ExerciseFields
            name={v.draftName ?? ''}
            onName={v.setName}
            nameError={v.draftNameError}
            sets={v.draftSets ?? ''}
            reps={v.draftReps ?? ''}
            weight={v.draftWeight ?? ''}
            rest={v.draftRest ?? ''}
            onSets={v.setSets}
            onReps={v.setReps}
            onWeight={v.setWeight}
            band={v.draftBand}
            weighted={v.draftWeighted}
            onRest={v.setRest}
            areas={v.draftAreas ?? []}
            equipment={v.draftEquipment ? { id: 'picker-new-equipment', open: v.draftEquipment.open, onToggle: v.draftEquipment.toggle, summary: v.draftEquipment.summary, groups: v.draftEquipment.groups } : null}
            icon={v.iconGrid}
          />
        </div>
      ) : null}
      <FormActions compact>
        {v.addNew && v.draftHint ? (
          <Text variant="body" tone="muted" as="p" style={{ margin: '0 auto 0 0', flex: '1 1 200px' }}>
            {v.draftHint}
          </Text>
        ) : null}
        <Button type="neutral" ghost size="lg" onClick={v.closeAdd}>
          Close
        </Button>
        {v.addNew ? (
          <Button
            type="primary"
            size="lg"
            disabled={v.commitDisabled}
            onClick={v.commitNew}
          >
            Add to workout
          </Button>
        ) : null}
      </FormActions>
    </Card>
  );
}
