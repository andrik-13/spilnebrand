import { useMemo } from 'react';
import { Link, useParams, useSearchParams } from 'react-router';
import { ChevronRight } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';
import { getLocalizedProduct } from '../data/products';
import { useCatalogProducts } from '../lib/catalog';
import { categoryOrder, getLocalizedPath, getLocaleFromParam, type Category, ui } from '../lib/i18n';
import { usePageMeta } from '../lib/seo';

export function Catalog() {
  const { locale: localeParam } = useParams();
  const locale = getLocaleFromParam(localeParam);
  const copy = ui[locale];
  const { items } = useCatalogProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const activeFilter = (searchParams.get('category') as Category | 'all' | null) || 'all';

  const filters = [
    { value: 'all', label: copy.allFilter },
    ...categoryOrder.map((category) => ({ value: category, label: copy[category] })),
  ];

  const filteredProducts = useMemo(() => {
    const list = activeFilter === 'all'
      ? items
      : items.filter((product) => product.category === activeFilter);

    return list.map((product) => getLocalizedProduct(product, locale));
  }, [activeFilter, items, locale]);

  usePageMeta(
    locale === 'ua' ? `Каталог | SPIL'NE` : `Catalog | SPIL'NE`,
    locale === 'ua'
      ? "Каталог базового жіночого одягу SPIL'NE: футболки, штани та готові сети."
      : "Browse SPIL'NE essentials: tees, trousers, and matching sets."
  );

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-[80px] md:py-[60px]">
        <div className="mb-8 flex items-center gap-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
          <Link to={getLocalizedPath(locale)} className="transition-colors hover:text-[#1A1816]">
            {copy.home}
          </Link>
          <ChevronRight className="h-4 w-4" />
          <span className="text-[#1A1816]">{copy.catalog}</span>
        </div>

        <div className="mb-12 text-center md:mb-14">
          <h2 className="mb-3">{copy.breadcrumbsCollection}</h2>
          <p className="mx-auto max-w-2xl text-[#6B6560]">
            {locale === 'ua'
              ? 'Лаконічні речі для щоденних образів, які легко поєднуються між собою.'
              : 'Thoughtful essentials designed to mix easily into an everyday wardrobe.'}
          </p>
        </div>

        <div className="mb-10 flex justify-center md:mb-12">
          <div className="flex gap-6 overflow-x-auto border-b border-[#C4B5A0] pb-2 scrollbar-hide md:gap-8">
            {filters.map((filter) => {
              const isActive = filter.value === activeFilter;
              return (
                <button
                  key={filter.value}
                  type="button"
                  onClick={() => {
                    if (filter.value === 'all') {
                      setSearchParams({});
                    } else {
                      setSearchParams({ category: filter.value });
                    }
                  }}
                  className={[
                    'whitespace-nowrap text-[13px] uppercase tracking-[2px] transition-colors',
                    isActive ? 'text-[#1A1816]' : 'text-[#6B6560] hover:text-[#1A1816]',
                  ].join(' ')}
                >
                  {filter.label}
                </button>
              );
            })}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="py-20 text-center text-[#6B6560]">{copy.noProducts}</div>
        )}
      </div>
    </div>
  );
}


