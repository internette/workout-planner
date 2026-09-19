import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styles from './buttons.module.css';
import { cx } from './cx';

export interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, 'type'> {
  /**
   * What the button is for, and so how it is coloured.
   * primary: the main action. secondary: an alternative beside a primary. neutral: quiet actions such as
   * cancel and back. danger: destructive. dashed: "add something".
   */
  type?: 'primary' | 'secondary' | 'neutral' | 'danger' | 'dashed';
  /** Drops the fill and keeps just the coloured text, for low-emphasis actions. Ignored for dashed. */
  ghost?: boolean;
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** A pink glow under a primary button, for the one call to action on an empty screen. */
  glow?: boolean;
  /** The native <button type>. `type` above is the design type, so this carries the HTML one. */
  htmlType?: 'button' | 'submit' | 'reset';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { type = 'primary', ghost, size = 'md', fullWidth, glow, htmlType = 'button', className, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      type={htmlType}
      className={cx(
        styles.base,
        styles[size],
        styles[type],
        ghost && type !== 'dashed' && styles.ghost,
        fullWidth && styles.fullWidth,
        glow && styles.glow,
        className,
      )}
      {...rest}
    />
  );
});
