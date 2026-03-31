import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router';
import type { Product } from '../data/products';
import {
  importCatalogProducts,
  readCatalogProducts,
  useCatalogProducts,
} from '../lib/catalog';
import { getLocaleFromParam } from '../lib/i18n';
import { usePageMeta } from '../lib/seo';

function cloneProduct(product: Product): Product {
  return JSON.parse(JSON.stringify(product)) as Product;
}

export function Admin() {
  const { locale: localeParam } = useParams();
  const locale = getLocaleFromParam(localeParam);
  const { items, updateOne, reset } = useCatalogProducts();
  const [selectedId, setSelectedId] = useState(items[0]?.id ?? '');
  const [message, setMessage] = useState<string>('');

  const selectedProduct = useMemo(
    () => items.find((item) => item.id === selectedId) ?? items[0] ?? null,
    [items, selectedId]
  );

  const [draft, setDraft] = useState<Product | null>(
    selectedProduct ? cloneProduct(selectedProduct) : null
  );

  usePageMeta(`Admin | SPIL'NE`, 'Local catalog editing.');

  useEffect(() => {
    if (!items.some((item) => item.id === selectedId)) {
      setSelectedId(items[0]?.id ?? '');
    }
  }, [items, selectedId]);

  useEffect(() => {
    if (selectedProduct) {
      setDraft(cloneProduct(selectedProduct));
    }
  }, [selectedProduct]);

  if (!draft) {
    return <div className="px-5 py-12">No products available.</div>;
  }

  const handleExport = () => {
    const raw = JSON.stringify(readCatalogProducts(), null, 2);
    if (typeof navigator !== 'undefined' && navigator.clipboard?.writeText) {
      navigator.clipboard
        .writeText(raw)
        .then(() => {
          setMessage('Catalog JSON copied to clipboard.');
        })
        .catch(() => {
          window.prompt('Copy catalog JSON', raw);
          setMessage('Clipboard was unavailable, opened prompt fallback.');
        });
      return;
    }

    window.prompt('Copy catalog JSON', raw);
    setMessage('Clipboard was unavailable, opened prompt fallback.');
  };

  const handleImport = async () => {
    const raw = window.prompt('Paste catalog JSON');
    if (!raw) {
      return;
    }

    try {
      const parsed = importCatalogProducts(raw);
      setSelectedId(parsed[0]?.id ?? '');
      setMessage('Catalog JSON imported.');
    } catch (error) {
      setMessage(error instanceof Error ? error.message : 'Failed to import catalog JSON.');
    }
  };

  return (
    <div className="mx-auto max-w-[1280px] px-5 py-10 md:px-[80px]">
      <div className="mb-8">
        <p className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">Admin</p>
        <h2 className="mb-3">Local catalog editor</h2>
        <p className="max-w-2xl text-[#6B6560]">
          This is a temporary in-browser editor for the catalog until the real backend is connected.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-[300px_minmax(0,1fr)]">
        <aside className="border border-[#C4B5A0] bg-white/40">
          <div className="border-b border-[#C4B5A0] px-4 py-3 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
            Products
          </div>
          <div className="max-h-[640px] overflow-y-auto">
            {items.map((item) => {
              const active = item.id === draft.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(item.id);
                    setDraft(cloneProduct(item));
                  }}
                  className={[
                    'w-full border-b border-[#C4B5A0] px-4 py-4 text-left transition-colors',
                    active ? 'bg-[#F0EAE0]' : 'hover:bg-[#F0EAE0]/50',
                  ].join(' ')}
                >
                  <div className="text-[13px] uppercase tracking-[2px] text-[#6B6560]">
                    {item.category}
                  </div>
                  <div className="mt-1 text-[#1A1816]">{item.translations[locale].name}</div>
                </button>
              );
            })}
          </div>
        </aside>

        <section className="space-y-6 border border-[#C4B5A0] bg-white/40 p-5 md:p-8">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">Slug</div>
              <input
                className="w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.slug}
                onChange={(event) => setDraft({ ...draft, slug: event.target.value })}
              />
            </label>
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">Price</div>
              <input
                type="number"
                className="w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.price}
                onChange={(event) =>
                  setDraft({ ...draft, price: Number(event.target.value) || 0 })
                }
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">UA name</div>
              <input
                className="w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.translations.ua.name}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    translations: {
                      ...draft.translations,
                      ua: { ...draft.translations.ua, name: event.target.value },
                    },
                  })
                }
              />
            </label>
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">EN name</div>
              <input
                className="w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.translations.en.name}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    translations: {
                      ...draft.translations,
                      en: { ...draft.translations.en, name: event.target.value },
                    },
                  })
                }
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">Category</div>
              <select
                className="w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.category}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    category: event.target.value as Product['category'],
                  })
                }
              >
                <option value="tops">tops</option>
                <option value="bottoms">bottoms</option>
                <option value="sets">sets</option>
              </select>
            </label>
            <label className="flex items-center gap-3 pt-8">
              <input
                type="checkbox"
                checked={draft.isNew}
                onChange={(event) => setDraft({ ...draft, isNew: event.target.checked })}
              />
              <span>Show as new arrival</span>
            </label>
          </div>

          <label className="block">
            <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
              Sizes
            </div>
            <div className="flex gap-3">
              {(['S', 'M'] as const).map((size) => {
                const checked = draft.sizes.includes(size);
                return (
                  <label key={size} className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        const nextSizes = event.target.checked
                          ? [...draft.sizes, size]
                          : draft.sizes.filter((item) => item !== size);
                        setDraft({
                          ...draft,
                          sizes: nextSizes.sort() as Array<'S' | 'M'>,
                        });
                      }}
                    />
                    <span>{size}</span>
                  </label>
                );
              })}
            </div>
          </label>

          <label className="block">
            <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
              Colors
            </div>
            <div className="flex flex-wrap gap-3">
              {(['black', 'beige', 'gray', 'white'] as const).map((color) => {
                const checked = draft.colors.includes(color);
                return (
                  <label key={color} className="flex items-center gap-2 capitalize">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(event) => {
                        const nextColors = event.target.checked
                          ? [...draft.colors, color]
                          : draft.colors.filter((item) => item !== color);
                        setDraft({
                          ...draft,
                          colors: nextColors,
                        });
                      }}
                    />
                    <span>{color}</span>
                  </label>
                );
              })}
            </div>
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block md:col-span-2">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">Main image URL</div>
              <input
                className="w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.images[0] ?? ''}
                onChange={(event) => {
                  const nextImages = [...draft.images];
                  nextImages[0] = event.target.value;
                  setDraft({ ...draft, images: nextImages.filter(Boolean) });
                }}
              />
            </label>

            {[1, 2, 3, 4, 5].map((index) => (
              <label key={index} className="block">
                <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
                  Image {index + 1}
                </div>
                <input
                  className="w-full border border-[#C4B5A0] bg-white px-4 py-3"
                  value={draft.images[index] ?? ''}
                  onChange={(event) => {
                    const nextImages = [...draft.images];
                    nextImages[index] = event.target.value;
                    setDraft({
                      ...draft,
                      images: nextImages.map((item) => item?.trim()).filter(Boolean) as string[],
                    });
                  }}
                />
              </label>
            ))}
          </div>

          <label className="block">
            <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">UA description</div>
            <textarea
              className="min-h-32 w-full border border-[#C4B5A0] bg-white px-4 py-3"
              value={draft.translations.ua.description}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  translations: {
                    ...draft.translations,
                    ua: { ...draft.translations.ua, description: event.target.value },
                  },
                })
              }
            />
          </label>

          <label className="block">
            <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">EN description</div>
            <textarea
              className="min-h-32 w-full border border-[#C4B5A0] bg-white px-4 py-3"
              value={draft.translations.en.description}
              onChange={(event) =>
                setDraft({
                  ...draft,
                  translations: {
                    ...draft.translations,
                    en: { ...draft.translations.en, description: event.target.value },
                  },
                })
              }
            />
          </label>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
                UA composition
              </div>
              <textarea
                className="min-h-24 w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.translations.ua.composition}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    translations: {
                      ...draft.translations,
                      ua: { ...draft.translations.ua, composition: event.target.value },
                    },
                  })
                }
              />
            </label>
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
                EN composition
              </div>
              <textarea
                className="min-h-24 w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.translations.en.composition}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    translations: {
                      ...draft.translations,
                      en: { ...draft.translations.en, composition: event.target.value },
                    },
                  })
                }
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
                UA care
              </div>
              <textarea
                className="min-h-24 w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.translations.ua.care}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    translations: {
                      ...draft.translations,
                      ua: { ...draft.translations.ua, care: event.target.value },
                    },
                  })
                }
              />
            </label>
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
                EN care
              </div>
              <textarea
                className="min-h-24 w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.translations.en.care}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    translations: {
                      ...draft.translations,
                      en: { ...draft.translations.en, care: event.target.value },
                    },
                  })
                }
              />
            </label>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
                UA delivery
              </div>
              <textarea
                className="min-h-24 w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.translations.ua.delivery}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    translations: {
                      ...draft.translations,
                      ua: { ...draft.translations.ua, delivery: event.target.value },
                    },
                  })
                }
              />
            </label>
            <label className="block">
              <div className="mb-2 text-[13px] uppercase tracking-[2px] text-[#6B6560]">
                EN delivery
              </div>
              <textarea
                className="min-h-24 w-full border border-[#C4B5A0] bg-white px-4 py-3"
                value={draft.translations.en.delivery}
                onChange={(event) =>
                  setDraft({
                    ...draft,
                    translations: {
                      ...draft.translations,
                      en: { ...draft.translations.en, delivery: event.target.value },
                    },
                  })
                }
              />
            </label>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => updateOne(draft)}
              className="bg-[#2C2420] px-6 py-3 text-[13px] uppercase tracking-[2px] text-white"
            >
              Save locally
            </button>
            <button
              type="button"
              onClick={() => {
                reset();
              }}
              className="border border-[#2C2420] px-6 py-3 text-[13px] uppercase tracking-[2px] text-[#2C2420]"
            >
              Reset to seed data
            </button>
            <button
              type="button"
              onClick={handleExport}
              className="border border-[#2C2420] px-6 py-3 text-[13px] uppercase tracking-[2px] text-[#2C2420]"
            >
              Export JSON
            </button>
            <button
              type="button"
              onClick={handleImport}
              className="border border-[#2C2420] px-6 py-3 text-[13px] uppercase tracking-[2px] text-[#2C2420]"
            >
              Import JSON
            </button>
          </div>

          <p className="text-sm text-[#6B6560]">
            Changes are stored in this browser localStorage.
          </p>
          {message ? <p className="text-sm text-[#6B6560]">{message}</p> : null}
        </section>
      </div>
    </div>
  );
}

