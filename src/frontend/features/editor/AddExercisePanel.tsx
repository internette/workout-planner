import { Button, IconButton } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ChevronRight, Plus } from '@moonshot/design-system/icons';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { Text } from '@moonshot/design-system/typography';
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
          {(v.library ?? []).map((l, i) => (
            <div key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                padding: '6px 6px 6px 16px',
                borderRadius: 'var(--radius-md)',
                background: 'var(--color-canvas)',
              }}
            >
              <button
                type="button"
                onClick={l?.open ?? undefined}
                disabled={!l?.open}
                aria-label={'View details for ' + l?.name}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  flex: '1',
                  minWidth: '0',
                  minHeight: '44px',
                  padding: '4px 0',
                  border: 'none',
                  background: 'none',
                  textAlign: 'left',
                  cursor: l?.open ? 'pointer' : 'default',
                  fontFamily: 'inherit',
                }}
              >
                {/* The detail goes under the name: side by side, a narrow screen squeezed the name to a sliver. */}
                <span style={{ display: 'flex', flexDirection: 'column', gap: '2px', flex: '1', minWidth: '0' }}>
                  <span
                    style={{
                      fontSize: 'var(--text-lg)',
                      fontWeight: 'var(--font-weight-semibold)',
                      color: 'var(--color-ink)',
                    }}
                  >
                    {l?.name}
                  </span>
                  <Text variant="body" tone="muted">
                    {l?.detail}
                  </Text>
                </span>
                {l?.open ? (
                  <ChevronRight color="var(--color-muted)" strokeWidth={2.2} size={16} />
                ) : null}
              </button>
              <IconButton
                label={'Add ' + l?.name + ' to workout'}
                size="lg"
                onClick={l?.add}
                style={{ background: 'var(--color-surface)' }}
              >
                <Plus color="var(--color-pink-deep)" strokeWidth={2.4} size={18} />
              </IconButton>
            </div>
          ))}
          {v.libraryEmpty ? (
            <Text variant="body" tone="muted" as="p" style={{ margin: '4px 0 0' }}>
              {v.libraryEmptyNote}
            </Text>
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
