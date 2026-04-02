import Image from 'next/image';
import Link from 'next/link';
import type { LocalizedProduct } from '@/lib/products';
import { getCurrencyLabel, type Locale, ui } from '@/lib/i18n';

interface ProductCardProps {
  product: LocalizedProduct;
  locale: Locale;
}

export function ProductCard({ product, locale }: ProductCardProps) {
  const primaryImage = product.images[0];
  const copy = ui[locale];

  return (
    <Link href={`/${locale}/catalog/${product.slug}`} className="group block">
      <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-surface">
        {primaryImage ? (
          <Image
            src={primaryImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 50vw, 33vw"
            unoptimized
            className="object-cover transition duration-300 group-hover:scale-[1.02] group-hover:brightness-95"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-[13px] uppercase tracking-[2px] text-muted">
            {copy.imageComingSoon}
          </div>
        )}
      </div>

      <h3 className="mb-2">{product.name}</h3>
      <p className="mb-3 text-primary">{getCurrencyLabel(product.price, locale)}</p>

      <div className="flex gap-2">
        {product.sizes.map((size) => (
          <div
            key={size}
            className="flex h-8 w-8 items-center justify-center border border-accent text-[13px] tracking-[2px] text-muted"
          >
            {size}
          </div>
        ))}
      </div>
    </Link>
  );
}
