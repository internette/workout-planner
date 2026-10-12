import type { CSSProperties } from 'react';
import { Text } from '../typography';
import styles from './block-bar.module.css';

export interface BlockBarBlock {
  name: string;
  weeks: number;
}

export interface BlockBarProps {
  /** The program's blocks, in order. Each is as long as its weeks. */
  blocks: BlockBarBlock[];
  /** Where a run of it is, in weeks from the start of the first block (2.5 = halfway through week 3). Leave it out for
   * a program that isn't running. */
  at?: number | null;
  style?: CSSProperties;
  className?: string;
}

/** A block's fill: the theme color at rising strength, so the blocks read as one climb (the last at full strength). */
const fillOf = (i: number, of: number) => {
  if (of <= 1 || i === of - 1) return styles.full;
  return i === 0 ? styles.faint : styles.half;
};

const weeksText = (n: number) => n + (n === 1 ? ' week' : ' weeks');

/** A program's blocks as one bar, each as long as its weeks, with a key under it when there's more than one, and a
 * marker for where a run is. */
export function BlockBar({ blocks, at, style, className }: BlockBarProps) {
  const total = blocks.reduce((s, b) => s + b.weeks, 0) || 1;
  return (
    <div style={style} className={className}>
      <div className={styles.bar} role="img" aria-label={blocks.map((b) => b.name + ', ' + weeksText(b.weeks)).join('; ')}>
        {blocks.map((b, i) => (
          <div key={i} className={[styles.block, fillOf(i, blocks.length)].join(' ')} style={{ flex: b.weeks }} />
        ))}
      </div>
      {at != null ? (
        <div
          className={styles.marker}
          aria-hidden="true"
          style={{ '--at': Math.max(0, Math.min(100, (at / total) * 100)) + '%' } as CSSProperties}
        />
      ) : null}
      {blocks.length > 1 ? (
        <div className={styles.key} aria-hidden="true">
          {blocks.map((b, i) => (
            <span key={i} className={styles.keyItem}>
              <span className={[styles.dot, fillOf(i, blocks.length)].join(' ')} />
              <Text variant="body" tone="muted">
                {b.name} · {weeksText(b.weeks)}
              </Text>
            </span>
          ))}
        </div>
      ) : null}
    </div>
  );
}
