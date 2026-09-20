import type { ReactNode } from 'react';
import { Text } from '../typography';
import styles from './option-card.module.css';

export interface OptionGroupProps {
  /** What the choice is about, for screen readers. */
  label: string;
  children: ReactNode;
}

/** Stacks OptionCards that share one choice. */
export function OptionGroup({ label, children }: OptionGroupProps) {
  return (
    <div role="radiogroup" aria-label={label} className={styles.group}>
      {children}
    </div>
  );
}

export interface OptionCardProps {
  /** The same for every card in the group. */
  name: string;
  value: string;
  checked: boolean;
  onChange: (value: string) => void;
  /** The option, in a few words. */
  title: string;
  /** One line on what choosing it does. */
  description?: ReactNode;
  disabled?: boolean;
  /** Extra controls that belong to this option, such as a checkbox. Shown only while the card is selected. */
  children?: ReactNode;
}

/** One answer to a question, as a card. A radio underneath, so arrow keys move between the cards in a group. */
export function OptionCard({ name, value, checked, onChange, title, description, disabled, children }: OptionCardProps) {
  const classes = [styles.card, checked && styles.checked, disabled && styles.disabled].filter(Boolean).join(' ');
  return (
    <div className={classes}>
      {/* The label, and the radio inside it, cover only this head, so controls in `children` stay clickable. */}
      <label className={styles.head}>
        <input
          type="radio"
          className={styles.input}
          name={name}
          value={value}
          checked={checked}
          disabled={disabled}
          onChange={() => onChange(value)}
        />
        <span className={styles.dot} aria-hidden="true" />
        <span className={styles.text}>
          <Text variant="itemTitle" tone="ink" as="span" className={styles.title}>
            {title}
          </Text>
          {description ? (
            <Text variant="caption" tone="muted" as="span" className={styles.description}>
              {description}
            </Text>
          ) : null}
        </span>
      </label>
      {checked && children ? <div className={styles.extra}>{children}</div> : null}
    </div>
  );
}
