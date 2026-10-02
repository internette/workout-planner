import type { ReactNode } from 'react';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { SegmentedControl } from '@moonshot/design-system/segmented-control';
import { Text } from '@moonshot/design-system/typography';
import { REPEAT_WEEKS } from '@/frontend/shared/schedule';

export interface RepeatWeeklyProps {
  on: boolean;
  onChange: (on: boolean) => void;
  /** Shown while it's on: what repeating will do, e.g. "Every Tuesday, 12 sessions in all". */
  note?: string;
  /** How many weeks it repeats for, and changing that. Without them there's no choice of length. */
  weeks?: number;
  onWeeks?: (weeks: number) => void;
  /** Shown while it's on, first: such as the weekdays it repeats on. */
  children?: ReactNode;
}

// "For 4 | 8 | 12 weeks": the numbers alone in the control, so all three fit on a phone's narrowest card.
const WEEK_OPTIONS = [...REPEAT_WEEKS].reverse().map((w) => ({ value: String(w), label: String(w) }));

/** The "Repeat weekly" switch, with for how long and what it will do underneath while it's on. The caller puts it in its
 * own box. */
export function RepeatWeekly({ on, onChange, note, weeks, onWeeks, children }: RepeatWeeklyProps) {
  return (
    <>
      <Checkbox switch checked={on} onChange={onChange}>
        Repeat weekly
      </Checkbox>
      {on ? children : null}
      {on && weeks && onWeeks ? (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' }}>
          <Text variant="body" tone="muted" aria-hidden="true">
            For
          </Text>
          <SegmentedControl
            label="Weeks to repeat for"
            size="sm"
            tone="quiet"
            options={WEEK_OPTIONS}
            value={String(weeks)}
            onChange={(w) => onWeeks(Number(w))}
          />
          <Text variant="body" tone="muted" aria-hidden="true">
            weeks
          </Text>
        </div>
      ) : null}
      {on ? (
        <Text variant="body" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
          {note}
        </Text>
      ) : null}
    </>
  );
}
