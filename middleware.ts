import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildAdminLoginRedirect, hasAdminAccess } from '@/lib/admin-auth';

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

  if (hasAdminAccess(request)) {
    return NextResponse.next();
  }

  const locale = pathname.split('/')[1] || 'ua';
  return buildAdminLoginRedirect(request, locale, pathname);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)']
};
