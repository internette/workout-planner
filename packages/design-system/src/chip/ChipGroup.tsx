import type { CSSProperties, ReactNode } from 'react';
import { Chip } from './Chip';
import styles from './chip.module.css';

export interface ChipGroupProps {
  children: ReactNode;
  /** Names the group for screen readers, e.g. "Target areas". Without it, it's only a layout. */
  label?: string;
  /** Closer and slimmer on the narrowest phones, so a short row of choices stays on one line. */
  compact?: boolean;
  /** A div by default; a span inside inline content. */
  as?: 'div' | 'span';
  style?: CSSProperties;
  className?: string;
}

/** Chips side by side, wrapping onto more lines as needed: target areas, equipment, a ride's effort. */
export function ChipGroup({ children, label, compact, as: Tag = 'div', style, className }: ChipGroupProps) {
  return (
    <Tag
      role={label ? 'group' : undefined}
      aria-label={label}
      className={[styles.group, compact && styles.compact, className].filter(Boolean).join(' ')}
      style={style}
    >
      {children}
    </Tag>
  );
}

export interface ChoiceChipsProps<T extends string> {
  /** Names the choice for screen readers, e.g. "Kind". */
  label: string;
  options: { value: T; label: string }[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  /** What the chips sit on; see Chip. */
  surface?: 'card' | 'page';
  compact?: boolean;
}

/** One of a few options, as choice chips that wrap onto another line when there isn't room (a segmented control would
 * cut off the last). Each says whether it's the one chosen. */
export function ChoiceChips<T extends string>({ label, options, value, onChange, size = 'md', surface, compact }: ChoiceChipsProps<T>) {
  return (
    <ChipGroup label={label} compact={compact}>
      {options.map((o) => (
        <Chip key={o.value} tone="choice" size={size} surface={surface} selected={o.value === value} onClick={() => onChange(o.value)}>
          {o.label}
        </Chip>
      ))}
    </ChipGroup>
  );
}
