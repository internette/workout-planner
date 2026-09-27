import type { CSSProperties, ReactNode } from 'react';
import styles from './text-field.module.css';

export interface LabelProps {
  children: ReactNode;
  /** A quieter aside after the label, such as a unit: "(miles)". */
  note?: ReactNode;
  /** Render as a <label> for a control (pass htmlFor), or a plain <span> heading for a group. */
  as?: 'span' | 'label';
  htmlFor?: string;
  style?: CSSProperties;
}

// The small uppercase caption above a field. Write it in normal case; it is uppercased in CSS.
export function Label({ children, note, as: Tag = 'span', htmlFor, style }: LabelProps) {
  return (
    <Tag className={styles.caption} htmlFor={Tag === 'label' ? htmlFor : undefined} style={style}>
      {children}
      {note ? <span className={styles.note}> {note}</span> : null}
    </Tag>
  );
}
