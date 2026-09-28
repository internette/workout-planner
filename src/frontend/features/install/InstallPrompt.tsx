'use client';

import { useId, useLayoutEffect, useRef, useState, type MouseEvent, type SyntheticEvent } from 'react';
import { Mark } from '@moonshot/design-system/brand';
import { Button } from '@moonshot/design-system/buttons';
import { Checkbox } from '@moonshot/design-system/checkbox';
import { pressedOutside } from '@moonshot/design-system/dialog';
import { Text } from '@moonshot/design-system/typography';
import styles from './install-prompt.module.css';

export interface InstallPromptProps {
  open: boolean;
  /** Show the note that a "no" was final. */
  notice: boolean;
  /** 'reinstall': the app was installed on this phone and has been removed, so this asks to add it back. */
  kind?: 'install' | 'reinstall';
  onInstall: (dontAsk: boolean) => void;
  onNotNow: (dontAsk: boolean) => void;
}

// What it says, first time and after the app was removed.
const WORDS = {
  install: {
    title: 'Install Moonshot',
    body: 'Open it like an app: full screen, no browser bar, one tap away.',
    action: 'Install',
    notice: 'We won’t ask again. You can still install Moonshot from Profile → Settings.',
  },
  reinstall: {
    title: 'Add Moonshot back?',
    body: 'It looks like Moonshot was removed from this phone. Add it back to open it like an app again, one tap away.',
    action: 'Add it back',
    notice: 'We won’t ask again. You can add Moonshot back from Profile → Settings.',
  },
};

/**
 * "Install Moonshot", or "Add Moonshot back?" once it has been removed: a sheet from the bottom with the action,
 * Not now and a "Don't ask me again" switch.
 */
export function InstallPrompt({ open, notice, kind = 'install', onInstall, onNotNow }: InstallPromptProps) {
  const words = WORDS[kind];
  return (
    <>
      {open ? <Sheet words={words} onInstall={onInstall} onNotNow={onNotNow} /> : null}
      {notice ? (
        <div className={styles.notice} role="status">
          {words.notice}
        </div>
      ) : null}
    </>
  );
}

// Mounted only while open, so showModal() runs once per opening.
function Sheet({ words, onInstall, onNotNow }: Pick<InstallPromptProps, 'onInstall' | 'onNotNow'> & { words: (typeof WORDS)['install'] }) {
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
          {words.title}
        </Text>
      </div>
      <Text variant="body" tone="muted" as="p" style={{ margin: 0, textWrap: 'pretty' }}>
        {words.body}
      </Text>
      <div className={styles.actions}>
        <Button type="primary" size="lg" fullWidth onClick={() => onInstall(dontAsk)}>
          {words.action}
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
