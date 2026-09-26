import type { CSSProperties, ReactNode } from 'react';
import { Text, type TextTone } from '@/components/ui/typography';

// The value's text style for each size, the gap between the label and it, and the gap above a note.
const sizes = {
  sm: { variant: 'itemTitle', gap: 4, noteGap: 2 },
  md: { variant: 'cardTitle', gap: 4, noteGap: 2 },
  lg: { variant: 'subheading', gap: 4, noteGap: 2 },
  xl: { variant: 'heading', gap: 6, noteGap: 4 },
} as const;

export interface StatProps {
  /** The small capitals label above the value, e.g. "DISTANCE". */
  label: ReactNode;
  value: ReactNode;
  /** A unit written after the value, smaller and muted, e.g. "sessions". Passing one (even empty) sets the value
   * on a baseline row with it, so a row of stats lines up whether or not each has a unit. */
  unit?: ReactNode;
  /** A line under the value, e.g. "of 14 mi planned". */
  note?: ReactNode;
  /** sm for a row of several (a ride plan), md in a card (a ride's stats, a mood), lg for an exercise's numbers, xl
   * for a page's headline figures (Profile). */
  size?: keyof typeof sizes;
  /** The label's colour: subtle by default, muted where it sits on a tinted card. */
  labelTone?: TextTone;
  style?: CSSProperties;
  className?: string;
}

/** A labelled figure: a micro label, the value under it, and optionally a unit and a note. */
export function Stat({ label, value, unit, note, size = 'md', labelTone = 'subtle', style, className }: StatProps) {
  const { variant, gap, noteGap } = sizes[size];
  return (
    <div style={style} className={className}>
      <Text variant="micro" as="div" tone={labelTone}>
        {label}
      </Text>
      {unit !== undefined ? (
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '5px', marginTop: gap + 'px' }}>
          <Text variant={variant} tone="ink">
            {value}
          </Text>
          <Text variant="small" tone="muted" weight="medium">
            {unit}
          </Text>
        </div>
      ) : (
        <Text variant={variant} as="div" tone="ink" style={{ marginTop: gap + 'px' }}>
          {value}
        </Text>
      )}
      {note ? (
        <Text variant="caption" as="div" tone="muted" style={{ marginTop: noteGap + 'px' }}>
          {note}
        </Text>
      ) : null}
    </div>
  );
}
