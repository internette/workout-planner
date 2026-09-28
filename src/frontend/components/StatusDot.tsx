import type { CSSProperties } from 'react';

/** Where a day or a session stands. */
export type DayStatus = 'done' | 'partly' | 'missed' | 'planned' | 'rest';

export interface StatusDotProps {
  status: DayStatus;
  /** `sm` under a date (the week strip, the month grid, the legend); `md` at the end of a week row. */
  size?: 'sm' | 'md';
  /** Drawn on the accent colour: a selected day. */
  onAccent?: boolean;
}

// Done is a filled dot, planned a ring, missed a fainter and slightly larger ring, partly done a half-filled one, and
// a rest day a short dash. The words are always beside it or in the control's name; this only shows it.
const SIZES = {
  sm: { dot: 6, partly: 8, missed: 7, rest: [8, 2] },
  md: { dot: 8, partly: 8, missed: 9, rest: [14, 2] },
};

export function StatusDot({ status, size = 'sm', onAccent = false }: StatusDotProps) {
  const s = SIZES[size];
  const ink = onAccent ? 'var(--color-on-accent)' : 'var(--color-slate)';
  const round = (px: number, rest: CSSProperties): CSSProperties => ({ width: px, height: px, borderRadius: 'var(--radius-full)', ...rest });
  const style: CSSProperties =
    status === 'done'
      ? round(s.dot, { background: ink })
      : status === 'partly'
        ? round(s.partly, { boxShadow: `inset 0 0 0 1.5px ${ink}`, background: `linear-gradient(90deg,${ink} 50%,transparent 50%)` })
        : status === 'missed'
          ? round(s.missed, { boxShadow: `inset 0 0 0 1.5px ${onAccent ? 'var(--color-on-accent-soft)' : 'var(--color-muted)'}` })
          : status === 'planned'
            ? round(s.dot, { boxShadow: `inset 0 0 0 1.5px ${onAccent ? 'var(--color-on-accent)' : 'var(--color-teal)'}` })
            : {
                width: s.rest[0],
                height: s.rest[1],
                borderRadius: 1,
                background: onAccent ? 'var(--color-on-accent-faint)' : 'var(--color-divider)',
              };
  return <span aria-hidden="true" style={{ flex: 'none', display: 'block', ...style }} />;
}

/** The key under the calendar: each status with its name. */
export const STATUS_NAMES: [DayStatus, string][] = [
  ['planned', 'Planned'],
  ['done', 'Completed'],
  ['partly', 'Partly done'],
  ['missed', 'Missed'],
  ['rest', 'Rest'],
];
