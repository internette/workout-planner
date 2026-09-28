import type { CSSProperties } from 'react';
import { Stat } from '@moonshot/design-system/stat';

export interface StatItem {
  label: string;
  value: string;
  /** e.g. what was planned, under what was ridden. */
  note?: string;
}

/** Figures side by side, wrapping on a narrow screen: a ride's distance, time, elevation and effort, or an exercise's
 * sets, weight and rest. `lg` on a saved workout's or exercise's own page. */
export function StatRow({ stats, size, style }: { stats: StatItem[]; size?: 'lg'; style?: CSSProperties }) {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '26px', ...style }}>
      {stats.map((r) => (
        <Stat key={r.label} size={size} label={r.label} value={r.value} note={r.note} />
      ))}
    </div>
  );
}
