import { Checkbox } from '@moonshot/design-system/checkbox';
import { Text } from '@moonshot/design-system/typography';

export interface RepeatWeeklyProps {
  on: boolean;
  onChange: (on: boolean) => void;
  /** Shown while it's on: what repeating will do, e.g. "Every Tuesday for 12 weeks". */
  note?: string;
}

/** The "Repeat weekly" switch, with what it will do underneath while it's on. The caller puts it in its own box. */
export function RepeatWeekly({ on, onChange, note }: RepeatWeeklyProps) {
  return (
    <>
      <Checkbox switch checked={on} onChange={onChange}>
        Repeat weekly
      </Checkbox>
      {on ? (
        <Text variant="caption" tone="muted" as="p" style={{ margin: '8px 0 0' }}>
          {note}
        </Text>
      ) : null}
    </>
  );
}
