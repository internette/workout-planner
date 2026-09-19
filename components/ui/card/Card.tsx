import { forwardRef, type ElementType, type HTMLAttributes } from 'react';
import styles from './card.module.css';

export interface CardProps extends HTMLAttributes<HTMLElement> {
  /** The element to render. A card that is clicked should be a button. */
  as?: 'div' | 'section' | 'aside' | 'article' | 'button';
  /** Inner spacing: xs 14, sm 18/20, md 22, lg 26 px. */
  pad?: 'none' | 'xs' | 'sm' | 'md' | 'lg';
  /** raised: a card on the page. overlay: a dialog, menu or popover floating above it. */
  elevation?: 'raised' | 'overlay';
  /** Makes the card a clickable surface that lifts on hover. Pair with as="button". */
  interactive?: boolean;
}

export const Card = forwardRef<HTMLElement, CardProps>(function Card(
  { as = 'div', pad = 'md', elevation = 'raised', interactive, className, ...rest },
  ref,
) {
  const Tag = as as ElementType;
  const classes = [styles.card, styles[elevation], pad !== 'none' && styles[`pad-${pad}`], interactive && styles.interactive, className]
    .filter(Boolean)
    .join(' ');
  return <Tag ref={ref} className={classes} {...(as === 'button' ? { type: 'button' } : {})} {...rest} />;
});
