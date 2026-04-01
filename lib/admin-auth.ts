import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const ADMIN_COOKIE = 'spilne_admin';

export function hasAdminAccess(request: NextRequest) {
  if (!process.env.ADMIN_PASSWORD) {
    return false;
  }

  return request.cookies.get(ADMIN_COOKIE)?.value === '1';
}

export function getRequestOrigin(request: Request | NextRequest) {
  const originHeader = request.headers.get('origin');

  if (originHeader) {
    return originHeader;
  }

  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || 'https';

  if (host) {
    return `${protocol}://${host}`;
  }

  return new URL(request.url).origin;
}

export function buildAdminLoginRedirect(request: NextRequest, locale: string, nextPath: string) {
  const loginUrl = new URL(`/${locale}/admin/login`, getRequestOrigin(request));
  loginUrl.searchParams.set('next', nextPath);
  return NextResponse.redirect(loginUrl);
}
