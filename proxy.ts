import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const session = request.cookies.get('user_role');
  const { pathname } = request.nextUrl;

  if (!session && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL(getHomeRoute(session.value), request.url));
  }

  if (pathname === '/') {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.redirect(new URL(getHomeRoute(session.value), request.url));
  }

  return NextResponse.next();
}

function getHomeRoute(role: string) {
  if (role === 'ADMIN') return '/admin-dashboard';
  if (role === 'HOD') return '/hod-dashboard';
  return '/portal-dashboard';
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};