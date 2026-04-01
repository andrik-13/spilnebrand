import { categoryOrder, type ColorKey, type Locale, locales, ui } from '@/lib/i18n';
import type { AdminProductInput } from '@/lib/admin-products';

interface ProductFormProps {
  locale: Locale;
  mode: 'create' | 'edit';
  submitLabel: string;
  action: string;
  product: AdminProductInput;
  productId?: string;
  error?: string;
  success?: string;
}

const sizeOptions = ['S', 'M'] as const;
const colorOptions: ColorKey[] = ['black', 'beige', 'gray', 'white'];

export function ProductForm({
  locale,
  mode,
  submitLabel,
  action,
  product,
  productId,
  error,
  success,
}: ProductFormProps) {
  const copy = ui[locale];

  return (
    <form action={action} method="post" className="space-y-8">
      <input type="hidden" name="locale" value={locale} />
      {productId ? <input type="hidden" name="id" value={productId} /> : null}

      {error ? <p className="rounded border border-[#c77f6f] bg-[#f7e5df] px-4 py-3 text-sm text-[#9b3d2f]">{error}</p> : null}
      {success ? <p className="rounded border border-[#98b49b] bg-[#edf5ee] px-4 py-3 text-sm text-[#37583a]">{success}</p> : null}

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Slug</span>
          <input
            type="text"
            name="slug"
            defaultValue={product.slug}
            className="w-full border border-accent bg-white px-4 py-3 outline-none"
            required
          />
        </label>

        <label className="block">
          <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Price</span>
          <input
            type="number"
            name="price"
            min="0"
            step="1"
            defaultValue={product.price}
            className="w-full border border-accent bg-white px-4 py-3 outline-none"
            required
          />
        </label>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Category</span>
          <select
            name="category"
            defaultValue={product.category}
            className="w-full border border-accent bg-white px-4 py-3 outline-none"
          >
            {categoryOrder.map((category) => (
              <option key={category} value={category}>
                {copy[category]}
              </option>
            ))}
          </select>
        </label>

        <div>
          <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Sizes</span>
          <div className="flex gap-4">
            {sizeOptions.map((size) => (
              <label key={size} className="inline-flex items-center gap-2 text-sm text-primary">
                <input type="checkbox" name="sizes" value={size} defaultChecked={product.sizes.includes(size)} />
                <span>{size}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      <div>
        <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">{copy.colors}</span>
        <div className="flex flex-wrap gap-4">
          {colorOptions.map((color) => (
            <label key={color} className="inline-flex items-center gap-2 text-sm text-primary">
              <input type="checkbox" name="colors" value={color} defaultChecked={product.colors.includes(color)} />
              <span>{ui[locale][color]}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="inline-flex items-center gap-2 text-sm text-primary">
          <input type="checkbox" name="isNew" defaultChecked={product.isNew} />
          <span>Show as new</span>
        </label>
        <label className="inline-flex items-center gap-2 text-sm text-primary">
          <input type="checkbox" name="isActive" defaultChecked={product.isActive} />
          <span>Visible on site</span>
        </label>
      </div>

      {locales.map((entryLocale) => (
        <section key={entryLocale} className="space-y-4 border border-accent bg-white/50 p-5">
          <h3 className="text-[13px] uppercase tracking-[2px] text-muted">{entryLocale.toUpperCase()} content</h3>

          <label className="block">
            <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Name</span>
            <input
              type="text"
              name={`name_${entryLocale}`}
              defaultValue={product.translations[entryLocale].name}
              className="w-full border border-accent bg-white px-4 py-3 outline-none"
              required
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Description</span>
            <textarea
              name={`description_${entryLocale}`}
              defaultValue={product.translations[entryLocale].description}
              rows={4}
              className="w-full border border-accent bg-white px-4 py-3 outline-none"
              required
            />
          </label>

          <div className="grid gap-4 md:grid-cols-3">
            <label className="block">
              <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Composition</span>
              <textarea
                name={`composition_${entryLocale}`}
                defaultValue={product.translations[entryLocale].composition}
                rows={3}
                className="w-full border border-accent bg-white px-4 py-3 outline-none"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Care</span>
              <textarea
                name={`care_${entryLocale}`}
                defaultValue={product.translations[entryLocale].care}
                rows={3}
                className="w-full border border-accent bg-white px-4 py-3 outline-none"
                required
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Delivery</span>
              <textarea
                name={`delivery_${entryLocale}`}
                defaultValue={product.translations[entryLocale].delivery}
                rows={3}
                className="w-full border border-accent bg-white px-4 py-3 outline-none"
                required
              />
            </label>
          </div>
        </section>
      ))}

      <label className="block">
        <span className="mb-2 block text-[13px] uppercase tracking-[2px] text-muted">Image URLs</span>
        <textarea
          name="images"
          defaultValue={product.images.join('\n')}
          rows={6}
          className="w-full border border-accent bg-white px-4 py-3 font-mono text-sm outline-none"
          placeholder="/catalog/tee/white-main.jpg"
        />
        <span className="mt-2 block text-sm text-muted">One URL per line. This is the foundation step before adding file uploads to Supabase Storage.</span>
      </label>

      <div className="flex flex-wrap gap-3">
        <button
          type="submit"
          className="inline-flex cursor-pointer items-center justify-center bg-dark px-8 py-4 text-[14px] uppercase tracking-[1.5px] text-white transition-colors hover:bg-primary"
        >
          {submitLabel}
        </button>

        {mode === 'edit' ? (
          <a
            href={`/${locale}/admin`}
            className="inline-flex items-center justify-center border border-dark px-8 py-4 text-[14px] uppercase tracking-[1.5px] text-dark transition-colors hover:bg-dark hover:text-white"
          >
            Back to admin
          </a>
        ) : null}
      </div>
    </form>
  );
}
