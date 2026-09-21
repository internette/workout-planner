import { NextResponse, type NextRequest } from 'next/server';
import { getAuth0 } from '@/lib/auth0';

// Public: the front door, the design-system site, the SDK's own routes (/auth/...), and the token route, which
// answers 401 itself when signed out, so the page's code can tell.
const isPublic = (path: string) =>
  path === '/welcome' || path === '/api/token' || path.startsWith('/design-system') || path.startsWith('/auth/');

// On unless NEXT_PUBLIC_AUTH_REQUIRED=false (see lib/auth.ts).
const required = () => process.env.NEXT_PUBLIC_AUTH_REQUIRED !== 'false';

export async function middleware(request: NextRequest) {
  const { pathname, origin } = request.nextUrl;
  const toFrontDoor = () => NextResponse.redirect(new URL('/welcome', origin));

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
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
