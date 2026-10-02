import type { ReactNode } from 'react';
import { Card } from '@moonshot/design-system/card';
import { Text } from '@moonshot/design-system/typography';

/** A group on the Settings page: its title (and a note beside it, such as where it's saved), then its settings. */
export function SettingsCard({ title, note, danger, children }: { title: string; note?: string; danger?: boolean; children: ReactNode }) {
  return (
    <Card
      as="section"
      aria-label={title.charAt(0) + title.slice(1).toLowerCase()}
      style={{ marginTop: '14px', ...(danger ? { boxShadow: 'inset 0 0 0 1.5px color-mix(in srgb, var(--color-danger) 35%, transparent)' } : {}) }}
    >
      <Text variant="micro" as="h2" tone={danger ? 'danger' : 'slate'} style={{ margin: 0 }}>
        {title}
        {note ? (
          <Text variant="body" tone="muted" style={{ letterSpacing: 'var(--tracking-base)', textTransform: 'none', fontWeight: 'var(--font-weight-regular)' }}>
            {' · ' + note}
          </Text>
        ) : null}
      </Text>
      {children}
    </Card>
  );
}
