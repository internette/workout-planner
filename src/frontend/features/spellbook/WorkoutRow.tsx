import { Card } from '@moonshot/design-system/card';
import { Chip } from '@moonshot/design-system/chip';
import { Text } from '@moonshot/design-system/typography';
import { IconSquare } from '@/frontend/components/IconSquare';
import { ChipRow } from '@/frontend/components/ChipRow';
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
      <IconSquare size={40}>{workout?.svg}</IconSquare>
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
          <ChipRow as="span" style={{ marginTop: '8px' }}>
            {(workout?.areas ?? []).map((a, k) => (
              <Chip key={k}>{a}</Chip>
            ))}
          </ChipRow>
        ) : null}
      </span>
    </Card>
  );
}
