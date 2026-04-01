import { NextResponse } from 'next/server';
import { AdminConfigurationError, updateAdminProduct } from '@/lib/admin-products';
import { parseAdminProductForm } from '@/lib/admin-form';

function buildRedirectUrl(request: Request, pathname: string, search: Record<string, string>) {
  const url = new URL(pathname, request.url);
  Object.entries(search).forEach(([key, value]) => url.searchParams.set(key, value));
  return url;
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  const formData = await request.formData();
  const locale = String(formData.get('locale') || 'ua');

  try {
    const input = parseAdminProductForm(formData);
    await updateAdminProduct(params.id, input);
    return NextResponse.redirect(buildRedirectUrl(request, `/${locale}/admin/products/${params.id}`, { saved: '1' }));
  } catch (error) {
    const message = error instanceof AdminConfigurationError
      ? 'Supabase admin credentials are not configured yet. Add NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY to continue.'
      : error instanceof Error
        ? error.message
        : 'Failed to update product.';

    return NextResponse.redirect(buildRedirectUrl(request, `/${locale}/admin/products/${params.id}`, { error: message }));
  }
}
