'use client';

import { useId, useRef, type CSSProperties, type KeyboardEvent, type PointerEvent, type ReactNode } from 'react';
import { Grip } from '../icons';
import styles from './reorderable-list.module.css';

export interface ReorderableListProps<T> {
  items: T[];
  /** A stable key for each item, so a moved row keeps its focus and state. */
  getKey: (item: T, index: number) => string;
  /** Draws a row. Put `handle` where it should sit, usually first in the row; it's null when there's only one item. */
  renderItem: (item: T, index: number, handle: ReactNode) => ReactNode;
  /** Called when a row is dropped somewhere else, or moved with the arrow keys. Reorder the items; say where it went
   * (an aria-live announcement) so a screen reader hears the move. */
  onMove: (from: number, to: number) => void;
  /** The handle's name, which says what moves and where it is now: "Move Bench Press, 2 of 5". */
  handleLabel: (item: T, index: number) => string;
  /** Read after the handle's name, once, to say how to use it. */
  hint?: string;
  /** The space between rows, in px. */
  gap?: number;
  style?: CSSProperties;
  className?: string;
}

/** A list whose rows can be put in a new order: dragged by a handle, or moved one place at a time with the arrow keys
 * (and Home, End) on it. While dragging, the row follows the pointer, the others slide aside to show where it will
 * land, and the page scrolls near the top or bottom of the window. */
export function ReorderableList<T>({
  items,
  getKey,
  renderItem,
  onMove,
  handleLabel,
  hint = 'Drag to reorder, or use the up and down arrow keys.',
  gap = 14,
  style,
  className,
}: ReorderableListProps<T>) {
  const list = useRef<HTMLDivElement>(null);
  const hintId = useId();
  const n = items.length;
  return (
    <>
      <p id={hintId} className="sr-only">
        {hint}
      </p>
      <div ref={list} className={[styles.list, className].filter(Boolean).join(' ')} style={{ gap, ...style }}>
        {items.map((item, i) => (
          <div key={getKey(item, i)}>
            {renderItem(
              item,
              i,
              n > 1 ? (
                <Handle list={list} index={i} count={n} label={handleLabel(item, i)} hintId={hintId} onMove={(to) => onMove(i, to)} />
              ) : null,
            )}
          </div>
        ))}
      </div>
    </>
  );
}

function Handle({
  list,
  index,
  count,
  label,
  hintId,
  onMove,
}: {
  list: React.RefObject<HTMLDivElement>;
  index: number;
  count: number;
  label: string;
  hintId: string;
  onMove: (to: number) => void;
}) {
  const drag = useRef<{ stop: () => void } | null>(null);

  const onKeyDown = (e: KeyboardEvent<HTMLButtonElement>) => {
    const to = ({ ArrowUp: index - 1, ArrowDown: index + 1, Home: 0, End: count - 1 } as Record<string, number>)[e.key];
    if (to === undefined) return;
    e.preventDefault();
    if (to >= 0 && to < count && to !== index) onMove(to);
  };

  const start = (e: PointerEvent<HTMLButtonElement>) => {
    if (e.button !== 0 || drag.current) return;
    const handle = e.currentTarget;
    const rows = Array.from(list.current?.children ?? []) as HTMLElement[];
    const row = rows[index];
    if (!row) return;
    e.preventDefault();
    handle.setPointerCapture(e.pointerId);
    // Measured once, in page coordinates, so scrolling while dragging doesn't throw them off.
    const top = (el: HTMLElement) => el.getBoundingClientRect().top + window.scrollY;
    const tops = rows.map(top);
    const heights = rows.map((r) => r.offsetHeight);
    const gap = rows.length > 1 ? tops[1] - tops[0] - heights[0] : 0;
    const shift = heights[index] + gap;
    const startY = e.clientY + window.scrollY;
    let pointerY = e.clientY;
    let to = index;
    let frame = 0;
    rows.forEach((r) => {
      if (r !== row) r.style.transition = 'transform .16s ease';
    });
    Object.assign(row.style, {
      position: 'relative',
      zIndex: '2',
      transition: 'none',
      cursor: 'grabbing',
      filter: 'drop-shadow(0 10px 18px var(--color-shadow))',
    });
    document.body.style.cursor = 'grabbing';
    const place = () => {
      const dy = pointerY + window.scrollY - startY;
      row.style.transform = 'translateY(' + dy + 'px) scale(1.02)';
      const mid = tops[index] + heights[index] / 2 + dy;
      to = index;
      rows.forEach((r, j) => {
        const theirs = tops[j] + heights[j] / 2;
        let move = 0;
        if (j < index && mid < theirs) move = shift;
        if (j > index && mid > theirs) move = -shift;
        if (move > 0) to--;
        if (move < 0) to++;
        if (j !== index) r.style.transform = move ? 'translateY(' + move + 'px)' : '';
      });
    };
    // Near the top or bottom of the window, the page scrolls so the row can be carried past what's in view.
    const tick = () => {
      const edge = 64;
      const speed =
        pointerY < edge ? -Math.ceil((edge - pointerY) / 6) : pointerY > window.innerHeight - edge
          ? Math.ceil((pointerY - (window.innerHeight - edge)) / 6)
          : 0;
      if (speed) {
        window.scrollBy(0, speed);
        place();
      }
      frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    const move = (ev: globalThis.PointerEvent) => {
      pointerY = ev.clientY;
      place();
    };
    const stop = () => {
      cancelAnimationFrame(frame);
      handle.removeEventListener('pointermove', move);
      handle.removeEventListener('pointerup', end);
      handle.removeEventListener('pointercancel', stop);
      rows.forEach((r) => {
        Object.assign(r.style, { transform: '', transition: '', position: '', zIndex: '', cursor: '', filter: '' });
      });
      document.body.style.cursor = '';
      drag.current = null;
    };
    const end = () => {
      const landed = to;
      stop();
      if (landed !== index) onMove(landed);
    };
    handle.addEventListener('pointermove', move);
    handle.addEventListener('pointerup', end);
    handle.addEventListener('pointercancel', stop);
    drag.current = { stop };
  };

  return (
    <button
      type="button"
      aria-label={label}
      aria-describedby={hintId}
      onPointerDown={start}
      onKeyDown={onKeyDown}
      className={['hit', styles.handle].join(' ')}
    >
      <Grip color="var(--color-muted)" strokeWidth={3} size={20} />
    </button>
  );
}
