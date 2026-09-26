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
  /** Just text, with no padding, underlined on hover and keyboard focus: for an action inside a sentence, or a quiet
   * one like "+ 2 more". Its tap area is still 44px. The colour comes from `type`: primary and secondary take the deep
   * accent, neutral the muted grey (in a lighter weight), danger red. Ignored for dashed. */
  link?: boolean;
  /** sm and md are 44px tall (md with larger text), for cards, dialogs and bars; lg is 52px, for a screen's main
   * action; xs is a small text link such as Back (its tap area is still 44px with the `hit` class). */
  size?: 'xs' | 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  /** A pink glow under a primary button, for the one call to action on an empty screen. */
  glow?: boolean;
  /** The native <button type>. `type` above is the design type, so this carries the HTML one. */
  htmlType?: 'button' | 'submit' | 'reset';
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { type = 'primary', ghost, link, size = 'md', fullWidth, glow, htmlType = 'button', className, ...rest },
  ref,
) {
  const isLink = link && type !== 'dashed';
  return (
    <button
      ref={ref}
      type={htmlType}
      className={cx(
        styles.base,
        styles[size],
        isLink ? styles['link-' + type] : styles[type],
        isLink && styles.link,
        !isLink && ghost && type !== 'dashed' && styles.ghost,
        fullWidth && styles.fullWidth,
        glow && styles.glow,
        className,
      )}
      {...rest}
    />
  );
});
