import { forwardRef, type ButtonHTMLAttributes } from 'react';
import styles from './buttons.module.css';
import { cx } from '../utils/cx';

export interface PressableProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** The tint laid over it on hover and keyboard focus: the neutral wash, or the accent tint for a row that opens
   * something of the person's own. */
  wash?: 'neutral' | 'accent';
  /** A tap area of at least 44 px around one drawn smaller. */
  hit?: boolean;
}

/**
 * A button that looks like whatever is inside it: a row of a list card, a name that opens something, a pill. It
 * resets the native button look, keeps the text and font of its surroundings, and lays a wash over itself on hover,
 * above its own background (so a row drawn on canvas, or the rank pill's tint, still shows it). Lay it out with
 * `style`; it takes its corners from `borderRadius` there.
 */
export const Pressable = forwardRef<HTMLButtonElement, PressableProps>(function Pressable(
  { wash = 'neutral', hit, className, type = 'button', ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={cx(styles.pressable, styles['wash-' + wash], hit && 'hit', className)} {...rest} />;
});
