import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getProductBySlug } from '@/lib/catalog-repository';
import { ProductDetails } from '@/components/product/ProductDetails';
import { getLocalizedPath, isLocale, type Locale, ui } from '@/lib/i18n';
import { getLocalizedProduct } from '@/lib/products';

export const dynamic = 'force-dynamic';

export async function generateMetadata({ params }: { params: { locale: string; slug: string } }): Promise<Metadata> {
  const product = await getProductBySlug(params.slug);
  if (!product) return {};

  const locale = isLocale(params.locale) ? params.locale : 'ua';
  const localized = getLocalizedProduct(product, locale);

  return {
    title: `${localized.name} | SPIL'NE`,
    description: localized.description,
    openGraph: localized.images[0] ? { images: [localized.images[0]] } : undefined,
  };
}

export default async function ProductPage({ params }: { params: { locale: string; slug: string } }) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale: Locale = params.locale;
  const copy = ui[locale];
  const product = await getProductBySlug(params.slug);

  if (!product) {
    notFound();
  }

  const localized = getLocalizedProduct(product, locale);

  return (
    <div>
      <div className="mx-auto max-w-[1280px] px-5 pt-8 md:px-[80px]">
        <div className="mb-8 flex items-center gap-2 text-[13px] uppercase tracking-[2px] text-muted">
          <Link href={getLocalizedPath(locale)} className="hover:text-primary">{copy.home}</Link>
          <ChevronRight className="h-4 w-4" />
          <Link href={getLocalizedPath(locale, '/catalog')} className="hover:text-primary">{copy.catalog}</Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-primary">{localized.name}</span>
        </div>
      </div>
      <ProductDetails locale={locale} product={localized} />
    </div>
  );
}
