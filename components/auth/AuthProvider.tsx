'use client';

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { Auth0Provider, useAuth0 } from '@auth0/auth0-react';
import { AUTH0_CLIENT_ID, AUTH0_CONFIGURED, AUTH0_DOMAIN, CONNECTION, setIdTokenGetter, type Provider } from '@/lib/auth';

export type AuthStatus = 'loading' | 'signedIn' | 'signedOut';

export interface AuthValue {
  status: AuthStatus;
  /** Sends the browser to the provider. On success the page leaves, so this only settles with a failure. */
  signIn: (provider: Provider) => Promise<{ error: 'not-configured' | 'failed' } | undefined>;
  signOut: () => void;
  /** Set when the provider sent the person back with an error, such as cancelling. */
  returnedError: { cancelled: boolean } | null;
}

// Outside a provider nobody is signed in and there is nothing to sign in to or out of.
const AuthContext = createContext<AuthValue>({
  status: 'signedOut',
  signIn: async () => ({ error: 'not-configured' }),
  signOut: () => undefined,
  returnedError: null,
});

// Auth0 hands back a fresh ID token when the cached one is missing or about to expire.
const REFRESH_WITHIN_SECONDS = 60;

function Bridge({ children }: { children: ReactNode }) {
  const { isLoading, isAuthenticated, loginWithRedirect, logout, getIdTokenClaims, getAccessTokenSilently, error } = useAuth0();

  // Registered while rendering, not in an effect: children's effects run first, and the planner's first load needs it.
  setIdTokenGetter(async () => {
    let claims = await getIdTokenClaims();
    if (!claims || (claims.exp ?? 0) - Date.now() / 1000 < REFRESH_WITHIN_SECONDS) {
      await getAccessTokenSilently({ cacheMode: 'off' });
      claims = await getIdTokenClaims();
    }
    return claims?.__raw ?? null;
  });

  const value = useMemo<AuthValue>(
    () => ({
      status: isLoading ? 'loading' : isAuthenticated ? 'signedIn' : 'signedOut',
      signIn: async (provider) => {
        try {
          await loginWithRedirect({ authorizationParams: { connection: CONNECTION[provider] } });
          return undefined;
        } catch (e) {
          console.error('Sign-in failed:', e);
          return { error: 'failed' };
        }
      },
      signOut: () => logout({ logoutParams: { returnTo: window.location.origin + '/welcome' } }),
      returnedError: error
        ? { cancelled: (error as { error?: string }).error === 'access_denied' }
        : null,
    }),
    [isLoading, isAuthenticated, loginWithRedirect, logout, error],
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * The Auth0 session, as a status the rest of the app can read. Auth0's client only runs in the browser, so until
 * the page has mounted the status is "loading".
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  const notConfigured = useMemo<AuthValue>(
    () => ({ status: 'signedOut', signIn: async () => ({ error: 'not-configured' }), signOut: () => undefined, returnedError: null }),
    [],
  );
  const loading = useMemo<AuthValue>(() => ({ ...notConfigured, status: 'loading' }), [notConfigured]);

  useEffect(() => () => setIdTokenGetter(null), []);

  if (!AUTH0_CONFIGURED) return <AuthContext.Provider value={notConfigured}>{children}</AuthContext.Provider>;
  if (!mounted) return <AuthContext.Provider value={loading}>{children}</AuthContext.Provider>;
  return (
    <Auth0Provider
      domain={AUTH0_DOMAIN!}
      clientId={AUTH0_CLIENT_ID!}
      authorizationParams={{ redirect_uri: window.location.origin + '/' }}
      cacheLocation="localstorage"
      useRefreshTokens
      onRedirectCallback={() => window.history.replaceState({}, document.title, window.location.pathname)}
    >
      <Bridge>{children}</Bridge>
    </Auth0Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
