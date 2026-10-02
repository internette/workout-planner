import type { HTMLAttributes, ReactNode } from 'react';
import styles from './chip.module.css';

export interface ChipProps extends Omit<HTMLAttributes<HTMLElement>, 'children'> {
  /**
   * info: white, for a fact (a date, a duration, a tag). accent: solid pink, for something switched on.
   * choice: a selectable option, pink when `selected`.
   */
  tone?: 'info' | 'accent' | 'choice';
  /** Marks a choice chip as selected. */
  selected?: boolean;
  size?: 'sm' | 'md';
  /** What a choice chip sits on: a card (the default; unpicked chips are the page's tint), or the page itself
   * (unpicked chips are white, so they don't vanish into it). */
  surface?: 'card' | 'page';
  /** An icon shown before the label. */
  icon?: ReactNode;
  /** Something shown after the label, such as a small remove button. */
  trailing?: ReactNode;
  children: ReactNode;
}

// A chip with an onClick, or a choice chip, is a button; anything else is a plain label.
export function Chip({
  tone = 'info',
  selected,
  size = 'sm',
  surface = 'card',
  icon,
  trailing,
  onClick,
  className,
  children,
  ...rest
}: ChipProps) {
  const clickable = !!onClick || tone === 'choice';
  const classes = [
    styles.chip,
    styles[size],
    styles[tone],
    tone === 'choice' && selected && styles.selected,
    surface === 'page' && styles.onPage,
    clickable && styles.clickable,
    trailing && styles.hasTrailing,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const content = (
    <>
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      {children}
      {trailing ? <span className={styles.trailing}>{trailing}</span> : null}
    </>
  );
  return clickable ? (
    <button
      type="button"
      className={classes}
      onClick={onClick}
      aria-pressed={tone === 'choice' ? !!selected : undefined}
      {...rest}
    >
      {content}
    </button>
  ) : (
    <span className={classes} {...rest}>
      {content}
    </span>
  );
}
