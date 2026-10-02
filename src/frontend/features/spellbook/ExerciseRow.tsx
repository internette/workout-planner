import { IconTile } from '@moonshot/design-system/icon-tile';
import { Button } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ChevronRight, Plus } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';

/** An exercise in the Spellbook’s list: open it, or add it to the workout being built. */
export function ExerciseRow({ exercise }: { exercise: any }) {
  return (
    <Card
      pad="sm"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        width: '100%',
      }}
    >
      <button
        type="button"
        onClick={exercise?.open}
        aria-label={'View details for ' + exercise?.name}
        className="hv1"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
          flex: '1 1 200px',
          minWidth: '0',
          margin: '-6px',
          padding: '6px',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          background: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <IconTile as="span" size="xs" variant="flat">{exercise?.svg}</IconTile>
        <span style={{ flex: '1', minWidth: '0' }}>
          <Text variant="subheading" tone="ink" style={{ display: 'block' }}>
            {exercise?.name}
          </Text>
          <Text
            variant="body"
            tone="muted"
            style={{ display: 'block', marginTop: '3px' }}
          >
            {exercise?.detail}
          </Text>
        </span>
        <ChevronRight color="var(--color-muted)" strokeWidth={2.2} size={16} />
      </button>
      {exercise?.inWorkout ? (
        <Text
          variant="small"
          tone="muted"
          weight="medium"
          style={{ flex: 'none', whiteSpace: 'nowrap' }}
        >
          In workout
        </Text>
      ) : (
        // Said in words, not just +: it adds the exercise to a workout (the one being built, or one to choose).
        <Button type="secondary" size="sm" onClick={exercise?.add} aria-label={'Add ' + exercise?.name + ' to a workout'} style={{ flex: 'none' }}>
          <Plus color="var(--color-accent-deep)" strokeWidth={2.4} size={15} />
          Add
        </Button>
      )}
    </Card>
  );
}
