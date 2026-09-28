import { Text } from '@moonshot/design-system/typography';

// Marks a warm-up: a small label above its name, or beside it (inline) where a row has no room above.
export function WarmupTag({ inline }: { inline?: boolean }) {
  return (
    <>
      {/* A real space, so it isn't read run together with the words before it. */}
      {inline ? ' ' : null}
      <Text
        variant="micro"
        as="span"
        tone="accent"
        weight="bold"
        style={
          inline
            ? { display: 'inline-block', marginLeft: '4px', verticalAlign: 'middle' }
            : { display: 'block', marginBottom: '3px' }
        }
      >
        WARM-UP
      </Text>
    </>
  );
}
