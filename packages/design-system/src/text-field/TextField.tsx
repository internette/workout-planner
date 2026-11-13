import { forwardRef, useId, type CSSProperties, type InputHTMLAttributes, type ReactNode } from 'react';
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
  /** An error message. Marks the field invalid, shows the message beneath it and reads it out with the field. Pass ''
   * (not undefined) on a field that can show one while you type, so the field keeps its place, and its focus, when
   * the message comes and goes. */
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
    'aria-describedby': describedBy,
    ...rest
  },
  ref,
) {
  const id = useId();
  const noteId = id + '-note';
  const note = error || hint;
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
      aria-describedby={[describedBy, note ? noteId : ''].filter(Boolean).join(' ') || undefined}
      {...rest}
    />
  );
  // With no caption around it (named by aria-label), the box itself is the label, so a tap anywhere in it — its
  // padding, its suffix — focuses the input, not only the line of text in the middle.
  const bare = !label && error === undefined && !hint;
  const Box = bare ? 'label' : 'span';
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

  if (bare) return containerStyle ? <span style={containerStyle}>{control}</span> : control;
  // The message sits after the <label>, not in it, so it isn't read as part of the field's name; the input is
  // described by it instead. It's a live region that's always there, so an error that turns up while typing is said.
  return (
    <span className={styles.field} style={containerStyle}>
      {label ? (
        <label className={styles.field}>
          <Label note={labelNote}>{label}</Label>
          {control}
        </label>
      ) : (
        control
      )}
      <span id={noteId} aria-live="polite" className={error ? styles.error : hint ? styles.hint : undefined}>
        {note || null}
      </span>
    </span>
  );
});
