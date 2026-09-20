'use client';

import { useLayoutEffect, useId, useRef, type MouseEvent, type ReactNode, type SyntheticEvent } from 'react';
import { IconButton } from '../buttons';
import { Card } from '../card';
import { Close } from '../icons';
import { Text } from '../typography';
import styles from './dialog.module.css';

export interface DialogProps {
  open: boolean;
  /** Called when the browser asks to close it (Escape), on the close button, and on a press on the dimmed area if `dismissOnScrim` is set. It should set `open` to false. */
  onClose: () => void;
  title: string;
  /** Small muted text beside the title. */
  aside?: string;
  /** A close button in the header, for dialogs that have no Cancel button. */
  closeButton?: boolean;
  /** Muted explanatory text under the title. */
  description?: ReactNode;
  /** Buttons along the bottom, right-aligned. */
  actions?: ReactNode;
  /** md is a little wider than the default sm. */
  size?: 'sm' | 'md';
  /** Let a press on the dimmed area close the dialog. Leave it off for questions that need an answer. */
  dismissOnScrim?: boolean;
  /** Anything between the description and the buttons. */
  children?: ReactNode;
}

/**
 * A modal dialog, built on the native <dialog> element. The browser makes the rest of the page inert, keeps
 * Tab inside, closes it on Escape and gives focus back to whatever opened it.
 */
export function Dialog(props: DialogProps) {
  return props.open ? <DialogPanel {...props} /> : null;
}

// Mounted only while open, so showModal() runs once per opening.
function DialogPanel({ onClose, title, aside, closeButton, description, actions, size = 'sm', dismissOnScrim, children }: DialogProps) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const live = useRef(true);

  // A layout effect, so close() runs while the dialog is still in the page and focus can go back.
  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    live.current = true;
    dialog.showModal();
    dialog.querySelector<HTMLElement>('button')?.focus();
    return () => {
      live.current = false;
      if (dialog.open) dialog.close();
    };
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
  // The dimmed area is the dialog element itself, outside the card's own box.
  const onPress = (e: MouseEvent<HTMLDialogElement>) => {
    if (!dismissOnScrim || e.target !== e.currentTarget) return;
    const r = e.currentTarget.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose();
  };

  return (
    <Card
      ref={ref as never}
      as="dialog"
      pad="lg"
      elevation="overlay"
      aria-labelledby={titleId}
      className={`${styles.panel} ${styles[size]}`}
      onClick={onPress as never}
      // React supports these two events on <dialog>, but Card's props are typed for a generic element.
      {...({ onCancel, onClose: onNativeClose } as object)}
    >
      <div className={styles.header}>
        <Text variant="subheading" as="h2" id={titleId} className={styles.title}>
          {title}
        </Text>
        {aside ? (
          <Text variant="caption" tone="muted" weight="medium">
            {aside}
          </Text>
        ) : null}
        {closeButton ? (
          <IconButton label="Close" size="md" onClick={onClose} className={styles.close}>
            <Close color="var(--color-muted)" strokeWidth={2.2} size={16} />
          </IconButton>
        ) : null}
      </div>
      {description ? (
        <Text variant="body" as="p" tone="muted" className={styles.description}>
          {description}
        </Text>
      ) : null}
      {children}
      {actions ? <div className={styles.actions}>{actions}</div> : null}
    </Card>
  );
}
