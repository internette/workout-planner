import { Badge } from '@moonshot/design-system/badge';
import { Text } from '@moonshot/design-system/typography';
import { splitSide } from '@/frontend/shared/sides';

/** An exercise's name as a row's heading. One done on each side shows its side as a chip on its own line under the
 * name, so the chip is always in the same place and the name is never cut short to make room for it. */
export function ExerciseName({ name, done = false }: { name: string; done?: boolean }) {
  const { base, side } = splitSide(name);
  return (
    <>
      <Text
        variant="subheading"
        tone={done ? 'muted' : 'ink'}
        style={{ display: 'block', textDecoration: done ? 'line-through' : undefined }}
      >
        {base}
      </Text>
      {side ? (
        <Badge tone="soft" style={{ marginTop: '4px', padding: '2px 8px' }}>
          {side}
        </Badge>
      ) : null}
    </>
  );
}
