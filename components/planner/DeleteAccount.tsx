'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/buttons';
import { Dialog } from '@/components/ui/dialog';
import { TextField } from '@/components/ui/text-field';
import { Text } from '@/components/ui/typography';
import { logoutUrl } from '@/lib/auth';
import styles from './delete-account.module.css';

const CONFIRM_WORD = 'DELETE';

// What went wrong, in plain words, and what state that leaves things in.
const FAILURES: Record<string, string> = {
  not_configured: 'Account deletion is not set up yet, so nothing was deleted.',
  signed_out: 'You were signed out, so nothing was deleted. Sign in and try again.',
  failed: 'Something went wrong, and some of your information may already be gone. Try again to finish deleting it.',
  sign_in_remains: 'Your information was deleted, but we could not remove your sign-in. Try again to finish.',
};

/**
 * "Delete my account and information": a row for the Account card and the confirmation behind it. Permanent, so the
 * dialog says what goes, says there is no way back, and asks for the word DELETE before it will do anything.
 */
export function DeleteAccount() {
  const [open, setOpen] = useState(false);
  const [typed, setTyped] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const confirmed = typed.trim().toUpperCase() === CONFIRM_WORD;

  const close = () => {
    if (busy) return; // Not while it is happening.
    setOpen(false);
    setTyped('');
    setError(null);
  };

  const remove = async () => {
    if (!confirmed || busy) return;
    setBusy(true);
    setError(null);
    try {
      const res = await fetch('/api/account/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ confirm: CONFIRM_WORD }),
      });
      if (res.ok) {
        // Gone. Ends the session, and the front door says so. The page stays busy until it has left.
        window.location.assign(logoutUrl());
        return;
      }
      const { error: code } = (await res.json().catch(() => ({}))) as { error?: string };
      setError(FAILURES[code ?? ''] ?? FAILURES.failed);
    } catch {
      setError('We could not reach the server, so nothing was deleted. Check your connection and try again.');
    }
    setBusy(false);
  };

  return (
    <>
      <div className={styles.row}>
        <Text variant="body" tone="muted" as="p" className={styles.explain} style={{ margin: 0 }}>
          Permanently delete your account and everything in it. This cannot be undone.
        </Text>
        <Button type="danger" ghost size="sm" onClick={() => setOpen(true)} style={{ flex: 'none' }}>
          Delete my account and information
        </Button>
      </div>

      <Dialog
        open={open}
        onClose={close}
        title="Delete your account permanently?"
        description="This deletes everything you have in Moonshot, and removes your sign-in."
        dismissOnScrim={false}
        actions={
          <>
            <Button type="neutral" ghost size="md" onClick={close} disabled={busy}>
              Keep my account
            </Button>
            <Button type="danger" size="md" onClick={remove} disabled={!confirmed || busy}>
              {busy ? 'Deleting…' : 'Delete permanently'}
            </Button>
          </>
        }
      >
        <ul className={styles.list}>
          <li>Every workout and exercise you have saved</li>
          <li>Your plan, chronicle entries, streak and rank</li>
          <li>Your sign-in, including the name and email we hold</li>
        </ul>
        <p className={styles.permanent}>
          This is permanent. There is no way to recover your account or anything in it, by you or by us.
        </p>
        <div className={styles.field}>
          <TextField
            label={`Type ${CONFIRM_WORD} to confirm`}
            value={typed}
            onChange={(e) => setTyped(e.target.value)}
            placeholder={CONFIRM_WORD}
            autoComplete="off"
            autoCapitalize="characters"
            spellCheck={false}
            disabled={busy}
            onKeyDown={(e) => {
              if (e.key === 'Enter') remove();
            }}
          />
        </div>
        {error ? (
          <p className={styles.error} role="alert">
            {error}
          </p>
        ) : null}
      </Dialog>
    </>
  );
}
