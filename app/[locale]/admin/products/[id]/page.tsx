import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ProductForm } from '@/components/admin/ProductForm';
import { getAdminProductById, mapProductToInput } from '@/lib/admin-products';
import { isLocale, type Locale } from '@/lib/i18n';

export default async function EditAdminProductPage({
  params,
  searchParams,
}: {
  params: { locale: string; id: string };
  searchParams: { error?: string; saved?: string };
}) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale: Locale = params.locale;
  const product = await getAdminProductById(params.id);

  if (!product) {
    notFound();
  }

  return (
    <div className="mx-auto max-w-[1080px] px-5 py-12 md:px-[80px]">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="mb-2 text-[13px] uppercase tracking-[2px] text-muted">Admin</p>
          <h2>Edit product</h2>
        </div>
        <Link href={`/${locale}/admin`} className="text-[13px] uppercase tracking-[2px] text-muted hover:text-primary">
          Back to admin
        </Link>
      </div>

      <ProductForm
        locale={locale}
        mode="edit"
        submitLabel="Update product"
        action={`/api/admin/products/${product.id}`}
        product={mapProductToInput(product)}
        productId={product.id}
        error={searchParams.error}
        success={searchParams.saved === '1' ? 'Product updated.' : undefined}
      />
    </div>
  );
}
