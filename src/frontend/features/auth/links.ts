import { CONNECTION, type Provider } from '@/shared/auth';

// Sign-in and sign-out are trips to the server's own routes (/auth/…, mounted by the middleware).

/** Where a provider button goes. The server route sends the person to Auth0 and back to the planner, or to `returnTo`
 * (a path on this site, such as a shared program's page). */
export const loginUrl = (provider: Provider, returnTo = '/calendar') =>
  `/auth/login?connection=${encodeURIComponent(CONNECTION[provider])}&returnTo=${encodeURIComponent(returnTo.startsWith('/') && !returnTo.startsWith('//') ? returnTo : '/calendar')}`;

// Auth0 only accepts an absolute post-logout address (and it must be listed under Allowed Logout URLs).
export const logoutUrl = () =>
  `/auth/logout?returnTo=${encodeURIComponent(`${window.location.origin}/welcome`)}`;
