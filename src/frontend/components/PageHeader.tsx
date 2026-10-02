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
      {/* The action keeps its place at the end of the line; on a narrow screen the count goes under the title instead. */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 'var(--space-3)' }}>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignItems: 'baseline',
            gap: '0 var(--space-3)',
            flex: '1',
            minWidth: 0,
          }}
        >
          <Text variant="title" as="h1" style={{ margin: 0 }}>
            {title}
          </Text>
          {count != null ? (
            <Text variant="strong" tone="muted">
              {count}
            </Text>
          ) : null}
        </div>
        {action ? <span style={{ flex: 'none' }}>{action}</span> : null}
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
