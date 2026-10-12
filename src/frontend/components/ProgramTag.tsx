import { Text } from '@moonshot/design-system/typography';

/** The program a session belongs to, as a small label above its name: "3-day band split" (and where in it, when there's
 * room: "· Build, week 2 of 3"). Nothing for a session no program put there. */
export function ProgramTag({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <Text variant="micro" as="span" tone="accent" style={{ display: 'block', marginBottom: '3px' }}>
      {text}
    </Text>
  );
}
