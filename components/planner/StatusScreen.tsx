'use client';

import { Mark } from '@/components/brand/Mark';
import { Button } from '@/components/ui/buttons';
import { Moon, SparkleTrail } from '@/components/ui/icons';
import { Text } from '@/components/ui/typography';
import styles from './status-screen.module.css';

export type StatusKind = 'loading' | 'slow' | 'error';

export interface StatusScreenProps {
  /** loading: the plan is on its way. slow: it is taking longer than usual. error: it did not arrive. */
  kind: StatusKind;
  /** The server's own words, kept behind "Show details" on the error screen. */
  detail?: string;
  /** Try again. Leave it out and the button is left out. */
  onRetry?: () => void;
  /** Sign out, offered on the error screen so a stale session cannot trap anyone. */
  onSignOut?: () => void;
}

const COPY: Record<StatusKind, { title: string; note: string }> = {
  loading: { title: 'Loading your plan', note: 'Setting up your week, streak and chronicle.' },
  slow: { title: 'Still loading your plan', note: 'This is taking longer than usual. It may be your connection.' },
  error: { title: 'Couldn’t reach your plan', note: 'Your plan is safe. Check your connection, then try again.' },
};

/** What the planner shows before it has data: loading, taking longer, and the failure. One screen, three states. */
export function StatusScreen({ kind, detail, onRetry, onSignOut }: StatusScreenProps) {
  const { title, note } = COPY[kind];
  const failed = kind === 'error';
  return (
    <main className={styles.screen} role={failed ? 'alert' : 'status'}>
      <div className={styles.column}>
        <div className={styles.medallion}>
          {failed ? <Moon size={44} color="var(--color-slate)" /> : <Mark size={60} animate />}
          {failed ? (
            <span className={styles.badge} aria-hidden="true">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="var(--color-danger)" strokeWidth="2.4" strokeLinecap="round">
                <path d="M12 7v6M12 17h.01" />
              </svg>
            </span>
          ) : null}
        </div>

        <div className={styles.copy}>
          <Text variant="title" as="h1" style={{ margin: 0 }}>
            {title}
          </Text>
          <Text variant="body" tone="muted" as="p" style={{ margin: 0, maxWidth: 360, textWrap: 'pretty' }}>
            {note}
          </Text>
        </div>

        {failed ? null : <SparkleTrail className={styles.trail} />}

        {kind === 'slow' && onRetry ? (
          <div className={styles.actions}>
            <Button type="neutral" ghost size="md" onClick={onRetry}>
              Try again
            </Button>
          </div>
        ) : null}

        {failed ? (
          <>
            <div className={styles.actions}>
              {onRetry ? (
                <Button type="primary" size="md" onClick={onRetry}>
                  Try again
                </Button>
              ) : null}
              {onSignOut ? (
                <Button type="neutral" ghost size="md" onClick={onSignOut}>
                  Sign out
                </Button>
              ) : null}
            </div>
            {detail ? (
              <details className={styles.details}>
                <summary className={styles.summary}>Show details</summary>
                <pre className={styles.detail}>{detail}</pre>
              </details>
            ) : null}
          </>
        ) : null}
      </div>
    </main>
  );
}
