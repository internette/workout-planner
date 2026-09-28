// Sign-in settings both sides use: the middleware and the server's routes, and the sign-in page and the planner. The
// server's Auth0 client is in backend/auth0/client.ts; the browser's links and ID token are in frontend/.

import { vendorOn } from './vendors';

export type Provider = 'google' | 'apple';

/**
 * Whether the planner needs a signed-in user. On unless NEXT_PUBLIC_AUTH_REQUIRED=false, so a visitor who is not
 * signed in always lands on the front door. Set it to false only to work locally before Auth0 is set up.
 */
export const AUTH_REQUIRED = process.env.NEXT_PUBLIC_AUTH_REQUIRED !== 'false';

/** The Auth0 connection names for each provider. Auth0 calls Google's "google-oauth2". */
export const CONNECTION: Record<Provider, string> = { google: 'google-oauth2', apple: 'apple' };

/** The providers people can sign in with: those switched on in vendors.config.ts. */
export const PROVIDERS: Provider[] = (['google', 'apple'] as const).filter(vendorOn);

/** Whether an Auth0 connection name ("google-oauth2") is one people may sign in with here. */
export const connectionOn = (connection: string | null) => PROVIDERS.some((p) => CONNECTION[p] === connection);

/** Who is signed in, as far as Profile needs to say. Each part is null when the session lacks it. */
export interface Account {
  name: string | null;
  email: string | null;
  /** The provider's photo of them, an https address. */
  picture: string | null;
  /** When the account was created, as an ISO date. Auth0 records it; the Action in the README puts it in the token. */
  createdAt: string | null;
  /** The provider the session used, as a person would say it: "Google" or "Apple". */
  provider: string | null;
}

/**
 * What to call them. Apple can hide the name and Auth0 then fills it with the email, so a name that is just the email
 * does not count; the part of the email before the @ is the next best thing.
 */
export const displayName = (a: Account | null): string => {
  const named = a?.name && a.name !== a.email ? a.name.trim() : '';
  return named || a?.email?.split('@')[0] || 'You';
};

/** What each provider is called on screen. */
export const PROVIDER_NAME: Record<Provider, string> = { google: 'Google', apple: 'Apple' };

/** "google-oauth2|1234" -> "Google". Auth0 user ids begin with the connection that made them. */
export const providerName = (sub?: string | null): string | null => {
  const connection = sub?.split('|')[0];
  const provider = (Object.keys(CONNECTION) as Provider[]).find((p) => CONNECTION[p] === connection);
  return provider ? PROVIDER_NAME[provider] : null;
};
