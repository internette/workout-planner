import { forwardRef, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';
import { Label } from './Label';
import styles from './text-field.module.css';

export interface TextFieldProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  /** filled: a canvas box (the default). title: an editable heading. bare: just the input, for your own container. */
  variant?: 'filled' | 'title' | 'bare';
  /** bare only: sm is the compact date-style text. */
  size?: 'md' | 'sm';
  /** Caption above the field. Renders the field inside a <label>. */
  label?: ReactNode;
  /** A quieter aside after the caption, such as "(miles)". */
  labelNote?: ReactNode;
  /** filled only: text after the input inside the box, such as a unit ("hr"). */
  suffix?: ReactNode;
  /** Helper text beneath the field. */
  hint?: ReactNode;
  /** An error message. Marks the field invalid and shows the message beneath it. */
  error?: string;
  /** Layout for the wrapper (flex basis, margins). `style` styles the input. */
  containerStyle?: CSSProperties;
}

export const TextField = forwardRef<HTMLInputElement, TextFieldProps>(function TextField(
  {
    variant = 'filled',
    size = 'md',
    label,
    labelNote,
    suffix,
    hint,
    error,
    containerStyle,
    className,
    disabled,
    ...rest
  },
  ref,
) {
  const inputClass = [
    styles.input,
    variant === 'title' && styles.title,
    variant === 'bare' && (size === 'sm' ? styles['bare-sm'] : styles.bare),
    variant !== 'filled' && disabled && styles.disabled,
    className,
  ]
    .filter(Boolean)
    .join(' ');
  const input = (
    <input
      ref={ref}
      className={inputClass}
      disabled={disabled}
      aria-invalid={error ? true : undefined}
      {...rest}
    />
  );
  // With no caption around it (named by aria-label), the box itself is the label, so a tap anywhere in it — its
  // padding, its suffix — focuses the input, not only the line of text in the middle.
  const Box = !label && !error && !hint ? 'label' : 'span';
  const control =
    variant === 'filled' ? (
      <Box
        className={[styles.control, error && styles.invalid, disabled && styles.disabled]
          .filter(Boolean)
          .join(' ')}
      >
        {input}
        {suffix ? <span className={styles.suffix}>{suffix}</span> : null}
      </Box>
    ) : (
      input
    );

  if (!label && !error && !hint)
    return containerStyle ? <span style={containerStyle}>{control}</span> : control;
  return (
    <label className={styles.field} style={containerStyle}>
      {label ? <Label note={labelNote}>{label}</Label> : null}
      {control}
      {error ? (
        <span className={styles.error}>{error}</span>
      ) : hint ? (
        <span className={styles.hint}>{hint}</span>
      ) : null}
    </label>
  );
});
