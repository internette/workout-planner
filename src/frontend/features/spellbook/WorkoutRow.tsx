import { IconTile } from '@moonshot/design-system/icon-tile';
import { Card } from '@moonshot/design-system/card';
import { Chip, ChipGroup } from '@moonshot/design-system/chip';
import { Text } from '@moonshot/design-system/typography';
import { KindTag, kindOf } from '@/frontend/components/KindTag';

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
      <IconTile as="span" size="sm" variant="flat">{workout?.svg}</IconTile>
      <span style={{ flex: '1 1 200px', minWidth: '0' }}>
        <KindTag kind={kindOf(workout)} />
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
          <ChipGroup as="span" style={{ marginTop: '8px' }}>
            {(workout?.areas ?? []).map((a, k) => (
              <Chip key={k}>{a}</Chip>
            ))}
          </ChipGroup>
        ) : null}
      </span>
    </Card>
  );
}
