'use client';

import { useLayoutEffect, useId, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react';
import { IconButton } from '../buttons';
import { Card } from '../card';
import { Close } from '../icons';
import { Text } from '../typography';
import { pressedOutside } from './outside';
import styles from './dialog.module.css';

export interface DialogProps {
  open: boolean;
  /** Called when the browser asks to close it (Escape), on the close button, and on a press on the dimmed area around it. It should set `open` to false. */
  onClose: () => void;
  /** The heading. Leave it out when the content draws its own (a welcome card, a flow of screens), and say which with
   * `labelledBy`: then no header is drawn. */
  title?: string;
  labelledBy?: string;
  /** Before the title: the app's mark, say. */
  icon?: ReactNode;
  /** Small muted text beside the title. */
  aside?: string;
  /** The X button in the top right corner. It does the same as Escape. On by default; pass false to leave it out. */
  closeButton?: boolean;
  /** Muted explanatory text under the title. */
  description?: ReactNode;
  /** Buttons along the bottom, right-aligned. */
  actions?: ReactNode;
  /** md is a little wider than the default sm. */
  size?: 'sm' | 'md';
  /** center: in the middle of the screen, over the dimmed page. sheet: on a phone, along the bottom of the screen,
   * its buttons across it, for choices to pick from while the page stays in view above (wider screens center it).
   * fullscreen: the whole screen, on the page color, for a flow of its own such as customizing. */
  variant?: 'center' | 'sheet' | 'fullscreen';
  /** Anything between the description and the buttons. */
  children?: ReactNode;
}

/**
 * A modal dialog, built on the native <dialog> element. The browser makes the rest of the page inert, keeps
 * Tab inside, closes it on Escape and gives focus back to whatever opened it. In the middle of the screen by default;
 * a sheet along the bottom of a phone's, or the whole screen for a flow of its own (see `variant`).
 */
export function Dialog(props: DialogProps) {
  return props.open ? <DialogPanel {...props} /> : null;
}

// Mounted only while open, so showModal() runs once per opening.
function DialogPanel({ onClose, title, labelledBy, icon, aside, closeButton = true, description, actions, size = 'sm', variant: kind = 'center', children }: DialogProps) {
  const titleId = useId();
  const descId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const live = useRef(true);

  // A layout effect, so close() runs while the dialog is still in the page and focus can go back.
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    live.current = true;
    // A sheet or a full screen holds the page still behind it: focus inside it, low on the screen, would otherwise
    // scroll the page.
    const unlock = kind !== 'center' ? holdPage() : null;
    dialog.showModal();
    // Start on the first action if there is one (Cancel, Keep it), otherwise on the close button.
    (dialog.querySelector<HTMLElement>('[data-dialog-actions] button') ?? dialog.querySelector<HTMLElement>('button'))?.focus();
    return () => {
      live.current = false;
      if (dialog.open) dialog.close();
      unlock?.();
    };
    // Mounted once per opening: `variant` doesn't change while it's open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // The parent owns `open`, so Escape asks it to close rather than closing the dialog itself.
  const onCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    onClose();
  };
  // Some browsers close on a second Escape even when cancel was prevented; tell the parent so they stay in step.
  // (A close event that arrives while the dialog is open again is left over from an earlier close, so ignore it.)
  const onNativeClose = () => {
    if (live.current && !ref.current?.open) onClose();
  };
  // A press on the dimmed area closes it, the same as Escape.
  const onPress = (e: MouseEvent<HTMLDialogElement>) => {
    if (pressedOutside(e)) onClose();
  };

  return (
    <Card
      ref={ref as never}
      as="dialog"
      pad={kind === 'fullscreen' ? 'none' : 'lg'}
      elevation="overlay"
      aria-labelledby={title ? titleId : labelledBy}
      // Read out with the title when it opens, since focus lands on a button past the text.
      aria-describedby={description ? descId : undefined}
      className={`${styles.panel} ${styles[size]} ${styles[kind]}`}
      onClick={onPress as never}
      // React supports these two events on <dialog>, but Card's props are typed for a generic element.
      {...({ onCancel, onClose: onNativeClose } as object)}
    >
      {kind === 'sheet' ? <div className={styles.handle} aria-hidden="true" /> : null}
      {closeButton ? (
        <IconButton label="Close" size="md" onClick={onClose} className={styles.close}>
          <Close color="var(--color-muted)" strokeWidth={2.2} size={16} />
        </IconButton>
      ) : null}
      {title ? (
        <div className={`${styles.header} ${closeButton ? styles.withClose : ''}`}>
          {icon ? <span className={styles.icon}>{icon}</span> : null}
          <Text variant="heading" as="h2" id={titleId} className={styles.title}>
            {title}
          </Text>
          {aside ? (
            <Text variant="strong" tone="muted">
              {aside}
            </Text>
          ) : null}
        </div>
      ) : null}
      {description ? (
        <Text variant="body" as="p" tone="muted" id={descId} className={styles.description}>
          {description}
        </Text>
      ) : null}
      {children}
      {actions ? (
        <div className={styles.actions} data-dialog-actions>
          {actions}
        </div>
      ) : null}
    </Card>
  );
}

// Pins the page where it is, so nothing can scroll it, and returns what puts it back.
function holdPage() {
  const { scrollX, scrollY } = window;
  const body = document.body.style;
  const was = { position: body.position, top: body.top, left: body.left, right: body.right };
  Object.assign(body, { position: 'fixed', top: -scrollY + 'px', left: '0', right: '0' });
  return () => {
    Object.assign(body, was);
    window.scrollTo(scrollX, scrollY);
  };
}
