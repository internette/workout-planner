import type { HTMLAttributes } from 'react';
import styles from './badge.module.css';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  /** accent (solid pink) and soft (pale pink) for done; neutral (grey) for in progress, partly done or missed;
   * quiet (white) for planned on a tinted surface. The screen picks the tone for each status. */
  tone?: 'accent' | 'soft' | 'neutral' | 'quiet';
  /** md (the default) for a status; sm for a count on a button, e.g. how many filters are on. */
  size?: 'sm' | 'md';
}

/** A small status pill: what state something is in. For a fact or a choice, use Chip. */
export function Badge({ tone = 'neutral', size = 'md', className, ...rest }: BadgeProps) {
  return <span className={[styles.badge, size === 'sm' && styles.sm, styles[tone], className].filter(Boolean).join(' ')} {...rest} />;
}
