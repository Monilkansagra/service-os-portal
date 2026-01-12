import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const session = request.cookies.get('user_role'); // કૂકીમાંથી રોલ ચેક કરશે
  const { pathname } = request.nextUrl;

  // 1. જો યુઝર લોગિન નથી અને ડેશબોર્ડ એક્સેસ કરવા જાય તો લોગિન પેજ પર મોકલો
  if (!session && pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // 2. જો યુઝર લોગિન છે અને ફરીથી લોગિન પેજ ખોલે તો તેને તેના ડેશબોર્ડ પર પાછા મોકલો
  if (session && pathname === '/login') {
    return NextResponse.redirect(new URL(getHomeRoute(session.value), request.url));
  }

  // 3. રૂટ "/" પરથી સીધું લોગિન અથવા ડેશબોર્ડ પર રીડાયરેક્ટ કરો
  if (pathname === '/') {
    if (!session) return NextResponse.redirect(new URL('/login', request.url));
    return NextResponse.redirect(new URL(getHomeRoute(session.value), request.url));
  }

  return NextResponse.next();
}

// રોલ મુજબ પાથ નક્કી કરવાનું ફંક્શન
function getHomeRoute(role: string) {
  if (role === 'ADMIN') return '/admin-dashboard';
  if (role === 'HOD') return '/hod-dashboard';
  return '/portal-dashboard';
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};