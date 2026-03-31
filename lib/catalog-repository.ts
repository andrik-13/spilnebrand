import type { Category } from '@/lib/i18n';
import { products, type Product } from '@/lib/products';
import { createSupabaseServerClient } from '@/lib/supabase-server';

interface ProductImageRow {
  url: string;
  position: number;
}

interface ProductRow {
  id: string;
  slug: string;
  category: Category;
  price: number;
  sizes: Array<'S' | 'M'>;
  colors?: string[] | null;
  is_new: boolean;
  is_active?: boolean;
  name_ua: string;
  name_en: string;
  description_ua: string;
  description_en: string;
  composition_ua: string;
  composition_en: string;
  care_ua?: string | null;
  care_en?: string | null;
  delivery_ua?: string | null;
  delivery_en?: string | null;
  product_images?: ProductImageRow[] | null;
}

interface ListProductsOptions {
  category?: string | null;
  isNew?: boolean;
  limit?: number;
}

function fallbackDelivery(locale: 'ua' | 'en') {
  return locale === 'ua'
    ? 'Доставка по Україні Новою Поштою або Укрпоштою після підтвердження замовлення.'
    : 'Delivery across Ukraine via Nova Poshta or Ukrposhta after order confirmation.';
}

function fallbackCare(locale: 'ua' | 'en') {
  return locale === 'ua'
    ? 'Делікатне прання при 30°C. Сушити природним способом.'
    : 'Delicate wash at 30°C. Air dry naturally.';
}

function mapSupabaseRowToProduct(row: ProductRow): Product {
  const images = [...(row.product_images ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((image) => image.url);

  return {
    id: row.id,
    slug: row.slug,
    category: row.category,
    price: row.price,
    sizes: row.sizes,
    colors: (row.colors as Product['colors'] | null) ?? ['black'],
    isNew: row.is_new,
    images,
    translations: {
      ua: {
        name: row.name_ua,
        description: row.description_ua,
        composition: row.composition_ua,
        care: row.care_ua || fallbackCare('ua'),
        delivery: row.delivery_ua || fallbackDelivery('ua')
      },
      en: {
        name: row.name_en,
        description: row.description_en,
        composition: row.composition_en,
        care: row.care_en || fallbackCare('en'),
        delivery: row.delivery_en || fallbackDelivery('en')
      }
    }
  };
}

function applyFilters(items: Product[], options: ListProductsOptions) {
  let next = items;

  if (options.category) {
    next = next.filter((product) => product.category === options.category);
  }

  if (options.isNew) {
    next = next.filter((product) => product.isNew);
  }

  if (options.limit) {
    next = next.slice(0, options.limit);
  }

  return next;
}

export async function listProducts(options: ListProductsOptions = {}) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return applyFilters(products, options);
  }

  try {
    let query = supabase
      .from('products')
      .select('id,slug,category,price,sizes,colors,is_new,is_active,name_ua,name_en,description_ua,description_en,composition_ua,composition_en,care_ua,care_en,delivery_ua,delivery_en,product_images(url,position)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (options.category) query = query.eq('category', options.category);
    if (options.isNew) query = query.eq('is_new', true);
    if (options.limit) query = query.limit(options.limit);

    const { data, error } = await query;
    if (error || !data) {
      return applyFilters(products, options);
    }

    return (data as ProductRow[]).map(mapSupabaseRowToProduct);
  } catch {
    return applyFilters(products, options);
  }
}

export async function getProductBySlug(slug: string) {
  const supabase = createSupabaseServerClient();
  if (!supabase) {
    return products.find((product) => product.slug === slug) ?? null;
  }

  try {
    const { data, error } = await supabase
      .from('products')
      .select('id,slug,category,price,sizes,colors,is_new,is_active,name_ua,name_en,description_ua,description_en,composition_ua,composition_en,care_ua,care_en,delivery_ua,delivery_en,product_images(url,position)')
      .eq('slug', slug)
      .eq('is_active', true)
      .single();

    if (error || !data) {
      return products.find((product) => product.slug === slug) ?? null;
    }

    return mapSupabaseRowToProduct(data as ProductRow);
  } catch {
    return products.find((product) => product.slug === slug) ?? null;
  }
}
