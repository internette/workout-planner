import { useId, type ReactNode } from 'react';
import { Tick } from '../checkbox';
import { Text } from '../typography';
import styles from './option-card.module.css';
import { cx } from '../utils/cx';

export interface CheckGroupProps {
  /** What the choices are about, for screen readers. */
  label: string;
  children: ReactNode;
}

/** Stacks CheckCards that answer one question. */
export function CheckGroup({ label, children }: CheckGroupProps) {
  return (
    <div role="group" aria-label={label} className={styles.group}>
      {children}
    </div>
  );
}

export interface CheckCardProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** The option, in a few words. */
  title: ReactNode;
  /** One line under it: what it is, or what choosing it does. */
  description?: ReactNode;
  /** Before the text: an IconTile, say. */
  icon?: ReactNode;
  /** What the card sits on: another card (the default: it's drawn on the page color), or the page itself (it's white,
   * so it doesn't vanish into it). */
  surface?: 'card' | 'page';
  disabled?: boolean;
  name?: string;
}

/** One of several answers that can each be on or off, as a card, with its tick at the end. A native checkbox underneath,
 * so Space toggles it and screen readers announce it. For one answer only, see OptionCard. */
export function CheckCard({ checked, onChange, title, description, icon, surface = 'card', disabled, name }: CheckCardProps) {
  const descId = useId();
  return (
    <label className={cx(styles.card, styles.check, surface === 'page' && styles.onPage, checked && styles.checked, disabled && styles.disabled)}>
      <input
        type="checkbox"
        className={styles.input}
        name={name}
        checked={checked}
        disabled={disabled}
        aria-describedby={description ? descId : undefined}
        onChange={(e) => onChange(e.target.checked)}
      />
      {icon ? <span className={styles.icon}>{icon}</span> : null}
      <span className={styles.text}>
        <Text variant="subheading" tone="ink" as="span" className={styles.title}>
          {title}
        </Text>
        {description ? (
          <Text variant="body" tone="muted" as="span" id={descId} className={styles.description}>
            {description}
          </Text>
        ) : null}
      </span>
      <Tick on={checked} size="md" />
    </label>
  );
}
