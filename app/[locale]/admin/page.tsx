import Link from 'next/link';
import { getCurrencyLabel, type Locale, ui } from '@/lib/i18n';
import { createSupabaseAdminClient } from '@/lib/supabase-server';
import { AdminDataAccessError, listAdminProducts, type AdminProductRecord } from '@/lib/admin-products';

export default async function AdminPage({ params }: { params: { locale: Locale } }) {
  const locale = params.locale;
  const copy = ui[locale];
  const hasLiveDatabase = Boolean(createSupabaseAdminClient());

  let items: AdminProductRecord[] = [];
  let loadError: string | null = null;

  try {
    items = await listAdminProducts();
  } catch (error) {
    items = [];
    loadError = error instanceof AdminDataAccessError
      ? error.message
      : error instanceof Error
        ? error.message
        : 'Failed to load admin products.';
  }

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-[80px]">
      <p className="mb-2 text-[13px] uppercase tracking-[2px] text-muted">{copy.adminTitle}</p>
      <h2 className="mb-4 font-sans text-4xl tracking-[-0.02em]">{copy.catalogAdmin}</h2>
      <p className="mb-8 max-w-2xl text-muted">{copy.adminText}</p>

      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href={`/${locale}/admin/products/new`}
          className="inline-flex items-center justify-center bg-dark px-6 py-3 text-[13px] uppercase tracking-[2px] text-white transition-colors hover:bg-primary"
        >
          Add product
        </Link>

        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center border border-dark px-6 py-3 text-[13px] uppercase tracking-[2px] text-dark transition-colors hover:bg-dark hover:text-white"
          >
            Logout
          </button>
        </form>
      </div>

      <p className="mb-4 text-sm text-muted">
        Source: {hasLiveDatabase ? 'Supabase' : 'seed fallback'}
      </p>

      {loadError ? (
        <p className="mb-8 rounded border border-[#c77f6f] bg-[#f7e5df] px-4 py-3 text-sm text-[#9b3d2f]">
          {loadError}
        </p>
      ) : null}

      <div className="space-y-4">
        {items.map((product) => (
          <div key={product.id} className="flex flex-col gap-4 border border-accent bg-white/40 p-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-[13px] uppercase tracking-[2px] text-muted">{product.category}</div>
              <div className="mt-2 text-xl font-sans">{product.translations[locale].name}</div>
              <div className="mt-1 text-muted">{product.slug}</div>
              <div className="mt-1 text-sm text-muted">
                {getCurrencyLabel(product.price, locale)} / {product.isActive ? copy.productVisible : copy.productHidden}
              </div>
            </div>

            <Link
              href={`/${locale}/admin/products/${product.id}`}
              className="inline-flex items-center justify-center border border-dark px-5 py-3 text-[13px] uppercase tracking-[2px] text-dark transition-colors hover:bg-dark hover:text-white"
            >
              Edit
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
