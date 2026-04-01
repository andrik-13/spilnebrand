import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, getRequestOrigin } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const referer = request.headers.get('referer');
  const origin = getRequestOrigin(request);
  const redirectUrl = (referer === origin || (referer && referer.startsWith(`${origin}/`)))
    ? new URL(referer)
    : new URL('/', origin);
  const response = NextResponse.redirect(redirectUrl);

  response.cookies.set(ADMIN_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0
  });

  return response;
}
