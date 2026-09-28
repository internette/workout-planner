import type { CSSProperties, ReactNode } from 'react';
import { Text } from '@moonshot/design-system/typography';

export interface PageHeaderProps {
  /** The page's heading. */
  title: ReactNode;
  /** A muted count beside it, e.g. "12 exercises". */
  count?: ReactNode;
  /** A button at the right of the heading's line, e.g. "New entry". */
  action?: ReactNode;
  /** A line or two under it saying what the page is for. */
  intro?: ReactNode;
  style?: CSSProperties;
}

/** A section's own page heading: Progress, the Spellbook, the Chronicle. */
export function PageHeader({ title, count, action, intro, style }: PageHeaderProps) {
  return (
    <div style={style}>
      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 'var(--space-2) var(--space-3)' }}>
        <Text variant="title" as="h1" style={{ margin: 0 }}>
          {title}
        </Text>
        {count != null ? (
          <Text variant="label" tone="muted">
            {count}
          </Text>
        ) : null}
        {action ? <span style={{ marginLeft: 'auto' }}>{action}</span> : null}
      </div>
      {intro ? (
        <Text
          variant="body"
          as="p"
          tone="muted"
          style={{ margin: 'var(--space-2) 0 0', maxWidth: 'var(--layout-prose-max)', textWrap: 'pretty' }}
        >
          {intro}
        </Text>
      ) : null}
    </div>
  );
}
