import { Link, useParams } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { Button } from '../components/Button';
import { ProductCard } from '../components/ProductCard';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getLocalizedProduct } from '../data/products';
import { useCatalogProducts } from '../lib/catalog';
import { getLocalizedPath, getLocaleFromParam, ui } from '../lib/i18n';
import { usePageMeta } from '../lib/seo';

const lookbookImages = [
  'https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1551232864-3f0890e580d9?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=1200&q=80'
];

export function Home() {
  const { locale: localeParam } = useParams();
  const locale = getLocaleFromParam(localeParam);
  const copy = ui[locale];
  const { items } = useCatalogProducts();
  const newCollection = items
    .filter((product) => product.isNew)
    .slice(0, 4)
    .map((product) => getLocalizedProduct(product, locale));

  usePageMeta(
    locale === 'ua' ? "SPIL'NE - Базовий жіночий одяг" : "SPIL'NE - Essential womenswear",
    locale === 'ua'
      ? "Базовий жіночий одяг SPIL'NE: футболки, штани та сети в спокійній натуральній палітрі."
      : "SPIL'NE essentials: tees, trousers, and matching sets in a calm natural palette."
  );

  return (
    <div>
      <section className="relative min-h-[88vh] overflow-hidden">
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1400&q=80"
            alt="SPIL'NE hero"
            className="h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,24,22,0.10),rgba(26,24,22,0.58))]" />
        </div>

        <div className="relative mx-auto flex min-h-[88vh] max-w-[1440px] items-end px-5 pb-20 md:px-[80px] md:pb-24">
          <div className="max-w-2xl text-white">
            <p className="mb-4 text-[13px] uppercase tracking-[2px] text-white/80">{copy.brand}</p>
            <h1 className="mb-5 max-w-xl text-white">{copy.heroTitle}</h1>
            <p className="mb-8 max-w-lg text-white/85">{copy.heroSubtitle}</p>
            <Link to={getLocalizedPath(locale, '/catalog')}>
              <Button variant="secondary-light">{copy.viewCollection}</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-[80px] md:py-[100px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-12 flex flex-col gap-3 md:mb-16 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="mb-2">{copy.newCollection}</h2>
              <p className="text-[13px] uppercase tracking-[2px] text-[#6B6560]">{copy.seasonLabel}</p>
            </div>
            <Link
              to={getLocalizedPath(locale, '/catalog')}
              className="inline-flex items-center gap-2 text-[13px] uppercase tracking-[2px] text-[#6B6560] transition-colors hover:text-[#1A1816]"
            >
              {copy.allProducts}
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-4 md:grid-cols-4 md:gap-6">
            {newCollection.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      <section id="about" className="bg-[#F0EAE0] px-5 py-20 md:px-[80px] md:py-[100px]">
        <div className="mx-auto grid max-w-[1280px] gap-10 md:grid-cols-[1.05fr_0.95fr] md:items-center md:gap-16">
          <div className="aspect-[4/5] overflow-hidden">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1506629905607-d9b1a5f4d3f0?auto=format&fit=crop&w=1200&q=80"
              alt={copy.about}
              className="h-full w-full object-cover"
            />
          </div>
          <div>
            <p className="mb-4 text-[13px] uppercase tracking-[2px] text-[#6B6560]">{copy.aboutEyebrow}</p>
            <h2 className="mb-6">{copy.aboutTitle}</h2>
            <p className="mb-8 max-w-xl text-[#6B6560]">{copy.aboutText}</p>
            <Link to={getLocalizedPath(locale, '/catalog')}>
              <Button variant="secondary">{copy.aboutCta}</Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="px-5 py-20 md:px-[80px] md:py-[100px]">
        <div className="mx-auto max-w-[1280px]">
          <div className="mb-10 max-w-xl">
            <p className="mb-4 text-[13px] uppercase tracking-[2px] text-[#6B6560]">{copy.lookbookLabel}</p>
            <h2 className="mb-4">{copy.lookbookTitle}</h2>
            <p className="text-[#6B6560]">{copy.lookbookSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-5 md:gap-5">
            {lookbookImages.map((image) => (
              <div key={image} className="aspect-[4/5] overflow-hidden bg-[#F0EAE0] md:aspect-[3/4]">
                <ImageWithFallback src={image} alt={copy.galleryAlt} className="h-full w-full object-cover" />
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

