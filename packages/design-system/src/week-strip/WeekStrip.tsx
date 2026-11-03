import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../typography';
import styles from './week-strip.module.css';
import { cx } from '../utils/cx';

export interface WeekStripDay {
  /** The day's letter over its tile: "S", "M"… */
  letter: string;
  /** What a screen reader says for it: "Monday: Band Upper Body", "Tuesday: rest". */
  label: string;
  /** The icon on a day with something on it; none on a rest day. Two or more sit side by side. */
  icon?: ReactNode;
  /** Rings the day, to call it out: a day two programs share. Say why in its label. */
  flag?: boolean;
}

export interface WeekStripProps {
  /** Seven days, in the order they're shown. */
  days: WeekStripDay[];
  style?: CSSProperties;
  className?: string;
}

/** A week at a glance: a tile per day, with an icon on the days that have something on them, and a ring on any called out. */
export function WeekStrip({ days, style, className }: WeekStripProps) {
  return (
    <div className={cx(styles.strip, className)} style={style}>
      {days.map((d, i) => (
        <div key={i} className={styles.day} role="img" aria-label={d.label}>
          <Text variant="micro" tone="slate" as="div" aria-hidden="true">
            {d.letter}
          </Text>
          <div className={cx(styles.tile, d.icon ? styles.on : '', d.flag ? styles.flag : '')} aria-hidden="true">
            {d.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
