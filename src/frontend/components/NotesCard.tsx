import type { CSSProperties, ReactNode } from 'react';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';

/** Notes written for later: a saved workout's cues, or a Chronicle entry's reflection (`lead`, where the note is the
 * page's main text and is set larger). Line breaks are kept as typed. */
export function NotesCard({ children, lead = false, style }: { children: ReactNode; lead?: boolean; style?: CSSProperties }) {
  return (
    <Card style={style}>
      <Text variant="micro" as="div" tone="subtle">
        NOTES
      </Text>
      <Text
        variant="body"
        tone="ink"
        as="p"
        style={{ margin: 'var(--space-2) 0 0', whiteSpace: 'pre-wrap', textWrap: 'pretty', ...(lead ? { fontSize: 'var(--text-lg)' } : {}) }}
      >
        {children}
      </Text>
    </Card>
  );
}
