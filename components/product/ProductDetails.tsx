'use client';

import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/Button';
import { ProductAccordion } from '@/components/product/ProductAccordion';
import { SizeSelector } from '@/components/ui/SizeSelector';
import { buildTelegramOrderLink } from '@/lib/config';
import { getCategoryLabel, getColorLabel, getCurrencyLabel, type Locale, ui } from '@/lib/i18n';
import type { LocalizedProduct } from '@/lib/products';

interface ProductDetailsProps {
  locale: Locale;
  product: LocalizedProduct;
}

function findColorImageIndex(images: string[], color: string) {
  const aliases: Record<string, string[]> = {
    black: ['black'],
    beige: ['beige'],
    gray: ['gray', 'graphite'],
    white: ['white'],
    red: ['red']
  };

  const terms = aliases[color] ?? [color];
  const index = images.findIndex((image) => {
    const tokens = image.toLowerCase().split(/[\\/._\-\s]+/).filter(Boolean);
    return terms.some((term) => tokens.includes(term));
  });
  return index >= 0 ? index : 0;
}

export function ProductDetails({ locale, product }: ProductDetailsProps) {
  const copy = ui[locale];
  const hasImages = product.images.length > 0;
  const hasMultipleImages = product.images.length > 1;
  const initialColor = product.colors[0] ?? null;
  const initialImage = hasImages && initialColor ? findColorImageIndex(product.images, initialColor) : 0;
  const [selectedImage, setSelectedImage] = useState(initialImage);
  const [selectedSize, setSelectedSize] = useState<string | null>(product.sizes[0] ?? null);
  const [selectedColor, setSelectedColor] = useState<string | null>(initialColor);

  useEffect(() => {
    const nextColor = product.colors[0] ?? null;
    setSelectedImage(hasImages && nextColor ? findColorImageIndex(product.images, nextColor) : 0);
    setSelectedSize(product.sizes[0] ?? null);
    setSelectedColor(nextColor);
  }, [hasImages, product]);

  const accordionItems = useMemo(() => {
    const compositionAndCare = [product.composition, product.care].filter(Boolean).join('\n\n');
    return compositionAndCare
      ? [{ title: copy.compositionAndCare, content: compositionAndCare }]
      : [];
  }, [copy.compositionAndCare, product.care, product.composition]);

  const handleOrder = () => {
    window.open(
      buildTelegramOrderLink(product.slug, selectedSize || undefined, selectedColor || undefined),
      '_blank',
      'noopener,noreferrer'
    );
  };

  const colorButtons = (
    <div className="flex flex-wrap gap-2">
      {product.colors.map((color) => (
        <button
          key={color}
          type="button"
          onClick={() => {
            setSelectedColor(color);
            setSelectedImage(hasImages ? findColorImageIndex(product.images, color) : 0);
          }}
          className={[
            'cursor-pointer border px-3 py-2 text-[13px] uppercase tracking-[2px] transition-colors',
            selectedColor === color
              ? 'border-dark bg-dark text-white'
              : 'border-accent text-muted hover:border-dark hover:text-primary',
          ].join(' ')}
        >
          {getColorLabel(locale, color)}
        </button>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1280px] px-5 py-8 md:px-[80px] md:py-[60px]">
        <div className="hidden gap-12 md:grid md:grid-cols-[60%_40%]">
          <div>
            <div className="relative mb-3 aspect-[3/4] overflow-hidden bg-surface">
              {hasImages ? (
                <Image src={product.images[selectedImage]} alt={product.name} fill sizes="60vw" className="object-cover" priority unoptimized />
              ) : (
                <div className="flex h-full items-center justify-center px-8 text-center text-[13px] uppercase tracking-[2px] text-muted">
                  {copy.imageComingSoon}
                </div>
              )}
            </div>
            {hasMultipleImages ? (
              <div className="grid grid-cols-3 gap-3">
                {product.images.map((image, index) => (
                  <button
                    key={image}
                    type="button"
                    onClick={() => setSelectedImage(index)}
                    className={[
                      'relative aspect-[3/4] cursor-pointer overflow-hidden bg-surface',
                      selectedImage === index ? 'ring-2 ring-primary' : '',
                    ].join(' ')}
                  >
                    <Image src={image} alt={`${product.name} ${index + 1}`} fill sizes="20vw" className="object-cover" unoptimized />
                  </button>
                ))}
              </div>
            ) : null}
          </div>

          <div className="self-start md:sticky md:top-24">
            <p className="mb-2 text-[13px] uppercase tracking-[2px] text-muted">{getCategoryLabel(locale, product.category)}</p>
            <h2 className="mb-4">{product.name}</h2>
            <h3 className="mb-5">{getCurrencyLabel(product.price, locale)}</h3>
            <p className="mb-8 text-muted">{product.description}</p>

            <div className="my-6 h-px bg-accent" />

            <div className="mb-6">
              <p className="mb-3 text-[13px] uppercase tracking-[2px] text-muted">{copy.colors}</p>
              {colorButtons}
            </div>

            <div className="mb-8">
              <p className="mb-3 text-[13px] uppercase tracking-[2px] text-muted">{copy.size}</p>
              <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
            </div>

            <Button variant="primary" fullWidth onClick={handleOrder}>
              {copy.orderTelegram}
            </Button>
            <p className="mt-3 text-center text-[13px] uppercase tracking-[2px] text-muted">{copy.orderHint}</p>

            {accordionItems.length > 0 ? (
              <>
                <div className="my-10 h-px bg-accent" />
                <ProductAccordion items={accordionItems} />
              </>
            ) : null}
          </div>
        </div>

        <div className="md:hidden">
          <div className="relative mb-6 aspect-[3/4] overflow-hidden bg-surface">
            {hasImages ? (
              <Image src={product.images[selectedImage]} alt={product.name} fill sizes="100vw" className="object-cover" priority unoptimized />
            ) : (
              <div className="flex h-full items-center justify-center px-8 text-center text-[13px] uppercase tracking-[2px] text-muted">
                {copy.imageComingSoon}
              </div>
            )}
          </div>

          {hasMultipleImages ? (
            <div className="mb-6 flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((image, index) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => setSelectedImage(index)}
                  className={[
                    'relative h-24 w-20 cursor-pointer flex-shrink-0 overflow-hidden bg-surface',
                    selectedImage === index ? 'ring-2 ring-primary' : '',
                  ].join(' ')}
                >
                  <Image src={image} alt={`${product.name} ${index + 1}`} fill sizes="80px" className="object-cover" unoptimized />
                </button>
              ))}
            </div>
          ) : null}

          <div className="pb-28">
            <p className="mb-2 text-[13px] uppercase tracking-[2px] text-muted">{getCategoryLabel(locale, product.category)}</p>
            <h2 className="mb-4">{product.name}</h2>
            <h3 className="mb-5">{getCurrencyLabel(product.price, locale)}</h3>
            <p className="mb-8 text-muted">{product.description}</p>

            <div className="my-6 h-px bg-accent" />

            <div className="mb-6">
              <p className="mb-3 text-[13px] uppercase tracking-[2px] text-muted">{copy.colors}</p>
              {colorButtons}
            </div>

            <div className="mb-8">
              <p className="mb-3 text-[13px] uppercase tracking-[2px] text-muted">{copy.size}</p>
              <SizeSelector sizes={product.sizes} selectedSize={selectedSize} onSelectSize={setSelectedSize} />
            </div>

            {accordionItems.length > 0 ? <ProductAccordion items={accordionItems} /> : null}
          </div>

          <div className="fixed inset-x-0 bottom-0 border-t border-accent bg-background p-5">
            <Button variant="primary" fullWidth onClick={handleOrder}>
              {copy.orderTelegram}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
