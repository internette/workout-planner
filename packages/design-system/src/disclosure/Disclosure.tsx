import type { CSSProperties, ReactNode } from 'react';
import { ChevronDown } from '../icons';
import styles from './disclosure.module.css';

/** The chevron on a row that opens and closes: down while closed, up while open, turning between the two. */
export function DisclosureChevron({ open, size = 16 }: { open: boolean; size?: number }) {
  return (
    <ChevronDown
      color="var(--color-muted)"
      strokeWidth={2.2}
      size={size}
      style={{ flex: 'none', transition: 'transform .2s', transform: open ? 'rotate(180deg)' : 'none' }}
    />
  );
}

export interface DisclosureRowProps {
  open: boolean;
  onToggle: () => void;
  /** The id of what it opens, rendered by the caller (only while open). */
  controls: string;
  /** outlined: a box of its own, as a field in a form. divided: a row in a list, with a line under it. */
  variant?: 'outlined' | 'divided';
  /** What the row says, e.g. a name and what's picked. The chevron follows it. */
  children: ReactNode;
  style?: CSSProperties;
}

/** A row that opens and closes what's under it: a button that says whether it's open, with the chevron at its end. */
export function DisclosureRow({ open, onToggle, controls, variant = 'outlined', children, style }: DisclosureRowProps) {
  return (
    <button
      type="button"
      aria-expanded={open}
      aria-controls={controls}
      onClick={onToggle}
      className={[styles.row, styles[variant]].join(' ')}
      style={style}
    >
      {children}
      <DisclosureChevron open={open} />
    </button>
  );
}
