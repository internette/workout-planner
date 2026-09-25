'use client';

import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import styles from './segmented-control.module.css';

export interface SegmentedControlOption<T extends string> {
  value: T;
  label: ReactNode;
}

export interface SegmentedControlProps<T extends string> {
  /** Names the group for screen readers, for example "Calendar view". */
  label: string;
  options: SegmentedControlOption<T>[];
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  /** brand: white tray, pink selection. quiet: canvas tray, for placing inside a card. */
  tone?: 'brand' | 'quiet';
  /** tabs: the options switch a view. options: the options set a value or filter. */
  semantics?: 'tabs' | 'options';
  /** Give every option the same width instead of sizing each to its label. */
  equalWidth?: boolean;
  /** Stretch the tray to the full width of its container. */
  fullWidth?: boolean;
  /** Let the options wrap onto a second line when there isn't room. */
  wrap?: boolean;
  /** Tabs only: the id of the panel the tabs switch. The selected tab controls it, and each tab's id is
   * `<panelId>-<value>`, for the panel's aria-labelledby. */
  panelId?: string;
  /** Tighter side padding, for a row of several short options on a phone. */
  compact?: boolean;
  style?: CSSProperties;
  className?: string;
}

export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  size = 'md',
  tone = 'brand',
  semantics = 'options',
  equalWidth,
  fullWidth,
  wrap,
  panelId,
  compact,
  style,
  className,
}: SegmentedControlProps<T>) {
  const tray = useRef<HTMLDivElement>(null);
  const isTabs = semantics === 'tabs';
  const selected = Math.max(
    0,
    options.findIndex((o) => o.value === value),
  );

  // Arrow keys move the selection, as they do for tabs and radio buttons.
  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const step =
      e.key === 'ArrowRight' || e.key === 'ArrowDown'
        ? 1
        : e.key === 'ArrowLeft' || e.key === 'ArrowUp'
          ? -1
          : 0;
    const target =
      e.key === 'Home'
        ? 0
        : e.key === 'End'
          ? options.length - 1
          : step
            ? (selected + step + options.length) % options.length
            : -1;
    if (target < 0) return;
    e.preventDefault();
    onChange(options[target].value);
    tray.current?.querySelectorAll<HTMLButtonElement>('button')[target]?.focus();
  };

  return (
    <div
      ref={tray}
      role={isTabs ? 'tablist' : 'radiogroup'}
      aria-label={label}
      onKeyDown={onKeyDown}
      className={[
        styles.tray,
        styles[`tray-${size}`],
        styles[`tone-${tone}`],
        wrap && styles.wrap,
        equalWidth && styles.equalWidth,
        fullWidth && styles.fullWidth,
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      style={style}
    >
      {options.map((option, i) => {
        const on = i === selected;
        return (
          <button
            key={option.value}
            type="button"
            role={isTabs ? 'tab' : 'radio'}
            {...(isTabs ? { 'aria-selected': on } : { 'aria-checked': on })}
            {...(isTabs && panelId ? { id: panelId + '-' + option.value, 'aria-controls': on ? panelId : undefined } : {})}
            tabIndex={on ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={[styles.segment, styles[`segment-${size}`], compact && styles.compact, on && styles.selected]
              .filter(Boolean)
              .join(' ')}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
