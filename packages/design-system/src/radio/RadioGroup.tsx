import { useId, type ReactNode } from 'react';
import styles from './radio.module.css';
import { cx } from '../utils/cx';

export interface RadioOption<T extends string> {
  value: T;
  label: ReactNode;
  /** More about it, under the label and lined up with it. */
  description?: ReactNode;
}

export interface RadioGroupProps<T extends string> {
  /** What the choice is about. Shown above the options, and their group's name for screen readers. */
  label: ReactNode;
  options: RadioOption<T>[];
  value: T;
  onChange: (value: T) => void;
  disabled?: boolean;
}

/**
 * One choice from a short list, stacked: a round button and a label on each line, as Checkbox draws a tick box. Native
 * radios underneath, so arrow keys move the choice and screen readers announce the group. For a choice that's a card
 * of its own, see OptionCard.
 */
export function RadioGroup<T extends string>({ label, options, value, onChange, disabled }: RadioGroupProps<T>) {
  const name = useId();
  const labelId = useId();
  return (
    <div role="radiogroup" aria-labelledby={labelId} className={styles.group}>
      <span id={labelId} className={styles.legend}>
        {label}
      </span>
      {options.map((o) => {
        const checked = o.value === value;
        const descId = name + '-' + o.value;
        return (
          <div key={o.value}>
            <label className={cx(styles.wrap, checked && styles.checked, disabled && styles.disabled)}>
              <input
                type="radio"
                className={styles.input}
                name={name}
                value={o.value}
                checked={checked}
                disabled={disabled}
                aria-describedby={o.description ? descId : undefined}
                onChange={() => onChange(o.value)}
              />
              <span className={styles.dot} aria-hidden="true" />
              <span className={styles.label}>{o.label}</span>
            </label>
            {o.description ? (
              <p id={descId} className={styles.description}>
                {o.description}
              </p>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
