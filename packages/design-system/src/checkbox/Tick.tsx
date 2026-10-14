import { Check } from '../icons';
import styles from './checkbox.module.css';
import { cx } from '../utils/cx';

export interface TickProps {
  on: boolean;
  /** sm (20px) in a Checkbox, md (24px) at the end of a CheckCard, lg (34px) as a tick button of its own. */
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

/** The tick box itself, drawn only: an outlined square, filled with the accent and a tick when it's on. Checkbox and
 * CheckCard draw theirs with it; a button that is just a tick can too. */
export function Tick({ on, size = 'sm', className }: TickProps) {
  return (
    <span className={cx(styles.box, styles['box-' + size], on && styles.on, className)} aria-hidden="true">
      {on ? <Check color="var(--color-surface)" strokeWidth={3} size={size === 'lg' ? 15 : size === 'md' ? 14 : 13} /> : null}
    </span>
  );
}
