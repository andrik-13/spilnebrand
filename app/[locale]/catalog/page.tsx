import Link from 'next/link';
import { ProductCard } from '@/components/product/ProductCard';
import { categoryOrder, getLocalizedPath, type Category, type Locale, ui } from '@/lib/i18n';
import { getLocalizedProduct, products } from '@/lib/products';

export default function CatalogPage({ params, searchParams }: { params: { locale: Locale }; searchParams: { category?: string } }) {
  const locale = params.locale;
  const copy = ui[locale];
  const activeFilter = (searchParams.category as Category | 'all' | undefined) || 'all';
  const filters = [{ value: 'all', label: copy.allFilter }, ...categoryOrder.map((category) => ({ value: category, label: copy[category] }))];

  const filteredProducts = (activeFilter === 'all' ? products : products.filter((product) => product.category === activeFilter)).map((product) => getLocalizedProduct(product, locale));

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-[80px] md:py-[60px]">
        <div className="mb-12 text-center md:mb-14">
          <h2 className="mb-3">{copy.breadcrumbsCollection}</h2>
          <p className="mx-auto max-w-2xl text-muted">
            {locale === 'ua' ? 'Лаконічні речі для щоденних образів, які легко поєднуються між собою.' : 'Thoughtful essentials designed to mix easily into an everyday wardrobe.'}
          </p>
        </div>

        <div className="mb-10 flex justify-center md:mb-12">
          <div className="flex gap-6 overflow-x-auto border-b border-accent pb-2 scrollbar-hide md:gap-8">
            {filters.map((filter) => {
              const isActive = filter.value === activeFilter;
              const href = filter.value === 'all' ? getLocalizedPath(locale, '/catalog') : getLocalizedPath(locale, `/catalog?category=${filter.value}`);

              return (
                <Link key={filter.value} href={href} className={['whitespace-nowrap text-[13px] uppercase tracking-[2px] transition-colors', isActive ? 'text-primary' : 'text-muted hover:text-primary'].join(' ')}>
                  {filter.label}
                </Link>
              );
            })}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-3 md:gap-6">
            {filteredProducts.map((product) => <ProductCard key={product.id} product={product} locale={locale} />)}
          </div>
        ) : (
          <div className="py-20 text-center text-muted">{copy.noProducts}</div>
        )}
      </div>
    </div>
  );
}
