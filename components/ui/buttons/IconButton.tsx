import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styles from './buttons.module.css';
import { cx } from './cx';

export interface IconButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'aria-label'> {
  /** What the button does. Icon-only buttons need this for screen readers; it is also the tooltip. */
  label: string;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  /** default: grey hover. danger: red hover. inverse: for use on a coloured background. */
  tone?: 'default' | 'danger' | 'inverse';
  circle?: boolean;
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(function IconButton(
  { label, size = 'md', tone = 'default', circle, className, type = 'button', title, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={type}
      aria-label={label}
      title={title ?? undefined}
      className={cx(
        styles.base,
        styles.icon,
        styles[`icon-${size}`],
        styles[`icon-${tone}`],
        circle && styles.circle,
        className,
      )}
      {...rest}
    />
  );
});
