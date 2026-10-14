import { Text } from '@moonshot/design-system/typography';
import { TagLabel } from './KindTag';

/** Above a session's name, on the calendar: the program it's part of, quietly, then what kind of workout it is
 * ("Warm-up · Lifting"; see typeLabelOf). */
export function SessionTags({ program, type }: { program?: string | null; type: string }) {
  return (
    <>
      {program ? (
        <Text variant="micro" tone="muted" as="span" style={{ display: 'block', marginBottom: 'var(--space-1)' }}>
          {program}
        </Text>
      ) : null}
      <TagLabel>{type}</TagLabel>
    </>
  );
}
