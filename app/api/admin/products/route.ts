import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildAdminLoginRedirect, buildAdminRedirectUrl, hasAdminAccess } from '@/lib/admin-auth';
import { ADMIN_ERROR_CODES, isTaggedError } from '@/lib/admin-errors';
import { createAdminProduct } from '@/lib/admin-products';
import { parseAdminProductForm } from '@/lib/admin-form';

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const locale = String(formData.get('locale') || 'ua');

  if (!hasAdminAccess(request)) {
    return buildAdminLoginRedirect(request, locale, `/${locale}/admin/products/new`);
  }

  try {
    const input = parseAdminProductForm(formData);
    const id = await createAdminProduct(input);
    return NextResponse.redirect(buildAdminRedirectUrl(request, `/${locale}/admin/products/${id}`, { saved: '1' }));
  } catch (error) {
    const message = isTaggedError(error, ADMIN_ERROR_CODES.configuration)
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Failed to create product.';

    return NextResponse.redirect(buildAdminRedirectUrl(request, `/${locale}/admin/products/new`, { error: message }));
  }
}
