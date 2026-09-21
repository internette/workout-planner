import type { ReactNode } from 'react';
import { Check } from '../icons';
import styles from './checkbox.module.css';

export interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  /** What ticking it means, in a sentence. */
  children: ReactNode;
  /** Announce it as a switch ("on" and "off") instead of a checkbox. Use it for a setting that takes effect, not a form field. */
  switch?: boolean;
  disabled?: boolean;
  name?: string;
}

/** A tick box with its label. A native checkbox underneath, so Space toggles it and screen readers announce it. */
export function Checkbox({ checked, onChange, children, switch: asSwitch, disabled, name }: CheckboxProps) {
  const classes = [styles.wrap, checked && styles.checked, disabled && styles.disabled].filter(Boolean).join(' ');
  return (
    <label className={classes}>
      <input
        type="checkbox"
        role={asSwitch ? 'switch' : undefined}
        className={styles.input}
        name={name}
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
      />
      <span className={styles.box} aria-hidden="true">
        {checked ? <Check color="var(--color-white)" strokeWidth={3} size={13} /> : null}
      </span>
      <span className={styles.label}>{children}</span>
    </label>
  );
}
