export type Provider = 'google' | 'apple';

/**
 * Whether the planner needs a signed-in user. Off by default, so the app keeps working locally until Auth0 and
 * Supabase are set up and the per-user migration has been run (see the README).
 */
export const AUTH_REQUIRED = process.env.NEXT_PUBLIC_AUTH_REQUIRED === 'true';

export const AUTH0_DOMAIN = process.env.NEXT_PUBLIC_AUTH0_DOMAIN;
export const AUTH0_CLIENT_ID = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID;
export const AUTH0_CONFIGURED = !!AUTH0_DOMAIN && !!AUTH0_CLIENT_ID;

/** The Auth0 connection names for each provider. Auth0 calls Google's "google-oauth2". */
export const CONNECTION: Record<Provider, string> = { google: 'google-oauth2', apple: 'apple' };

// Supabase asks for a token on every request. Auth0's SDK lives in React, so the provider registers how to get
// one here, and the Supabase client (which is not a React thing) reads it.
type IdTokenGetter = () => Promise<string | null>;
let idTokenGetter: IdTokenGetter | null = null;
export const setIdTokenGetter = (fn: IdTokenGetter | null) => {
  idTokenGetter = fn;
};

/** The signed-in person's Auth0 ID token, which Supabase accepts, or null when nobody is signed in. */
export const getIdToken = async () => (idTokenGetter ? idTokenGetter() : null);
