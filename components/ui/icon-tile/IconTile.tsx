import { forwardRef, type ButtonHTMLAttributes, type HTMLAttributes } from 'react';
import styles from './icon-tile.module.css';

type Size = 'sm' | 'md';
const cls = (size: Size, extra?: string, className?: string) =>
  [styles.tile, styles[size], extra, className].filter(Boolean).join(' ');

export interface IconTileProps extends HTMLAttributes<HTMLElement> {
  /** sm (40px) beside a row's or card's title; md (46px, the default) beside a page's title. */
  size?: Size;
  /** A div by default; a span inside inline content. */
  as?: 'div' | 'span';
}

/** A workout's or exercise's icon on its pale pink tile. Put the icon (drawn about 19–22px) inside. */
export function IconTile({ size = 'md', as: Tag = 'div', className, ...rest }: IconTileProps) {
  return <Tag className={cls(size, undefined, className)} {...rest} />;
}

export interface IconTileButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  size?: Size;
  /** Names the button, e.g. "Choose icon for Bench Press": the tile only shows the icon. */
  'aria-label': string;
}

/** The tile as a button, for choosing the icon: it opens a picker. */
export const IconTileButton = forwardRef<HTMLButtonElement, IconTileButtonProps>(function IconTileButton(
  { size = 'md', className, type = 'button', ...rest },
  ref,
) {
  return <button ref={ref} type={type} className={cls(size, styles.button, className)} {...rest} />;
});
