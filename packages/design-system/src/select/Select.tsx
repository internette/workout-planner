'use client';

import { useEffect, useId, useRef, useState, type CSSProperties, type KeyboardEvent, type ReactNode } from 'react';
import { Check, ChevronDown } from '../icons';
import { Popover } from '../popover';
import { Label } from '../text-field';
import styles from './select.module.css';

export interface SelectOption<T extends string> {
  value: T;
  label: string;
  /** Shown before the label, in the field and in the list: a color dot, an icon. */
  icon?: ReactNode;
}

export interface SelectProps<T extends string> {
  /** The caption above the field, which also names it for screen readers. */
  label: string;
  options: SelectOption<T>[];
  value: T;
  onChange: (value: T) => void;
  style?: CSSProperties;
}

/**
 * A dropdown for picking one of a few options: a field-like button that opens the options as a list in a popover.
 * Arrow keys, Home and End move through the list, Enter or Space picks, Escape closes it.
 */
export function Select<T extends string>({ label, options, value, onChange, style }: SelectProps<T>) {
  const id = useId();
  const [open, setOpen] = useState(false);
  const trigger = useRef<HTMLButtonElement>(null);
  const list = useRef<HTMLUListElement>(null);
  const current = options.find((o) => o.value === value) ?? options[0];

  const items = () => Array.from(list.current?.querySelectorAll<HTMLElement>('[role="option"]') ?? []);
  const focusAt = (i: number) => {
    const all = items();
    const el = all[(i + all.length) % all.length];
    el?.focus();
    // In a panel capped to the window, keep the focused option in view.
    el?.scrollIntoView({ block: 'nearest' });
  };
  const pick = (v: T) => {
    onChange(v);
    setOpen(false);
    trigger.current?.focus();
  };

  // Opening moves focus to the chosen option, so the arrow keys work from there.
  const chosen = Math.max(0, options.indexOf(current));
  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => focusAt(chosen));
    return () => cancelAnimationFrame(frame);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onTriggerKey = (e: KeyboardEvent) => {
    if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
      e.preventDefault();
      setOpen(true);
    }
  };
  const onListKey = (e: KeyboardEvent) => {
    const all = items();
    const at = all.indexOf(document.activeElement as HTMLElement);
    const go: Record<string, () => void> = {
      ArrowDown: () => focusAt(at + 1),
      ArrowUp: () => focusAt(at - 1),
      Home: () => focusAt(0),
      End: () => focusAt(all.length - 1),
      Enter: () => at > -1 && pick(options[at].value),
      ' ': () => at > -1 && pick(options[at].value),
    };
    if (go[e.key]) {
      e.preventDefault();
      go[e.key]();
    }
  };

  return (
    <div style={style}>
      <Label as="span" style={{ display: 'block' }}>
        <span id={`${id}-label`}>{label}</span>
      </Label>
      <Popover
        open={open}
        onClose={() => setOpen(false)}
        width="anchor"
        top={52}
        style={{ flex: 'initial' }}
        content={
          <ul
            ref={list}
            role="listbox"
            aria-labelledby={`${id}-label`}
            className={styles.list}
            onKeyDown={onListKey}
          >
            {options.map((o) => (
              <li
                key={o.value}
                role="option"
                aria-selected={o.value === value}
                tabIndex={-1}
                className={styles.option}
                onClick={() => pick(o.value)}
              >
                {o.icon}
                <span className={styles.label}>{o.label}</span>
                {o.value === value ? <Check size={16} strokeWidth={2.6} color="currentColor" /> : null}
              </li>
            ))}
          </ul>
        }
      >
        <button
          ref={trigger}
          type="button"
          className={styles.trigger}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-labelledby={`${id}-label ${id}-value`}
          onClick={() => setOpen((o) => !o)}
          onKeyDown={onTriggerKey}
        >
          {current.icon}
          <span id={`${id}-value`} className={styles.value}>
            {current.label}
          </span>
          <ChevronDown size={16} strokeWidth={2.4} color="var(--color-slate)" />
        </button>
      </Popover>
    </div>
  );
}
