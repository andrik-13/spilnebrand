import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { ProductDetails } from '@/components/product/ProductDetails';
import { getLocalizedPath, type Locale, ui } from '@/lib/i18n';
import { getLocalizedProduct, getProductBySlug, products } from '@/lib/products';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';

export function generateStaticParams() {
  return products.flatMap((product) => [
    { locale: 'ua', slug: product.slug },
    { locale: 'en', slug: product.slug },
  ]);
}

export function generateMetadata({ params }: { params: { locale: Locale; slug: string } }): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) return {};

  const localized = getLocalizedProduct(product, params.locale);
  return {
    title: `${localized.name} | SPIL'NE`,
    description: localized.description,
    openGraph: { images: [localized.images[0]] }
  };
}

export default function ProductPage({ params }: { params: { locale: Locale; slug: string } }) {
  const locale = params.locale;
  const copy = ui[locale];
  const product = getProductBySlug(params.slug);

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
