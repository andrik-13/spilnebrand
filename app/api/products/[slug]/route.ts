import { NextResponse } from 'next/server';
import { getLocaleFromPathname } from '@/lib/i18n';
import { getLocalizedProduct } from '@/lib/products';
import { getProductBySlug } from '@/lib/catalog-repository';

export async function GET(request: Request, { params }: { params: { slug: string } }) {
  const product = await getProductBySlug(params.slug);
  if (!product) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const locale = getLocaleFromPathname(searchParams.get('locale') || undefined);

  return NextResponse.json({ product: getLocalizedProduct(product, locale) });
}
