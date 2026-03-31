import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const ADMIN_COOKIE = 'spilne_admin';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isLocalizedAdmin = /^\/(ua|en)\/admin(\/.*)?$/.test(pathname);

  if (!isLocalizedAdmin) {
    return NextResponse.next();
  }

  if (pathname.endsWith('/login')) {
    return NextResponse.next();
  }

  if (!process.env.ADMIN_PASSWORD) {
    return NextResponse.next();
  }

  const isAuthorized = request.cookies.get(ADMIN_COOKIE)?.value === '1';
  if (isAuthorized) {
    return NextResponse.next();
  }

  const locale = pathname.split('/')[1] || 'ua';
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = `/${locale}/admin/login`;
  loginUrl.searchParams.set('next', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
