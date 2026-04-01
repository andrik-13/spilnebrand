import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { buildAdminLoginRedirect, buildAdminRedirectUrl, hasAdminAccess } from '@/lib/admin-auth';
import { AdminConfigurationError, updateAdminProduct } from '@/lib/admin-products';
import { parseAdminProductForm } from '@/lib/admin-form';

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  const locale = String(formData.get('locale') || 'ua');

  if (!hasAdminAccess(request)) {
    return buildAdminLoginRedirect(request, locale, `/${locale}/admin/products/${params.id}`);
  }

  try {
    const input = parseAdminProductForm(formData);
    await updateAdminProduct(params.id, input);
    return NextResponse.redirect(buildAdminRedirectUrl(request, `/${locale}/admin/products/${params.id}`, { saved: '1' }));
  } catch (error) {
    const message = error instanceof AdminConfigurationError
      ? 'Supabase admin credentials are not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to continue.'
      : error instanceof Error
        ? error.message
        : 'Failed to update product.';

    return NextResponse.redirect(buildAdminRedirectUrl(request, `/${locale}/admin/products/${params.id}`, { error: message }));
  }
}
