'use client';

import { useId, useLayoutEffect, useRef, useState, type MouseEvent, type SyntheticEvent } from 'react';
import { Mark } from '@/components/brand/Mark';
import { Button } from '@/components/ui/buttons';
import { Checkbox } from '@/components/ui/checkbox';
import { pressedOutside } from '@/components/ui/dialog';
import { Text } from '@/components/ui/typography';
import styles from './install-prompt.module.css';

export interface InstallPromptProps {
  open: boolean;
  /** Show the note that a "no" was final. */
  notice: boolean;
  onInstall: (dontAsk: boolean) => void;
  onNotNow: (dontAsk: boolean) => void;
}

/** "Install Moonshot": a sheet from the bottom with Install, Not now and a "Don't ask me again" switch. */
export function InstallPrompt({ open, notice, onInstall, onNotNow }: InstallPromptProps) {
  return (
    <>
      {open ? <Sheet onInstall={onInstall} onNotNow={onNotNow} /> : null}
      {notice ? (
        <div className={styles.notice} role="status">
          We won’t ask again. You can still install Moonshot from your browser’s menu.
        </div>
      ) : null}
    </>
  );
}

// Mounted only while open, so showModal() runs once per opening.
function Sheet({ onInstall, onNotNow }: Pick<InstallPromptProps, 'onInstall' | 'onNotNow'>) {
  const titleId = useId();
  const ref = useRef<HTMLDialogElement>(null);
  const [dontAsk, setDontAsk] = useState(false);

  useLayoutEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    dialog.showModal();
    return () => {
      if (dialog.open) dialog.close();
    };
  }, []);

  // Escape answers the same as Not now. The parent closes it, so the browser must not.
  const onCancel = (e: SyntheticEvent) => {
    e.preventDefault();
    onNotNow(dontAsk);
  };

  // A press on the dimmed area answers the same as Escape.
  const onPress = (e: MouseEvent<HTMLDialogElement>) => {
    if (pressedOutside(e)) onNotNow(dontAsk);
  };

  return (
    <dialog ref={ref} className={styles.sheet} aria-labelledby={titleId} onCancel={onCancel} onClick={onPress}>
      <div className={styles.handle} aria-hidden="true" />
      <div className={styles.head}>
        <span className={styles.icon}>
          <Mark size={36} />
        </span>
        <Text variant="heading" as="h2" id={titleId} style={{ margin: 0 }}>
          Install Moonshot
        </Text>
      </div>
      <Text variant="body" tone="muted" as="p" style={{ margin: 0, textWrap: 'pretty' }}>
        Open it like an app: full screen, no browser bar, one tap away.
      </Text>
      <div className={styles.actions}>
        <Button type="primary" size="lg" fullWidth onClick={() => onInstall(dontAsk)}>
          Install
        </Button>
        <Button type="neutral" ghost size="md" fullWidth onClick={() => onNotNow(dontAsk)}>
          Not now
        </Button>
      </div>
      <Checkbox switch checked={dontAsk} onChange={setDontAsk}>
        Don’t ask me again
      </Checkbox>
    </dialog>
  );
}
