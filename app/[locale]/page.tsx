import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { notFound } from 'next/navigation';
import { ProductCard } from '@/components/product/ProductCard';
import { Button } from '@/components/ui/Button';
import { listProducts } from '@/lib/catalog-repository';
import { getLocalizedPath, isLocale, type Locale, ui } from '@/lib/i18n';
import { getLocalizedProduct } from '@/lib/products';

const lookbookImages = [
  '/brand/hanger-red.webp',
  '/catalog/tee/white-main.webp',
  '/catalog/trousers/black-editorial.webp',
  '/catalog/zip-set/beige-main.webp',
  '/brand/package.webp',
];

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale: Locale = params.locale;
  const copy = ui[locale];
  const newCollection = (await listProducts({ isNew: true, limit: 4 })).map((product) => getLocalizedProduct(product, locale));

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <Image src="/catalog/zip-set/beige-main.webp" alt="SPIL'NE hero" fill priority sizes="100vw" className="object-cover" unoptimized />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,24,22,0.14),rgba(26,24,22,0.58))]" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-[1440px] items-end px-5 pb-20 md:px-[80px] md:pb-24">
          <div className="max-w-2xl text-white">
            <p className="mb-4 text-[13px] uppercase tracking-[2px] text-white/80">{copy.brand}</p>
            <h1 className="mb-5 max-w-xl text-white">{copy.heroTitle}</h1>
            <p className="mb-8 max-w-lg text-white/85">{copy.heroSubtitle}</p>
            <Link href={getLocalizedPath(locale, '/catalog')}><Button variant="secondaryLight">{copy.viewCollection}</Button></Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-[80px] md:py-[100px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 flex flex-col gap-3 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-2">{copy.newCollection}</h2>
              <p className="text-[13px] uppercase tracking-[2px] text-muted">{copy.seasonLabel}</p>
            </div>
            <Link href={getLocalizedPath(locale, '/catalog')} className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[2px] text-muted hover:text-primary">
              {copy.allProducts}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {newCollection.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}
          </div>
        </div>
      </section>

      <section id="about" className="bg-surface px-5 py-20 md:px-[80px] md:py-[100px]">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-16">
          <div className="relative aspect-[4/5] overflow-hidden">
            <Image src="/catalog/tee/white-main.webp" alt={copy.about} fill sizes="50vw" className="object-cover" unoptimized />
          </div>
          <div>
            <p className="mb-4 text-[13px] uppercase tracking-[2px] text-muted">{copy.aboutEyebrow}</p>
            <h2 className="mb-6">{copy.aboutTitle}</h2>
            <p className="mb-8 max-w-xl text-muted">{copy.aboutText}</p>
            <Link href={getLocalizedPath(locale, '/catalog')}><Button variant="secondary">{copy.aboutCta}</Button></Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-[80px] md:py-[100px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 max-w-xl">
            <p className="mb-4 text-[13px] uppercase tracking-[2px] text-muted">{copy.lookbookLabel}</p>
            <h2 className="mb-4">{copy.lookbookTitle}</h2>
            <p className="text-muted">{copy.lookbookSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
            {lookbookImages.map((image) => (
              <div key={image} className="relative aspect-[4/5] overflow-hidden bg-surface md:aspect-[3/4]">
                <Image src={image} alt={copy.galleryAlt} fill sizes="20vw" className="object-cover" unoptimized />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
