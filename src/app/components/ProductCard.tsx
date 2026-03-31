import { Link, useParams } from 'react-router';
import type { LocalizedProduct } from '../data/products';
import { getCurrencyLabel, getLocalizedPath, getLocaleFromParam } from '../lib/i18n';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ProductCardProps {
  product: LocalizedProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const { locale: localeParam } = useParams();
  const locale = getLocaleFromParam(localeParam);

  return (
    <Link to={getLocalizedPath(locale, `/catalog/${product.slug}`)} className="group block">
      <div className="relative mb-4 aspect-[4/5] overflow-hidden bg-[#F0EAE0]">
        <ImageWithFallback
          src={product.images[0]}
          alt={product.name}
          className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02] group-hover:brightness-95"
        />
      </div>

      <h3 className="mb-2 text-[24px] leading-tight text-[#1A1816] md:text-[28px]">{product.name}</h3>
      <p className="mb-3 text-[#1A1816]">{getCurrencyLabel(product.price, locale)}</p>

      <div className="flex gap-2">
        {product.sizes.map((size) => (
          <div
            key={size}
            className="flex h-8 w-8 items-center justify-center border border-[#C4B5A0] text-[13px] tracking-[2px] text-[#6B6560]"
          >
            {size}
          </div>
        ))}
      </div>
    </Link>
  );
}
