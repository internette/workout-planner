import { NextResponse } from 'next/server';
import { Auth0Client } from '@auth0/nextjs-auth0/server';

// Server only. Auth0's server SDK keeps the session in an encrypted httpOnly cookie, so no token sits in browser
// storage. It reads these five variables.
const REQUIRED = ['AUTH0_DOMAIN', 'AUTH0_CLIENT_ID', 'AUTH0_CLIENT_SECRET', 'AUTH0_SECRET', 'APP_BASE_URL'] as const;

export const AUTH0_CONFIGURED = REQUIRED.every((name) => !!process.env[name]);

// What the session keeps of the ID token's claims: the SDK's usual short list, plus when the account was created,
// which the Auth0 Action adds (see the README). Without the hook the SDK would drop that one; keeping every claim
// would put the whole token in the cookie.
const KEPT_CLAIMS = ['sub', 'name', 'nickname', 'given_name', 'family_name', 'picture', 'email', 'email_verified', 'created_at'];

let client: Auth0Client | null = null;

/** The Auth0 client, or null while sign-in is not configured, so the app runs without it. */
export function getAuth0(): Auth0Client | null {
  if (!AUTH0_CONFIGURED) return null;
  client ??= new Auth0Client({
    beforeSessionSaved: async (session) => ({
      ...session,
      user: Object.fromEntries(Object.entries(session.user).filter(([claim]) => KEPT_CLAIMS.includes(claim))) as typeof session.user,
    }),
    // After Auth0 sends the person back: on success go where they were headed, and on failure return to the front
    // door with what happened, so it can say so plainly.
    onCallback: async (error, ctx) => {
      const base = ctx.appBaseUrl || process.env.APP_BASE_URL!;
      if (error) {
        const cancelled = /access_denied/i.test(error.message) || /access_denied/i.test(String((error as { cause?: { code?: string } }).cause?.code));
        console.error('Auth0 callback failed:', error.message);
        return NextResponse.redirect(new URL(`/welcome?error=${cancelled ? 'cancelled' : 'failed'}`, base));
      }
      return NextResponse.redirect(new URL(ctx.returnTo || '/calendar', base));
    },
  });
  return client;
}
