import { notFound } from 'next/navigation';
import { isLocale, ui } from '@/lib/i18n';
import { listProducts } from '@/lib/catalog-repository';

export default async function AdminPage({ params }: { params: { locale: string } }) {
  if (!isLocale(params.locale)) {
    notFound();
  }

  const locale = params.locale;
  const copy = ui[locale];
  const items = await listProducts();

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-12 md:px-[80px]">
      <p className="mb-2 text-[13px] uppercase tracking-[2px] text-muted">{copy.adminTitle}</p>
      <h2 className="mb-4">Catalog source preview</h2>
      <p className="mb-8 max-w-2xl text-muted">{copy.adminText}</p>

      <div className="mb-6 flex flex-wrap gap-3">
        <form action="/api/admin/logout" method="post">
          <button
            type="submit"
            className="inline-flex cursor-pointer items-center justify-center border border-dark px-6 py-3 text-[13px] uppercase tracking-[2px] text-dark transition-colors hover:bg-dark hover:text-white"
          >
            Logout
          </button>
        </form>
      </div>

      <div className="space-y-4">
        {items.map((product) => (
          <div key={product.id} className="border border-accent bg-white/40 p-4">
            <div className="text-[13px] uppercase tracking-[2px] text-muted">{product.category}</div>
            <div className="mt-2 text-xl">{product.translations[locale].name}</div>
            <div className="mt-1 text-muted">{product.slug}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
