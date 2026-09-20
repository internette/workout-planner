'use client';

import { useEffect, useLayoutEffect, useRef, type CSSProperties, type MouseEvent, type ReactNode, type PointerEvent } from 'react';
import { Card } from '../card';

export interface PopoverProps {
  /** Whether the panel is showing. The parent owns this, so the trigger inside `children` can toggle it. */
  open: boolean;
  /** Called when the browser dismisses the panel (Escape, or a press outside it). It should set `open` to false. */
  onClose: () => void;
  /** The panel's contents. */
  content: ReactNode;
  /** Panel width in px. */
  width: number;
  /** Gap in px between the top of the trigger area and the panel. */
  top: number;
  /** Which edge of the trigger area the panel lines up with. */
  align?: 'start' | 'center';
  /** Padding inside the panel (Card steps). */
  pad?: 'xs' | 'sm' | 'md';
  /** The trigger, and anything else that belongs to it. */
  children: ReactNode;
  /** Layout for the wrapper around the trigger. It is `position: relative` and does not shrink by default. */
  style?: CSSProperties;
  /** Element for the wrapper. Use span where the popover sits inside inline content. */
  as?: 'div' | 'span';
}

const EDGE = 8; // keep the panel this far inside the window

/**
 * A small floating panel anchored to a trigger, built on the native popover attribute. It is shown in the top
 * layer, so nothing can clip it, and the browser dismisses it on Escape and on a press outside it.
 */
export function Popover({ open, onClose, content, width, top, align = 'start', pad = 'xs', children, style, as: Tag = 'div' }: PopoverProps) {
  const anchor = useRef<HTMLElement>(null);
  const panel = useRef<HTMLElement | null>(null);
  const openAtPress = useRef(false);

  // A press on the trigger while the panel is open is also "outside" the panel, so the browser dismisses it on
  // release. The trigger's own click would then toggle it straight back open. Swallow that click.
  const onPressCapture = (_: PointerEvent) => {
    openAtPress.current = open;
  };
  const onClickCapture = (e: MouseEvent) => {
    const dismissedByPress = openAtPress.current && !panel.current?.matches(':popover-open');
    openAtPress.current = false;
    if (dismissedByPress) e.stopPropagation();
  };

  return (
    <Tag
      ref={anchor as never}
      style={{ position: 'relative', flex: 'none', ...style }}
      onPointerDownCapture={onPressCapture}
      onClickCapture={onClickCapture}
    >
      {children}
      {open ? (
        <PopoverPanel anchor={anchor} panelRef={panel} onClose={onClose} width={width} top={top} align={align} pad={pad}>
          {content}
        </PopoverPanel>
      ) : null}
    </Tag>
  );
}

// Mounted only while open, so its listeners exist only then.
function PopoverPanel({
  anchor,
  panelRef,
  onClose,
  width,
  top,
  align,
  pad,
  children,
}: {
  anchor: React.RefObject<HTMLElement>;
  panelRef: React.MutableRefObject<HTMLElement | null>;
  onClose: () => void;
  width: number;
  top: number;
  align: 'start' | 'center';
  pad: 'xs' | 'sm' | 'md';
  children: ReactNode;
}) {
  const ref = useRef<HTMLElement>(null);
  const live = useRef(true);
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  // The panel is in the top layer, so it is placed against the window, and follows the trigger on scroll.
  useLayoutEffect(() => {
    const el = ref.current;
    const at = anchor.current;
    if (!el || !at) return;
    panelRef.current = el;
    live.current = true;
    const place = () => {
      const r = at.getBoundingClientRect();
      const left = align === 'center' ? r.left + r.width / 2 - width / 2 : r.left;
      el.style.left = Math.max(EDGE, Math.min(left, window.innerWidth - width - EDGE)) + 'px';
      el.style.top = r.top + top + 'px';
    };
    place();
    el.showPopover();
    window.addEventListener('scroll', place, true);
    window.addEventListener('resize', place);
    // The browser closes it on Escape and outside presses; tell the parent so `open` follows.
    const onToggle = (e: Event) => {
      if (live.current && (e as ToggleEvent).newState === 'closed') onCloseRef.current();
    };
    el.addEventListener('toggle', onToggle);
    return () => {
      live.current = false;
      window.removeEventListener('scroll', place, true);
      window.removeEventListener('resize', place);
      el.removeEventListener('toggle', onToggle);
      if (el.matches(':popover-open')) el.hidePopover();
      panelRef.current = null;
    };
  }, [anchor, panelRef, align, width, top]);

  return (
    <Card
      ref={ref}
      pad={pad}
      elevation="overlay"
      {...({ popover: 'auto' } as object)}
      style={{ position: 'fixed', inset: 'auto', margin: 0, border: 'none', overflow: 'visible', width, zIndex: 30 }}
    >
      {children}
    </Card>
  );
}
