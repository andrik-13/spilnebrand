import Link from 'next/link';
import { ProductForm } from '@/components/admin/ProductForm';
import { getEmptyAdminProductInput } from '@/lib/admin-products';
import { type Locale } from '@/lib/i18n';

export default function NewAdminProductPage({
  params,
  searchParams,
}: {
  params: { locale: Locale };
  searchParams: { error?: string; saved?: string };
}) {
  const locale = params.locale;

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-12 md:px-[80px]">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-[13px] uppercase tracking-[2px] text-muted">Admin</p>
          <h2>Create product</h2>
        </div>
        <Link href={`/${locale}/admin`} className="text-[13px] uppercase tracking-[2px] text-muted hover:text-primary">
          Back to admin
        </Link>
      </div>

      <ProductForm
        locale={locale}
        mode="create"
        submitLabel="Save product"
        action="/api/admin/products"
        product={getEmptyAdminProductInput()}
        error={searchParams.error}
        success={searchParams.saved === '1' ? 'Product created.' : undefined}
      />
    </div>
  );
}
