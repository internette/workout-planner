import type { ReactNode } from 'react';
import type { Provider } from '@/lib/auth';
import { AppleMark, GoogleMark } from './marks';
import styles from './landing.module.css';

interface ProviderButtonProps {
  provider: Provider;
  onClick: () => void;
  /** This button's sign-in is in flight. */
  busy?: boolean;
  /** Some sign-in is in flight, so the others wait. */
  disabled?: boolean;
  children: ReactNode;
}

/**
 * A sign-in button for one identity provider. It lives with the login, not in the design system, because each
 * provider sets its own rules for the button's look and label.
 */
export function ProviderButton({ provider, onClick, busy, disabled, children }: ProviderButtonProps) {
  return (
    <button
      type="button"
      className={`${styles.provider} ${provider === 'apple' ? styles.apple : styles.google}`}
      onClick={onClick}
      disabled={disabled}
      aria-busy={busy || undefined}
    >
      {provider === 'apple' ? <AppleMark /> : <GoogleMark />}
      {children}
    </button>
  );
}
