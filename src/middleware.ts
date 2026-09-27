import { NextResponse, type NextRequest } from 'next/server';
import { connectionOn } from '@/lib/auth';
import { getAuth0 } from '@/lib/auth0';

// Public: the front door, the design-system site (another app, forwarded by next.config.js), the SDK's own routes
// (/auth/...), and the token route, which answers 401 itself when signed out, so the page's code can tell. The assistant
// connector and its discovery document too: the connector checks its own bearer token (Claude has no session cookie)
// and answers 401 itself.
const isPublic = (path: string) =>
  path === '/welcome' ||
  path === '/api/token' ||
  path === '/api/mcp' ||
  path === '/api/oauth-protected-resource' ||
  path.startsWith('/.well-known/') ||
  path.startsWith('/design-system') ||
  path.startsWith('/auth/');

// On unless NEXT_PUBLIC_AUTH_REQUIRED=false (see lib/auth.ts).
const required = () => process.env.NEXT_PUBLIC_AUTH_REQUIRED !== 'false';

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const toFrontDoor = () => NextResponse.redirect(new URL('/welcome', origin));

  // Sign-in goes only through a provider that's switched on in vendors.config.ts. Without a connection Auth0 would show its
  // own page with every provider, so that's refused too.
  if (pathname === '/auth/login' && !connectionOn(request.nextUrl.searchParams.get('connection'))) {
    return NextResponse.redirect(new URL('/welcome?error=failed', origin));
  }

  const auth0 = getAuth0();
  if (!auth0) {
    // Sign-in is not configured, so nobody can be signed in. The front door says so.
    return required() && !isPublic(pathname) ? toFrontDoor() : NextResponse.next();
  }

  // Mounts /auth/login, /auth/callback and /auth/logout, and keeps the session cookie fresh. Its response must be
  // the one returned, or cookie updates are lost.
  const response = await auth0.middleware(request);
  if (pathname.startsWith('/auth/')) return response;

  if (required() && !isPublic(pathname) && !(await auth0.getSession(request))) return toFrontDoor();
  return response;
}

export const config = {
  // Static files and the icon/manifest routes stay out of it: browsers fetch those without the session cookie.
  matcher: ['/((?!_next/static|_next/image|favicon.ico|icon.svg|apple-icon.png|manifest.webmanifest|sw.js|icons/|brand/|sitemap.xml|robots.txt).*)'],
};
