import { forwardRef, type TextareaHTMLAttributes } from 'react';
import styles from './text-field.module.css';
import { cx } from '../utils/cx';

export interface TextAreaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string;
}

// A multi-line field on a white raised surface, for notes.
export const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(function TextArea(
  { error, className, ...rest },
  ref,
) {
  return (
    <>
      <textarea
        ref={ref}
        aria-invalid={error ? true : undefined}
        className={cx(styles.textarea, error && styles.invalid, className)}
        {...rest}
      />
      {error ? <span className={styles.error}>{error}</span> : null}
    </>
  );
});
