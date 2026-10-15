import { Button } from '@moonshot/design-system/buttons';
import { Dialog } from '@moonshot/design-system/dialog';
import { PROVIDER_NAME, PROVIDERS } from '@/shared/auth';
import { ProviderButton } from './ProviderButton';
import styles from './landing.module.css';

/**
 * Says the session has ended, in place, instead of leaving for the front door mid-workout or mid-edit. Signing in again
 * comes back to this same page. "Not now" keeps the page as it is, to copy something first; the banner at the top
 * offers the way back in.
 */
export function SignedOutDialog({ open, onClose, unsaved }: { open: boolean; onClose: () => void; unsaved: boolean }) {
  const here = typeof window === 'undefined' ? '/calendar' : window.location.pathname + window.location.search;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      title="Sign in again to keep going"
      description={
        'Your sign-in has ended, so nothing new can be saved. Ticks and your workout clock are kept on this device, and ' +
        'save once you’re back.' +
        (unsaved ? ' Changes you haven’t saved on this screen will be lost, so copy anything you need first.' : '')
      }
      actions={
        <Button type="neutral" ghost size="md" onClick={onClose}>
          Not now
        </Button>
      }
    >
      <div className={styles.providers} style={{ marginTop: 'var(--space-3)' }}>
        {PROVIDERS.map((p) => (
          <ProviderButton key={p} provider={p} onClick={() => undefined} returnTo={here}>
            Continue with {PROVIDER_NAME[p]}
          </ProviderButton>
        ))}
      </div>
    </Dialog>
  );
}
