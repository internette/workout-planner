import type { ReactNode } from 'react';
import { IconTile } from '@moonshot/design-system/icon-tile';
import { Text } from '@moonshot/design-system/typography';

export interface PageTitleProps {
  /** The workout's or exercise's icon, on its tile. */
  icon: ReactNode;
  /** A small line above, e.g. "EXERCISE" or the session's date. */
  eyebrow: ReactNode;
  /** The page's heading. */
  title: ReactNode;
}

/** An inner page's heading, with its icon: the exercise, saved workout and session pages. */
export function PageTitle({ icon, eyebrow, title }: PageTitleProps) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginTop: '18px' }}>
      <IconTile as="span">{icon}</IconTile>
      <div style={{ minWidth: 0 }}>
        <Text variant="micro" as="div" tone="slate">
          {eyebrow}
        </Text>
        <Text variant="title" as="h1" style={{ margin: '3px 0 0' }}>
          {title}
        </Text>
      </div>
    </div>
  );
}
