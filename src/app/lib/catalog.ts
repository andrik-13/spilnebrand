import { useEffect, useMemo, useState } from 'react';
import { products as seedProducts, type Product } from '../data/products';

const STORAGE_KEY = 'spilne.catalog.products.v2';
const CATALOG_EVENT = 'spilne:catalog-updated';

function canUseStorage() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function emitCatalogUpdate() {
  if (typeof window === 'undefined') {
    return;
  }

  window.dispatchEvent(new CustomEvent(CATALOG_EVENT));
}

export function readCatalogProducts(): Product[] {
  if (!canUseStorage()) {
    return seedProducts;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    return seedProducts;
  }

  try {
    const parsed = JSON.parse(raw) as Product[];
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : seedProducts;
  } catch {
    return seedProducts;
  }
}

export function writeCatalogProducts(nextProducts: Product[]) {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextProducts));
  emitCatalogUpdate();
}

export function resetCatalogProducts() {
  if (!canUseStorage()) {
    return;
  }

  window.localStorage.removeItem(STORAGE_KEY);
  emitCatalogUpdate();
}

export function importCatalogProducts(raw: string) {
  const parsed = JSON.parse(raw) as Product[];
  if (!Array.isArray(parsed) || parsed.length === 0) {
    throw new Error('Catalog import expects a non-empty JSON array.');
  }

  writeCatalogProducts(parsed);
  return parsed;
}

export function useCatalogProducts() {
  const [items, setItems] = useState<Product[]>(seedProducts);

  useEffect(() => {
    setItems(readCatalogProducts());
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const sync = () => setItems(readCatalogProducts());

    window.addEventListener('storage', sync);
    window.addEventListener(CATALOG_EVENT, sync);

    return () => {
      window.removeEventListener('storage', sync);
      window.removeEventListener(CATALOG_EVENT, sync);
    };
  }, []);

  const actions = useMemo(
    () => ({
      setAll(nextProducts: Product[]) {
        setItems(nextProducts);
        writeCatalogProducts(nextProducts);
      },
      updateOne(nextProduct: Product) {
        setItems((current) => {
          const nextProducts = current.map((item) =>
            item.id === nextProduct.id ? nextProduct : item
          );
          writeCatalogProducts(nextProducts);
          return nextProducts;
        });
      },
      reset() {
        resetCatalogProducts();
        setItems(seedProducts);
      },
    }),
    []
  );

  return { items, ...actions };
}
