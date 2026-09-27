'use client';

import { Mark } from '../brand';
import { Button } from '../buttons';
import { Moon, SparkleTrail } from '../icons';
import { Text } from '../typography';
import styles from './status-screen.module.css';

export type StatusKind = 'loading' | 'slow' | 'error';

export interface StatusScreenProps {
  /** loading: on its way, with the animated mark. slow: taking longer than usual. error: it didn't arrive. */
  kind: StatusKind;
  /** What's happening, e.g. "Loading your plan". */
  title: string;
  /** A sentence under the title. */
  note: string;
  /** The server's own words, kept behind "Show details" on the error screen. */
  detail?: string;
  /** Try again. Leave it out and the button is left out. */
  onRetry?: () => void;
  /** Sign out, offered on the error screen so a stale session cannot trap anyone. */
  onSignOut?: () => void;
  /** Draw it inside a page rather than as the whole page: no full height, no main landmark and no live region. For
   * showing it as an example. */
  inline?: boolean;
}

/** What an app shows before it has its data: loading, taking longer, and the failure. One screen, three states. */
export function StatusScreen({ kind, title, note, detail, onRetry, onSignOut, inline = false }: StatusScreenProps) {
  const failed = kind === 'error';
  const Root = inline ? 'div' : 'main';
  return (
    <Root className={inline ? `${styles.screen} ${styles.inline}` : styles.screen} role={inline ? undefined : failed ? 'alert' : 'status'}>
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
          <Text variant="title" as={inline ? 'h3' : 'h1'} style={{ margin: 0 }}>
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
    </Root>
  );
}
