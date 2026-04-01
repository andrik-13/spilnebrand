import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const ADMIN_COOKIE = 'spilne_admin';

export function hasAdminAccess(request: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return false;
  }

  return request.cookies.get(ADMIN_COOKIE)?.value === '1';
}

export function buildAdminLoginRedirect(request: NextRequest, locale: string, nextPath: string) {
  const loginUrl = request.nextUrl.clone();
  loginUrl.pathname = `/${locale}/admin/login`;
  loginUrl.searchParams.set('next', nextPath);
  return NextResponse.redirect(loginUrl);
}
