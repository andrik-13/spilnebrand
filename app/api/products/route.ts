import { NextResponse } from 'next/server';
import { getLocaleFromPathname } from '@/lib/i18n';
import { getLocalizedProduct } from '@/lib/products';
import { listProducts } from '@/lib/catalog-repository';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const locale = getLocaleFromPathname(searchParams.get('locale') || undefined);
  const category = searchParams.get('category');
  const isNew = searchParams.get('is_new');
  const limit = Number(searchParams.get('limit') || 0);

  const items = await listProducts({
    category,
    isNew: isNew === 'true',
    limit: limit > 0 ? limit : undefined
  });

  return NextResponse.json({ products: items.map((product) => getLocalizedProduct(product, locale)) });
}
