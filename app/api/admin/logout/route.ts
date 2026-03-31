import { NextResponse } from 'next/server';

const ADMIN_COOKIE = 'spilne_admin';

export async function POST(request: Request) {
  const referer = request.headers.get('referer');
  const redirectUrl = new URL(referer || '/', request.url);
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
