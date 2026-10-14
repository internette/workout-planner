import { Pressable } from '@moonshot/design-system/buttons';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { Plus } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';

/** An exercise in the Spellbook’s list: open it, or add it to the workout being built. */
export function ExerciseRow({ exercise }: { exercise: any }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: 'var(--space-3) 0' }}>
      <Pressable
        onClick={exercise?.open}
        aria-label={'View details for ' + exercise?.name}
        style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: '1 1 200px', minWidth: '0', margin: '-6px', padding: '6px', borderRadius: 'var(--radius-sm)' }}
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
      </Pressable>
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
        <Pressable
          onClick={exercise?.add}
          aria-label={'Add ' + exercise?.name + ' to a workout'}
          style={{ flex: 'none', width: '44px', height: '44px', margin: '-4px -6px -4px 0', display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-full)' }}
        >
          <span style={{ width: '32px', height: '32px', display: 'grid', placeItems: 'center', borderRadius: 'var(--radius-full)', background: 'var(--color-pink-tint)' }}>
            <Plus color="var(--color-pink-deep)" strokeWidth={2.6} size={16} />
          </span>
        </Pressable>
      )}
    </div>
  );
}
