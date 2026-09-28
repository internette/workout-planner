import type { CSSProperties } from 'react';
import { Stat } from '@moonshot/design-system/stat';

export interface RideStat {
  label: string;
  value: string;
  /** e.g. what was planned, under what was ridden. */
  note?: string;
}

/** A ride's figures (distance, time, elevation, effort) side by side, wrapping on a narrow screen. `lg` on a saved
 * workout's own page, like an exercise's. */
export function RideStats({ stats, size, style }: { stats: RideStat[]; size?: 'lg'; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px', ...style }}>
      {stats.map((r) => (
        <Stat key={r.label} size={size} label={r.label} value={r.value} note={r.note} />
      ))}
    </div>
  );
}
