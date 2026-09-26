import type { CSSProperties } from 'react';
import styles from './progress-bar.module.css';

export interface ProgressBarProps {
  /** How full it is, from 0 to 100. Anything outside is clamped. */
  value: number;
  /** The track: mist on white cards, tint (pale pink) where the bar is the card's main point. */
  track?: 'mist' | 'tint';
  /** The fill: the gem gradient, or any CSS colour (e.g. one per mood). */
  fill?: 'gem' | string;
  /** Names it for screen readers, which makes it a progressbar. Leave it out when the number is already written
   * beside it: the bar is then only a picture of that number. */
  label?: string;
  /** What a screen reader says for the value, e.g. "3 of 4 done". Defaults to the percentage. */
  valueText?: string;
  style?: CSSProperties;
  className?: string;
}

export function ProgressBar({ value, track = 'mist', fill = 'gem', label, valueText, style, className }: ProgressBarProps) {
  const pct = Math.max(0, Math.min(100, value || 0));
  const semantics = label
    ? { role: 'progressbar', 'aria-label': label, 'aria-valuemin': 0, 'aria-valuemax': 100, 'aria-valuenow': Math.round(pct), 'aria-valuetext': valueText }
    : { 'aria-hidden': true };
  return (
    <span
      className={[styles.track, styles[track], className].filter(Boolean).join(' ')}
      style={style}
      {...semantics}
    >
      <span
        className={[styles.fill, fill === 'gem' ? styles.gem : ''].filter(Boolean).join(' ')}
        style={{ width: pct + '%', ...(fill === 'gem' ? {} : { background: fill }) }}
      />
    </span>
  );
}
