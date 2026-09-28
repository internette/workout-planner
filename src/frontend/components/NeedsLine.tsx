import { Text } from '@moonshot/design-system/typography';

/** "You'll need": the equipment a workout's exercises use, under its chips. Nothing when it isn't known. */
export function NeedsLine({ text }: { text?: string | null }) {
  if (!text) return null;
  return (
    <p style={{ margin: '16px 0 0', lineHeight: 'var(--leading-snug)' }}>
      <Text variant="eyebrow" as="span" tone="slate" style={{ display: 'block' }}>
        YOU&apos;LL NEED
      </Text>
      <Text variant="body" as="span" tone="ink" style={{ display: 'block', marginTop: '2px' }}>
        {text}
      </Text>
    </p>
  );
}
