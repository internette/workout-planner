'use client';

import { useRef, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Check } from '../icons';
import styles from './icon-choice-group.module.css';

export interface IconChoiceOption<T extends string> {
  value: T;
  /** Names the option for screen readers, for example "Dumbbell icon" or "Teal": the button only shows a picture. */
  label: string;
  /** icon kind: the icon to show, drawn about 20px. */
  icon?: ReactNode;
  /** swatch kind: the colour to fill the button with, a CSS colour or variable. */
  color?: string;
  /** Round swatches: the colour of the tick on the chosen one, readable on `color`. White by default. */
  checkColor?: string;
}

export interface IconChoiceGroupProps<T extends string> {
  /** Names the group for screen readers, for example "Icon". Leave it out when `labelledBy` points at a visible label. */
  label?: string;
  /** The id of a visible label that names the group. */
  labelledBy?: string;
  options: IconChoiceOption<T>[];
  value: T | undefined;
  /** `via` says whether a click (or Space) or an arrow key made the choice: a picker in a popover closes on a click
   * but stays open while the arrow keys move through it. */
  onChange: (value: T, via: 'click' | 'arrow') => void;
  /** icon: a grid of icon tiles. swatch: a wrapping row of colour squares. */
  kind?: 'icon' | 'swatch';
  /** swatch kind: square (the default) for a colour that tints something else, like a workout's icon; round, with a
   * tick on the chosen one, for a colour that is itself the setting, like the app's theme colour. */
  shape?: 'square' | 'round';
  /** icon kind: how many tiles to a row. The up and down arrow keys move by a row. */
  columns?: number;
  style?: CSSProperties;
  className?: string;
}

/** Pick one icon, or one colour, from a set shown as pictures. A radio group: Tab reaches the chosen option, the arrow
 * keys (and Home, End) move the choice. */
export function IconChoiceGroup<T extends string>({
  label,
  labelledBy,
  options,
  value,
  onChange,
  kind = 'icon',
  shape = 'square',
  columns = 5,
  style,
  className,
}: IconChoiceGroupProps<T>) {
  const group = useRef<HTMLDivElement>(null);
  const selected = options.findIndex((o) => o.value === value);
  // With nothing chosen, the first option takes the Tab stop so the group can still be reached.
  const tabStop = Math.max(0, selected);
  const isGrid = kind === 'icon';
  const round = !isGrid && shape === 'round';

  const onKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    const from = Math.max(0, options.findIndex((o, i) => group.current?.children[i] === document.activeElement));
    const row = isGrid ? columns : 1;
    const n = options.length;
    const to =
      e.key === 'ArrowRight'
        ? (from + 1) % n
        : e.key === 'ArrowLeft'
          ? (from - 1 + n) % n
          : e.key === 'ArrowDown'
            ? from + row < n ? from + row : (from + 1) % n
            : e.key === 'ArrowUp'
              ? from - row >= 0 ? from - row : (from - 1 + n) % n
              : e.key === 'Home'
                ? 0
                : e.key === 'End'
                  ? n - 1
                  : -1;
    if (to < 0) return;
    e.preventDefault();
    onChange(options[to].value, 'arrow');
    (group.current?.children[to] as HTMLElement | undefined)?.focus();
  };

  return (
    <div
      ref={group}
      role="radiogroup"
      aria-label={labelledBy ? undefined : label}
      aria-labelledby={labelledBy}
      onKeyDown={onKeyDown}
      className={[isGrid ? styles.grid : styles.row, className].filter(Boolean).join(' ')}
      style={isGrid ? { gridTemplateColumns: `repeat(${columns},minmax(0,1fr))`, ...style } : style}
    >
      {options.map((option, i) => {
        const on = i === selected;
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={on}
            aria-label={option.label}
            title={kind === 'swatch' ? option.label : undefined}
            tabIndex={i === tabStop ? 0 : -1}
            onClick={() => onChange(option.value, 'click')}
            className={[isGrid ? styles.tile : styles.swatch, round && styles.round, on && styles.selected]
              .filter(Boolean)
              .join(' ')}
            style={kind === 'swatch' ? ({ '--swatch': option.color } as CSSProperties) : undefined}
          >
            {isGrid ? option.icon : round && on ? <Check color={option.checkColor ?? '#FFFFFF'} strokeWidth={3} size={15} /> : null}
          </button>
        );
      })}
    </div>
  );
}
