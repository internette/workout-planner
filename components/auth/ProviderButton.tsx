import type { MouseEvent, ReactNode } from 'react';
import { loginUrl, type Provider } from '@/lib/auth';
import { AppleMark, GoogleMark } from './marks';
import styles from './landing.module.css';

interface ProviderButtonProps {
  provider: Provider;
  /** Runs before the browser follows the link. Call preventDefault to stop it. */
  onClick: (e: MouseEvent<HTMLAnchorElement>) => void;
  /** This button's sign-in is in flight. */
  busy?: boolean;
  /** Some sign-in is in flight, so the others wait. */
  disabled?: boolean;
  children: ReactNode;
}

/**
 * A sign-in button for one identity provider. It is a link to the server's login route, which sends the person to
 * Auth0, so it works before the page's scripts have loaded. It lives with the login, not in the design system,
 * because each provider sets its own rules for the button's look and label.
 */
export function ProviderButton({ provider, onClick, busy, disabled, children }: ProviderButtonProps) {
  return (
    <a
      href={loginUrl(provider)}
      className={`${styles.provider} ${provider === 'apple' ? styles.apple : styles.google}`}
      onClick={(e) => {
        if (disabled) {
          e.preventDefault();
          return;
        }
        onClick(e);
      }}
      aria-busy={busy || undefined}
      aria-disabled={disabled || undefined}
    >
      {provider === 'apple' ? <AppleMark /> : <GoogleMark />}
      {children}
    </a>
  );
}
