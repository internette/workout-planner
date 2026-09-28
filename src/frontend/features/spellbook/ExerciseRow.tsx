import { IconButton } from '@moonshot/design-system/buttons';
import { Card } from '@moonshot/design-system/card';
import { ChevronRight, Plus } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { IconSquare } from '@/frontend/components/IconSquare';

/** An exercise in the Spellbook’s list: open it, or add it to the workout being built. */
export function ExerciseRow({ exercise }: { exercise: any }) {
  return (
    <Card
      pad="sm"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
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
          gap: '16px',
          flex: '1 1 200px',
          minWidth: '0',
          margin: '-8px',
          padding: '8px',
          border: 'none',
          borderRadius: 'var(--radius-sm)',
          background: 'none',
          textAlign: 'left',
          cursor: 'pointer',
          fontFamily: 'inherit',
        }}
      >
        <IconSquare>{exercise?.svg}</IconSquare>
        <span style={{ flex: '1', minWidth: '0' }}>
          <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
            {exercise?.name}
          </Text>
          <Text
            variant="caption"
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
        <IconButton
          label={'Add ' + exercise?.name + ' to workout'}
          size="lg"
          onClick={exercise?.add}
          style={{ background: 'var(--color-accent-tint)' }}
        >
          <Plus color="var(--color-accent-deep)" strokeWidth={2.4} size={18} />
        </IconButton>
      )}
    </Card>
  );
}
