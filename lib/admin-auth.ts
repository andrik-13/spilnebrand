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
  const forwardedHost = request.headers.get('x-forwarded-host');
  const host = forwardedHost || request.headers.get('host');
  const protocol = request.headers.get('x-forwarded-proto') || new URL(request.url).protocol.replace(/:$/, '');

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

export function buildAdminRedirectUrl(
  request: Request | NextRequest,
  pathname: string,
  search: Record<string, string> = {}
) {
  const url = new URL(pathname, getRequestOrigin(request));
  Object.entries(search).forEach(([key, value]) => url.searchParams.set(key, value));
  return url;
}

export function normalizeAdminNextPath(value: string, locale: string) {
  if (value.startsWith('/') && !value.startsWith('//')) {
    return value;
  }

  return `/${locale}/admin`;
}
