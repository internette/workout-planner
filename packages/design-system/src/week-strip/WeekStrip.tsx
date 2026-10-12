import type { CSSProperties, ReactNode } from 'react';
import { Text } from '../typography';
import styles from './week-strip.module.css';

export interface WeekStripDay {
  /** The day's letter over its tile: "S", "M"… */
  letter: string;
  /** What a screen reader says for it: "Monday: Band Upper Body", "Tuesday: rest". */
  label: string;
  /** The icon on a day with something on it; none on a rest day. */
  icon?: ReactNode;
}

export interface WeekStripProps {
  /** Seven days, in the order they're shown. */
  days: WeekStripDay[];
  style?: CSSProperties;
  className?: string;
}

/** A week at a glance: a tile per day, with an icon on the days that have something on them. */
export function WeekStrip({ days, style, className }: WeekStripProps) {
  return (
    <div className={[styles.strip, className].filter(Boolean).join(' ')} style={style}>
      {days.map((d, i) => (
        <div key={i} className={styles.day} role="img" aria-label={d.label}>
          <Text variant="micro" tone="slate" as="div" aria-hidden="true">
            {d.letter}
          </Text>
          <div className={[styles.tile, d.icon ? styles.on : ''].filter(Boolean).join(' ')} aria-hidden="true">
            {d.icon}
          </div>
        </div>
      ))}
    </div>
  );
}
