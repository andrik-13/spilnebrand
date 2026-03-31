import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useParams } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { Button } from '../components/Button';
import { ProductAccordion } from '../components/ProductAccordion';
import { SizeSelector } from '../components/SizeSelector';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { getLocalizedProduct } from '../data/products';
import { useCatalogProducts } from '../lib/catalog';
import { buildTelegramOrderLink } from '../lib/config';
import {
  getCategoryLabel,
  getColorLabel,
  getCurrencyLabel,
  getLocalizedPath,
  getLocaleFromParam,
  ui,
} from '../lib/i18n';
import { usePageMeta } from '../lib/seo';

function findColorImageIndex(images: string[], color: string) {
  const aliases: Record<string, string[]> = {
    black: ['black'],
    beige: ['beige'],
    gray: ['gray', 'graphite'],
    white: ['white'],
  };

  const terms = aliases[color] ?? [color];
  const index = images.findIndex((image) => terms.some((term) => image.toLowerCase().includes(term)));

  return index >= 0 ? index : 0;
}

export function Product() {
  const { slug, locale: localeParam } = useParams<{ slug: string; locale: string }>();
  const locale = getLocaleFromParam(localeParam);
  const copy = ui[locale];
  const { items } = useCatalogProducts();
  const productRecord = items.find((item) => item.slug === slug);
  const product = productRecord ? getLocalizedProduct(productRecord, locale) : null;
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedSize, setSelectedSize] = useState<string | null>(product?.sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(product?.colors[0] ?? null);

  useEffect(() => {
    setSelectedImage(0);
    setSelectedSize(product?.sizes[0] ?? null);
    setSelectedColor(product?.colors[0] ?? null);
  }, [product?.id]);

  usePageMeta(product ? `${product.name} | SPIL'NE` : `SPIL'NE`, product?.description);

  const accordionItems = useMemo(() => {
    if (!product) {
      return [];
    }

    return [
      {
        title: copy.compositionAndCare,
        content: `${product.composition}\n\n${product.care}`,
      },
      {
        title: copy.relatedDelivery,
        content: product.delivery,
      },
    ];
  }, [copy.compositionAndCare, copy.relatedDelivery, product]);

  if (!product) {
    return <Navigate to={getLocalizedPath(locale, '/catalog')} replace />;
  }

  const handleOrder = () => {
    const url = buildTelegramOrderLink(
      product.slug,
      selectedSize || undefined,
      selectedColor || undefined
    );
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-[80px] md:py-[60px]">
        <div className="mb-8 flex items-center gap-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
          <Link to={getLocalizedPath(locale)} className="transition-colors hover:text-[#1A1816]">
            {copy.home}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <Link to={getLocalizedPath(locale, '/catalog')} className="transition-colors hover:text-[#1A1816]">
            {copy.catalog}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1A1816]">{product.name}</span>
        </div>

        <div className="hidden gap-12 md:grid md:grid-cols-[60%_40%]">
          <div>
            <div className="mb-3 aspect-[3/4] overflow-hidden bg-[#F0EAE0]">
              <ImageWithFallback src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="grid grid-cols-3 gap-3">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={[
                    'aspect-[3/4] cursor-pointer overflow-hidden bg-[#F0EAE0]',
                    selectedImage === index ? 'ring-2 ring-[#1A1816]' : '',
                  ].join(' ')}
                >
                  <ImageWithFallback src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          <div className="self-start md:sticky md:top-24">
            <p className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">{getCategoryLabel(locale, product.category)}</p>
            <h2 className="mb-4">{product.name}</h2>
            <h3 className="mb-5">{getCurrencyLabel(product.price, locale)}</h3>
            <p className="mb-8 text-[#6B6560]">{product.description}</p>

            <div className="my-6 h-px bg-[#C4B5A0]" />

            <div className="mb-6">
              <p className="mb-3 text-[13px] uppercase tracking-[2px] text-[#6B6560]">{copy.colors}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedImage(findColorImageIndex(product.images, color));
                    }}
                    className={[
                      'cursor-pointer border px-3 py-2 text-[13px] uppercase tracking-[2px] transition-colors',
                      selectedColor === color
                        ? 'border-[#2C2420] bg-[#2C2420] text-white'
                        : 'border-[#C4B5A0] text-[#6B6560] hover:border-[#2C2420] hover:text-[#1A1816]',
                    ].join(' ')}
                  >
                    {getColorLabel(locale, color)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-[13px] uppercase tracking-[2px] text-[#6B6560]">{copy.size}</p>
              <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
            </div>

            <Button variant="primary" fullWidth onClick={handleOrder}>
              {copy.orderTelegram}
            </Button>
            <p className="mt-3 text-center text-[13px] uppercase tracking-[2px] text-[#6B6560]">{copy.orderHint}</p>

            <div className="my-10 h-px bg-[#C4B5A0]" />
            <ProductAccordion items={accordionItems} />
          </div>
        </div>

        <div className="md:hidden">
          <div className="mb-6 aspect-[3/4] overflow-hidden bg-[#F0EAE0]">
            <ImageWithFallback src={product.images[selectedImage]} alt={product.name} className="h-full w-full object-cover" />
          </div>

          <div className="mb-6 flex gap-2 overflow-x-auto scrollbar-hide">
            {product.images.map((image, index) => (
              <button
                key={image}
                type="button"
                onClick={() => setSelectedImage(index)}
                className={[
                  'h-24 w-20 cursor-pointer flex-shrink-0 overflow-hidden bg-[#F0EAE0]',
                  selectedImage === index ? 'ring-2 ring-[#1A1816]' : '',
                ].join(' ')}
              >
                <ImageWithFallback src={image} alt={`${product.name} ${index + 1}`} className="h-full w-full object-cover" />
              </button>
            ))}
          </div>

          <div className="pb-28">
            <p className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">{getCategoryLabel(locale, product.category)}</p>
            <h2 className="mb-4">{product.name}</h2>
            <h3 className="mb-5">{getCurrencyLabel(product.price, locale)}</h3>
            <p className="mb-8 text-[#6B6560]">{product.description}</p>

            <div className="my-6 h-px bg-[#C4B5A0]" />

            <div className="mb-6">
              <p className="mb-3 text-[13px] uppercase tracking-[2px] text-[#6B6560]">{copy.colors}</p>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => {
                      setSelectedColor(color);
                      setSelectedImage(findColorImageIndex(product.images, color));
                    }}
                    className={[
                      'cursor-pointer border px-3 py-2 text-[13px] uppercase tracking-[2px] transition-colors',
                      selectedColor === color
                        ? 'border-[#2C2420] bg-[#2C2420] text-white'
                        : 'border-[#C4B5A0] text-[#6B6560] hover:border-[#2C2420] hover:text-[#1A1816]',
                    ].join(' ')}
                  >
                    {getColorLabel(locale, color)}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-8">
              <p className="mb-3 text-[13px] uppercase tracking-[2px] text-[#6B6560]">{copy.size}</p>
              <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
            </div>

            <ProductAccordion items={accordionItems} />
          </div>

          <div className="fixed inset-x-0 bottom-0 border-t border-[#C4B5A0] bg-[#FAFAF7] p-5">
            <Button variant="primary" fullWidth onClick={handleOrder}>
              {copy.orderTelegram}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
