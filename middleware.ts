import { NextResponse, type NextRequest } from 'next/server';
import { getAuth0 } from '@/lib/auth0';

// Public: the front door, the design-system site, and the SDK's own routes (/auth/...).
const isPublic = (path: string) => path === '/welcome' || path.startsWith('/design-system') || path.startsWith('/auth/');

export async function middleware(request: NextRequest) {
  const auth0 = getAuth0();
  if (!auth0) return NextResponse.next(); // sign-in is not configured

  // Mounts /auth/login, /auth/callback and /auth/logout, and keeps the session cookie fresh. Its response must be
  // the one returned, or cookie updates are lost.
  const response = await auth0.middleware(request);
  if (request.nextUrl.pathname.startsWith('/auth/')) return response;

  const required = process.env.NEXT_PUBLIC_AUTH_REQUIRED === 'true';
  if (required && !isPublic(request.nextUrl.pathname) && !(await auth0.getSession(request))) {
    return NextResponse.redirect(new URL('/welcome', request.nextUrl.origin));
  }
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)'],
};
