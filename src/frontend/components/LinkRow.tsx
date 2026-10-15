import type { ReactNode } from 'react';
import { Card } from '@moonshot/design-system/card';
import { ChevronRight, Plus } from '@moonshot/design-system/icons';
import { Text } from '@moonshot/design-system/typography';
import { KindTag, type WorkoutKind } from './KindTag';

export interface LinkRowProps {
  title: ReactNode;
  /** A line under the title, e.g. "3 exercises · 45 min". */
  detail?: ReactNode;
  /** Marks a warm-up, a stretch or yoga above the title. */
  kind?: WorkoutKind[] | null;
  /** Before the text, e.g. a flat IconTile. */
  leading?: ReactNode;
  /** What pressing it does: go somewhere (a chevron) or add something (a plus). */
  action?: 'open' | 'add';
  onClick?: () => void;
  /** Can't be picked: dimmed, with no chevron. */
  disabled?: boolean;
  /** What a screen reader calls it, where the title, tag and detail wouldn't read well run together. */
  label?: string;
}

/** A card-sized row you press to open or add something: an optional icon, a title with a detail line, and a chevron
 * or plus at the end. Lists of them sit in a column 8px apart. */
export function LinkRow({ title, detail, kind, leading, action = 'open', onClick, disabled, label }: LinkRowProps) {
  return (
    <Card
      as="button"
      pad="sm"
      interactive
      disabled={disabled}
      onClick={onClick}
      aria-label={label}
      style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', textAlign: 'left', width: '100%', opacity: disabled ? 'var(--alpha-5)' : 1 }}
    >
      {leading}
      <span style={{ flex: '1', minWidth: '0' }}>
        <KindTag kind={kind ?? null} />
        <Text variant="subheading" tone="ink" style={{ display: 'block' }}>
          {title}
        </Text>
        {detail != null && detail !== '' ? (
          <Text variant="body" tone="muted" style={{ display: 'block', marginTop: 'var(--space-1)' }}>
            {detail}
          </Text>
        ) : null}
      </span>
      {disabled ? null : action === 'add' ? (
        <Plus color="var(--color-pink-deep)" size={17} />
      ) : (
        <ChevronRight color="var(--color-muted)" size={16} />
      )}
    </Card>
  );
}
