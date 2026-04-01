import { NextResponse } from 'next/server';
import { ADMIN_COOKIE, getRequestOrigin, normalizeAdminNextPath } from '@/lib/admin-auth';

export async function POST(request: Request) {
  const formData = await request.formData();
  const password = String(formData.get('password') || '');
  const locale = String(formData.get('locale') || 'ua');
  const nextPath = normalizeAdminNextPath(String(formData.get('next') || `/${locale}/admin`), locale);
  const adminPassword = process.env.ADMIN_PASSWORD;

  const redirectUrl = new URL(
    password && adminPassword && password === adminPassword ? nextPath : `/${locale}/admin/login?error=1`,
    getRequestOrigin(request)
  );

  const response = NextResponse.redirect(redirectUrl);

  if (password && adminPassword && password === adminPassword) {
    response.cookies.set(ADMIN_COOKIE, '1', {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/'
    });
  }

  return response;
}
