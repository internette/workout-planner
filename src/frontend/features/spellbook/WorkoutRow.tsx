import { Card } from '@moonshot/design-system/card';
import { Chip } from '@moonshot/design-system/chip';
import { Text } from '@moonshot/design-system/typography';
import { IconSquare } from '@/frontend/components/IconSquare';
import { WarmupTag } from '@/frontend/components/WarmupTag';

/** A saved workout in the Spellbook’s list, with its exercises and target areas. */
export function WorkoutRow({ workout }: { workout: any }) {
  return (
    <Card
      as="button"
      interactive
      pad="sm"
      onClick={workout?.open}
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        gap: '14px',
        width: '100%',
      }}
    >
      <IconSquare size={40}>{workout?.svg}</IconSquare>
      <span style={{ flex: '1 1 200px', minWidth: '0' }}>
        {workout?.warmup ? <WarmupTag /> : null}
        <Text variant="itemTitle" tone="ink" style={{ display: 'block' }}>
          {workout?.name}
        </Text>
        <Text
          variant="caption"
          tone="muted"
          style={{ display: 'block', marginTop: '3px' }}
        >
          {workout?.meta}
        </Text>
        {workout?.exercises ? (
          <Text
            variant="small"
            tone="subtle"
            style={{ display: 'block', marginTop: '3px' }}
          >
            {workout?.exercises}
          </Text>
        ) : null}
        {(workout?.areas ?? []).length ? (
          <span
            style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '8px' }}
          >
            {(workout?.areas ?? []).map((a, k) => (
              <Chip key={k}>{a}</Chip>
            ))}
          </span>
        ) : null}
      </span>
    </Card>
  );
}
